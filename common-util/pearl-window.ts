/*
 * Pearl app window with the agent chat, from the homepage design handoff of 2026-10-21 (timings,
 * layout and texts unchanged). Builds the window inside `.pc-window` (rendered empty by
 * `components/HomepageSection/PearlWindow.tsx`), so a re-init replaces it cleanly.
 */

// Pearl window with the agent chat (Figma file Pearl-1.0, section "New Agent Chat UI"). Two agents
// take turns. Polystrat places a trade in its feed; the user asks it to raise the max trade size,
// the agent asks to confirm, the user says yes, and the change shows up as a card once the user
// turns off Messages only. Then the user opens Basius and asks why it chose its pool. One clock
// drives everything, so any moment can be rendered on demand; it pauses off-screen, in hidden tabs
// and in the page cache. Reduced motion shows one still frame of the Polystrat conversation.

type Span = [number, number];
type Point = [number, number];
type ChatKey = 'polystrat' | 'basius';
type AgentKey = ChatKey | 'omenstrat' | 'connect';

type Timeline = {
  toStart: Span;
  startClick: number;
  starting: number;
  running: number;
  trade?: number;
  toInput: Span;
  inputClick: number;
  type1: Span;
  toSend: Span;
  send1: number;
  reply1: number;
  type2?: Span;
  send2?: number;
  reply2?: number;
  config?: number;
  toChip?: Span;
  chipClick?: number;
  toPause: Span;
  pauseClick: number;
  stopping: number;
  stopped: number;
  toNext: Span;
  nextClick: number;
  swap: number;
  end: number;
};
// Moments that add an entry to the feed.
type Moment = 'trade' | 'send1' | 'reply1' | 'send2' | 'reply2' | 'config';

type Field = [label: string, value: string, kind?: 'link' | 'gain'];
type FeedEntry =
  | { kind: 'day'; at?: never; text: string }
  | { kind: 'user'; at: Moment; time: string; text: string }
  | { kind: 'agent'; at: Moment; time: string; text: string }
  | { kind: 'event'; at?: Moment; time: string; title: string; fields: Field[] };

type Agent = { name: string; icon: string; instance?: string; beta?: boolean };
type ChatAgent = Agent & {
  instance: string;
  chain: string;
  metrics: [label: string, value: string, info?: boolean][];
  streak: number;
  badges: [boolean, boolean];
  typed: string[];
  // Loader steps: [from, text].
  steps: [number, string][];
  // While a reply is on its way.
  pending: Span[];
  messagesOnly: Span[];
  feed: FeedEntry[];
};

type Status = { text: string; since: number };

