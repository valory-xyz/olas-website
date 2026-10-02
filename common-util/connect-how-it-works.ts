/**
 * Connect "How it works" diagram. Desktop reads left to right: your coding agent, Connect agents
 * (one per chain), then the Olas Marketplace and the chains. Mobile (diagram narrower than 640 px)
 * reads top to bottom with the Marketplace last. The intro builds "you"; the camera then pulls back
 * to an economy of several people.
 *
 * Ported from the design handoff (`connect-how-it-works-handoff-2026-10-01/scene.html`); timings,
 * layouts, colours, connector shapes and the order of events are kept verbatim so the handoff's
 * `preview.html` stays the visual reference. Only the approved beam (`charge`) and chip (`glass`)
 * styles are kept.
 *
 * `initConnectHowItWorks(svg, { assetBase })` builds everything inside the SVG and returns
 * `{ dispose }`. SVG IDs start with `hiw-`, so render it once per page.
 */

type Seg = number[]; // cubic segment [x0,y0, x1,y1, x2,y2, x3,y3]
type Path = Seg[];
type ChainKey = 'gnosis' | 'polygon' | 'robinhood';
type Chain = { name: string; color: string; logo: string };
type Pos = { x: number; y: number };
type PersonBox = Pos & { size: number };
type AgentBox = Pos & { r: number };
type Connectors = { agent: Path; market: Path; chain: Path };
type AgentNode = {
  person: Person;
  key: ChainKey;
  chain: Chain;
  A?: AgentBox;
  B?: AgentBox;
  pos?: Pos;
  r?: number;
  c?: Connectors;
  el?: {
    toAgent: SVGPathElement;
    toMarket: SVGPathElement;
    toChain: SVGPathElement;
    g: SVGGElement;
    tile?: SVGRectElement;
    orb?: SVGImageElement;
    disc?: SVGCircleElement;
    logo?: SVGImageElement;
    label?: SVGTextElement;
  };
};
type Person = {
  i: number;
  chains: ChainKey[];
  agents: AgentNode[];
  A?: PersonBox;
  B?: PersonBox;
  enter?: number;
  pos?: Pos;
  s?: number;
  el?: { g: SVGGElement; tile?: SVGRectElement; icon?: SVGImageElement; label?: SVGTextElement };
};
type ChipDef = {
  text: string;
  color: string;
  path: () => SVGPathElement;
  at: number;
  start: () => number;
};
type Chip = ChipDef & { chip: { g: SVGGElement }; shown?: boolean };
type Layout = {
  W: number;
  H: number;
  font: number;
  hex: { x: number; y: number; w: number; h: number };
  hexIn: Pos;
  chains: Record<ChainKey, [number, number]>;
  chainR: number;
  chainLogo: number;
  gap?: Record<ChainKey, number>;
  youLabel: boolean;
  agentLabels: boolean;
  people: ChainKey[][];
  place(people: Person[]): void;
  connectors(p: Person, a: AgentNode, pos: Pos, r: number): Connectors;
  chips(you: Person): ChipDef[];
};
type Stream = {
  agent: AgentNode;
  kind: keyof Connectors;
  reverse: boolean;
  start: number;
  dur: number;
  g: SVGGElement;
  grad: SVGLinearGradientElement;
  glow: SVGPathElement;
  core: SVGPathElement;
  bloom: SVGCircleElement;
};

export type ConnectHowItWorksOptions = {
  /** Base URL of the six images, with a trailing slash. */
  assetBase: string;
};

const NS = 'http://www.w3.org/2000/svg';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (t: number) => t * t * (3 - 2 * t);
// Progress of a window [start, start + dur] at time t, eased.
const win = (t: number, start: number, dur: number, f = smooth) => f(clamp((t - start) / dur));

// ---------- Paths ----------
// A connector is a list of cubic segments [x0,y0, x1,y1, x2,y2, x3,y3]. Lengths and points are computed
// here rather than asked from the DOM every frame.
const at = (c: Seg, t: number): [number, number] => {
  const j = 1 - t;
  const a = j * j * j;
  const b = 3 * j * j * t;
  const e = 3 * j * t * t;
  const f = t * t * t;
  return [a * c[0] + b * c[2] + e * c[4] + f * c[6], a * c[1] + b * c[3] + e * c[5] + f * c[7]];
};
const segLen = (c: Seg) => {
  let L = 0;
  let px = c[0];
  let py = c[1];
  for (let i = 1; i <= 20; i++) {
    const q = at(c, i / 20);
    L += Math.hypot(q[0] - px, q[1] - py);
    px = q[0];
    py = q[1];
  }
  return L;
};
const pathLen = (P: Path) => P.reduce((s, c) => s + segLen(c), 0);
const pathAt = (P: Path, u: number): [number, number] => {
  // point at fraction u of the length
  const lens = P.map(segLen);
  const total = lens.reduce((a, b) => a + b, 0);
  let d = clamp(u) * total;
  for (let i = 0; i < P.length; i++) {
    if (d <= lens[i] || i === P.length - 1) return at(P[i], lens[i] ? clamp(d / lens[i]) : 0);
    d -= lens[i];
  }
  return at(P[P.length - 1], 1);
};
const pathD = (P: Path) =>
  'M' +
  P[0][0].toFixed(1) +
  ',' +
  P[0][1].toFixed(1) +
  P.map(
    (c) =>
      ` C${c[2].toFixed(1)},${c[3].toFixed(1)} ${c[4].toFixed(1)},${c[5].toFixed(1)} ${c[6].toFixed(1)},${c[7].toFixed(1)}`
  ).join('');
