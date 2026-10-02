/**
 * Connect economy hero: nine Connect agents on three chain islands (Gnosis, Polygon, Robinhood
 * Chain) under the Olas Marketplace. The islands and the Marketplace float; agents send requests to
 * the Marketplace as a stream of particles in the agent's own colour, and a violet stream brings the
 * answer back. Agents never talk to each other.
 *
 * Ported from the design handoff (`connect-economy-hero-handoff-2026-09-30/scene.html`); timings,
 * amplitudes, colours and positions are kept verbatim so the handoff's `preview.html` stays the
 * visual reference. Only the root lookup and asset path changed.
 *
 * `initConnectEconomyHero(root, { assetBase })` builds the whole scene inside `root` (with IDs
 * prefixed per instance, so it can render more than once) and returns `{ dispose }`. It pauses off
 * screen, in hidden tabs and in the back-forward cache, and shows a still frame with reduced motion
 * or on slow-update displays.
 */

type Node = { p: [number, number]; r: number; layer: string };
type Agent = Node & { color: string };
type Layer = {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  amp: number;
  period: number;
  phase: number;
};
type Group = { layer: Layer; animation: Animation | null; fx: SVGGElement; dy: number };
type Curve = { sx: number; sy: number; mx: number; my: number; ex: number; ey: number; d: string };

export type ConnectEconomyHeroOptions = {
  /** Base URL of the five WebP images, with a trailing slash. */
  assetBase: string;
};

// ---------- Geometry ----------
// The frame is Figma's "Hero Image" (Olas Website, node 18782:372912), 464 x 432, drawn at 3x.
// Three hexagons 346.41 x 390.1 offset by 32 x 16: outline top-left, the image, outline bottom-right.
const VIEW_W = 1392;
const VIEW_H = 1296;
const HEX =
  'M157.393 4.61208C167.177 -1.03718 179.233 -1.03718 189.018 4.61208L330.223 86.1365C340.007 91.7858 346.035 102.227 346.035 113.525V276.574C346.035 287.873 340.007 298.313 330.223 303.963L189.018 385.487C179.233 391.136 167.177 391.136 157.393 385.487L16.1875 303.963C6.40269 298.313 0.375 287.873 0.375 276.574V113.525C0.375 102.227 6.40269 91.7858 16.1875 86.1365L157.393 4.61208Z';
const HEX_IMAGE = 'translate(176.4,62.88) scale(3)';
const HEX_OUTLINE_TL = 'translate(80.4,14.88) scale(3)';
const HEX_OUTLINE_BR = 'translate(272.4,110.88) scale(3)';

// The art is a 1254 px square, placed at 1.02895 view units per source pixel with its origin at (50.35, 25.81).
const ART = { x: 50.35, y: 25.81, scale: 1.02895, size: 1254 };
const PCT = (ART.size * ART.scale) / 100; // view units per percent of the art

// Cut-out layers (source pixels) and how each one floats: amplitude in view units, period in seconds.
const LAYERS: Layer[] = [
  { name: 'marketplace', x: 381, y: 89, w: 479, h: 377, amp: 9, period: 8.0, phase: 0.0 },
  { name: 'island-gnosis', x: 139, y: 491, w: 341, h: 325, amp: 12, period: 6.2, phase: 1.3 },
  { name: 'island-robinhood', x: 763, y: 506, w: 359, h: 311, amp: 12, period: 5.6, phase: 3.1 },
  { name: 'island-polygon', x: 422, y: 674, w: 424, h: 369, amp: 11, period: 7.0, phase: 4.7 },
];

// Centres and radii in percent of the art. Agents carry their sphere's colour.
const MARKETPLACE: Node = { p: [50, 22.5], r: 9, layer: 'marketplace' };
const AGENTS: Agent[] = [
  { p: [18.5, 46], r: 3, layer: 'island-gnosis', color: '#ff6fb0' },
  { p: [27.5, 43.5], r: 3.2, layer: 'island-gnosis', color: '#34e0c0' },
  { p: [24.5, 51], r: 3.3, layer: 'island-gnosis', color: '#4f8dff' },
  { p: [44, 60], r: 3, layer: 'island-polygon', color: '#ff7ad0' },
  { p: [55, 58.5], r: 3, layer: 'island-polygon', color: '#5ccfff' },
  { p: [50.5, 66], r: 5, layer: 'island-polygon', color: '#8a5cff' },
  { p: [71, 46], r: 3, layer: 'island-robinhood', color: '#ffa27a' },
  { p: [80.5, 44], r: 3.2, layer: 'island-robinhood', color: '#7a6cff' },
  { p: [76.5, 51.5], r: 3.4, layer: 'island-robinhood', color: '#2fd6c4' },
];
const ANSWER = '#c592ff';

