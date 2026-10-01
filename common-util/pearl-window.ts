/*
 * Pearl app window motion (homepage design handoff 2026-09-28). Ported as-is from the handoff
 * scene; only the root lookup, asset paths and types differ. Builds the window inside
 * `.pw-window` (rendered empty by `components/HomepageSection/PearlWindow.tsx`), so a re-init
 * replaces it cleanly.
 */

// Pearl window: a representative Pearl desktop app. Three agents take turns: the selected
// agent starts, works (its current action changes), the user looks at its Profile and scrolls
// a little, returns to Overview, the agent earns its staking rewards, the user pauses it and
// picks the next agent in the sidebar. Styles follow the Figma design; texts, states and
// order follow the shipped app (Pearl 1.9.9). One clock drives everything, so any moment can
// be rendered on demand; it pauses off-screen, in hidden tabs and in the page cache. Reduced
// motion shows one still frame with the first agent at work.
export function initPearlWindow(
  root: HTMLElement,
  options: { assetBase: string }
): { dispose: () => void } {
  const stage = root.querySelector<HTMLElement>('.pw-stage');
  const win = root.querySelector<HTMLElement>('.pw-window');
  const reduced = matchMedia('(prefers-reduced-motion: reduce), (update: slow)');
  const A = `${options.assetBase}assets/`;

  // ---- Content ---------------------------------------------------------------------------

  // Sidebar order follows the app's agent config; Connect is the only Beta agent.
  const SIDEBAR = ['omenstrat', 'polystrat', 'basius', 'connect'];
  const CYCLE = ['polystrat', 'omenstrat', 'basius'];
  // Figures match the captured profiles (Roman's agents, 2026-09-28, slightly adjusted upwards);
  // Total ROI is all-time profit over funds used.
  const AGENTS = {
    polystrat: {
      name: 'Polystrat',
      instance: 'fafon-norlo48',
      icon: 'agent-polymarket_trader-icon.webp',
      chain: 'polygon-chain.png',
      metrics: [
        ['Total ROI', '3%', true],
        ['Prediction accuracy', '55%', true],
      ],
      behavior: 'Trade sizes adapt to market conditions and agent confidence.',
      streak: 18,
      epoch: '21:37:14',
      tokens: [
        ['USDC', 'usdc-icon.png'],
        ['POL', 'pol-icon.png'],
      ],
      actions: [
        'Fetching Polymarket markets',
        'Making a prediction',
        'Opening a trade on Polymarket',
        'Checking reward status',
      ],
    },
    omenstrat: {
      name: 'Omenstrat',
      instance: 'corzim-vardor96',
      icon: 'agent-trader-icon.webp',
      chain: 'gnosis-chain.png',
      metrics: [
        ['Total ROI', '15%', true],
        ['Prediction accuracy', '68%', true],
      ],
      behavior: 'Adopting a conservative strategy with small, high-confidence trades.',
      streak: 41,
      epoch: '16:48:05',
      tokens: [['XDAI', 'xdai-icon.png']],
      actions: [
        'Sampling a trade',
        'Making a prediction',
        'Opening a trade',
        'Checking reward status',
      ],
    },
    basius: {
      name: 'Basius',
      instance: 'pasus-benmo18',
      icon: 'agent-basius-icon.webp',
      chain: 'base-chain.png',
      metrics: [
        ['Portfolio Balance', '$15.47', true],
        ['Total ROI', '2.4%', true],
      ],
      behavior:
        'Conservative volatile exposure across DEXs and lending markets with advanced functionalities enabled.',
      streak: 9,
      epoch: '13:22:51',
      tokens: [['USDC', 'usdc-icon.png']],
      actions: [
        'Checking portfolio',
        'Evaluating strategies',
        'Executing trades',
        'Checking staking reward status',
      ],
      scroll: 0, // the profile's first screen is enough
    },
    connect: {
      name: 'Connect',
      instance: 'My Connect',
      icon: 'agent-connect-icon.webp',
      beta: true,
    },
  };

  // ---- Markup ------------------------------------------------------------------------------

  const img = (src, w, h, alt = '') =>
    `<img src="${A}${src}" width="${w}" height="${h}" alt="${alt}">`;
  const infoIcon = img('info-small.svg', 16, 16);
  win.innerHTML = `
    <aside class="pw-sidebar">
      <div class="pw-side-head">
        <div class="pw-lights"><i style="background:#ff6056"></i><i style="background:#febc2e"></i><i style="background:#29c742"></i></div>
        <div class="pw-logo">${img('logo-happy-robot.svg', 35, 39)}</div>
      </div>
      <div class="pw-side-body">
        <div class="pw-myagents"><p>My agents</p><div class="pw-autorun"><span>Off</span><span class="pw-mini-btn">${img('autorun-refresh.svg', 16, 16)}</span></div></div>
        <div class="pw-list">${SIDEBAR.map((key) => {
          const a = AGENTS[key];
          const open = CYCLE.includes(key);
          return `<div class="pw-group${open ? ' is-open' : ''}" data-agent="${key}">
            <div class="pw-group-row">
              <span class="pw-chev">${img(open ? 'chevron-down.svg' : 'chevron-right.svg', 16, 16)}</span>
              <span class="pw-thumb">${img(a.icon, 28, 28)}</span>
              <span class="pw-group-name">${a.name}</span>${a.beta ? '<span class="pw-tag">Beta</span>' : ''}
            </div>
            <div class="pw-instances"><div class="pw-instances-inner"><span class="pw-rail"></span>
              <div class="pw-inst"><p>${a.instance}</p><span class="pw-dot-box"><span class="pw-dot"></span></span></div>
            </div></div>
          </div>`;
        }).join('')}</div>
        <div class="pw-add">${img('plus.svg', 20, 20)}Add Agent</div>
      </div>
      <div class="pw-side-foot">
        <div class="pw-nav">${img('nav-wallet.svg', 20, 20)}Pearl Wallet</div>
        <div class="pw-nav">${img('nav-help.svg', 20, 20)}Help Center</div>
        <div class="pw-nav">${img('nav-settings.svg', 20, 20)}Settings</div>
      </div>
    </aside>
    <section class="pw-main">
      <div class="pw-tabs-wrap"><div class="pw-tabs">
        <span class="pw-tab-pill"></span>
        <span class="pw-tab is-active" data-tab="overview"><span class="pw-tab-icon">${img('tab-overview-idle.svg', 20, 20)}${img('tab-overview.svg', 20, 20)}</span>Overview</span>
        <span class="pw-tab" data-tab="profile"><span class="pw-tab-icon">${img('tab-profile.svg', 20, 20)}${img('tab-profile-active.svg', 20, 20)}</span>Profile</span>
      </div></div>
      <div class="pw-overview"><div class="pw-ov-inner">
        <div class="pw-agent-card">
          <span class="pw-card-bg idle"></span><span class="pw-card-bg loading"></span><span class="pw-card-bg running"></span><span class="pw-card-bg rewards"></span>
          <div class="pw-agent-main">
            <div class="pw-avatar"><img class="pw-avatar-img" width="88" height="88" alt=""></div>
            <div class="pw-agent-info">
              <div class="pw-agent-head"><p class="pw-agent-name"></p>
                <div class="pw-ctas"><span class="pw-chain"><img class="pw-chain-img" width="16" height="16" alt=""></span><span class="pw-icon-btn">${img('btn-info.svg', 20, 20)}</span></div>
              </div>
              <div class="pw-run-slot"><span class="pw-run is-start"><span class="pw-spin"></span><span class="pw-run-label">Start agent</span></span></div>
            </div>
          </div>
          <div class="pw-status">
            <div class="pw-st idle">Agent is not running</div>
            <div class="pw-st loading">Agent is loading</div>
            <div class="pw-st running"><span class="pw-st-label">Current action:</span><span class="pw-actions"><span class="pw-action"><span></span></span><span class="pw-action"><span></span></span></span>${img('chevrons-up-down.svg', 20, 20)}</div>
            <div class="pw-st rewards">Agent has earned staking rewards and is in standby mode for the next epoch <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div>
          </div>
        </div>
        <div class="pw-section">
          <div class="pw-sub"><h3>Performance</h3></div>
          <div class="pw-card">
            <div class="pw-metrics">${[0, 1].map(() => `<div class="pw-metric"><div class="pw-metric-label"><span class="pw-metric-name"></span>${infoIcon}</div><p class="pw-metric-value"></p></div>`).join('')}</div>
            <div class="pw-behavior"><div class="pw-metric-label">Agent behavior</div>
              <div class="pw-behavior-box"><p class="pw-behavior-text"></p><span class="pw-btn-sm pw-behavior-btn">Update</span></div></div>
          </div>
        </div>
        <div class="pw-section">
          <div class="pw-sub"><h3>Staking</h3><span class="pw-btn-sm">Manage Staking</span></div>
          <div class="pw-card"><div class="pw-metrics">
            <div class="pw-metric"><div class="pw-metric-label">Epoch lifetime</div><div class="pw-metric-inline">${img('clock.svg', 24, 24)}<span class="pw-epoch">21:37:14</span></div></div>
            <div class="pw-metric"><div class="pw-metric-label">Streak</div><div class="pw-metric-inline"><span class="pw-flame">${img('flame.svg', 24, 24)}${img('flame-lit.svg', 24, 24)}</span><span class="pw-streak"></span></div></div>
          </div></div>
        </div>
        <div class="pw-section">
          <div class="pw-sub"><h3>Wallet</h3><span class="pw-btn-sm">Manage Wallet</span></div>
          <div class="pw-card"><div class="pw-metric"><div class="pw-metric-label">Tokens</div><div class="pw-tokens"></div></div></div>
        </div>
      </div></div>
      <div class="pw-profile"></div>
    </section>
    <div class="pw-cursor">
      <span class="pw-ripple"></span>
      <img class="arrow" src="${A}cursor-default.svg" width="32" height="32" alt="">
      <img class="hand" src="${A}cursor-hand.svg" width="32" height="32" alt="">
    </div>`;

  // Profiles: pictures of the agents' own web UIs (tools/capture-profiles.ts, then
  // tools/render-profiles.ts), as tall as the window can show; the picture slides to scroll.
  const PROFILE_HEIGHT = { polystrat: 970, omenstrat: 970, basius: 700 }; // tools/render-profiles.ts
  root.querySelector('.pw-profile').innerHTML = CYCLE.map(
    (key) =>
      `<div class="pw-pp" data-agent="${key}"><img class="pw-pp-scroll" src="${options.assetBase}profiles/${key}.webp" width="776" height="${PROFILE_HEIGHT[key]}" alt="" decoding="async"></div>`
  ).join('');

  // ---- Elements ----------------------------------------------------------------------------

  const $ = (s: string) => root.querySelector<HTMLElement>(s);
  const $$ = (s: string) => [...root.querySelectorAll<HTMLElement>(s)];
  const groups = Object.fromEntries(
    $$('.pw-group').map((g) => [
      g.dataset.agent,
      {
        el: g,
        row: g.querySelector('.pw-group-row'),
        chev: g.querySelector('.pw-chev'),
        instances: g.querySelector('.pw-instances'),
        inner: g.querySelector('.pw-instances-inner'),
        inst: g.querySelector('.pw-inst'),
        dot: g.querySelector('.pw-dot'),
      },
    ])
  );
  const el = {
    overview: $('.pw-overview'),
    profile: $('.pw-profile'),
    pages: Object.fromEntries($$('.pw-pp').map((p) => [p.dataset.agent, p])),
    pill: $('.pw-tab-pill'),
    tabs: Object.fromEntries($$('.pw-tab').map((t) => [t.dataset.tab, t])),
    avatar: $('.pw-avatar-img') as HTMLImageElement,
    name: $('.pw-agent-name'),
    chain: $('.pw-chain-img') as HTMLImageElement,
    run: $('.pw-run'),
    runLabel: $('.pw-run-label'),
    cardBg: Object.fromEntries($$('.pw-card-bg').map((b) => [b.classList[1], b])),
    status: Object.fromEntries($$('.pw-st').map((s) => [s.classList[1], s])),
    actions: $$('.pw-action'),
    metricNames: $$('.pw-metric-name'),
    metricValues: $$('.pw-metric-value'),
    behavior: $('.pw-behavior-text'),
    behaviorBtn: $('.pw-behavior-btn'),
    epoch: $('.pw-epoch'),
    streak: $('.pw-streak'),
    flameLit: $$('.pw-flame img')[1],
    tokens: $('.pw-tokens'),
    cursor: $('.pw-cursor'),
    arrow: $('.pw-cursor .arrow'),
    hand: $('.pw-cursor .hand'),
    ripple: $('.pw-ripple'),
  };
  el.tabs.overview.querySelectorAll('img')[0].style.opacity = '0';
  el.tabs.profile.querySelectorAll('img')[1].style.opacity = '0';

  // ---- Helpers -----------------------------------------------------------------------------

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const prog = (t, at, dur) => clamp01((t - at) / dur);
  const easeInOut = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
  const easeOut = (v) => 1 - Math.pow(1 - v, 3);
  const bump = (v) => Math.sin(Math.PI * clamp01(v));
  // Writes only when a value changes, so a still frame costs almost nothing.
  const memo = new WeakMap();
  const put = (node, key, value, write) => {
    let m = memo.get(node);
    if (!m) memo.set(node, (m = {}));
    if (m[key] !== value) {
      m[key] = value;
      write(value);
    }
  };
  const css = (node, prop, value) =>
    put(node, prop, value, (v) => {
      node.style[prop] = v;
    });
  const cls = (node, name, on) => put(node, `.${name}`, on, (v) => node.classList.toggle(name, v));
  const txt = (node, value) =>
    put(node, 'text', value, (v) => {
      node.textContent = v;
    });
  let scale = 1;
  // Centre of an element in window coordinates (the window is scaled with a transform).
  const centre = (node, dx = 0, dy = 0) => {
    const w = win.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    return [
      (r.left - w.left + r.width / 2) / scale + dx,
      (r.top - w.top + r.height / 2) / scale + dy,
    ];
  };

  // ---- Timeline, in seconds within one agent's turn ----------------------------------------

  const T = {
    toStart: [0.6, 1.5],
    startClick: 1.6, // cursor goes to "Start agent" and clicks
    loading: 1.65,
    running: 3.0, // "Starting" / "Agent is loading", then at work
    actions: [3.0, 4.8, 7.6, 12.8], // current action changes
    toProfile: [5.6, 6.4],
    profileClick: 6.5, // cursor goes to the Profile tab and clicks
    toPage: [7.3, 7.8],
    scroll: [8.2, 9.6], // into the page, then scrolls a little
    toOverview: [10.6, 11.4],
    overviewClick: 11.5, // back to Overview
    rewards: 14.2, // rewards earned: green strip, streak +1
    toPause: [16.2, 16.9],
    pauseClick: 17.0, // cursor pauses the agent
    stopping: 17.05,
    idle: 17.6,
    toNext: [18.6, 19.4],
    nextClick: 19.5, // cursor picks the next agent in the sidebar
    swap: 19.65,
    end: 20.8,
  };
  const PASS = T.end;
  const CYCLE_LENGTH = PASS * CYCLE.length;
  const SCROLL = 280; // how far the profile scrolls, unless the agent sets its own

  let shownKey = null;
  function showAgent(key) {
    if (shownKey === key) return;
    shownKey = key;
    const a = AGENTS[key];
    el.avatar.src = A + a.icon;
    el.name.textContent = a.instance;
    el.chain.src = A + a.chain;
    a.metrics.forEach(([label, value], i) => {
      el.metricNames[i].textContent = label;
      el.metricValues[i].textContent = value;
    });
    el.behavior.textContent = a.behavior;
    el.tokens.innerHTML = a.tokens
      .map(([sym, icon]) => `<span class="pw-token">${img(icon, 20, 20)}${sym}</span>`)
      .join('');
    Object.entries(el.pages).forEach(([k, p]) => p.classList.toggle('is-shown', k === key));
  }

  // Crossfaded states: each [from, to] window fades in and out over `fade` seconds.
  const windowed = (u, spans, fade = 0.25) =>
    spans.reduce(
      (o, [a, b]) => Math.max(o, prog(u, a, fade) * (b === Infinity ? 1 : 1 - prog(u, b, fade))),
      0
    );

  function renderTurn(u, key, nextKey, turn) {
    const a = AGENTS[key];
    const swapped = u >= T.swap;
    showAgent(swapped ? nextKey : key);
    const at = swapped ? -1 : u; // the next agent starts idle

    // Run button and status strip.
    const phase =
      at < T.loading
        ? 'idle'
        : at < T.running
          ? 'loading'
          : at < T.rewards
            ? 'running'
            : at < T.stopping
              ? 'rewards'
              : at < T.idle
                ? 'stopping'
                : 'idle';
    const button = {
      idle: 'start',
      loading: 'starting',
      running: 'pause',
      rewards: 'pause',
      stopping: 'stopping',
    }[phase];
    ['start', 'starting', 'pause', 'stopping'].forEach((b) => cls(el.run, `is-${b}`, b === button));
    txt(
      el.runLabel,
      { start: 'Start agent', starting: 'Starting', pause: 'Pause Agent', stopping: 'Stopping' }[
        button
      ]
    );
    const hover =
      (at > T.toStart[1] - 0.1 && at < T.startClick + 0.1) ||
      (at > T.toPause[1] - 0.1 && at < T.pauseClick + 0.1);
    cls(el.run, 'is-hover', hover);
    const press =
      bump(prog(at, T.startClick - 0.04, 0.2)) + bump(prog(at, T.pauseClick - 0.04, 0.2));
    css(el.run, 'transform', `scale(${1 - 0.05 * press})`);
    const states = {
      idle: [
        [-9, T.loading],
        [T.stopping, Infinity],
      ],
      loading: [[T.loading, T.running]],
      running: [[T.running, T.rewards]],
      rewards: [[T.rewards, T.stopping]],
    };
    Object.entries(states).forEach(([s, spans]) => {
      const o = at < 0 ? (s === 'idle' ? 1 : 0) : windowed(at, spans).toFixed(3);
      css(el.status[s], 'opacity', String(o));
      css(el.cardBg[s], 'opacity', String(o));
    });
    // Current action: the new line slides up as the old one leaves.
    let k = -1;
    T.actions.forEach((t, i) => {
      if (at >= t) k = i;
    });
    const p = k < 0 ? 0 : easeOut(prog(at, T.actions[k], 0.35));
    const [out, inc] = el.actions;
    txt(out.firstChild, k > 0 ? a.actions[k - 1] : '');
    txt(inc.firstChild, k >= 0 ? a.actions[k] : '');
    css(out, 'transform', `translateY(${-20 * p}px)`);
    css(out, 'opacity', String(k > 0 ? 1 - p : 0));
    css(inc, 'transform', `translateY(${20 * (1 - p)}px)`);
    css(inc, 'opacity', String(k >= 0 ? p : 0));
    txt(
      el.behaviorBtn,
      phase === 'idle' || phase === 'stopping' ? 'Start Agent to Update' : 'Update'
    );
    cls(el.behaviorBtn, 'is-disabled', phase === 'idle' || phase === 'stopping');

    // Staking: the epoch clock ticks; the streak flame lights and counts up with the rewards.
    const lit = at >= 0 ? prog(at, T.rewards, 0.3) : 0;
    css(el.flameLit, 'opacity', String(lit));
    txt(el.streak, String(AGENTS[swapped ? nextKey : key].streak + (lit > 0.5 ? 1 : 0)));

    // Tabs and views: Overview ⇄ Profile, and the fade between agents (8px slide, as in the app).
    const toProfile = easeInOut(prog(at, T.profileClick + 0.03, 0.3));
    const toOverview = easeInOut(prog(at, T.overviewClick + 0.03, 0.3));
    const profile = at < 0 ? 0 : toProfile - toOverview;
    css(el.pill, 'transform', `translateX(${130 * profile}px)`);
    cls(el.tabs.overview, 'is-active', profile < 0.5);
    cls(el.tabs.profile, 'is-active', profile >= 0.5);
    css(el.tabs.overview.querySelectorAll('img')[1], 'opacity', String(1 - profile));
    css(el.tabs.overview.querySelectorAll('img')[0], 'opacity', String(profile));
    css(el.tabs.profile.querySelectorAll('img')[0], 'opacity', String(1 - profile));
    css(el.tabs.profile.querySelectorAll('img')[1], 'opacity', String(profile));
    const leaving = prog(u, T.nextClick + 0.03, T.swap - T.nextClick - 0.03);
    const arriving = swapped ? easeOut(prog(u, T.swap, 0.18)) : 1;
    const ovOpacity = (1 - profile) * (swapped ? arriving : 1 - leaving);
    css(el.overview, 'opacity', String(ovOpacity));
    css(
      el.overview,
      'transform',
      `translateY(${swapped ? 8 * (1 - arriving) : -8 * leaving + (profile > 0 ? -8 * profile : 0)}px)`
    );
    css(el.profile, 'opacity', String(profile));
    css(el.profile, 'visibility', profile > 0 ? 'visible' : 'hidden');
    css(el.profile, 'transform', `translateY(${8 * (1 - profile)}px)`);
    const scrolled =
      (a.scroll ?? SCROLL) * easeInOut(prog(at, T.scroll[0], T.scroll[1] - T.scroll[0]));
    const page = el.pages[key];
    if (page) css(page.firstElementChild, 'transform', `translateY(${-scrolled}px)`);

    // Sidebar: the selection moves to the next agent on click; the running dot pulses;
    // rewards turn it green.
    Object.entries(groups).forEach(([g, grp]) => {
      const selected = (g === key && u < T.nextClick) || (g === nextKey && u >= T.nextClick);
      css(grp.inst, 'background', selected ? '#edf2f7' : 'transparent');
      const order = CYCLE.indexOf(g);
      let dot = 'idle';
      if (order >= 0) {
        const ranBefore = order < turn || passIndex >= CYCLE.length; // earlier this round, or last round
        if (ranBefore) dot = 'rewarded';
        if (order === turn)
          dot =
            u >= T.idle ? 'rewarded' : u >= T.loading ? 'running' : ranBefore ? 'rewarded' : 'idle';
      }
      cls(grp.dot, 'is-running', dot === 'running');
      cls(grp.dot, 'is-rewarded', dot === 'rewarded');
    });

    // Cursor.
    const places: Record<string, () => number[]> = {
      start: () => centre(el.run, -10, 2),
      profileTab: () => centre(el.tabs.profile, -8, 2),
      page: () => centre(el.profile, 60, -40),
      overviewTab: () => centre(el.tabs.overview, -8, 2),
      next: () => centre(groups[nextKey].inst, -30, 1),
      rest: () => [1010, 520],
    };
    const legs: Array<[number[], () => number[], () => number[]]> = [
      [
        T.toStart,
        turn === 0 && passIndex === 0 ? places.rest : () => centre(groups[key].inst, -30, 1),
        places.start,
      ],
      [T.toProfile, places.start, places.profileTab],
      [T.toPage, places.profileTab, places.page],
      [T.toOverview, places.page, places.overviewTab],
      [T.toPause, places.overviewTab, places.start],
      [T.toNext, places.start, places.next],
    ];
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
    const clicks = [T.startClick, T.profileClick, T.overviewClick, T.pauseClick, T.nextClick];
    const click = Math.max(...clicks.map((c) => bump(prog(u, c - 0.04, 0.18))));
    const ripple = Math.max(...clicks.map((c) => (u >= c && u < c + 0.45 ? prog(u, c, 0.45) : 0)));
    const pointing = [
      [T.toStart[1] - 0.15, T.startClick + 0.25],
      [T.toProfile[1] - 0.15, T.profileClick + 0.25],
      [T.toOverview[1] - 0.15, T.overviewClick + 0.25],
      [T.toPause[1] - 0.15, T.pauseClick + 0.25],
      [T.toNext[1] - 0.15, T.nextClick + 0.25],
    ].some(([a0, b0]) => u > a0 && u < b0);
    css(
      el.cursor,
      'transform',
      `translate(${pos[0].toFixed(1)}px, ${pos[1].toFixed(1)}px) scale(${1 - 0.12 * click})`
    );
    css(el.arrow, 'opacity', pointing ? '0' : '1');
    css(el.hand, 'opacity', pointing ? '1' : '0');
    css(el.ripple, 'opacity', String(ripple > 0 ? 1 - ripple : 0));
    css(el.ripple, 'transform', `scale(${0.4 + ripple})`);
  }

  let passIndex = 0;
  function render(time) {
    const pass = Math.floor(time / PASS);
    passIndex = pass;
    const u = time - pass * PASS;
    const turn = pass % CYCLE.length;
    const key = CYCLE[turn];
    const nextKey = CYCLE[(turn + 1) % CYCLE.length];
    renderTurn(u, key, nextKey, turn);
    // Each agent's epoch clock counts down in real seconds while the agent is on screen
    // (it appears at T.swap of the pass before its turn).
    const shown = u >= T.swap ? nextKey : key;
    const [h, m, s] = AGENTS[shown].epoch.split(':').map(Number);
    const left = h * 3600 + m * 60 + s - Math.floor(u >= T.swap ? u - T.swap : u + PASS - T.swap);
    txt(
      el.epoch,
      [Math.floor(left / 3600), Math.floor(left / 60) % 60, left % 60]
        .map((n) => String(n).padStart(2, '0'))
        .join(':')
    );
  }
  function renderStill() {
    render(5.3); // the first agent at work: "Making a prediction"
    css(el.cursor, 'opacity', '0');
  }

  // ---- Clock and lifecycle ------------------------------------------------------------------

  let sceneTime = 0;
  let speed = 1;
  let paused = false;
  let armed = false; // a third of the window is on screen; it stays armed until the window leaves
  let disposed = false;
  let frozenForPageCache = false;
  let frame = 0;
  let lastUpdate = 0;

  const resize = () => {
    scale = stage.clientWidth / 1124;
    win.style.transform = `scale(${scale})`;
  };
  const sizeObserver = new ResizeObserver(() => {
    resize();
    sync();
  });

  function canAnimate() {
    return (
      !disposed &&
      !paused &&
      !reduced.matches &&
      !document.hidden &&
      !frozenForPageCache &&
      root.isConnected &&
      armed
    );
  }
  function tick(now) {
    frame = 0;
    if (!canAnimate()) {
      sync();
      return;
    }
    const dt = Math.max(0, Math.min((now - lastUpdate) / 1000, 0.08)); // the first frame can be stamped before lastUpdate
    lastUpdate = now;
    sceneTime += dt * speed;
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
  const onPageHide = (event) => {
    if (event.persisted) {
      frozenForPageCache = true;
      sync();
    } else dispose();
  };
  const onPageShow = () => {
    frozenForPageCache = false;
    sync();
  };
  // The window starts once a third of it is on screen (the Start button is in view by then).
  // After it has left the screen it comes back at the start of the current agent's turn, so
  // the visitor sees the story from the Start click rather than from its middle.
  const START_RATIO = 1 / 3;
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      if (!entry.isIntersecting && armed) {
        armed = false;
        const pass = Math.floor(sceneTime / PASS);
        sceneTime = (sceneTime - pass * PASS >= T.swap ? pass + 1 : pass) * PASS;
      }
      if (entry.intersectionRatio >= START_RATIO) armed = true;
      sync();
    },
    { threshold: [0, START_RATIO] }
  );
  function dispose() {
    if (disposed) return;
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    visibilityObserver.disconnect();
    sizeObserver.disconnect();
    reduced.removeEventListener('change', sync);
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
  }
  resize();
  visibilityObserver.observe(root);
  sizeObserver.observe(stage);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  sync();

  return { dispose };
}