const reversePath = (P: Path): Path =>
  P.slice()
    .reverse()
    .map((c) => [c[6], c[7], c[4], c[5], c[2], c[3], c[0], c[1]]);
const hseg = (x1: number, y1: number, x2: number, y2: number, k = 0.5): Seg => {
  const dx = (x2 - x1) * k;
  return [x1, y1, x1 + dx, y1, x2 - dx, y2, x2, y2];
};
const vseg = (x1: number, y1: number, x2: number, y2: number, k = 0.5): Seg => {
  const dy = (y2 - y1) * k;
  return [x1, y1, x1, y1 + dy, x2, y2 - dy, x2, y2];
};

const ANSWER = '#C592FF';
const LINE = '#c8cfdd';
const STAGE = '#F3F5F9';

// ---------- Timeline (seconds of playback) ----------
const T = {
  youIn: 0.2,
  toAgent: [0.6, 0.9, 1.2], // coding agent -> each Connect agent
  toChain: [1.9, 2.15, 2.4], // each agent -> its chain
  toMarket: [2.9, 3.15, 3.4], // each agent -> Marketplace
  draw: 0.6,
  demoFrom: 4.3,
  zoom: 9.5,
  zoomDur: 2.8,
  economy: 13.5,
};
const CHIP_HOLD = 2.2;
const BEAM_S = 1.1;

function lighter(hex: string, k: number) {
  // mix a #rrggbb colour with white
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const m = (v: number) =>
    Math.round(v + (255 - v) * k)
      .toString(16)
      .padStart(2, '0');
  return '#' + m(r) + m(g) + m(b);
}

