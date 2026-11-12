/**
 * Motion for the hero card's model shape (`components/HomepageSection/modelBlobSvg.ts`): the
 * white lines ripple, the shape tilts, drifts and squashes very slightly, and the light spot
 * circles. Every value is a sine of time, so the loop has no seams. The only state is the clock:
 * the motion fades in from the static frame, and `restore` sets the clock back to zero so the
 * next start fades in again.
 *
 * Runs only while the shape is on screen and the tab is visible; the desktop and phone cards
 * both render, and the hidden one never intersects. Reduced motion keeps the static Figma frame
 * that the markup already shows.
 */

type Line = { el: SVGPathElement; base: number[]; phase: number; speed: number };

// The glow's Figma transform is translate(125.148 98.5394) scale(175.968 158.373).
const GLOW_X = 125.148;
const GLOW_Y = 98.5394;
const GLOW_SCALE = 'scale(175.968 158.373)';

// The motion fades in over this long, so the first frame matches the static Figma frame.
const EASE_IN_SEC = 1.5;
// The sines are slow; 30 fps looks the same and halves the repaints of the blurred body.
const FRAME_MS = 1000 / 30;

const f = (n: number) => n.toFixed(2);

export function initModelBlobMotion(root: HTMLElement): { dispose: () => void } {
  const svg = root.querySelector<SVGSVGElement>('.mb-svg');
  const glow = root.querySelector<SVGRadialGradientElement>('.mb-glow');
  if (!svg) return { dispose: () => {} };

  const lines: Line[] = Array.from(root.querySelectorAll<SVGPathElement>('.mb-line')).map(
    (el, i) => ({
      el,
      // One cubic per line: M x0 y0 C x1 y1 x2 y2 x3 y3.
      base: (el.getAttribute('d')?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number),
      phase: i * 1.7,
      speed: 0.55 + (i % 4) * 0.12,
    })
  );
  const originals = lines.map((line) => line.el.getAttribute('d') ?? '');
  const glowOriginal = glow?.getAttribute('gradientTransform') ?? null;

  const reduced = matchMedia('(prefers-reduced-motion: reduce), (update: slow)');
  let disposed = false;
  let visible = false;
  let frame = 0;
  let lastUpdate = 0;
  let time = 0;
  let lastRender = -Infinity;

  function render(t: number) {
    const k = Math.min(t / EASE_IN_SEC, 1);
    const a = k * k * (3 - 2 * k); // smoothstep: 0 at the start, 1 after EASE_IN_SEC
    for (const { el, base, phase, speed } of lines) {
      if (base.length !== 8) continue;
      const [x0, y0, x1, y1, x2, y2, x3, y3] = base;
      const w = t * speed + phase;
      const d1 = Math.sin(w) * 18 * a;
      const d2 = Math.sin(w + 2.1) * 18 * a;
      const e0 = Math.sin(w * 0.6 + 1) * 4 * a;
      const e3 = Math.sin(w * 0.6 + 2.5) * 4 * a;
      el.setAttribute(
        'd',
        `M${f(x0)} ${f(y0 + e0)}C${f(x1)} ${f(y1 + d1)} ${f(x2)} ${f(y2 + d2)} ${f(x3)} ${f(y3 + e3)}`
      );
    }

    const tilt = (Math.sin(t * 0.4) * 2.5 + Math.sin(t * 1.3) * 0.6) * a;
    const dx = Math.sin(t * 0.7 + 1) * 1.2 * a;
    const dy = Math.sin(t * 0.9) * 1.6 * a;
    const sx = 1 + Math.sin(t * 1.1) * 0.012 * a;
    const sy = 1 + Math.sin(t * 1.1 + 1.9) * 0.012 * a;
    svg.style.transform = `translate(${f(dx)}%, ${f(dy)}%) rotate(${f(tilt)}deg) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;

    if (glow) {
      // The orbit grows out of the Figma position as the motion fades in.
      const gx = GLOW_X + Math.cos(t * 0.45) * 70 * a;
      const gy = GLOW_Y + Math.sin(t * 0.45) * 50 * a;
      glow.setAttribute('gradientTransform', `translate(${f(gx)} ${f(gy)}) ${GLOW_SCALE}`);
    }
  }

  function restore() {
    lines.forEach((line, i) => line.el.setAttribute('d', originals[i]));
    svg.style.transform = '';
    if (glow && glowOriginal) glow.setAttribute('gradientTransform', glowOriginal);
    // Back at the still frame, so a later start fades in again instead of jumping.
    time = 0;
  }

  const canAnimate = () =>
    !disposed && !reduced.matches && !document.hidden && root.isConnected && visible;

  function tick(now: number) {
    frame = 0;
    if (!canAnimate()) {
      sync();
      return;
    }
    // Cap the step so a long pause doesn't jump the shape.
    time += Math.max(0, Math.min((now - lastUpdate) / 1000, 0.08));
    lastUpdate = now;
    if (now - lastRender >= FRAME_MS - 1) {
      lastRender = now;
      render(time);
    }
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (disposed) return;
    if (reduced.matches) {
      restore();
      return;
    }
    if (canAnimate()) {
      lastUpdate = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }

  const observer = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    sync();
  });

  function dispose() {
    if (disposed) return;
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    observer.disconnect();
    reduced.removeEventListener('change', sync);
    document.removeEventListener('visibilitychange', sync);
    // Put the Figma frame back so a later init on the same markup (React StrictMode) starts clean.
    restore();
  }

  observer.observe(root);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();

  return { dispose };
}
