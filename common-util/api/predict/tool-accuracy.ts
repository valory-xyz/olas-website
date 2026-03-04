import {
  MARKETPLACE_GRAPH_CLIENTS,
  polymarketAgentsGraphClient,
  predictAgentsGraphClient,
} from 'common-util/graphql/client';
import {
  getClosedMarketsBetsQuery,
  getMechRequestsBySenderEntityQuery,
  getMechRequestsBySenderWithToolQuery,
  getPolymarketBetsWithBettorQuery,
} from 'common-util/graphql/queries';

const INVALID_ANSWER_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const BET_PAGE_SIZE = 1000;
const BET_TOTAL = 10000;
const MECH_PAGE_SIZE = 1000;
const MECH_MAX_PAGES = 10;
const SENDER_BATCH_SIZE = 5;

type Bet = {
  bettor: { id: string };
  outcomeIndex: string;
  timestamp: string;
  fixedProductMarketMaker: {
    currentAnswer: string;
    question: string;
  };
};

type PolymarketBet = {
  id: string;
  blockTimestamp: string;
  outcomeIndex: string;
  bettor: { id: string };
  question: {
    id: string;
    metadata: { title: string } | null;
    resolution: { winningIndex: string } | null;
  };
};

type MechRequest = {
  blockTimestamp: string;
  parsedRequest: {
    tool: string | null;
    questionTitle: string | null;
  } | null;
};

export type ToolAccuracyStat = {
  tool: string;
  totalBets: number;
  correctBets: number;
  accuracy: number;
};

export type ToolAccuracyData = {
  omenstrat: ToolAccuracyStat[];
  polystrat: ToolAccuracyStat[];
};