// ---------- Motion ----------
const LANES = 4; // requests in flight at most
const LANE_STARTS = [300, 1200, 2100, 3000];
const PARTICLES = 7;
const PARTICLE_GAP = 0.07;
const TRAVEL_MS = 1150;
const ANSWER_DELAY_MS = 450;
const REST_MS = [250, 950];
const MAX_FRAME_MS = 64; // a long gap (tab switch, jank) advances the clock by at most this
const SAMPLES = 24;

const NS = 'http://www.w3.org/2000/svg';

export function initConnectEconomyHero(
  root: HTMLElement,
  { assetBase }: ConnectEconomyHeroOptions
): { dispose: () => void } {
  const still =
    matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(update: slow)').matches;

  // ---------- Build the SVG ----------
  const uid = 'ch' + Math.random().toString(36).slice(2, 8);
  const id = (name: string) => `${uid}-${name}`;
  const el = <K extends keyof SVGElementTagNameMap>(
    tag: K,
    attrs: Record<string, string | number>,
    parent?: Element
  ): SVGElementTagNameMap[K] => {
    const node = document.createElementNS(NS, tag);
    for (const key in attrs) node.setAttribute(key, String(attrs[key]));
    if (parent) parent.appendChild(node);
    return node;
  };

  const svg = el('svg', { viewBox: `0 0 ${VIEW_W} ${VIEW_H}` }, root);
  const defs = el('defs', {}, svg);
  el('path', { id: id('hex'), d: HEX }, defs);
  el(
    'use',
    { href: `#${id('hex')}`, transform: HEX_IMAGE },
    el('clipPath', { id: id('clip') }, defs)
  );
  const gradient = (
    gid: string,
    attrs: Record<string, number>,
    stops: Record<string, string | number>[]
  ) => {
    const g = el(
      'linearGradient',
      { id: id(gid), gradientUnits: 'userSpaceOnUse', ...attrs },
      defs
    );
    stops.forEach((s) => el('stop', s, g));
  };
  gradient('outline-tl', { x1: 36.2, y1: 33.55, x2: 146.79, y2: 256.08 }, [
    { offset: '.439', 'stop-color': '#B369FC' },
    { offset: '1', 'stop-color': '#B269FC', 'stop-opacity': 0 },
  ]);
  gradient('outline-br', { x1: 404.705, y1: 316.05, x2: 198.627, y2: 188.681 }, [
    { offset: '0', 'stop-color': '#FCB9FE' },
    { offset: '1', 'stop-color': '#F5D0FE', 'stop-opacity': 0 },
  ]);
  const blur = (fid: string, sd: number) =>
    el(
      'feGaussianBlur',
      { stdDeviation: sd },
      el('filter', { id: id(fid), x: '-100%', y: '-100%', width: '300%', height: '300%' }, defs)
    );
  blur('blur-s', 3);
  blur('blur-m', 7);
  // Particles and flashes use radial gradients rather than blur filters: dozens of blurred shapes per frame cost far more.
  const radial = (gid: string, color: string, mid: [number, number]) => {
    const g = el('radialGradient', { id: id(gid) }, defs);
    el('stop', { offset: '0', 'stop-color': color, 'stop-opacity': mid[0] }, g);
    el('stop', { offset: '.5', 'stop-color': color, 'stop-opacity': mid[1] }, g);
    el('stop', { offset: '1', 'stop-color': color, 'stop-opacity': 0 }, g);
  };
  radial('core', '#ffffff', [1, 0.7]);
  radial('flash', '#ffffff', [0.9, 0.35]);
  const halo: Record<string, string> = {};
  [...new Set([...AGENTS.map((a) => a.color), ANSWER])].forEach((color, i) => {
    radial('halo-' + i, color, [0.75, 0.35]);
    halo[color] = `url(#${id('halo-' + i)})`;
  });

  el(
    'use',
    {
      href: `#${id('hex')}`,
      transform: HEX_OUTLINE_TL,
      fill: 'none',
      stroke: `url(#${id('outline-tl')})`,
      'stroke-opacity': 0.4,
      'stroke-width': 0.75,
    },
    svg
  );
  el(
    'use',
    {
      href: `#${id('hex')}`,
      transform: HEX_OUTLINE_BR,
      fill: 'none',
      stroke: `url(#${id('outline-br')})`,
      'stroke-width': 0.75,
    },
    svg
  );

  // The art is plain HTML images under a hexagon mask, so the browser can move the floating layers on the
  // compositor without repainting. The SVG on top only draws the streams, flashes and the border.
  const art = document.createElement('div');
  art.className = 'ch-art';
  const maskSvg = `<svg xmlns="${NS}" viewBox="0 0 ${VIEW_W} ${VIEW_H}"><path transform="${HEX_IMAGE}" d="${HEX}"/></svg>`;
  const maskUrl = `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`;
  art.style.setProperty('-webkit-mask-image', maskUrl);
  art.style.maskImage = maskUrl;
  root.insertBefore(art, svg);
  const fx = el('svg', { viewBox: `0 0 ${VIEW_W} ${VIEW_H}`, 'aria-hidden': 'true' }, root);
  const clipped = el('g', { 'clip-path': `url(#${id('clip')})` }, fx);
  const routes = el('g', {}, clipped);
  const particles = el('g', {}, clipped);
  // A white edge inside the image, blended as overlay; the clip keeps only its inner half.
  const border = el('g', { class: 'ch-border', 'clip-path': `url(#${id('clip')})` }, fx);
  el(
    'use',
    {
      href: `#${id('hex')}`,
      transform: HEX_IMAGE,
      fill: 'none',
      stroke: '#ffffff',
      'stroke-opacity': 0.85,
      'stroke-width': 4,
    },
    border
  );
  svg.setAttribute('aria-hidden', 'true');
  art.setAttribute('role', 'img');
  art.setAttribute(
    'aria-label',
    'Connect agents on three blockchain islands under the Olas Marketplace'
  );

  const pct = (v: number, of: number) => `${((100 * v) / of).toFixed(4)}%`;
  const image = (name: string, x: number, y: number, w: number, h: number) => {
    const img = document.createElement('img');
    img.src = `${assetBase}${name}.webp`;
    img.alt = '';
    img.decoding = 'async';
    Object.assign(img.style, {
      left: pct(x, VIEW_W),
      top: pct(y, VIEW_H),
      width: pct(w, VIEW_W),
      height: pct(h, VIEW_H),
    });
    art.appendChild(img);
    return img;
  };
  image('sky', ART.x, ART.y, ART.size * ART.scale, ART.size * ART.scale);

  // Each layer floats on a sine: sampled keyframes, linear between samples, looping forever.
  // The streams read the same animation's current time, so they stay attached to the layers.
  const groups: Record<string, Group> = {};
  for (const L of LAYERS) {
    const h = L.h * ART.scale;
    const img = image(L.name, ART.x + L.x * ART.scale, ART.y + L.y * ART.scale, L.w * ART.scale, h);
    const frames = Array.from({ length: SAMPLES + 1 }, (_, i) => ({
      transform: `translateY(${((100 * L.amp * Math.sin((2 * Math.PI * i) / SAMPLES + L.phase)) / h).toFixed(3)}%)`,
    }));
    const animation = still
      ? null
      : img.animate(frames, { duration: L.period * 1000, iterations: Infinity, easing: 'linear' });
    if (animation) animation.pause();
    // Flashes for this layer live in an overlay group that follows the same offset.
    const fxGroup = el('g', {}, clipped);
    clipped.insertBefore(fxGroup, routes);
    groups[L.name] = { layer: L, animation, fx: fxGroup, dy: 0 };
  }
  const layerOffset = (G: Group) => {
    if (!G.animation) return 0;
    const t = (Number(G.animation.currentTime) || 0) / 1000;
    return G.layer.amp * Math.sin((2 * Math.PI * t) / G.layer.period + G.layer.phase);
  };

  // ---------- Clock ----------
  // One clock drives floating and streams; it only advances while the component is running.
  let disposed = false;
  let clock = 0;
  let last: number | null = null;
  let raf = 0;
  let onScreen = false;
  let pageVisible = !document.hidden;
  let inCache = false;
  const ticks = new Set<() => void>();

  // Show the scene once every image has decoded, so layers don't pop in one by one.
  Promise.all([...art.querySelectorAll('img')].map((img) => img.decode().catch(() => {}))).then(
    () => {
      if (!disposed) root.classList.add('is-ready');
    }
  );

  const running = () => !disposed && !still && onScreen && pageVisible && !inCache;
  const frame = (now: number) => {
    raf = 0;
    if (last !== null) clock += Math.min(now - last, MAX_FRAME_MS);
    last = now;
    for (const name in groups) {
      const G = groups[name];
      G.dy = layerOffset(G);
      G.fx.setAttribute('transform', `translate(0,${G.dy.toFixed(2)})`);
    }
    ticks.forEach((fn) => fn());
    schedule();
  };
  function schedule() {
    const on = running();
    for (const name in groups) {
      const A = groups[name].animation;
      if (A && on && A.playState !== 'running') A.play();
      if (A && !on && A.playState === 'running') A.pause();
    }
    if (on) {
      if (!raf) raf = requestAnimationFrame(frame);
    } else {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = null;
    }
  }
  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      const end = clock + ms;
      const fn = () => {
        if (clock >= end || disposed) {
          ticks.delete(fn);
          resolve();
        }
      };
      ticks.add(fn);
    });
  const during = (ms: number, step: (t: number) => void) =>
    new Promise<void>((resolve) => {
      const start = clock;
      const fn = () => {
        const t = disposed ? 1 : Math.min((clock - start) / ms, 1);
        step(t);
        if (t >= 1) {
          ticks.delete(fn);
          resolve();
        }
      };
      ticks.add(fn);
    });

  // ---------- Signals ----------
  const at = (node: Node, float = true): [number, number, number] => {
    const dy = float ? groups[node.layer].dy : 0;
    return [ART.x + node.p[0] * PCT, ART.y + node.p[1] * PCT + dy, node.r * PCT];
  };
  // A quadratic curve from edge to edge of the two circles, bent slightly to one side.
  const curve = (a: Node, b: Node): Curve => {
    const [ax, ay, ar] = at(a);
    const [bx, by, br] = at(b);
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const sx = ax + ux * ar * 0.95;
    const sy = ay + uy * ar * 0.95;
    const ex = bx - ux * br * 0.95;
    const ey = by - uy * br * 0.95;
    const bend = len * 0.12;
    const mx = (sx + ex) / 2 - uy * bend;
    const my = (sy + ey) / 2 + ux * bend;
    return {
      sx,
      sy,
      mx,
      my,
      ex,
      ey,
      d: `M${sx.toFixed(1)},${sy.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`,
    };
  };
  // Point on the curve at parameter k, computed directly: asking the browser for path lengths every frame is slow.
  const pointOn = (c: Curve, k: number) => {
    const j = 1 - k;
    return [
      j * j * c.sx + 2 * j * k * c.mx + k * k * c.ex,
      j * j * c.sy + 2 * j * k * c.my + k * k * c.ey,
    ];
  };
  // Flashes and ripples live inside the node's layer, so they float with it.
  const flash = (node: Node, strength: number) => {
    const [x, y, r] = at(node, false);
    const c = el(
      'circle',
      { cx: x, cy: y, r: r * 1.3, fill: `url(#${id('flash')})`, opacity: 0 },
      groups[node.layer].fx
    );
    c.animate([{ opacity: 0 }, { opacity: Math.min(1, 0.85 * strength) }, { opacity: 0 }], {
      duration: 900,
      easing: 'ease-out',
    }).onfinish = () => c.remove();
  };
  const ripple = (node: Node, color: string) => {
    const [x, y, r] = at(node, false);
    const c = el(
      'circle',
      {
        cx: x,
        cy: y,
        r: r * 0.6,
        fill: 'none',
        stroke: color,
        'stroke-width': 10,
        filter: `url(#${id('blur-m')})`,
      },
      groups[node.layer].fx
    );
    c.animate(
      [
        { r: r * 0.6, opacity: 0.9 },
        { r: r * 2.2, opacity: 0 },
      ] as Keyframe[],
      { duration: 1100, easing: 'cubic-bezier(.2,.7,.3,1)' }
    ).onfinish = () => c.remove();
  };

  // A faint dotted route fades in, a train of particles runs along it, the route fades out.
  // The route follows the floating layers on every frame.
  async function stream(a: Node, b: Node, color: string, reverse: boolean) {
    let c = curve(a, b);
    const route = el(
      'path',
      {
        d: c.d,
        fill: 'none',
        stroke: color,
        'stroke-width': 5,
        'stroke-linecap': 'round',
        'stroke-dasharray': '0 22',
        opacity: 0,
        filter: `url(#${id('blur-s')})`,
      },
      routes
    );
    const follow = () => {
      c = curve(a, b);
      route.setAttribute('d', c.d);
    };
    ticks.add(follow);
    route.animate([{ opacity: 0 }, { opacity: 0.6 }], { duration: 300, fill: 'forwards' });
    const dots = Array.from({ length: PARTICLES }, () => {
      const g = el('g', { opacity: 0 }, particles);
      el('circle', { r: 22, fill: halo[color] }, g);
      el('circle', { r: 7, fill: `url(#${id('core')})` }, g);
      return g;
    });
    const span = 1 + PARTICLE_GAP * (PARTICLES - 1);
    await during(TRAVEL_MS * span, (t) => {
      const T = t * span;
      dots.forEach((g, i) => {
        const u = Math.max(0, Math.min(1, T - i * PARTICLE_GAP));
        const k = u * u * (3 - 2 * u);
        const [x, y] = pointOn(c, reverse ? 1 - k : k);
        g.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
        g.setAttribute(
          'opacity',
          String(u <= 0 || u >= 1 ? 0 : Math.min(1, Math.min(u, 1 - u) * 7) * (1 - i * 0.07))
        );
      });
    });
    dots.forEach((g) => g.remove());
    const fade = route.animate([{ opacity: 0.6 }, { opacity: 0 }], {
      duration: 800,
      easing: 'ease-out',
    });
    fade.onfinish = () => {
      ticks.delete(follow);
      route.remove();
    };
  }

  // One request: the agent's stream goes up to the Marketplace, the violet answer comes back.
  async function request(agent: Agent) {
    flash(agent, 0.5);
    await stream(agent, MARKETPLACE, agent.color, false);
    if (disposed) return;
    await wait(ANSWER_DELAY_MS);
    if (disposed) return;
    await stream(agent, MARKETPLACE, ANSWER, true);
    if (disposed) return;
    ripple(agent, ANSWER);
    flash(agent, 1);
  }

  const busy = new Set<Agent>();
  async function lane(delay: number) {
    await wait(delay);
    while (!disposed) {
      const free = AGENTS.filter((a) => !busy.has(a));
      if (!free.length) {
        await wait(400);
        continue;
      }
      const agent = free[Math.floor(Math.random() * free.length)];
      busy.add(agent); // one request per agent at a time; several agents may reach the Marketplace at once
      await request(agent);
      busy.delete(agent);
      await wait(REST_MS[0] + Math.random() * (REST_MS[1] - REST_MS[0]));
    }
  }

  // ---------- Lifecycle ----------
  const observer = new IntersectionObserver(
    (entries) => {
      onScreen = entries[entries.length - 1].isIntersecting;
      schedule();
    },
    { threshold: 0.1 }
  );
  observer.observe(root);
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
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);

  if (!still) for (let i = 0; i < LANES; i++) lane(LANE_STARTS[i]);

  function dispose() {
    disposed = true;
    schedule();
    ticks.forEach((fn) => fn());
    ticks.clear();
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
    for (const name in groups) groups[name].animation?.cancel();
    art.remove();
    fx.remove();
    svg.remove();
    root.classList.remove('is-ready');
  }

  return { dispose };
}