export function initPearlWindow(
  root: HTMLElement,
  options: { assetBase: string }
): { dispose: () => void } {
  const stage = root.querySelector<HTMLElement>('.pc-stage');
  const win = root.querySelector<HTMLElement>('.pc-window');
  const reduced = matchMedia('(prefers-reduced-motion: reduce), (update: slow)');
  const A = `${options.assetBase}assets/`;
  const W = 1080;

  // ---- Timeline, in seconds within one agent's turn ----------------------------------------

  // Pearl runs one agent at a time, so each turn starts the agent and ends by pausing it.
  const T: Record<ChatKey, Timeline> = {
    polystrat: {
      toStart: [0.6, 1.5],
      startClick: 1.6, // cursor clicks Start agent
      starting: 1.65,
      running: 3.0, // "Starting" and "Agent is loading", then at work
      trade: 5.0, // a new trade lands in the feed
      toInput: [5.9, 6.7],
      inputClick: 6.8, // cursor clicks into the input
      type1: [7.0, 8.6],
      toSend: [8.8, 9.4],
      send1: 9.5, // types the request, clicks Send
      reply1: 11.9, // the agent asks to confirm
      type2: [13.0, 13.5],
      send2: 13.9, // "Yes, please"
      reply2: 15.5,
      config: 16.0, // the agent confirms; the change is written
      toChip: [16.6, 17.3],
      chipClick: 17.4, // cursor turns Messages only off
      toPause: [18.6, 19.3],
      pauseClick: 19.4, // cursor pauses the agent
      stopping: 19.45,
      stopped: 20.0,
      toNext: [21.0, 21.8],
      nextClick: 21.9,
      swap: 22.05,
      end: 23.2,
    },
    basius: {
      toStart: [0.6, 1.5],
      startClick: 1.6,
      starting: 1.65,
      running: 3.0,
      toInput: [4.4, 5.2],
      inputClick: 5.3,
      type1: [5.5, 7.7],
      toSend: [7.9, 8.5],
      send1: 8.6,
      reply1: 11.0,
      toPause: [12.4, 13.1],
      pauseClick: 13.2,
      stopping: 13.25,
      stopped: 13.8,
      toNext: [14.8, 15.6],
      nextClick: 15.7,
      swap: 15.85,
      end: 17.0,
    },
  };
  const CYCLE: ChatKey[] = ['polystrat', 'basius'];
  const PASS = Object.fromEntries(CYCLE.map((k) => [k, T[k].end])) as Record<ChatKey, number>;
  const CYCLE_LENGTH = CYCLE.reduce((sum, k) => sum + PASS[k], 0);

  // ---- Content ---------------------------------------------------------------------------

  // Sidebar order follows the Figma design; Connect is the only Beta agent.
  const SIDEBAR: AgentKey[] = ['connect', 'polystrat', 'omenstrat', 'basius'];
  const CHAT: Record<ChatKey, ChatAgent> = {
    polystrat: {
      name: 'Polystrat',
      instance: 'fafon-norlo48',
      icon: 'agent-polymarket_trader-icon.webp',
      chain: 'chain-polygon.svg',
      metrics: [
        ['Total ROI', '10.22%', true],
        ['Prediction accuracy', '69%'],
      ],
      streak: 24,
      badges: [true, false],
      typed: ['Set my max trade size to $2', 'Yes, please'],
      // The FSM names Pearl shows, with the "..." of the design.
      steps: [
        [3.0, 'Making a prediction'],
        [4.3, 'Opening a trade on Polymarket'],
        [6.4, 'Taking a short break'],
        [11.9, 'Checking reward status'],
        [15.5, 'Sampling a trade'],
        [18.6, 'Making a prediction'],
      ],
      pending: [
        [9.5, 11.9],
        [13.9, 15.5],
      ],
      messagesOnly: [[9.6, 17.45]],
      feed: [
        { kind: 'day', text: 'Today' },
        {
          kind: 'event',
          time: '09:12',
          title: 'Placed a trade',
          fields: [
            ['Market', 'Will Apple announce a new iPad this month?', 'link'],
            ['Prediction', 'No'],
            ['Amount traded', '$1.00'],
            ['AI confidence', '81%'],
            ['Potential payout', '$1.29'],
          ],
        },
        {
          kind: 'event',
          time: '09:40',
          title: 'Skipped a market',
          fields: [
            ['Market', 'Will it rain in London tomorrow?', 'link'],
            ['Reason', 'The price already matched the AI tool’s estimate'],
          ],
        },
        {
          kind: 'event',
          at: 'trade',
          time: '10:05',
          title: 'Placed a trade',
          fields: [
            ['Market', 'Will Trump insult MapQuest this week?', 'link'],
            ['Prediction', 'Yes'],
            ['Amount traded', '$1.00'],
            ['AI confidence', '88%'],
            ['Potential payout', '$1.32'],
          ],
        },
        { kind: 'user', at: 'send1', time: '10:12', text: 'Set my max trade size to $2' },
        {
          kind: 'agent',
          at: 'reply1',
          time: '10:12',
          text: 'I can raise your max trade size from $1 to $2. Bigger trades can earn more, and they also put more of your funds at risk. Do you want me to set it to $2?',
        },
        { kind: 'user', at: 'send2', time: '10:13', text: 'Yes, please' },
        {
          kind: 'agent',
          at: 'reply2',
          time: '10:13',
          text: 'Got it. I’ll set your max trade size to $2 before my next trade.',
        },
        {
          kind: 'event',
          at: 'config',
          time: '10:14',
          title: 'Changed the configuration',
          fields: [['Max trade size', '$1 → $2']],
        },
      ],
    },
    basius: {
      name: 'Basius',
      instance: 'pasus-benmo18',
      icon: 'agent-basius-icon.webp',
      chain: 'base-chain.png',
      metrics: [
        ['Total ROI', '2.4%', true],
        ['Portfolio value', '$15.47'],
      ],
      streak: 9,
      badges: [true, false],
      typed: ['Why did you choose your current pool?'],
      steps: [
        [3.0, 'Checking portfolio'],
        [4.2, 'Evaluating strategies'],
      ],
      pending: [[8.6, 11.0]],
      messagesOnly: [[8.7, Infinity]],
      feed: [
        { kind: 'day', text: 'Today' },
        {
          kind: 'event',
          time: '08:30',
          title: 'Exited a pool',
          fields: [
            ['Pool', 'WETH/USDC on Aerodrome'],
            ['Result', '+$0.21', 'gain'],
            ['Amount entered', '$14.80'],
            ['Entered', 'Yesterday'],
          ],
        },
        {
          kind: 'event',
          time: '08:32',
          title: 'Entered a pool',
          fields: [
            ['Pool', 'USDC/eUSD on Aerodrome'],
            ['Amount entered', '$15.01'],
          ],
        },
        { kind: 'user', at: 'send1', time: '11:20', text: 'Why did you choose your current pool?' },
        // The agent answers from its recent activity and its settings only (no yields), as its
        // chat prompt asks.
        {
          kind: 'agent',
          at: 'reply1',
          time: '11:20',
          text: 'This morning I moved your funds from WETH/USDC to USDC/eUSD on Aerodrome. You’re on the Balanced strategy, and a pool of two stablecoins keeps your funds steadier than one with WETH.',
        },
      ],
    },
  };
  const AGENTS: Record<AgentKey, Agent> = {
    ...CHAT,
    omenstrat: { name: 'Omenstrat', icon: 'agent-trader-icon.webp' },
    connect: { name: 'Connect', icon: 'agent-connect-icon.webp', beta: true },
  };

  // ---- Markup ------------------------------------------------------------------------------

  // Every string in the markup is a constant from this file; esc() covers the characters the
  // texts can contain.
  const img = (src: string, w: number, h: number) =>
    `<img src="${A}${src}" width="${w}" height="${h}" alt="">`;
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const entryHtml = (e: FeedEntry, agent: ChatAgent) => {
    if (e.kind === 'day') return `<div class="pc-entry pc-day"><span>${esc(e.text)}</span></div>`;
    if (e.kind === 'user')
      return `<div class="pc-entry pc-user"><p class="pc-bubble"><span>${esc(e.text)}</span><time>${e.time}</time></p></div>`;
    if (e.kind === 'agent')
      return `<div class="pc-entry pc-agent"><span class="pc-mark">${img(agent.icon, 20, 20)}</span><div class="pc-body"><div class="pc-title"><p>${esc(e.text)}</p><time>${e.time}</time></div></div></div>`;
    const fields = e.fields
      .map(
        ([label, value, kind]) =>
          `<div><dt>${esc(label)}:</dt><dd${kind === 'gain' ? ' class="is-gain"' : ''}>${esc(value)}${kind === 'link' ? ' <span class="pc-ext">↗</span>' : ''}</dd></div>`
      )
      .join('');
    return `<div class="pc-entry pc-event"><span class="pc-mark"><i></i></span><div class="pc-body"><div class="pc-title"><p>${esc(e.title)}</p><time>${e.time}</time></div><dl class="pc-fields">${fields}</dl></div></div>`;
  };
  const markers = (feed: FeedEntry[]) =>
    feed.filter((e) => e.kind === 'event' || e.kind === 'agent').length;

  win.innerHTML = `
    <aside class="pc-sidebar">
      <div class="pc-side-head">
        <div class="pc-lights"><i style="background:#ff6056"></i><i style="background:#febc2e"></i><i style="background:#29c742"></i></div>
        <div class="pc-logo">${img('logo-happy-robot.svg', 35, 39)}</div>
      </div>
      <div class="pc-side-body">
        <div class="pc-myagents"><p>My agents</p><div class="pc-autorun"><span>Off</span><span class="pc-mini-btn">${img('autorun-refresh.svg', 16, 16)}</span></div></div>
        <div class="pc-list">${SIDEBAR.map((key) => {
          const a = AGENTS[key];
          const open = (CYCLE as AgentKey[]).includes(key);
          return `<div class="pc-group" data-agent="${key}">
            <div class="pc-group-row">${img(open ? 'chevron-down.svg' : 'chevron-right.svg', 16, 16)}<span class="pc-thumb">${img(a.icon, 28, 28)}</span><span>${a.name}</span>${a.beta ? '<span class="pc-tag">Beta</span>' : ''}</div>
            ${open ? `<div class="pc-instances"><span class="pc-rail"></span><div class="pc-inst"><p>${a.instance}</p><span class="pc-dot-box"><span class="pc-dot"></span></span></div></div>` : ''}
          </div>`;
        }).join('')}</div>
        <div class="pc-add">${img('plus.svg', 20, 20)}Add Agent</div>
      </div>
      <div class="pc-side-foot">
        <div class="pc-nav">${img('nav-wallet.svg', 20, 20)}Pearl Wallet</div>
        <div class="pc-nav">${img('nav-help.svg', 20, 20)}Help Center</div>
        <div class="pc-nav">${img('nav-settings.svg', 20, 20)}Settings</div>
      </div>
    </aside>
    <section class="pc-main">
      <div class="pc-tabs">
        <span class="pc-tab is-active">${img('tab-overview.svg', 20, 20)}Overview</span>
        <span class="pc-tab">${img('tab-profile.svg', 20, 20)}Profile</span>
      </div>
      <div class="pc-column">
        <div class="pc-head">
          <div class="pc-avatar"><img class="pc-avatar-img" width="112" height="112" alt=""></div>
          <div class="pc-info">
            <p class="pc-name"><span class="pc-name-text"></span><img class="pc-chain" width="16" height="16" alt=""></p>
            <span class="pc-run is-start"><span class="pc-spin"></span><span class="pc-run-label">Start agent</span></span>
          </div>
          <div class="pc-panel">
            <div class="pc-ctas"><span class="pc-cta">${img('btn-info.svg', 16, 16)}</span><span class="pc-cta">${img('btn-wallet.svg', 16, 16)}</span><span class="pc-cta is-streak">${img('btn-flame.svg', 16, 16)}<span class="pc-streak"></span></span></div>
            <dl class="pc-metrics">${[0, 1].map(() => `<div class="pc-metric"><dt></dt><dd></dd></div>`).join('')}</dl>
          </div>
        </div>
        <div class="pc-chat">
          <div class="pc-scroll">${CYCLE.map((key) => `<div class="pc-feed" data-agent="${key}" hidden>${CHAT[key].feed.map((e) => entryHtml(e, CHAT[key])).join('')}${'<span class="pc-line"></span>'.repeat(markers(CHAT[key].feed))}</div>`).join('')}</div>
          <div class="pc-status">
            <span class="pc-dmx">${'<i></i>'.repeat(25)}</span>
            <span class="pc-status-text"><span></span><span></span></span>
            <span class="pc-badges"><span class="pc-badge"></span><span class="pc-badge"></span></span>
          </div>
          <div class="pc-input-wrap"><p class="pc-start-note">Start the agent to chat</p><div class="pc-input">
            <div class="pc-text"><span class="pc-placeholder">Ask your agent or give it guidance...</span><span class="pc-typed"></span><span class="pc-caret"></span></div>
            <div class="pc-bar">
              <span class="pc-chip"><span class="pc-chip-bg"></span><span class="pc-chip-icon">${img('msg-only.svg', 16, 16)}${img('msg-only-on.svg', 16, 16)}</span><span class="pc-chip-label">Messages only</span><span class="pc-chip-x"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></span></span>
              <span class="pc-actions"><span class="pc-info-btn">${img('info-input.svg', 16, 16)}</span><span class="pc-send"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg></span></span>
            </div>
          </div></div>
        </div>
      </div>
    </section>
    <div class="pc-cursor">
      <span class="pc-ripple"></span>
      <img class="arrow" src="${A}cursor-default.svg" width="32" height="32" alt="">
      <img class="hand" src="${A}cursor-hand.svg" width="32" height="32" alt="">
    </div>`;

  // ---- Elements ----------------------------------------------------------------------------

  const $ = <E extends HTMLElement = HTMLElement>(s: string) => root.querySelector<E>(s);
  const $$ = (s: string, from: ParentNode = root) => [...from.querySelectorAll<HTMLElement>(s)];
  const inst = Object.fromEntries(
    $$('.pc-group')
      .filter((g) => g.querySelector('.pc-inst'))
      .map((g) => [g.dataset.agent, g.querySelector<HTMLElement>('.pc-inst')])
  ) as Record<ChatKey, HTMLElement>;
  const dots = Object.fromEntries(
    Object.entries(inst).map(([k, node]) => [k, node.querySelector<HTMLElement>('.pc-dot')])
  ) as Record<ChatKey, HTMLElement>;
  const feeds = Object.fromEntries(
    $$('.pc-feed').map((f) => [
      f.dataset.agent,
      { el: f, entries: $$('.pc-entry', f), lines: $$('.pc-line', f) },
    ])
  ) as Record<ChatKey, { el: HTMLElement; entries: HTMLElement[]; lines: HTMLElement[] }>;
  const badgeImgs = [true, false].map((on) =>
    img(on ? 'badge-filled.svg' : 'badge-outline.svg', 16, 16)
  );
  const el = {
    column: $('.pc-column'),
    avatar: $<HTMLImageElement>('.pc-avatar-img'),
    name: $('.pc-name-text'),
    chain: $<HTMLImageElement>('.pc-chain'),
    streak: $('.pc-streak'),
    metrics: $$('.pc-metric'),
    dots: $$('.pc-dmx i'),
    status: $$('.pc-status-text span'),
    statusRow: $('.pc-status'),
    badges: $('.pc-badges'),
    badge: $$('.pc-badge'),
    run: $('.pc-run'),
    runLabel: $('.pc-run-label'),
    startNote: $('.pc-start-note'),
    input: $('.pc-input'),
    placeholder: $('.pc-placeholder'),
    typed: $('.pc-typed'),
    caret: $('.pc-caret'),
    send: $('.pc-send'),
    chip: $('.pc-chip'),
    chipBg: $('.pc-chip-bg'),
    chipIcons: $$('.pc-chip-icon img'),
    chipLabel: $('.pc-chip-label'),
    chipX: $('.pc-chip-x'),
    cursor: $('.pc-cursor'),
    arrow: $('.pc-cursor .arrow'),
    hand: $('.pc-cursor .hand'),
    ripple: $('.pc-ripple'),
  };

  // ---- Helpers -----------------------------------------------------------------------------

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const prog = (t: number, at: number, dur: number) => clamp01((t - at) / dur);
  const easeInOut = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
  const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);
  const bump = (v: number) => Math.sin(Math.PI * clamp01(v));
  // Writes only when a value changes, so a still frame costs almost nothing.
  const memo = new WeakMap<HTMLElement, Record<string, unknown>>();
  const put = <V>(node: HTMLElement, key: string, value: V, write: (v: V) => void) => {
    let m = memo.get(node);
    if (!m) memo.set(node, (m = {}));
    if (m[key] !== value) {
      m[key] = value;
      write(value);
    }
  };
  type StyleProp =
    | 'transform'
    | 'opacity'
    | 'visibility'
    | 'clipPath'
    | 'background'
    | 'borderColor'
    | 'color'
    | 'width';
  const css = (node: HTMLElement, prop: StyleProp, value: string) =>
    put(node, prop, value, (v) => {
      node.style[prop] = v;
    });
  const txt = (node: HTMLElement, value: string) =>
    put(node, 'text', value, (v) => {
      node.textContent = v;
    });
  const cls = (node: HTMLElement, name: string, on: boolean) =>
    put(node, `.${name}`, on, (v) => node.classList.toggle(name, v));
  let scale = 1;
  let scaleY = 1;
  // Centre of an element in window coordinates (the window is scaled with a transform).
  const centre = (node: HTMLElement, dx = 0, dy = 0): Point => {
    const w = win.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    return [
      (r.left - w.left + r.width / 2) / scale + dx,
      (r.top - w.top + r.height / 2) / scaleY + dy,
    ];
  };
  const within = (u: number, spans: Span[]) => spans.some(([a, b]) => u >= a && u < b);
  // 0 → 1 → 0 over each [from, to] span, easing `dur` seconds at both ends.
  const spanLevel = (u: number, spans: Span[], dur: number) =>
    spans.reduce(
      (o, [a, b]) => Math.max(o, easeInOut(prog(u, a, dur)) * (1 - easeInOut(prog(u, b, dur)))),
      0
    );
  const spanLinear = (u: number, spans: Span[], dur: number) =>
    spans.reduce((o, [a, b]) => Math.max(o, prog(u, a, dur) * (1 - prog(u, b, dur))), 0);

  // ---- Feed layout -------------------------------------------------------------------------

  // Heights are measured once the fonts are in; positions are then pure arithmetic, so a frame
  // moves entries with transforms only and never asks the browser for layout.
  const heights = {} as Record<ChatKey, number[]>;
  function measure() {
    CYCLE.forEach((key) => {
      const f = feeds[key];
      const hidden = f.el.hidden;
      f.el.hidden = false;
      heights[key] = f.entries.map((e) => e.offsetHeight);
      f.el.hidden = hidden;
    });
  }
  // Space between two entries, from the Figma frames: events in a run sit 12px apart, an agent
  // line is followed by a 16px connector spacer on top of the usual 24px (40px in all), and
  // everything else is 24px apart.
  const gapBetween = (prev: FeedEntry['kind'], next: FeedEntry['kind']) =>
    prev === 'event' && next === 'event' ? 12 : prev === 'agent' ? 40 : 24;
  const PAD_TOP = 24;
  const SCROLL_H = 318;

  function renderFeed(u: number, key: ChatKey, mo: number) {
    const a = CHAT[key];
    const f = feeds[key];
    const t = T[key];
    let y = PAD_TOP;
    let prev: FeedEntry['kind'] | null = null;
    const placed = a.feed.map((e, i) => {
      const at = e.at ? t[e.at] : -Infinity;
      const grow = at === -Infinity ? 1 : easeInOut(prog(u, at, 0.45));
      // Messages only: an event folds up like an accordion while it fades (and back again).
      const fold = e.kind === 'event' ? easeInOut(mo) : 0;
      const fade = e.kind === 'event' ? clamp01(mo / 0.6) : 0;
      const w = grow * (1 - fold);
      if (prev) y += gapBetween(prev, e.kind) * w;
      const top = y;
      y += heights[key][i] * w;
      prev = e.kind;
      const fadeIn = at === -Infinity ? 1 : prog(u, at + 0.15, 0.35);
      const opacity = fadeIn * (1 - fade);
      return { e, top, w, opacity, clip: heights[key][i] * fold, node: f.entries[i] };
    });
    // The feed follows the newest entry; a short feed stays at the top, as in the app.
    const scroll = Math.max(0, y - SCROLL_H);
    placed.forEach(({ top, opacity, clip, node }) => {
      css(node, 'transform', `translateY(${(top - scroll).toFixed(1)}px)`);
      css(node, 'clipPath', clip > 0.5 ? `inset(0 0 ${clip.toFixed(1)}px 0)` : 'none');
      css(node, 'opacity', opacity.toFixed(3));
      css(node, 'visibility', opacity > 0 ? 'visible' : 'hidden');
    });
    // Connectors run from each marker to the next one still on screen, past user messages.
    const marks = placed.filter((p) => p.e.kind === 'event' || p.e.kind === 'agent');
    marks.forEach((m, i) => {
      const line = f.lines[i];
      const next = marks.slice(i + 1).find((n) => n.opacity > 0.02);
      if (!next || m.opacity <= 0.02) {
        css(line, 'opacity', '0');
        return;
      }
      const from = m.top + (m.e.kind === 'agent' ? 26 : 20);
      const to = next.top - (m.e.kind === 'event' && next.e.kind === 'event' ? 0 : 8);
      css(
        line,
        'transform',
        `translateY(${(from - scroll).toFixed(1)}px) scaleY(${Math.max(0, to - from).toFixed(1)})`
      );
      css(line, 'opacity', Math.min(m.opacity, next.opacity).toFixed(3));
    });
  }

  // ---- Status row --------------------------------------------------------------------------

  // Loader dots: each dot's place in the diagonal sweep sets its animation delay (the CSS runs the
  // animation). Without motion the dots keep the library's still pattern, alternate diagonals.
  const DMX_PERIOD = 1.5 / 0.66;
  el.dots.forEach((dot, i) => {
    const slice = Math.floor(i / 5) + (4 - (i % 5));
    const phase = (slice / 8) * 0.2 + (slice % 2) * 0.5;
    dot.style.setProperty('--pc-dmx-delay', `${(-(1 - phase) * DMX_PERIOD).toFixed(3)}s`);
    dot.style.opacity = slice % 2 ? '0.14' : '0.88';
  });

  // The row shows the agent's current step and "Thinking..." while a reply is on its way. While
  // Messages only is on and no reply is pending, the app hides the row: those are the quiet spans.
  const quietSpans = (a: ChatAgent) =>
    a.messagesOnly.flatMap(([s, e]) => {
      const spans: Span[] = [];
      let from = s;
      a.pending
        .filter(([ps, pe]) => pe > s && ps < e)
        .forEach(([ps, pe]) => {
          if (ps > from) spans.push([from, ps]);
          from = Math.max(from, pe);
        });
      if (from < e) spans.push([from, e]);
      return spans;
    });
  const QUIET = Object.fromEntries(CYCLE.map((k) => [k, quietSpans(CHAT[k])])) as Record<
    ChatKey,
    Span[]
  >;

  function statusAt(u: number, key: ChatKey): Status {
    const a = CHAT[key];
    const t = T[key];
    const quiet = QUIET[key];
    // Hidden before the start; "Agent is loading" while starting; the last text while stopping.
    if (u < t.running) return { text: 'Agent is loading', since: -9 };
    if (u >= t.stopping) return { text: statusAt(t.stopping - 0.001, key).text, since: -9 };
    const pending = a.pending.find(([s, e]) => u >= s && u < e);
    if (pending) return { text: 'Thinking...', since: pending[0] };
    // Hidden rows keep their last text while they fade out.
    if (within(u, quiet)) return { text: 'Thinking...', since: -9 };
    let step = a.steps[0];
    a.steps.forEach((s) => {
      if (u >= s[0]) step = s;
    });
    // A step that starts while the row is hidden appears without the slide.
    const ends = a.pending
      .map(([, e]) => e)
      .concat(quiet.map(([, e]) => e))
      .filter((e) => e <= u);
    const quietEnd = quiet.map(([, e]) => e).filter((e) => e <= u && e >= step[0]);
    const since = quietEnd.length ? -9 : Math.max(step[0], ...ends, -9);
    return { text: `${step[1]}...`, since };
  }

  function renderStatus(u: number, key: ChatKey, mo: number) {
    const now = statusAt(u, key);
    const prior = now.since > -9 ? statusAt(now.since - 0.001, key) : null;
    const before = prior && prior.text !== now.text ? prior : null;
    const p = before ? easeOut(prog(u, now.since, 0.35)) : 1;
    const [out, inc] = el.status;
    txt(out, before && p < 1 ? before.text : '');
    txt(inc, now.text);
    css(out, 'transform', `translateY(${(-20 * p).toFixed(1)}px)`);
    css(out, 'opacity', before ? (1 - p).toFixed(3) : '0');
    css(inc, 'transform', `translateY(${(20 * (1 - p)).toFixed(1)}px)`);
    css(inc, 'opacity', (before ? p : 1).toFixed(3));
    const t = T[key];
    const shown = prog(u, t.starting, 0.3) * (1 - prog(u, t.stopping, 0.3));
    css(el.statusRow, 'opacity', (shown * (1 - spanLevel(u, QUIET[key], 0.3))).toFixed(3));
    // The reward badges are hidden in Messages only.
    css(el.badges, 'opacity', (1 - mo).toFixed(3));
  }

  // ---- Agent on screen ---------------------------------------------------------------------

  let shownKey: ChatKey | null = null;
  function showAgent(key: ChatKey) {
    if (shownKey === key) return;
    shownKey = key;
    const a = CHAT[key];
    el.avatar.src = A + a.icon;
    el.name.textContent = a.instance;
    el.chain.src = A + a.chain;
    txt(el.streak, String(a.streak));
    a.metrics.forEach(([label, value, info], i) => {
      el.metrics[i].querySelector('dt').textContent = `${label}:`;
      el.metrics[i].querySelector('dd').innerHTML =
        `${info ? img('info-14.svg', 14, 14) : ''}${esc(value)}`;
    });
    el.badge.forEach((b, i) => {
      b.innerHTML = badgeImgs[a.badges[i] ? 0 : 1];
    });
    Object.entries(feeds).forEach(([k, f]) => {
      f.el.hidden = k !== key;
    });
  }

  // ---- One agent's turn --------------------------------------------------------------------

  // Where the cursor goes, in window coordinates (measured in measureSpots below).
  let spots: {
    run: Point;
    input: Point;
    send: Point;
    chip: Point;
    inst: Record<ChatKey, Point>;
  } | null = null;

  function renderTurn(u: number, key: ChatKey, nextKey: ChatKey) {
    const t = T[key];
    const swapped = u >= t.swap;
    const shown = swapped ? nextKey : key;
    showAgent(shown);
    const at = swapped ? -1 : u; // the next agent starts at the top of its turn
    const a = CHAT[shown];

    // Messages only switches on by itself when the first message goes out, and off on a click.
    const mo = swapped ? 0 : spanLinear(at, a.messagesOnly, 0.8);
    const chipOn = swapped ? 0 : within(at, a.messagesOnly) ? 1 : 0;
    renderFeed(at, shown, mo);
    renderStatus(at, shown, mo);

    // Input: focus, typing, send. The text clears when the message goes out.
    const tk = swapped ? T[shown] : t;
    const typing: [Span, number, string][] = [];
    if (tk.type1) typing.push([tk.type1, tk.send1, a.typed[0]]);
    if (tk.type2) typing.push([tk.type2, tk.send2, a.typed[1]]);
    let text = '';
    let isTyping = false;
    typing.forEach(([[s, e], sent, value]) => {
      if (at >= s && at < sent) {
        text = value.slice(0, Math.round(value.length * prog(at, s, e - s)));
        isTyping = at < e;
      }
    });
    const focused = !swapped && at >= tk.inputClick && at < (tk.chipClick ?? tk.pauseClick);
    txt(el.typed, text);
    css(el.placeholder, 'opacity', text ? '0' : '1');
    css(el.caret, 'opacity', focused && (isTyping || Math.floor(at * 2) % 2 === 0) ? '1' : '0');
    css(el.input, 'borderColor', focused ? '#d8b4fe' : '#dfe6ec');
    const sends = [tk.send1, tk.send2].filter(Boolean);
    const press = Math.max(0, ...sends.map((s) => bump(prog(at, s - 0.04, 0.2))));
    css(el.send, 'opacity', text ? '1' : '0.4');
    css(el.send, 'transform', `scale(${(1 - 0.1 * press).toFixed(3)})`);

    // Run button: Start agent → Starting → Pause Agent → Stopping → Start agent.
    const phase =
      at < tk.starting
        ? 'start'
        : at < tk.running
          ? 'starting'
          : at < tk.stopping
            ? 'pause'
            : at < tk.stopped
              ? 'stopping'
              : 'start';
    ['start', 'starting', 'pause', 'stopping'].forEach((b) => cls(el.run, `is-${b}`, b === phase));
    txt(
      el.runLabel,
      { start: 'Start agent', starting: 'Starting', pause: 'Pause Agent', stopping: 'Stopping' }[
        phase
      ]
    );
    cls(
      el.run,
      'is-hover',
      !swapped &&
        ((at > t.toStart[1] - 0.1 && at < t.startClick + 0.1) ||
          (at > t.toPause[1] - 0.1 && at < t.pauseClick + 0.1))
    );
    const runPress = swapped
      ? 0
      : bump(prog(at, t.startClick - 0.04, 0.2)) + bump(prog(at, t.pauseClick - 0.04, 0.2));
    css(el.run, 'transform', `scale(${(1 - 0.05 * runPress).toFixed(3)})`);

    // A stopped agent can't chat: "Start the agent to chat" stands where the input was. While it
    // starts or stops, the input is there but dimmed.
    const live = prog(at, tk.starting, 0.25) * (1 - prog(at, tk.stopped, 0.25));
    css(el.input, 'opacity', (live * (at >= tk.running && at < tk.stopping ? 1 : 0.6)).toFixed(3));
    css(el.startNote, 'opacity', (1 - live).toFixed(3));

    // Sidebar: the agent on screen pulses purple from its start until it has stopped; a stopped
    // agent that has earned its rewards is green.
    Object.entries(dots).forEach(([g, dot]) =>
      cls(dot, 'is-running', !swapped && g === key && at >= t.starting && at < t.stopped)
    );

    // Messages only chip: purple with a cross while on.
    css(el.chipBg, 'opacity', String(chipOn));
    css(el.chipIcons[1], 'opacity', String(chipOn));
    css(el.chipLabel, 'color', chipOn ? '#7e22ce' : '#617084');
    css(el.chipX, 'width', chipOn ? '12px' : '0px');
    const chipPress = t.chipClick && !swapped ? bump(prog(at, t.chipClick - 0.04, 0.2)) : 0;
    css(el.chip, 'transform', `scale(${(1 - 0.06 * chipPress).toFixed(3)})`);

    // Switching agents: the column fades out on the click and the next agent slides in.
    const leaving = prog(u, t.nextClick + 0.03, t.swap - t.nextClick - 0.03);
    const arriving = swapped ? easeOut(prog(u, t.swap, 0.18)) : 1;
    css(el.column, 'opacity', (swapped ? arriving : 1 - leaving).toFixed(3));
    css(
      el.column,
      'transform',
      `translateY(${(swapped ? 8 * (1 - arriving) : -8 * leaving).toFixed(1)}px)`
    );
    Object.entries(inst).forEach(([g, node]) => {
      const selected = (g === key && u < t.nextClick) || (g === nextKey && u >= t.nextClick);
      css(node, 'background', selected ? '#edf2f7' : 'transparent');
    });

    // Cursor.
    const places = {
      run: () => spots.run,
      input: () => spots.input,
      send: () => spots.send,
      chip: () => spots.chip,
      next: () => spots.inst[nextKey],
      here: () => spots.inst[key],
    };
    const legs: [Span, () => Point, () => Point][] = [
      [t.toStart, places.here, places.run],
      [t.toInput, places.run, places.input],
      [t.toSend, places.input, places.send],
    ];
    if (t.toChip) legs.push([t.toChip, places.send, places.chip]);
    legs.push([t.toPause, t.toChip ? places.chip : places.send, places.run]);
    legs.push([t.toNext, places.run, places.next]);
    let pos = legs[0][1]();
    for (const [[t0, t1], a0, a1] of legs) {
      if (u >= t1) pos = a1();
      else if (u > t0) {
        const v = easeInOut(prog(u, t0, t1 - t0));
        const p0 = a0();
        const p1 = a1();
        const lift = Math.min(40, Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) * 0.08);
        pos = [p0[0] + (p1[0] - p0[0]) * v, p0[1] + (p1[1] - p0[1]) * v - lift * bump(v)];
        break;
      } else break;
    }
    const clicks = [
      t.startClick,
      t.inputClick,
      t.send1,
      t.send2,
      t.chipClick,
      t.pauseClick,
      t.nextClick,
    ].filter(Boolean);
    const click = Math.max(...clicks.map((c) => bump(prog(u, c - 0.04, 0.18))));
    const ripple = Math.max(...clicks.map((c) => (u >= c && u < c + 0.45 ? prog(u, c, 0.45) : 0)));
    const pointing = (
      [
        [t.toStart[1] - 0.15, t.startClick + 0.25],
        [t.toSend[1] - 0.15, (t.send2 ?? t.send1) + 0.25],
        [t.toPause[1] - 0.15, t.pauseClick + 0.25],
        [t.toNext[1] - 0.15, t.nextClick + 0.25],
      ] as Span[]
    )
      .concat(t.toChip ? [[t.toChip[1] - 0.15, t.chipClick + 0.25]] : [])
      .some(([a0, b0]) => u > a0 && u < b0);
    css(
      el.cursor,
      'transform',
      `translate(${pos[0].toFixed(1)}px, ${pos[1].toFixed(1)}px) scale(${(1 - 0.12 * click).toFixed(3)})`
    );
    css(el.arrow, 'opacity', pointing ? '0' : '1');
    css(el.hand, 'opacity', pointing ? '1' : '0');
    css(el.ripple, 'opacity', String(ripple > 0 ? 1 - ripple : 0));
    css(el.ripple, 'transform', `scale(${0.4 + ripple})`);
  }

  // Scene time → which agent's turn, and how far into it.
  function locate(time: number) {
    let u = ((time % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH;
    for (let i = 0; i < CYCLE.length; i += 1) {
      if (u < PASS[CYCLE[i]]) return { turn: i, u };
      u -= PASS[CYCLE[i]];
    }
    return { turn: 0, u: 0 };
  }
  function render(time: number) {
    const { turn, u } = locate(time);
    renderTurn(u, CYCLE[turn], CYCLE[(turn + 1) % CYCLE.length]);
  }
  function renderStill() {
    render(18.4); // Polystrat after the change: the conversation and the new configuration card
    css(el.cursor, 'opacity', '0');
  }

  // ---- Clock and lifecycle ------------------------------------------------------------------

  let sceneTime = 0;
  let armed = false; // a third of the window is on screen; it stays armed until the window leaves
  let disposed = false;
  let frozenForPageCache = false;
  let frame = 0;
  let lastUpdate = 0;

  // The stage gets a whole-pixel height and starts on a whole device pixel, so the edge lines fall
  // on pixel rows: with the height the aspect ratio gives (754.72px at 1024 wide), the bottom line
  // was drawn across two rows at partial strength and read as half a pixel. The window is scaled
  // to fill that height exactly (a 0.04% stretch at most).
  // Content above the window can move it after it was sized (fonts, images), so the snap runs
  // again on load, when the fonts arrive and when the window comes on screen.
  const snap = () => {
    const dpr = window.devicePixelRatio || 1;
    stage.style.transform = '';
    const offset = ((stage.getBoundingClientRect().top + window.scrollY) * dpr) % 1;
    stage.style.transform =
      offset > 0.01 && offset < 0.99 ? `translateY(${(-offset / dpr).toFixed(4)}px)` : '';
  };
  // The layout inside the window doesn't move, so the cursor targets are measured here rather
  // than on every frame.
  const measureSpots = () => {
    const column = el.column.style.transform;
    el.column.style.transform = 'none';
    const runBox = el.run.getBoundingClientRect();
    const winBox = win.getBoundingClientRect();
    spots = {
      // The button changes width with its label, so the cursor aims at a fixed point on its left.
      run: [
        (runBox.left - winBox.left) / scale + 52,
        (runBox.top - winBox.top + runBox.height / 2) / scaleY + 2,
      ],
      input: centre(el.placeholder, -60, 0),
      send: centre(el.send, -2, 1),
      chip: centre(el.chipLabel, -10, 1),
      inst: Object.fromEntries(
        Object.entries(inst).map(([k, node]) => [k, centre(node, -30, 1)])
      ) as Record<ChatKey, Point>,
    };
    el.column.style.transform = column;
  };
  const resize = () => {
    stage.style.transform = '';
    const box = stage.getBoundingClientRect();
    const height = Math.round((box.width * 796) / W);
    stage.style.height = `${height}px`;
    scale = box.width / W;
    scaleY = height / 796;
    win.style.transform = `scale(${scale}, ${scaleY})`;
    stage.style.setProperty('--pc-scale', String(scale));
    snap();
    measureSpots();
  };
  // resize() sets the stage's own height, so it runs in the next frame: inside the callback the
  // observer would see the stage change again in the same frame.
  let sizeFrame = 0;
  const sizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(sizeFrame);
    sizeFrame = requestAnimationFrame(() => {
      sizeFrame = 0;
      if (disposed) return;
      resize();
      sync();
    });
  });

  function canAnimate() {
    return (
      !disposed &&
      !reduced.matches &&
      !document.hidden &&
      !frozenForPageCache &&
      root.isConnected &&
      armed
    );
  }
  function tick(now: number) {
    frame = 0;
    if (!canAnimate()) {
      sync();
      return;
    }
    const dt = Math.max(0, Math.min((now - lastUpdate) / 1000, 0.08)); // the first frame can be stamped before lastUpdate
    lastUpdate = now;
    sceneTime += dt;
    render(sceneTime);
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (disposed) return;
    if (reduced.matches) {
      renderStill();
      root.dataset.running = 'false';
      return;
    }
    css(el.cursor, 'opacity', '1');
    render(sceneTime);
    const running = canAnimate();
    root.dataset.running = String(running);
    if (running) {
      lastUpdate = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }
  const onPageHide = (event: PageTransitionEvent) => {
    if (event.persisted) {
      frozenForPageCache = true;
      sync();
    } else dispose();
  };
  const onPageShow = () => {
    frozenForPageCache = false;
    sync();
  };
  // The window starts once a third of it is on screen. After it has left the screen it comes back
  // at the start of the current agent's turn, so the visitor sees the story from its beginning.
  const START_RATIO = 1 / 3;
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      if (!entry.isIntersecting && armed) {
        armed = false;
        const base = Math.floor(sceneTime / CYCLE_LENGTH) * CYCLE_LENGTH;
        const { turn, u } = locate(sceneTime);
        const key = CYCLE[turn];
        let start = base + CYCLE.slice(0, turn).reduce((s, k) => s + PASS[k], 0);
        if (u >= T[key].swap) start += PASS[key];
        sceneTime = start;
      }
      if (entry.intersectionRatio >= START_RATIO) armed = true;
      snap();
      sync();
    },
    { threshold: [0, START_RATIO] }
  );
  function dispose() {
    if (disposed) return;
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    if (sizeFrame) cancelAnimationFrame(sizeFrame);
    visibilityObserver.disconnect();
    sizeObserver.disconnect();
    reduced.removeEventListener('change', sync);
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
    window.removeEventListener('load', snap);
  }
  resize();
  measure();
  visibilityObserver.observe(root);
  sizeObserver.observe(stage);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  window.addEventListener('load', snap);
  sync();
  // Text wraps differently once Inter arrives, so the feed is measured again.
  if (document.fonts) {
    document.fonts.ready.then(() => {
      if (disposed) return;
      measure();
      snap();
      measureSpots();
      sync();
    });
  }

  return { dispose };
}