const normalizeQuestion = (q: string): string => {
  // Split on the unit separator character (used by Omen) and take the first part
  const base = q.split('\u241f')[0];
  return base.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

// ---------------------------------------------------------------------------
// Omenstrat helpers
// ---------------------------------------------------------------------------

async function fetchResolvedBets(): Promise<Bet[]> {
  const pages = Math.ceil(BET_TOTAL / BET_PAGE_SIZE);

  const data = await predictAgentsGraphClient.request<Record<string, any[]>>(
    getClosedMarketsBetsQuery({ first: BET_PAGE_SIZE, pages, includeBettorDetails: true })
  );

  return Object.entries(data)
    .filter(([key]) => key !== '_meta')
    .flatMap(([, value]) => value) as Bet[];
}

async function fetchMechRequestsForSender(
  sender: string,
  timestampGt: number
): Promise<MechRequest[]> {
  const allRequests: MechRequest[] = [];

  for (let i = 0; i < MECH_MAX_PAGES; i++) {
    const skip = i * MECH_PAGE_SIZE;
    const data = await MARKETPLACE_GRAPH_CLIENTS.gnosis.request<{
      requests: MechRequest[];
    }>(
      getMechRequestsBySenderWithToolQuery({
        sender,
        timestamp_gt: timestampGt,
        first: MECH_PAGE_SIZE,
        skip,
      })
    );
    if (!data.requests || data.requests.length === 0) break;
    allRequests.push(...data.requests);
    if (data.requests.length < MECH_PAGE_SIZE) break;
  }

  return allRequests;
}

function matchBetToMechRequest(bet: Bet, mechRequests: MechRequest[]): string | null {
  const betQuestion = normalizeQuestion(bet.fixedProductMarketMaker.question);
  const betTimestamp = Number(bet.timestamp);

  // Find the latest mech request before the bet timestamp whose question matches
  let bestMatch: MechRequest | null = null;

  for (const req of mechRequests) {
    if (!req.parsedRequest?.tool || !req.parsedRequest?.questionTitle) continue;

    const reqTimestamp = Number(req.blockTimestamp);
    if (reqTimestamp > betTimestamp) continue;

    const reqQuestion = normalizeQuestion(req.parsedRequest.questionTitle);

    // Use prefix match: either one is a prefix of the other
    const minLen = Math.min(betQuestion.length, reqQuestion.length);
    if (minLen === 0) continue;

    if (
      betQuestion.startsWith(reqQuestion.slice(0, minLen)) ||
      reqQuestion.startsWith(betQuestion.slice(0, minLen))
    ) {
      if (!bestMatch || Number(req.blockTimestamp) > Number(bestMatch.blockTimestamp)) {
        bestMatch = req;
      }
    }
  }

  return bestMatch?.parsedRequest?.tool ?? null;
}

export async function computeOmenstratToolAccuracy(): Promise<ToolAccuracyStat[]> {
  const bets = await fetchResolvedBets();

  // Group bets by bettor
  const betsByBettor = new Map<string, Bet[]>();
  for (const bet of bets) {
    const bettorId = bet.bettor.id.toLowerCase();
    if (!betsByBettor.has(bettorId)) {
      betsByBettor.set(bettorId, []);
    }
    betsByBettor.get(bettorId)!.push(bet);
  }

  // Use the earliest bet timestamp to scope the mech requests query
  const earliestBetTimestamp = Math.min(...bets.map((b) => Number(b.timestamp)));
  const senders = Array.from(betsByBettor.keys());

  // Fetch mech requests per sender in batches
  const mechRequestsBySender = new Map<string, MechRequest[]>();

  for (let i = 0; i < senders.length; i += SENDER_BATCH_SIZE) {
    const batch = senders.slice(i, i + SENDER_BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((sender) => fetchMechRequestsForSender(sender, earliestBetTimestamp))
    );

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        mechRequestsBySender.set(batch[idx], result.value);
      }
    });
  }

  // Match bets to tools and aggregate per-tool stats
  const toolStats = new Map<string, { total: number; correct: number }>();

  for (const [bettorId, bettorBets] of betsByBettor) {
    const mechRequests = mechRequestsBySender.get(bettorId) ?? [];
    if (mechRequests.length === 0) continue;

    for (const bet of bettorBets) {
      const currentAnswer = bet.fixedProductMarketMaker.currentAnswer;
      if (currentAnswer === INVALID_ANSWER_HEX) continue;

      const tool = matchBetToMechRequest(bet, mechRequests);
      if (!tool) continue;

      if (!toolStats.has(tool)) {
        toolStats.set(tool, { total: 0, correct: 0 });
      }

      const stats = toolStats.get(tool)!;
      stats.total += 1;

      if (Number(currentAnswer) === Number(bet.outcomeIndex)) {
        stats.correct += 1;
      }
    }
  }

  // Convert to sorted array
  return Array.from(toolStats.entries())
    .map(([tool, stats]) => ({
      tool,
      totalBets: stats.total,
      correctBets: stats.correct,
      accuracy: stats.total > 0 ? Number(((stats.correct / stats.total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.totalBets - a.totalBets);
}

// ---------------------------------------------------------------------------
// Polystrat helpers
// ---------------------------------------------------------------------------

async function fetchPolymarketResolvedBets(): Promise<PolymarketBet[]> {
  const pages = Math.ceil(BET_TOTAL / BET_PAGE_SIZE);

  const data = await polymarketAgentsGraphClient.request<Record<string, any[]>>(
    getPolymarketBetsWithBettorQuery({ first: BET_PAGE_SIZE, pages })
  );

  const allBets = Object.entries(data)
    .filter(([key]) => key !== '_meta')
    .flatMap(([, value]) => value) as PolymarketBet[];

  // Only keep resolved bets
  return allBets.filter((bet) => bet.question.resolution !== null);
}

async function fetchPolygonMechRequestsForSender(
  sender: string,
  timestampGt: number
): Promise<MechRequest[]> {
  const allRequests: MechRequest[] = [];

  for (let i = 0; i < MECH_MAX_PAGES; i++) {
    const skip = i * MECH_PAGE_SIZE;
    const data = await MARKETPLACE_GRAPH_CLIENTS.polygon.request<{
      sender: { requests: MechRequest[] } | null;
    }>(
      getMechRequestsBySenderEntityQuery({
        sender,
        timestamp_gt: timestampGt,
        first: MECH_PAGE_SIZE,
        skip,
      })
    );
    const requests = data.sender?.requests ?? [];
    if (requests.length === 0) break;
    allRequests.push(...requests);
    if (requests.length < MECH_PAGE_SIZE) break;
  }

  return allRequests;
}

function matchPolymarketBetToMechRequest(
  bet: PolymarketBet,
  mechRequests: MechRequest[]
): string | null {
  const betTitle = (bet.question.metadata?.title ?? '').trim();
  if (!betTitle) return null;

  const betTimestamp = Number(bet.blockTimestamp);
  let bestMatch: MechRequest | null = null;

  for (const req of mechRequests) {
    if (!req.parsedRequest?.tool || !req.parsedRequest?.questionTitle) continue;

    const reqTimestamp = Number(req.blockTimestamp);
    if (reqTimestamp > betTimestamp) continue;

    const reqTitle = (req.parsedRequest.questionTitle.split('\u241f')[0] ?? '').trim();
    if (!reqTitle) continue;

    // Prefix match: either one starts with the other
    if (betTitle.startsWith(reqTitle) || reqTitle.startsWith(betTitle)) {
      if (!bestMatch || Number(req.blockTimestamp) > Number(bestMatch.blockTimestamp)) {
        bestMatch = req;
      }
    }
  }

  return bestMatch?.parsedRequest?.tool ?? null;
}

export async function computePolystratToolAccuracy(): Promise<ToolAccuracyStat[]> {
  const bets = await fetchPolymarketResolvedBets();
  if (bets.length === 0) return [];

  // Group bets by bettor
  const betsByBettor = new Map<string, PolymarketBet[]>();
  for (const bet of bets) {
    const bettorId = bet.bettor.id.toLowerCase();
    if (!betsByBettor.has(bettorId)) {
      betsByBettor.set(bettorId, []);
    }
    betsByBettor.get(bettorId)!.push(bet);
  }

  const earliestBetTimestamp = Math.min(...bets.map((b) => Number(b.blockTimestamp)));
  const senders = Array.from(betsByBettor.keys());

  // Fetch mech requests per sender in batches (polygon marketplace)
  const mechRequestsBySender = new Map<string, MechRequest[]>();

  for (let i = 0; i < senders.length; i += SENDER_BATCH_SIZE) {
    const batch = senders.slice(i, i + SENDER_BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((sender) => fetchPolygonMechRequestsForSender(sender, earliestBetTimestamp))
    );

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        mechRequestsBySender.set(batch[idx], result.value);
      }
    });
  }

  // Match bets to tools and aggregate per-tool stats
  const toolStats = new Map<string, { total: number; correct: number }>();

  for (const [bettorId, bettorBets] of betsByBettor) {
    const mechRequests = mechRequestsBySender.get(bettorId) ?? [];
    if (mechRequests.length === 0) continue;

    for (const bet of bettorBets) {
      const winningIndex = bet.question.resolution?.winningIndex;
      if (winningIndex === undefined || winningIndex === null) continue;

      const tool = matchPolymarketBetToMechRequest(bet, mechRequests);
      if (!tool) continue;

      if (!toolStats.has(tool)) {
        toolStats.set(tool, { total: 0, correct: 0 });
      }

      const stats = toolStats.get(tool)!;
      stats.total += 1;

      if (Number(winningIndex) === Number(bet.outcomeIndex)) {
        stats.correct += 1;
      }
    }
  }

  return Array.from(toolStats.entries())
    .map(([tool, stats]) => ({
      tool,
      totalBets: stats.total,
      correctBets: stats.correct,
      accuracy: stats.total > 0 ? Number(((stats.correct / stats.total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.totalBets - a.totalBets);
}

// ---------------------------------------------------------------------------
// Combined export
// ---------------------------------------------------------------------------

export async function computeAllToolAccuracy(): Promise<ToolAccuracyData> {
  const [omenstrat, polystrat] = await Promise.allSettled([
    computeOmenstratToolAccuracy(),
    computePolystratToolAccuracy(),
  ]);

  return {
    omenstrat: omenstrat.status === 'fulfilled' ? omenstrat.value : [],
    polystrat: polystrat.status === 'fulfilled' ? polystrat.value : [],
  };
}