export function initConnectHowItWorks(
  svg: SVGSVGElement,
  { assetBase }: ConnectHowItWorksOptions
): { dispose: () => void } {
  const el = <K extends keyof SVGElementTagNameMap>(
    tag: K,
    attrs: Record<string, string | number>,
    parent?: Element,
    text?: string
  ): SVGElementTagNameMap[K] => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, String(attrs[k]));
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  };
  const set = (n: Element, attrs: Record<string, string | number>) => {
    for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  };

  // ---------- Content ----------
  const CHAIN: Record<ChainKey, Chain> = {
    gnosis: { name: 'Gnosis', color: '#0E9F6E', logo: `${assetBase}gnosis.svg` },
    polygon: { name: 'Polygon', color: '#8247E5', logo: `${assetBase}polygon.svg` },
    robinhood: { name: 'Robinhood Chain', color: '#9DC400', logo: `${assetBase}robinhood.webp` },
  };

  // ---------- Layouts ----------
  // Desktop reads left to right; mobile (diagram narrower than 640 px) reads top to bottom.
  // Each layout gives the right-hand places, the close-up for "you", the economy, and how connectors run.
  const LAYOUTS: Record<'desktop' | 'mobile', Layout> = {
    desktop: {
      W: 1120,
      H: 680,
      font: 1,
      hex: { x: 862, y: 22, w: 136, h: 158 },
      hexIn: { x: 866, y: 101 },
      chains: { gnosis: [930, 310], polygon: [930, 450], robinhood: [930, 590] },
      chainR: 40,
      chainLogo: 48,
      youLabel: true,
      agentLabels: true,
      // "You" first, with an agent on every chain.
      people: [
        ['gnosis', 'polygon', 'robinhood'],
        ['polygon'],
        ['gnosis', 'robinhood'],
        ['robinhood'],
        ['gnosis', 'polygon'],
        ['polygon', 'robinhood'],
      ],
      place(people) {
        let y = 54;
        people.forEach((p) => {
          const ys = p.chains.map((_, i) => y + i * 46);
          const mid = (ys[0] + ys[ys.length - 1]) / 2;
          p.B = { x: 110, y: mid, size: 30 };
          p.agents.forEach((a, i) => {
            a.B = { x: 330, y: ys[i], r: 17 };
          });
          y = ys[ys.length - 1] + 62;
        });
        const you = people[0];
        you.A = { x: 140, y: 450, size: 72 };
        you.agents.forEach((a) => {
          a.A = { x: 450, y: this.chains[a.key][1], r: 33 };
        });
        // Others appear in place from the bottom row up.
        people.slice(1).forEach((p) => {
          p.enter = T.zoom + 0.5 + (people.length - 1 - p.i) * 0.45;
        });
      },
      connectors(p, a, pos, r) {
        const [cx, cy] = this.chains[a.key];
        return {
          agent: [hseg(p.pos.x + p.s / 2, p.pos.y, pos.x - r - 3, pos.y)],
          market: [hseg(pos.x + r + 3, pos.y, this.hexIn.x, this.hexIn.y, 0.55)],
          chain: [hseg(pos.x + r + 3, pos.y, cx - this.chainR - 4, cy)],
        };
      },
      chips: (you) => [
        {
          text: 'crypto wallet',
          color: '#7B3FF2',
          path: () => you.agents[1].el.toAgent,
          at: 0.45,
          start: () => T.toAgent[1],
        },
        ...you.agents.map((a, i) => ({
          text: 'on-chain transaction',
          color: a.chain.color,
          path: () => a.el.toChain,
          at: 0.72,
          start: () => T.toChain[i],
        })),
      ],
    },
    mobile: {
      W: 390,
      H: 790,
      font: 0.8,
      hex: { x: 143, y: 600, w: 104, h: 121 },
      hexIn: { x: 195, y: 603 },
      chains: { gnosis: [70, 480], polygon: [195, 480], robinhood: [320, 480] },
      chainR: 30,
      chainLogo: 36,
      gap: { gnosis: 132, polygon: 257, robinhood: 374 },
      youLabel: true,
      agentLabels: false,
      // Three people after the zoom-out: "you" in the middle, each person's Connect agents grouped under them
      // in one row. Fewer people than desktop keeps the narrow layout calm.
      people: [
        ['gnosis', 'polygon', 'robinhood'],
        ['gnosis', 'polygon'],
        ['polygon', 'robinhood'],
      ],
      place(people) {
        const xs = [195, 70, 320];
        const step = 34;
        people.forEach((p, i) => {
          p.B = { x: xs[i], y: 70, size: 34 };
          p.agents.forEach((a, n) => {
            a.B = { x: xs[i] + (n - (p.agents.length - 1) / 2) * step, y: 268, r: 15 };
          });
        });
        const you = people[0];
        you.A = { x: 195, y: 74, size: 52 };
        you.agents.forEach((a) => {
          a.A = { x: this.chains[a.key][0], y: 268, r: 28 };
        });
        // Others appear left, then right.
        people[1].enter = T.zoom + 0.5;
        people[2].enter = T.zoom + 0.95;
      },
      connectors(p, a, pos, r) {
        const [cx, cy] = this.chains[a.key];
        const R = this.chainR;
        const g = this.gap[a.key];
        const y0 = pos.y + r + 2;
        const top = cy - R - 6;
        const yb = cy + R + 18;
        const bend = Math.min(70, (top - y0) * 0.8);
        return {
          agent: [vseg(p.pos.x, p.pos.y + p.s / 2, pos.x, pos.y - r - 2)],
          // Both lines leave from the same point under the agent; the Marketplace line bends around the chain.
          market: [
            [pos.x, y0, pos.x, y0 + bend * 0.55, g, top - bend * 0.75, g, top],
            [g, top, g, top + (yb - top) / 3, g, yb - (yb - top) / 3, g, yb],
            [g, yb, g, yb + 50, this.hexIn.x, this.hexIn.y - 60, this.hexIn.x, this.hexIn.y],
          ],
          chain: [vseg(pos.x, y0, cx, cy - R - 3, 0.6)],
        };
      },
      // The on-chain chips are wider than the gap between columns here, so only the middle one shows.
      chips: (you) => [
        {
          text: 'crypto wallet',
          color: '#7B3FF2',
          path: () => you.agents[1].el.toAgent,
          at: 0.5,
          start: () => T.toAgent[1],
        },
        {
          text: 'on-chain transaction',
          color: you.agents[1].chain.color,
          path: () => you.agents[1].el.toChain,
          at: 0.5,
          start: () => T.toChain[1],
        },
      ],
    },
  };

  // ---------- Defs (shared by both layouts) ----------
  const defs = el('defs', {}, svg);
  {
    const tile = el('linearGradient', { id: 'hiw-tile', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    // Connect tile, as in the Connect agent icon (Figma Pearl-1.0, 28990:35159): white with a faint cyan-blue-violet tint.
    el('stop', { offset: 0, 'stop-color': '#f4fdff' }, tile);
    el('stop', { offset: 0.57, 'stop-color': '#f2f6ff' }, tile);
    el('stop', { offset: 1, 'stop-color': '#f9f3ff' }, tile);
    const edge = el('linearGradient', { id: 'hiw-tile-edge', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
    el('stop', { offset: 0, 'stop-color': '#9fe9ff' }, edge);
    el('stop', { offset: 1, 'stop-color': '#e3b8ff' }, edge);
    // Soft edges for the outer layer of a beam, so it has no visible outline.
    el(
      'feGaussianBlur',
      { stdDeviation: 3.5 },
      el(
        'filter',
        { id: 'hiw-beam-blur', x: '-20%', y: '-20%', width: '140%', height: '140%' },
        defs
      )
    );
    const f = el(
      'filter',
      {
        id: 'hiw-shadow',
        x: '-30%',
        y: '-30%',
        width: '160%',
        height: '190%',
        'color-interpolation-filters': 'sRGB',
      },
      defs
    );
    [
      [3.3, 1.6, 0.15],
      [6, 6, 0.12],
      [8, 13.5, 0.07],
    ].forEach(([b, dy, o], i) => {
      el('feGaussianBlur', { in: 'SourceAlpha', stdDeviation: b, result: 'b' + i }, f);
      el('feOffset', { in: 'b' + i, dy, result: 'o' + i }, f);
      el('feFlood', { 'flood-color': '#366581', 'flood-opacity': o }, f);
      el('feComposite', { in2: 'o' + i, operator: 'in', result: 's' + i }, f);
    });
    const m = el('feMerge', {}, f);
    [0, 1, 2].forEach((i) => el('feMergeNode', { in: 's' + i }, m));
    el('feMergeNode', { in: 'SourceGraphic' }, m);
  }
  const halos: Record<string, string> = {};
  function halo(color: string) {
    if (halos[color]) return halos[color];
    const id = 'hiw-h' + Object.keys(halos).length;
    const g = el('radialGradient', { id }, defs);
    el('stop', { offset: 0, 'stop-color': color, 'stop-opacity': 0.7 }, g);
    el('stop', { offset: 1, 'stop-color': color, 'stop-opacity': 0 }, g);
    return (halos[color] = `url(#${id})`);
  }
  const lineLayer = el('g', {}, svg);
  const nodeLayer = el('g', {}, svg);
  const flowLayer = el('g', {}, svg);
  const chipLayer = el('g', {}, svg);

  // ---------- Chips ----------
  // Each lights up when the drawing line reaches it, holds, and goes out.
  function chip(text: string, color: string, k: number) {
    const g = el('g', { opacity: 0 }, chipLayer);
    const w = text.length * 6.7 * k + 30 * k;
    el(
      'rect',
      {
        x: -w / 2 - 3,
        y: -17 * k,
        width: w + 6,
        height: 34 * k,
        rx: 17 * k,
        fill: color,
        opacity: 0.16,
      },
      g
    );
    el(
      'rect',
      {
        x: -w / 2,
        y: -14 * k,
        width: w,
        height: 28 * k,
        rx: 14 * k,
        fill: 'rgba(255,255,255,.78)',
        stroke: color,
        'stroke-opacity': 0.45,
      },
      g
    );
    el(
      'text',
      {
        x: 0,
        y: 4.5 * k,
        'text-anchor': 'middle',
        'font-size': 12.5 * k,
        'font-weight': 500,
        fill: '#1f2937',
      },
      g,
      text
    );
    return { g };
  }

  // ---------- Beams ----------
  // The connector fills with light from the agent to the target, then the whole line fades.
  // Geometry is read every frame, so beams ride the camera move.
  const streams = new Set<Stream>();
  let gradSeq = 0;
  function clearStreams() {
    streams.forEach((s) => {
      s.g.remove();
      s.grad.remove();
    });
    streams.clear();
  }

  // ---------- Build ----------
  let L: Layout = null;
  let people: Person[] = [];
  let agents: AgentNode[] = [];
  let chips: Chip[] = [];
  let YOU: Person = null;
  let SETTLE_AT = 0;
  let settled = false;
  let z = 0; // camera: 0 close-up, 1 economy
  function build(mode: 'desktop' | 'mobile') {
    L = LAYOUTS[mode];
    [lineLayer, nodeLayer, flowLayer, chipLayer].forEach((g) => g.replaceChildren());
    clearStreams();
    svg.setAttribute('viewBox', `0 0 ${L.W} ${L.H}`);
    const f = L.font;
    // Marketplace and chains: these never move.
    el(
      'image',
      {
        href: `${assetBase}marketplace-hex.svg`,
        x: L.hex.x,
        y: L.hex.y,
        width: L.hex.w,
        height: L.hex.h,
      },
      nodeLayer
    );
    el(
      'text',
      {
        x: L.hex.x + L.hex.w / 2,
        y: L.hex.y + L.hex.h + 20 * f,
        'text-anchor': 'middle',
        'font-size': 13 * f * 1.15,
        'font-weight': 500,
        fill: '#1f2937',
      },
      nodeLayer,
      'Olas Marketplace'
    );
    (Object.entries(L.chains) as [ChainKey, [number, number]][]).forEach(([k, [x, y]]) => {
      const c = CHAIN[k];
      const R = L.chainR;
      const s = L.chainLogo;
      el(
        'circle',
        {
          cx: x,
          cy: y,
          r: R,
          fill: '#fff',
          stroke: '#fff',
          'stroke-width': 2,
          filter: 'url(#hiw-shadow)',
        },
        nodeLayer
      );
      el(
        'circle',
        { cx: x, cy: y, r: R, fill: 'none', stroke: c.color, 'stroke-width': 2, opacity: 0.45 },
        nodeLayer
      );
      el('image', { href: c.logo, x: x - s / 2, y: y - s / 2, width: s, height: s }, nodeLayer);
      // A halo in the stage colour lets connectors pass behind a label without cutting it.
      el(
        'text',
        {
          x,
          y: y + R + 19 * f,
          'text-anchor': 'middle',
          'font-size': 13 * f * 1.1,
          'font-weight': 500,
          fill: '#1f2937',
          stroke: STAGE,
          'stroke-width': 5,
          'paint-order': 'stroke',
          'stroke-linejoin': 'round',
        },
        nodeLayer,
        c.name
      );
    });
    // People and their Connect agents. Each has a start position (A) and an economy position (B).
    people = L.people.map((chainKeys, i) => ({ i, chains: chainKeys, agents: [] }));
    agents = [];
    people.forEach((p) =>
      p.chains.forEach((k) => {
        const a: AgentNode = { person: p, key: k, chain: CHAIN[k] };
        p.agents.push(a);
        agents.push(a);
      })
    );
    L.place(people);
    people.slice(1).forEach((p) => {
      p.A = { ...p.B };
      p.agents.forEach((a) => {
        a.A = { ...a.B };
      });
    });
    YOU = people[0];
    people.forEach((p) => {
      p.el = { g: el('g', {}, nodeLayer) };
      p.el.tile = el(
        'rect',
        { fill: '#fff', stroke: '#fff', 'stroke-width': 2, filter: 'url(#hiw-shadow)' },
        p.el.g
      );
      p.el.icon = el('image', { href: `${assetBase}coding-agent.png` }, p.el.g);
      if (p === YOU && L.youLabel)
        p.el.label = el(
          'text',
          { 'text-anchor': 'middle', 'font-size': 16 * f, 'font-weight': 500, fill: '#1f2937' },
          p.el.g,
          'Your coding agent'
        );
      p.agents.forEach((a) => {
        a.el = {
          toAgent: el('path', { fill: 'none', stroke: LINE, 'stroke-linecap': 'round' }, lineLayer),
          toMarket: el(
            'path',
            { fill: 'none', stroke: LINE, 'stroke-linecap': 'round' },
            lineLayer
          ),
          toChain: el(
            'path',
            {
              fill: 'none',
              stroke: a.chain.color,
              'stroke-linecap': 'round',
              'stroke-opacity': 0.55,
            },
            lineLayer
          ),
          g: el('g', {}, nodeLayer),
        };
        a.el.tile = el(
          'rect',
          {
            fill: 'url(#hiw-tile)',
            stroke: 'url(#hiw-tile-edge)',
            'stroke-width': 1.5,
            filter: 'url(#hiw-shadow)',
          },
          a.el.g
        );
        a.el.orb = el('image', { href: `${assetBase}connect-orb.webp` }, a.el.g);
        a.el.disc = el('circle', { fill: '#fff' }, a.el.g);
        a.el.logo = el('image', { href: a.chain.logo }, a.el.g);
        if (p === YOU && L.agentLabels)
          a.el.label = el(
            'text',
            { 'text-anchor': 'middle', 'font-size': 12, fill: '#6b7280' },
            a.el.g,
            'Connect'
          );
      });
    });
    chips = L.chips(YOU).map((c) => ({
      ...c,
      chip: chip(c.text, c.color, mode === 'mobile' ? 0.9 : 1),
    }));
    SETTLE_AT = Math.max(
      T.zoom + T.zoomDur,
      ...people.slice(1).map((p) => p.enter + 1.6),
      ...T.toChain.map((x) => x + T.draw + CHIP_HOLD + 1)
    );
    settled = false;
    z = -1;
  }

  // ---------- Layout per frame ----------
  function layout(t: number) {
    if (settled) return;
    z = win(t, T.zoom, T.zoomDur, ease);
    const zp = (A: Pos, B: Pos) => ({ x: lerp(A.x, B.x, z), y: lerp(A.y, B.y, z) });
    people.forEach((p) => {
      const you = p === YOU;
      const q = you ? zp(p.A, p.B) : p.B;
      const s = you ? lerp(p.A.size, p.B.size, z) : p.B.size;
      const appear = you ? win(t, T.youIn, 0.5) : win(t, p.enter, 0.35);
      const pad = s * 0.16;
      const ic = s * 1.12; // the terminal fills 67% of the icon image; scale it up to fill the card
      set(p.el.tile, {
        x: q.x - s / 2 - pad,
        y: q.y - s / 2 - pad,
        width: s + 2 * pad,
        height: s + 2 * pad,
        rx: s * 0.22,
      });
      set(p.el.icon, {
        x: q.x - ic / 2 + (ic * 3.5) / 160,
        y: q.y - ic / 2 - (ic * 10.5) / 160,
        width: ic,
        height: ic,
      });
      p.el.g.setAttribute('opacity', String(appear));
      if (p.el.label)
        set(p.el.label, {
          x: q.x,
          y: q.y + s / 2 + pad + 26 * L.font,
          opacity: 1 - win(t, T.zoom, 0.6),
        });
      p.pos = q;
      p.s = s + 2 * pad;
      p.agents.forEach((a, i) => {
        const pos = you ? zp(a.A, a.B) : a.B;
        const r = you ? lerp(a.A.r, a.B.r, z) : a.B.r;
        const side = r * 2;
        const o = side * 1.25; // r is half the tile's side; the orb fills most of it
        set(a.el.tile, { x: pos.x - r, y: pos.y - r, width: side, height: side, rx: side * 0.24 });
        set(a.el.orb, { x: pos.x - o / 2, y: pos.y - o / 2, width: o, height: o });
        set(a.el.disc, { cx: pos.x, cy: pos.y, r: r * 0.42 });
        set(a.el.logo, {
          x: pos.x - r * 0.28,
          y: pos.y - r * 0.28,
          width: r * 0.56,
          height: r * 0.56,
        });
        if (a.el.label)
          set(a.el.label, { x: pos.x, y: pos.y + r + 20, opacity: 1 - win(t, T.zoom, 0.6) });
        a.el.g.setAttribute(
          'opacity',
          String(
            you
              ? win(t, T.toAgent[i] + T.draw * 0.8, 0.3)
              : win(t, p.enter + 0.25 + i * 0.08 + 0.35, 0.25)
          )
        );
        a.pos = pos;
        a.r = r;
        a.c = L.connectors(p, a, pos, r);
        const w = lerp(2.5, 1.8, z);
        set(a.el.toAgent, { d: pathD(a.c.agent), 'stroke-width': w });
        set(a.el.toMarket, { d: pathD(a.c.market), 'stroke-width': w });
        set(a.el.toChain, { d: pathD(a.c.chain), 'stroke-width': w });
        if (you) {
          reveal(a.el.toAgent, a.c.agent, win(t, T.toAgent[i], T.draw));
          reveal(a.el.toChain, a.c.chain, win(t, T.toChain[i], T.draw));
          reveal(a.el.toMarket, a.c.market, win(t, T.toMarket[i], T.draw));
        } else {
          reveal(a.el.toAgent, a.c.agent, win(t, p.enter + 0.25 + i * 0.08, 0.4));
          reveal(a.el.toChain, a.c.chain, win(t, p.enter + 0.75 + i * 0.08, 0.45));
          reveal(a.el.toMarket, a.c.market, win(t, p.enter + 0.85 + i * 0.08, 0.5));
        }
      });
    });
    chips.forEach((c) => {
      // The drawing head reaches the chip at start + draw * at (reveal uses a smoothstep, close enough).
      const on = c.start() + T.draw * c.at;
      if (t < on - 0.05 || t > on + CHIP_HOLD + 0.6) {
        if (c.shown !== false) {
          c.chip.g.setAttribute('opacity', '0');
          c.shown = false;
        }
        return;
      }
      c.shown = true;
      const inU = win(t, on, 0.3);
      const outU = win(t, on + CHIP_HOLD, 0.5);
      const path = c.path();
      const len = path.getTotalLength();
      const pt = path.getPointAtLength(len * c.at);
      set(c.chip.g, {
        opacity: inU * (1 - outU),
        transform: `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)}) scale(${(0.85 + 0.15 * inU).toFixed(3)})`,
      });
    });
    if (t > SETTLE_AT) settled = true;
  }
  // Draw a connector progressively (0..1).
  function reveal(path: SVGPathElement, P: Path, u: number) {
    if (u >= 1) {
      if (path.hasAttribute('stroke-dasharray')) {
        path.removeAttribute('stroke-dasharray');
        path.setAttribute('opacity', '1');
      }
      return;
    }
    const len = pathLen(P);
    set(path, {
      'stroke-dasharray': `${len} ${len}`,
      'stroke-dashoffset': len * (1 - u),
      opacity: u > 0 ? 1 : 0,
    });
  }

  function stream(
    agent: AgentNode,
    kind: keyof Connectors,
    color: string,
    reverse: boolean,
    start: number,
    dur = BEAM_S
  ) {
    const g = el('g', { opacity: 0 }, flowLayer);
    const id = 'hiw-bg' + gradSeq++;
    const grad = el('linearGradient', { id, gradientUnits: 'userSpaceOnUse' }, defs);
    el('stop', { offset: 0, 'stop-color': color, 'stop-opacity': 0 }, grad);
    el('stop', { offset: 0.65, 'stop-color': color, 'stop-opacity': 0.85 }, grad);
    el('stop', { offset: 1, 'stop-color': lighter(color, 0.55), 'stop-opacity': 1 }, grad);
    const glow = el(
      'path',
      {
        fill: 'none',
        stroke: `url(#${id})`,
        'stroke-width': 10,
        'stroke-linecap': 'round',
        opacity: 0.55,
        filter: 'url(#hiw-beam-blur)',
      },
      g
    );
    const core = el(
      'path',
      { fill: 'none', stroke: `url(#${id})`, 'stroke-width': 2.8, 'stroke-linecap': 'round' },
      g
    );
    const bloom = el('circle', { r: 14, fill: halo(lighter(color, 0.3)) }, g);
    streams.add({ agent, kind, reverse, start, dur, g, grad, glow, core, bloom });
  }
  function drawStreams(t: number) {
    streams.forEach((s) => {
      let P = s.agent.c[s.kind];
      if (s.reverse) P = reversePath(P);
      const u = (t - s.start) / s.dur;
      if (u < 0) return;
      const sc = lerp(1, 0.85, z);
      const d = pathD(P);
      const len = pathLen(P);
      s.core.setAttribute('d', d);
      s.glow.setAttribute('d', d);
      const to = smooth(clamp(u)) * len;
      const from = 0;
      const fade = 1 - clamp((u - 1) / 0.45);
      const pFrom = pathAt(P, from / len);
      const pTo = pathAt(P, to / len);
      set(s.grad, {
        x1: pFrom[0].toFixed(1),
        y1: pFrom[1].toFixed(1),
        x2: pTo[0].toFixed(1),
        y2: pTo[1].toFixed(1),
      });
      [s.core, s.glow].forEach((n) => {
        n.setAttribute(
          'stroke-dasharray',
          `${Math.max(0.01, to - from).toFixed(1)} ${(len * 3).toFixed(1)}`
        );
        n.setAttribute('stroke-dashoffset', (-from).toFixed(1));
      });
      set(s.bloom, {
        transform: `translate(${pTo[0].toFixed(1)},${pTo[1].toFixed(1)}) scale(${sc.toFixed(3)})`,
        opacity: u <= 1 ? 1 : 0,
      });
      s.g.setAttribute('opacity', String(fade));
      if (u >= 1.45) {
        s.g.remove();
        s.grad.remove();
        streams.delete(s);
      }
    });
  }
  // Rings on arrival.
  const pending: { when: number; fn: () => void }[] = [];
  const arrive = (when: number, fn: () => void) => pending.push({ when, fn });
  function ring(x: number, y: number, r: number, color: string) {
    const c = el(
      'circle',
      { cx: x, cy: y, r, fill: 'none', stroke: color, 'stroke-width': 3, opacity: 0.9 },
      flowLayer
    );
    c.animate(
      [
        { r, opacity: 0.8 },
        { r: r * 2, opacity: 0 },
      ] as Keyframe[],
      { duration: 700, easing: 'ease-out' }
    ).onfinish = () => c.remove();
  }
  // A request: out to the Marketplace in the agent's chain colour, then the violet answer back.
  function request(t: number, a: AgentNode) {
    stream(a, 'market', a.chain.color, false, t);
    stream(a, 'market', ANSWER, true, t + BEAM_S * 0.85 + 0.45);
    arrive(t + BEAM_S * 1.85 + 0.45, () => ring(a.pos.x, a.pos.y, a.r + 4, ANSWER));
  }
  function action(t: number, a: AgentNode) {
    stream(a, 'chain', a.chain.color, false, t);
    const [x, y] = L.chains[a.key];
    arrive(t + BEAM_S * 0.85, () => ring(x, y, L.chainR, a.chain.color));
  }
  // The close-up demo is fixed, so the first seconds always read the same way. After a layout switch
  // only the events still ahead are scheduled again.
  function scheduleIntro(from = 0) {
    const [g, p, r] = YOU.agents;
    (
      [
        [0, request, g],
        [0.5, action, p],
        [1.4, request, r],
        [2.6, action, g],
        [3.2, request, p],
      ] as [number, typeof request, AgentNode][]
    ).forEach(([dt, fn, a]) => {
      if (T.demoFrom + dt >= from) fn(T.demoFrom + dt, a);
    });
  }
  // The economy: random requests and actions, a few at a time, one per agent.
  let nextPick = 0;
  const busyUntil = new Map<AgentNode, number>();
  function economy(t: number) {
    if (t < T.economy || t < nextPick) return;
    const free = agents.filter((a) => (busyUntil.get(a) || 0) < t);
    if (free.length) {
      const a = free[Math.floor(Math.random() * free.length)];
      if (Math.random() < 0.55) {
        request(t, a);
        busyUntil.set(a, t + 4.6);
      } else {
        action(t, a);
        busyUntil.set(a, t + 2.2);
      }
    }
    nextPick = t + 0.7 + Math.random() * 1.2;
  }

  // ---------- Clock ----------
  let clock = 0;
  let last: number | null = null;
  let raf = 0;
  let started = false;
  let onScreen = true;
  let pageVisible = !document.hidden;
  let inCache = false;
  function frame(now: number) {
    raf = 0;
    if (last !== null) clock += Math.min(now - last, 64) / 1000;
    last = now;
    layout(clock);
    economy(clock);
    for (let i = pending.length - 1; i >= 0; i--)
      if (pending[i].when <= clock) {
        pending[i].fn();
        pending.splice(i, 1);
      }
    drawStreams(clock);
    schedule();
  }
  // The frame loop runs only while started, on screen, in a visible tab and outside the back-forward cache.
  function schedule() {
    const run = started && onScreen && pageVisible && !inCache;
    if (run && !raf) raf = requestAnimationFrame(frame);
    if (!run) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = null;
    }
  }
  function resetRun() {
    nextPick = 0;
    busyUntil.clear();
    pending.length = 0;
    clearStreams();
  }
  function start() {
    clock = 0;
    last = null;
    settled = false;
    resetRun();
    scheduleIntro();
    schedule();
  }

  // ---------- Layout switch ----------
  // The layout follows the diagram's own width, so it also works inside any container. It is rebuilt only
  // when the width crosses the threshold; the clock keeps running, so a switch never restarts the intro.
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const modeFor = (w: number): 'desktop' | 'mobile' => (w < 640 ? 'mobile' : 'desktop');
  let mode = modeFor(svg.parentElement.clientWidth || innerWidth);
  const render = () => layout(still ? T.economy + 3 : clock);
  build(mode);
  render();
  let switchTimer: ReturnType<typeof setTimeout> | undefined;
  const resizeObserver = new ResizeObserver((entries) => {
    const next = modeFor(entries[0].contentRect.width);
    if (next === mode) return;
    mode = next;
    svg.style.opacity = '0';
    clearTimeout(switchTimer);
    switchTimer = setTimeout(() => {
      build(mode);
      resetRun();
      if (started && clock < T.economy) scheduleIntro(clock);
      render();
      svg.style.opacity = '1';
    }, 180);
  });
  resizeObserver.observe(svg.parentElement);

  const onVisibility = () => {
    pageVisible = !document.hidden;
    schedule();
  };
  const onPageHide = () => {
    inCache = true;
    schedule();
  };
  const onPageShow = () => {
    inCache = false;
    schedule();
  };
  let visibilityObserver: IntersectionObserver | null = null;
  if (!still) {
    visibilityObserver = new IntersectionObserver(
      (e) => {
        const entry = e[e.length - 1];
        const visible = entry.isIntersecting;
        // The intro waits until a third of the diagram is on screen; after that any visible part keeps it running.
        if (visible && !started && entry.intersectionRatio >= 0.35) {
          started = true;
          start();
        }
        onScreen = visible;
        schedule();
      },
      { threshold: [0, 0.35] }
    );
    visibilityObserver.observe(svg);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('pageshow', onPageShow);
  }
  // Stops the loop, disconnects observers, removes listeners and everything the script drew.
  function dispose() {
    started = false;
    schedule();
    clearTimeout(switchTimer);
    resizeObserver.disconnect();
    if (visibilityObserver) visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
    clearStreams();
    pending.length = 0;
    svg.replaceChildren();
  }

  return { dispose };
}
