/*
 * OLAS flywheel motion (homepage design handoff 2026-09-28). Ported as-is from the handoff
 * scene; only the root lookup, types and DOM teardown in `dispose` differ. Finds its elements
 * by the `data-fw` / `data-fw-path` / `data-fw-label` hooks in
 * `components/HomepageSection/Flywheel/FlywheelDesktop.tsx` and `FlywheelConnectors.tsx`.
 */

// OLAS flywheel motion. Content comes first: cards, numbers and economy pills are visible from
// the first frame. Only one thing moves at a time, in reading order: the main loop clockwise
// from Users (the order of the paragraph above the diagram), then the PoL branch up to its OFF
// switch, then the four economy arcs together. The entrance draws the connectors in that
// order, one at a time with a short pause between them. Then a lap repeats: the same order
// lights up one connector at a time; it fills with purple, arrowhead included, and its card
// and label light as the fill arrives; the PoL branch stops at OFF. Numbers (interactive, with
// tooltips) and economy pills are left alone.
// One clock drives everything, so any moment can be rendered on demand; it pauses off-screen,
// in hidden tabs and in the page cache. Reduced motion shows the finished diagram, still.
export function initFlywheelMotion(canvas: HTMLElement): { dispose: () => void } {
  const root = canvas;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = root.querySelector('[data-fw="connectors"]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce), (update: slow)');

  const LOOP = ['stake', 'active', 'bazaar', 'burn', 'attract'];
  const ARRIVES = { stake: 'daa', active: 'txns', bazaar: 'a2a', burn: 'burned', attract: 'users' };
  const ECONOMIES = ['predict', 'babydegen', 'mech', 'agentsfun'];
  const POL = ['pol', 'pol-fees', 'pol-off'];
  const MARKET_SWITCH = [152, 728]; // the ON switch sits on the burn connector here

  const DRAW_SPEED = 450; // entrance: connectors grow at this many px per second, on average
  const DRAW_MIN = 0.45; // entrance: even a short connector takes this long, so its easing shows
  const DRAW_GAP = 0.35; // entrance: pause between one connector and the next
  const EASE_POWER = 2.6; // entrance: strength of the ease in and out (2 is gentle, 3 is cubic)
  const LAP_SPEED = 260; // lap: the pulse travels at this many px per second
  const DWELL = 0.6; // lap: pause at each card before the pulse moves on
  const JUMP = 0.3; // pause before attention moves to a new part of the diagram
  // Lap highlight colour per connector: the site's purple on the loop, a stronger tint of
  // each economy arc's own colour on the arcs.
  const LIT = {
    default: '#7E22CE',
    predict: '#A78BFA',
    babydegen: '#A78BFA',
    mech: '#2DD4BF',
    agentsfun: '#7DA7DB',
  };
  const LAP_MIN = 0.4; // lap: even a short connector takes this long

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const prog = (t, at, dur) => clamp01((t - at) / dur);
  const easeInOut = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
  const easeOut = (v) => 1 - Math.pow(1 - v, 3);
  const easeOutBack = (v) => 1 + 2.2 * Math.pow(v - 1, 3) + 1.2 * Math.pow(v - 1, 2);
  const bump = (v) => Math.sin(Math.PI * clamp01(v));
  // Connectors ease in and out; drawnAt is the inverse, for "when does the line reach x".
  const easeDraw = (v) => {
    const x = clamp01(v);
    return x < 0.5 ? 2 ** (EASE_POWER - 1) * x ** EASE_POWER : 1 - (2 - 2 * x) ** EASE_POWER / 2;
  };
  const drawnAt = (y) =>
    y < 0.5
      ? (y / 2 ** (EASE_POWER - 1)) ** (1 / EASE_POWER)
      : 1 - (2 - 2 * y) ** (1 / EASE_POWER) / 2;
  const drawTime = (length) => Math.max(DRAW_MIN, length / DRAW_SPEED);

  // Remember each element's own inline style (the site sets some) so it can be put back.
  const originals = new Map();
  const set = (el, prop, value) => {
    if (!originals.has(el)) originals.set(el, el.getAttribute('style'));
    el.style[prop] = value;
  };
  const glow = (el, g) =>
    set(
      el,
      'filter',
      g > 0.001 ? `drop-shadow(0 0 ${10 * g}px rgba(168, 85, 247, ${0.6 * g}))` : 'none'
    );

  // --- Connectors: a reveal mask for the entrance and a lap fill per path ---------------------

  const defs =
    svg.querySelector('defs') ??
    svg.insertBefore(document.createElementNS(NS, 'defs'), svg.firstChild);
  const overlay = document.createElementNS(NS, 'g');
  overlay.setAttribute('class', 'fw-overlay');
  svg.append(overlay);
  const clone = (path: Element, attrs: Record<string, string>) => {
    const el = document.createElementNS(NS, 'path');
    el.setAttribute('d', path.getAttribute('d'));
    el.setAttribute('fill', 'none');
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  };
  const paths: Record<string, any> = {};
  svg.querySelectorAll<SVGGeometryElement>('[data-fw-path]').forEach((el) => {
    const hook = el.dataset.fwPath;
    const length = el.getTotalLength();
    // Each mask covers only its own connector plus room for the arrowhead: canvas-sized masks
    // made the browser repaint the whole diagram on every frame. The area is measured along
    // the path, which works even while the diagram is hidden (narrow screens).
    let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
    for (let l = 0; l <= length + 4; l += 4) {
      const p = el.getPointAtLength(Math.min(l, length));
      [x0, y0, x1, y1] = [
        Math.min(x0, p.x),
        Math.min(y0, p.y),
        Math.max(x1, p.x),
        Math.max(y1, p.y),
      ];
    }
    const region = (m) => {
      m.setAttribute('maskUnits', 'userSpaceOnUse');
      m.setAttribute('x', String(Math.floor(x0 - 24)));
      m.setAttribute('y', String(Math.floor(y0 - 24)));
      m.setAttribute('width', String(Math.ceil(x1 - x0 + 48)));
      m.setAttribute('height', String(Math.ceil(y1 - y0 + 48)));
    };
    const mask = document.createElementNS(NS, 'mask');
    mask.id = `fw-reveal-${hook}`;
    region(mask);
    const reveal = clone(el, {
      stroke: '#fff',
      'stroke-width': '14',
      'stroke-dasharray': `${length} ${length}`,
    });
    mask.append(reveal);
    defs.append(mask);
    const dashed = el.hasAttribute('stroke-dasharray');
    const width = el.getAttribute('stroke-width') ?? '3';
    const litColor = LIT[hook] ?? LIT.default;
    // Fill: a coloured copy of the connector, dashes kept, revealed by its own mask.
    const litMask = document.createElementNS(NS, 'mask');
    litMask.id = `fw-lit-${hook}`;
    region(litMask);
    // Wide enough to take in the arrowhead's wings; the square cap reaches past its tip.
    const litReveal = clone(el, {
      stroke: '#fff',
      'stroke-width': '26',
      'stroke-linecap': 'square',
      'stroke-dasharray': `${length} ${length}`,
    });
    litMask.append(litReveal);
    defs.append(litMask);
    // Line and arrowhead share one group, so they fade as one layer: no line shows through a
    // half-transparent arrowhead.
    const litGroup = document.createElementNS(NS, 'g');
    litGroup.setAttribute('mask', `url(#${litMask.id})`);
    litGroup.setAttribute('opacity', '0');
    const lit = clone(el, { stroke: litColor, 'stroke-width': width });
    if (dashed) lit.setAttribute('stroke-dasharray', el.getAttribute('stroke-dasharray'));
    litGroup.append(lit);
    overlay.append(litGroup);
    paths[hook] = {
      el,
      length,
      mask,
      reveal,
      litGroup,
      litReveal,
      litColor,
      marker: el.getAttribute('marker-end'),
    };
  });
  // --- Arrowheads. The site draws them as SVG markers. During the entrance a copy of the
  // marker rides the tip of the growing line, turned along it, and hands over to the marker
  // when the line is complete.
  function buildHead(path) {
    if (!path.marker) return;
    const marker = svg.querySelector(`#${CSS.escape(path.marker.slice(5, -1))}`);
    if (!path.head) {
      path.head = document.createElementNS(NS, 'g');
      path.head.setAttribute('opacity', '0');
      overlay.append(path.head);
    }
    path.head.innerHTML = marker.innerHTML;
    const [, , vbW, vbH] = marker
      .getAttribute('viewBox')
      .split(/[\s,]+/)
      .map(Number);
    const stroke = Number(path.el.getAttribute('stroke-width') ?? 1);
    path.headScale =
      stroke *
      Math.min(
        Number(marker.getAttribute('markerWidth')) / vbW,
        Number(marker.getAttribute('markerHeight')) / vbH
      );
    path.headRef = [Number(marker.getAttribute('refX')), Number(marker.getAttribute('refY'))];
    if (!path.litHead) {
      path.litHead = document.createElementNS(NS, 'g');
      path.litGroup.append(path.litHead);
    }
    path.litHead.innerHTML = marker.innerHTML.replace(
      /(fill|stroke)="#[0-9a-fA-F]{3,8}"/g,
      `$1="${path.litColor}"`
    );
    const a = path.el.getPointAtLength(path.length - 1.5);
    const b = path.el.getPointAtLength(path.length);
    const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    path.litHead.setAttribute(
      'transform',
      `translate(${b.x} ${b.y}) rotate(${angle}) scale(${path.headScale}) translate(${-path.headRef[0]} ${-path.headRef[1]})`
    );
  }
  function placeHead(path, drawn) {
    const l = path.length * drawn;
    const a = path.el.getPointAtLength(Math.max(0, l - 1.5));
    const b = path.el.getPointAtLength(Math.min(path.length, Math.max(l, 1.5)));
    const tip = path.el.getPointAtLength(l);
    const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    set(path.head, 'opacity', '1');
    path.head.setAttribute(
      'transform',
      `translate(${tip.x} ${tip.y}) rotate(${angle}) scale(${path.headScale}) translate(${-path.headRef[0]} ${-path.headRef[1]})`
    );
  }
  Object.values(paths).forEach(buildHead);

  const lengthNear = (path, [x, y]: number[]) => {
    let best = 0;
    let bestDistance = Infinity;
    for (let l = 0; l <= path.length; l += 2) {
      const p = path.el.getPointAtLength(l);
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < bestDistance) {
        bestDistance = d;
        best = l;
      }
    }
    return best;
  };
  const switchOnBurn = lengthNear(paths.burn, MARKET_SWITCH);

  const q = (hook) => root.querySelector(`[data-fw="${hook}"]`);
  const cards = Object.fromEntries(
    ['users', 'daa', 'txns', 'a2a', 'burned', 'pol', 'pol-fees'].map((h) => [h, q(h)])
  );
  const labels = Object.fromEntries(
    [...root.querySelectorAll<HTMLElement>('[data-fw-label]')].map((el) => [el.dataset.fwLabel, el])
  );
  const switches = {
    market: [q('switch-market'), q('switch-market-label')],
    pol: [q('switch-pol'), q('switch-pol-label')],
  };

  // --- Timelines, in seconds -------------------------------------------------------------

  // Entrance: the main loop in one stroke from Users, then the PoL branch, then the arcs.
  const entrance: Record<string, { at: number; dur: number }> = {};
  let at = 0.15;
  for (const hook of LOOP) {
    entrance[hook] = { at, dur: drawTime(paths[hook].length) };
    at += entrance[hook].dur + DRAW_GAP;
  }
  at += JUMP;
  for (const hook of POL) {
    entrance[hook] = { at, dur: drawTime(paths[hook].length) };
    at += entrance[hook].dur + DRAW_GAP;
  }
  at += JUMP;
  ECONOMIES.forEach((hook) => {
    entrance[hook] = { at, dur: 1.2 };
  });
  const INTRO = at + 1.2 + 0.6;

  // Lap: the pulse goes round the loop, dwelling at each card; then down the PoL branch to
  // the OFF switch; then out to the economies.
  const lap: Record<string, { at: number; dur: number }> = {};
  at = 0.3;
  for (const hook of LOOP) {
    lap[hook] = { at, dur: paths[hook].length / LAP_SPEED };
    at += lap[hook].dur + DWELL;
  }
  at += JUMP;
  lap.pol = { at, dur: Math.max(LAP_MIN, paths.pol.length / LAP_SPEED) };
  at += lap.pol.dur + DWELL;
  lap['pol-fees'] = { at, dur: Math.max(LAP_MIN, paths['pol-fees'].length / LAP_SPEED) };
  at += lap['pol-fees'].dur + 0.6 + JUMP; // stops at the switch
  const economiesAt = at;
  const LAP = economiesAt + 1.0 + 1.8;

  // --- Rendering ---------------------------------------------------------------------------

  const LABEL = [96, 111, 133]; // #606F85, the site's label grey
  const ACCENT = [126, 34, 206]; // #7E22CE
  const tint = (v) =>
    v > 0.001 ? `rgb(${LABEL.map((c, i) => Math.round(c + (ACCENT[i] - c) * v)).join(',')})` : '';
  const labelTargets = () => [...Object.values(labels), switches.pol[1]];

  function hideLit(path) {
    set(path.litGroup, 'opacity', '0');
  }

  // One lap step on a connector: between `at` and `at + dur` it fills with colour from start
  // to end, arrowhead last; it holds until `holdUntil`, then fades while the next step begins.
  function lightStep(path, u, at, dur, holdUntil) {
    const v = easeInOut(prog(u, at, dur));
    set(path.litReveal, 'strokeDashoffset', String(path.length * (1 - v)));
    set(path.litGroup, 'opacity', String(u > at ? 1 - prog(u, holdUntil, 0.6) : 0));
  }

  // A card's highlight comes on as the fill enters the arrowhead (the eased fill covers its
  // last stretch slowly, so waiting for the formal end reads as a pause), holds while the
  // arrow stays lit and fades together with it.
  const reachTime = (path, at, dur) => {
    const head = Math.max(path.head ? path.headScale * path.headRef[0] : 0, 8);
    return at + invert(easeInOut, Math.max(0, 1 - head / path.length)) * dur;
  };
  const arrival = (u, reach, holdUntil) =>
    easeOut(prog(u, reach - 0.05, 0.2)) * (1 - prog(u, holdUntil, 0.6));

  function renderIntro(t) {
    for (const [hook, path] of Object.entries(paths)) {
      const e = entrance[hook];
      const drawn = easeDraw(prog(t, e.at, e.dur));
      if (drawn >= 1) {
        // Complete: no mask (it would clip the arrowhead's wings), the marker takes over.
        path.el.removeAttribute('mask');
        if (path.marker) set(path.el, 'markerEnd', path.marker);
        if (path.head) set(path.head, 'opacity', '0');
      } else {
        path.el.setAttribute('mask', `url(#${path.mask.id})`);
        set(path.reveal, 'strokeDashoffset', String(path.length * (1 - drawn)));
        if (path.marker) set(path.el, 'markerEnd', 'none');
        if (path.head) drawn > 0 ? placeHead(path, drawn) : set(path.head, 'opacity', '0');
      }
      hideLit(path);
    }
    for (const hook of LOOP) {
      const e = entrance[hook];
      if (labels[hook])
        set(labels[hook], 'opacity', String(easeOut(prog(t, e.at + 0.15 * e.dur, 0.35))));
    }
    // Cards stay as they are during the entrance: only the connectors move.
    Object.values(cards).forEach((card) => glow(card, 0));
    labelTargets().forEach((el) => set(el, 'color', ''));
    const reachesSwitch = drawnAt(switchOnBurn / paths.burn.length);
    const marketIn = prog(t, entrance.burn.at + reachesSwitch * entrance.burn.dur - 0.05, 0.35);
    const polIn = prog(t, entrance['pol-fees'].at + entrance['pol-fees'].dur - 0.05, 0.35);
    for (const [el, v] of (
      [
        [switches.market, marketIn],
        [switches.pol, polIn],
      ] as Array<[Element[], number]>
    ).flatMap<[Element, number]>(([els, v]) => els.map((el): [Element, number] => [el, v]))) {
      set(el, 'opacity', String(clamp01(v * 2)));
    }
  }

  function settle() {
    for (const path of Object.values(paths)) {
      path.el.removeAttribute('mask');
      if (path.marker) set(path.el, 'markerEnd', path.marker);
      if (path.head) set(path.head, 'opacity', '0');
    }
    Object.values(labels).forEach((el) => set(el, 'opacity', '1'));
    [...switches.market, ...switches.pol].forEach((el) => set(el, 'opacity', '1'));
  }

  // Inverse of an easing, for "when does the fill reach this point".
  const invert = (ease, y) => {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (ease(mid) < y) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  };
  const passing = lap.burn.at + invert(easeInOut, switchOnBurn / paths.burn.length) * lap.burn.dur;

  function renderLap(t) {
    const u = t % LAP;
    for (const hook of LOOP) {
      const e = lap[hook];
      const hold = e.at + e.dur + DWELL;
      lightStep(paths[hook], u, e.at, e.dur, hold);
      const arrive = arrival(u, reachTime(paths[hook], e.at, e.dur), hold);
      const card = ARRIVES[hook];
      glow(cards[card], arrive);
      // The arrow's label reads along with it, until attention leaves the card.
      if (labels[hook])
        set(
          labels[hook],
          'color',
          tint(prog(u, e.at - 0.1, 0.25) * (1 - prog(u, e.at + e.dur + DWELL - 0.2, 0.3)))
        );
    }
    // The ON switch nods as the highlight passes it.
    const nod = bump(prog(u, passing - 0.1, 0.35));
    set(switches.market[0], 'transform', `translate(-50%, -34px) scale(${1 + 0.18 * nod})`);
    // PoL: the panel, then its fees card, then along to the OFF switch, where it stops.
    const polHold = lap.pol.at + lap.pol.dur + DWELL;
    glow(cards.pol, easeOut(prog(u, lap.pol.at - JUMP, 0.2)) * (1 - prog(u, polHold, 0.6)));
    lightStep(paths.pol, u, lap.pol.at, lap.pol.dur, polHold);
    const feesPing = arrival(u, reachTime(paths.pol, lap.pol.at, lap.pol.dur), polHold);
    glow(cards['pol-fees'], feesPing);
    const fees = lap['pol-fees'];
    const blockedAt = fees.at + fees.dur;
    lightStep(paths['pol-fees'], u, fees.at, fees.dur, blockedAt + 0.6);
    hideLit(paths['pol-off']);
    set(
      switches.pol[1],
      'color',
      tint(prog(u, blockedAt - 0.2, 0.2) * (1 - prog(u, blockedAt + 0.6, 0.3)))
    );
    const shake = prog(u, blockedAt - 0.1, 0.4);
    set(
      switches.pol[0],
      'transform',
      `translate(calc(-50% + ${3 * Math.sin(shake * Math.PI * 4) * bump(shake)}px), -34px)`
    );
    // Out to the economies, all four at once.
    for (const hook of ECONOMIES) {
      lightStep(paths[hook], u, economiesAt, 1.0, economiesAt + 1.9);
    }
  }

  let sceneTime = 0;
  let speed = 1;
  let paused = false;
  let visible = false;
  let armed = false;
  let settled = false;
  let disposed = false;
  let frozenForPageCache = false;
  let frame = 0;
  let lastUpdate = 0;

  function render(time) {
    if (time < INTRO) {
      renderIntro(time);
      settled = false;
      return;
    }
    if (!settled) {
      settle();
      settled = true;
    }
    renderLap(time - INTRO);
  }

  function restoreStill() {
    originals.forEach((style, el) =>
      style === null ? el.removeAttribute('style') : el.setAttribute('style', style)
    );
    Object.values(paths).forEach((path) => path.el.removeAttribute('mask'));
    overlay.style.display = 'none';
    settled = false;
  }

  function canAnimate() {
    return (
      !disposed &&
      !paused &&
      !reduced.matches &&
      !document.hidden &&
      !frozenForPageCache &&
      root.isConnected &&
      visible &&
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
      restoreStill();
      root.dataset.running = 'false';
      return;
    }
    overlay.style.display = '';
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
  // Starts once a fifth of the diagram is on screen; cards are already there, so early is fine.
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      visible = entry.isIntersecting;
      if (entry.intersectionRatio >= 0.2) armed = true;
      sync();
    },
    { threshold: [0, 0.2] }
  );
  function dispose() {
    if (disposed) return;
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    visibilityObserver.disconnect();
    reduced.removeEventListener('change', sync);
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
    // Undo DOM changes so a later init on the same markup (React StrictMode) starts clean.
    restoreStill();
    overlay.remove();
    Object.values(paths).forEach((path) => {
      path.mask.remove();
      path.litReveal.parentNode.remove();
    });
  }
  visibilityObserver.observe(root);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  sync();

  return { dispose };
}
