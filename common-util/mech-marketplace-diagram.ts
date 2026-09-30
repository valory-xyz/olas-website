/*
 * Mech Marketplace diagram motion (homepage design handoff 2026-09-28). Ported as-is from the
 * handoff scene; only the root lookup, types and DOM teardown in `dispose` differ. Rendered by
 * `components/HomepageSection/MechMarketplaceDiagram.tsx`.
 */

type SvgEl = SVGGeometryElement;

// Mech Marketplace illustration: one deal per pass. A buyer asks for a puzzle piece, the
// request reaches the marketplace hexagon, one slow wave spreads from its centre until it
// finds a matching tile, the request goes on to the seller, the seller works, and a pulse
// runs back through the match to the buyer, whose ? turns into a tick. Before the first deal
// the illustration builds in once, from the hexagon outwards. One clock drives every element,
// so any moment can be rendered on demand; it pauses off-screen, in hidden tabs and in the
// page cache. Reduced motion keeps the static Figma frame that the markup already shows.
export function initMechMarketplaceDiagram(root: HTMLElement): { dispose: () => void } {
  const NS = 'http://www.w3.org/2000/svg';
  const reduced = matchMedia('(prefers-reduced-motion: reduce), (update: slow)');

  const PAIRS = [
    ['b-tr', 's-tl'],
    ['b-bl', 's-br'],
    ['b-tl', 's-tr'],
    ['b-br', 's-bl'],
  ];
  const GREY = [155, 173, 195];
  const PURPLE = [126, 34, 206];
  const RED = [255, 55, 88];

  // Seconds within one pass.
  const T = {
    ask: 0.0, // buyer hops, bubble pops, piece turns purple, ? turns red
    request: 0.35, // buyer's connector draws to the hexagon
    requestDur: 0.85,
    search: 1.15, // one wave leaves the hexagon centre; it lights the match on the way
    searchDur: 1.5,
    forward: 2.3, // connector draws from the hexagon to the seller
    forwardDur: 0.7,
    work: 3.0, // seller hops, its piece lights up, progress bar fills
    workDur: 1.1,
    back: 4.1, // pulse runs seller → match; the match flashes as it arrives
    backDur: 0.55,
    home: 4.7, // pulse runs on to the buyer; as it arrives the piece pops, ? becomes ✓
    homeDur: 0.7,
    reset: 7.7, // everything fades back to grey
    resetDur: 0.6,
    end: 8.6,
  };
  const RING_WIDTH = 0.16; // wave thickness, share of the hexagon radius
  const RING_GLOW = 0.5; // how far the wave lifts a tile towards full opacity
  const DIM = 0.6; // other tiles keep this share of their opacity while matched
  const PULSE = [
    { length: 46, width: 12, color: '#E9D5FF', opacity: 0.9 },
    { length: 26, width: 4.5, color: '#C026D3', opacity: 1 },
  ];

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const prog = (t, at, dur) => clamp01((t - at) / dur);
  const easeInOut = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
  const easeOut = (v) => 1 - Math.pow(1 - v, 3);
  const easeOutBack = (v) => 1 + 2.2 * Math.pow(v - 1, 3) + 1.2 * Math.pow(v - 1, 2);
  const bump = (v) => Math.sin(Math.PI * clamp01(v));
  const mix = (a, b, v) => `rgb(${a.map((c, i) => Math.round(c + (b[i] - c) * v)).join(',')})`;
  const around = ([x, y]: number[], s: number) =>
    `translate(${x}px, ${y}px) scale(${s}) translate(${-x}px, ${-y}px)`;
  const centerOf = (el) => {
    const b = el.getBBox();
    return [b.x + b.width / 2, b.y + b.height / 2];
  };

  const touched = new Set<SVGElement>();
  const set = (el: SVGElement, prop: string, value: string) => {
    touched.add(el);
    el.style[prop] = value;
  };
  const clearStyles = () => touched.forEach((el) => el.removeAttribute('style'));

  // --- Agents, connectors and the pulses that run along them -------------------------------

  const pulseLayer = document.createElementNS(NS, 'g');
  pulseLayer.setAttribute('class', 'mm-pulses');
  root.querySelector<SvgEl>('.mm-lines-active').after(pulseLayer);

  const slots = {};
  root.querySelectorAll<SvgEl>('.mm-agent').forEach((g) => {
    const slot = g.dataset.slot;
    const piece = g.querySelector<SvgEl>('.mm-piece');
    const bubble = g.querySelector<SvgEl>('.mm-bubble');
    const line = root.querySelector<SvgEl>(`.mm-line-active[data-slot="${slot}"]`);
    const progress = g.querySelector<SvgEl>('.mm-progress');
    const bubbleBox = bubble && bubble.getBBox();
    const lineLength = line.getTotalLength();
    const pulses = PULSE.map((p) => {
      const el = line.cloneNode(false) as SvgEl;
      el.removeAttribute('opacity');
      el.setAttribute('class', 'mm-pulse');
      el.setAttribute('stroke', p.color);
      el.setAttribute('stroke-width', String(p.width));
      el.setAttribute('stroke-linecap', 'round');
      el.setAttribute('stroke-dasharray', `${p.length} ${lineLength + p.length}`);
      el.setAttribute('opacity', '0');
      pulseLayer.append(el);
      return { el, ...p };
    });
    slots[slot] = {
      robot: g.querySelector<SvgEl>('.mm-robot'),
      bubble,
      bubblePivot: bubbleBox && [bubbleBox.x + 8, bubbleBox.y + bubbleBox.height],
      piece,
      pieceShape: piece.querySelector<SvgEl>('.mm-piece-shape'),
      pieceCenter: [Number(piece.dataset.cx), Number(piece.dataset.cy)],
      question: g.querySelector<SvgEl>('.mm-question'),
      questionShape: g.querySelector<SvgEl>('.mm-question path'),
      questionCenter: bubble && centerOf(g.querySelector<SvgEl>('.mm-question')),
      check: g.querySelector<SvgEl>('.mm-check'),
      checkCenter: bubble && centerOf(g.querySelector<SvgEl>('.mm-check')),
      progress,
      progressLeft: progress && Number(progress.getAttribute('x')),
      line,
      lineLength,
      pulses,
    };
    line.style.strokeDasharray = `${lineLength} ${lineLength}`;
    touched.add(line);
  });

  // --- Hexagon: mosaic tiles, hexagonal wave distance, the matched tile per pair -----------

  const hex = root.querySelector<SvgEl>('.mm-hex');
  const hexBox = root.querySelector<SvgEl>('.mm-hex-shape').getBBox();
  const hexCenter = [hexBox.x + hexBox.width / 2, hexBox.y + hexBox.height / 2];
  const tiles = [...root.querySelectorAll<SvgEl>('.mm-tile')].map((el) => {
    const [x, y] = centerOf(el);
    const dx = x - hexCenter[0];
    const dy = y - hexCenter[1];
    // Distance to the centre measured in hexagon rings (pointy-top), so the wave keeps the
    // marketplace's shape.
    return {
      el,
      base: Number(el.getAttribute('opacity')),
      dx,
      dy,
      center: [x, y],
      ring: Math.max(Math.abs(dx), 0.5 * Math.abs(dx) + 0.866 * Math.abs(dy)),
    };
  });
  const farthest = Math.max(...tiles.map((t) => t.ring));
  tiles.forEach((t) => {
    t.ring /= farthest;
  });
  // Each pair's match is the mosaic tile with the same shape and orientation as its piece,
  // marked data-match in the markup.
  const matches = PAIRS.map((_, i) => tiles.find((t) => t.el.dataset.match === String(i)));
  // The wave front reaches the matched tile at this moment.
  const foundAt = (tile) =>
    T.search + T.searchDur * ((tile.ring + RING_WIDTH) / (1 + 2 * RING_WIDTH));

  // --- Entrance: plays once, the first time 35% of the illustration is on screen. The
  // hexagon and its logo fade in, the mosaic grows from the centre in hexagon rings, the
  // connectors grow out to the agents, each agent pops in as its connector arrives, and the
  // labels come last.

  const LINE_SPEED = 420; // user units per second while the connectors grow out of the hexagon
  const baseLines = [...root.querySelectorAll<SvgEl>('.mm-line')].map((el) => {
    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length} ${length}`;
    touched.add(el);
    return { el, slot: el.dataset.slot, length };
  });
  const entering = [...root.querySelectorAll<SvgEl>('.mm-agent')].map((el) => ({
    el,
    pivot: centerOf(el.querySelector<SvgEl>('.mm-robot')),
    arrive: baseLines.find((l) => l.slot === el.dataset.slot).length / LINE_SPEED,
  }));
  const lastArrival = Math.max(...entering.map((a) => a.arrive));
  const labels = [...root.querySelectorAll<SvgEl>('.mm-label')];
  const hexShape = root.querySelector<SvgEl>('.mm-hex-shape');
  const logo = root.querySelector<SvgEl>('.mm-logo');
  const logoCenter = centerOf(logo);
  const LINES_AT = 0.7; // connectors start growing
  const introLength = () => LINES_AT + lastArrival + 0.45 + 0.35 + 0.4;

  function renderIntro(t) {
    set(hexShape, 'opacity', String(easeOut(prog(t, 0, 0.45))));
    set(hexShape, 'transform', around(hexCenter, 0.92 + 0.08 * easeOut(prog(t, 0, 0.5))));
    tiles.forEach((tile) => {
      const v = prog(t, 0.15 + 0.55 * tile.ring, 0.3);
      set(tile.el, 'opacity', String(tile.base * easeOut(v)));
      set(tile.el, 'transform', around(tile.center, 0.5 + 0.5 * (v > 0 ? easeOutBack(v) : 0)));
    });
    const logoIn = prog(t, 0.1, 0.4);
    set(logo, 'opacity', String(clamp01(logoIn * 2.5)));
    set(logo, 'transform', around(logoCenter, 0.5 + 0.5 * (logoIn > 0 ? easeOutBack(logoIn) : 0)));
    for (const line of baseLines) {
      const grown = clamp01(((t - LINES_AT) * LINE_SPEED) / line.length);
      set(line.el, 'strokeDashoffset', String(-line.length * (1 - grown)));
    }
    for (const agent of entering) {
      const v = prog(t, LINES_AT + agent.arrive - 0.05, 0.45);
      set(agent.el, 'opacity', String(clamp01(v * 2.5)));
      set(agent.el, 'transform', around(agent.pivot, 0.6 + 0.4 * (v > 0 ? easeOutBack(v) : 0)));
    }
    const labelsIn = easeOut(prog(t, LINES_AT + lastArrival + 0.1, 0.4));
    labels.forEach((label) => {
      set(label, 'opacity', String(labelsIn));
      set(label, 'transform', `translateY(${6 * (1 - labelsIn)}px)`);
    });
  }

  let activePairs = [0, 1, 2, 3]; // the four deals in turn, one pass each
  let armed = false; // becomes true once 35% of the illustration has been on screen
  let settled = false; // the entrance's final state has been applied
  let sceneTime = 0;
  let speed = 1;
  let paused = false;
  let visible = false;
  let disposed = false;
  let frozenForPageCache = false;
  let frame = 0;
  let lastUpdate = 0;

  function renderBuyer(el, u, keep, active) {
    if (!active) {
      set(el.line, 'opacity', '0');
      el.pulses.forEach((p) => set(p.el, 'opacity', '0'));
      set(el.robot, 'transform', 'none');
      set(el.bubble, 'transform', 'none');
      set(el.piece, 'transform', 'none');
      set(el.pieceShape, 'fill', mix(GREY, GREY, 0));
      set(el.question, 'opacity', '1');
      set(el.question, 'transform', 'none');
      set(el.questionShape, 'fill', mix(GREY, GREY, 0));
      set(el.check, 'opacity', '0');
      return;
    }
    const drawn = easeInOut(prog(u, T.request, T.requestDur));
    set(el.line, 'opacity', String(drawn > 0 ? keep : 0));
    set(el.line, 'strokeDashoffset', String(el.lineLength * (1 - drawn)));

    const land = T.home + T.homeDur;
    const landed = prog(u, land, 0.3);
    const hop = bump(prog(u, T.ask, 0.4)) + bump(prog(u, land + 0.1, 0.4));
    set(el.robot, 'transform', `translateY(${-4 * hop}px)`);
    set(el.bubble, 'transform', around(el.bubblePivot, 1 + 0.08 * bump(prog(u, T.ask, 0.45))));
    set(el.piece, 'transform', around(el.pieceCenter, 1 + 0.3 * bump(prog(u, land, 0.4))));
    set(el.pieceShape, 'fill', mix(GREY, PURPLE, easeOut(prog(u, T.ask + 0.05, 0.3)) * keep));

    const done = easeOut(landed) * keep;
    set(el.questionShape, 'fill', mix(GREY, RED, easeOut(prog(u, T.ask, 0.3)) * keep));
    set(el.question, 'opacity', String(1 - done));
    set(el.question, 'transform', around(el.questionCenter, 1 - 0.4 * done));
    set(el.check, 'opacity', String(done));
    set(
      el.check,
      'transform',
      around(el.checkCenter, 0.6 + 0.4 * (landed > 0 ? easeOutBack(landed) : 0))
    );
  }

  function renderSeller(el, u, keep, active) {
    if (!active) {
      set(el.line, 'opacity', '0');
      el.pulses.forEach((p) => set(p.el, 'opacity', '0'));
      set(el.robot, 'transform', 'none');
      set(el.piece, 'transform', 'none');
      set(el.pieceShape, 'fill', mix(GREY, GREY, 0));
      set(el.progress, 'opacity', '0');
      return;
    }
    const drawn = easeInOut(prog(u, T.forward, T.forwardDur));
    set(el.line, 'opacity', String(drawn > 0 ? keep : 0));
    set(el.line, 'strokeDashoffset', String(-el.lineLength * (1 - drawn)));

    set(el.robot, 'transform', `translateY(${-4 * bump(prog(u, T.work, 0.4))}px)`);
    set(el.pieceShape, 'fill', mix(GREY, PURPLE, easeOut(prog(u, T.work + 0.1, 0.3)) * keep));
    const filled = easeInOut(prog(u, T.work + 0.2, T.workDur - 0.2));
    set(el.progress, 'opacity', String(filled > 0 ? keep : 0));
    set(
      el.progress,
      'transform',
      `translateX(${el.progressLeft}px) scaleX(${filled}) translateX(${-el.progressLeft}px)`
    );
  }

  function renderHex(u, keep, pairIndex) {
    set(hex, 'transform', around(hexCenter, 1 + 0.012 * bump(prog(u, T.search - 0.05, 0.6))));
    const v = (u - T.search) / T.searchDur;
    const radius = v > 0 && v < 1 ? -RING_WIDTH + v * (1 + 2 * RING_WIDTH) : null;
    const match = matches[pairIndex];
    const found = foundAt(match);
    const lit = prog(u, found, 0.35) * keep;
    const arrival = T.back + T.backDur;
    for (const tile of tiles) {
      const glow = radius === null ? 0 : Math.exp(-(((tile.ring - radius) / RING_WIDTH) ** 2));
      const opacity = tile.base + (1 - tile.base) * RING_GLOW * glow;
      if (tile === match) {
        set(tile.el, 'opacity', String(opacity + (1 - opacity) * lit));
        set(tile.el, 'stroke', lit > 0 ? `rgba(255, 255, 255, ${lit})` : 'none');
        set(tile.el, 'strokeWidth', '1.4');
        set(
          tile.el,
          'transform',
          around(
            tile.center,
            1 + 0.18 * bump(prog(u, found, 0.45)) + 0.14 * bump(prog(u, arrival - 0.05, 0.35))
          )
        );
      } else {
        set(tile.el, 'opacity', String(opacity * (1 - (1 - DIM) * easeOut(lit))));
        set(tile.el, 'transform', 'none');
        set(tile.el, 'stroke', 'none');
      }
    }
  }

  function renderPulse(el, u, at, dur, reverse) {
    const v = prog(u, at, dur);
    const moving = u > at && v < 1;
    for (const p of el.pulses) {
      const head = easeInOut(v) * (el.lineLength + p.length);
      set(p.el, 'opacity', String(moving ? p.opacity : 0));
      set(p.el, 'strokeDashoffset', String(reverse ? head - el.lineLength : p.length - head));
    }
  }

  function renderReturn(u, pairIndex) {
    const [buyer, seller] = PAIRS[pairIndex];
    renderPulse(slots[seller], u, T.back, T.backDur, false);
    renderPulse(slots[buyer], u, T.home, T.homeDur, true);
  }

  function render(time) {
    const intro = introLength();
    if (time < intro) {
      renderLoop(0);
      renderIntro(time);
      settled = false;
      return;
    }
    if (!settled) {
      renderIntro(intro);
      settled = true;
    }
    renderLoop(time - intro);
  }

  function renderLoop(time) {
    const pass = Math.floor(time / T.end);
    const u = time - pass * T.end;
    const pairIndex =
      activePairs[((pass % activePairs.length) + activePairs.length) % activePairs.length];
    const [buyer, seller] = PAIRS[pairIndex];
    const keep = 1 - easeInOut(prog(u, T.reset, T.resetDur));
    for (const [slot, el] of Object.entries(slots)) {
      if (slot.startsWith('b-')) renderBuyer(el, u, keep, slot === buyer);
      else renderSeller(el, u, keep, slot === seller);
    }
    renderHex(u, keep, pairIndex);
    renderReturn(u, pairIndex);
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
      clearStyles();
      root.dataset.running = 'false';
      return;
    }
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
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      visible = entry.isIntersecting;
      if (entry.intersectionRatio >= 0.35) armed = true;
      sync();
    },
    { threshold: [0, 0.35] }
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
    pulseLayer.remove();
    clearStyles();
  }
  visibilityObserver.observe(root);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  sync();

  return { dispose };
}
