import { useCallback, useEffect, useRef } from 'react';

import type { CreateTypes } from 'canvas-confetti';

/**
 * Fired-already flag lives at module scope on purpose.
 *
 * The transactions card mounts twice — once in the desktop branch of the
 * flywheel and once in the mobile one — and React StrictMode double-mounts
 * effects in dev. A ref is per-instance, so it would let the volley run
 * several times; a module-level flag makes "once per visit" actually mean once.
 */
let hasAutoFired = false;

const SECOND_VOLLEY_DELAY_MS = 900;
/** Matches the selector in globals.css that halts the ring and glow. */
const PAUSED_CLASS = 'milestone-paused';

const COLORS = ['#7E22ED', '#A855F7', '#C084FC', '#F472B6', '#FBCFE8'];

export const useMilestoneConfetti = (enabled: boolean) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // The promise is cached, not the resolved instance: two volleys can start
  // while the chunk is still loading (the scroll volley plus an eager click),
  // and caching only the result lets both see an empty ref and build a second
  // instance on the same canvas — two render loops each clearing the other's
  // frame. Storing the promise makes the first caller the only builder.
  const instanceRef = useRef<Promise<CreateTypes | null> | null>(null);

  const getInstance = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return Promise.resolve(null);

    // Lazy: keeps canvas-confetti out of the homepage bundle entirely.
    // No `useWorker` — transferControlToOffscreen only works once per canvas,
    // and StrictMode's double mount would throw on the second attempt.
    instanceRef.current ??= import('canvas-confetti').then(({ default: confetti }) =>
      confetti.create(canvas, { resize: true })
    );

    return instanceRef.current;
  }, []);

  const burst = useCallback(async () => {
    const confetti = await getInstance();
    if (!confetti) return;

    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

    const shot = {
      particleCount: isTouch ? 40 : 75,
      spread: 62,
      startVelocity: 34,
      decay: 0.9,
      scalar: 1,
      ticks: 200,
      colors: COLORS,
      // The library's own gate — no separate matchMedia needed.
      disableForReducedMotion: true,
    };

    // Two angled shots from just inside the card's left and right edges, aimed
    // outwards (angle 90 is straight up), so the particles fan out from behind
    // the card instead of colliding in its middle.
    confetti({ ...shot, origin: { x: 0.34, y: 0.62 }, angle: 112 });
    confetti({ ...shot, origin: { x: 0.66, y: 0.62 }, angle: 68 });
  }, [getInstance]);

  /**
   * Bonus volley on click. Deliberately unthrottled — spamming it is the point.
   * canvas-confetti folds every volley into one animation loop and drops each
   * particle after `ticks`, so the cost stays bounded however hard it's mashed.
   */
  const fire = burst;

  useEffect(() => {
    if (!enabled || hasAutoFired) return undefined;

    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return undefined;

    let secondVolley: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      (entries) => {
        if (hasAutoFired || !entries.some((entry) => entry.isIntersecting)) return;
        hasAutoFired = true;
        observer.disconnect();
        burst();
        // Two volleys: the first one is easy to scroll past and miss.
        secondVolley = setTimeout(burst, SECOND_VOLLEY_DELAY_MS);
      },
      // Not `threshold: 0.5` — that measures how much of the card is visible,
      // and the card is short enough to clear it while still at the bottom of
      // the screen. Shrinking the root's bottom edge by half the viewport
      // instead makes it fire when the card reaches the middle of the screen.
      { threshold: 0, rootMargin: '0px 0px -50% 0px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimeout(secondVolley);
    };
  }, [enabled, burst]);

  /**
   * Park the ring and the glow while the card is off-screen.
   *
   * Both run forever, and the compositor keeps servicing them the entire time
   * a visitor spends anywhere on the page — including the long stretches where
   * the card isn't even in view. The flywheel cards each sit on their own
   * layer (they carry a backdrop-filter), so the less standing work there is,
   * the less chance a loaded machine drops a frame while compositing them.
   *
   * Toggled through the DOM rather than state: this fires on every scroll past
   * the section, and none of it needs to re-render React.
   */
  useEffect(() => {
    if (!enabled) return undefined;

    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return undefined;

    element.classList.add(PAUSED_CLASS);

    const observer = new IntersectionObserver(
      ([entry]) => element.classList.toggle(PAUSED_CLASS, !entry.isIntersecting),
      // Wake slightly before it scrolls in, so it is never caught mid-park.
      { rootMargin: '150px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);

  useEffect(
    () => () => {
      // May still be in flight — resolve before resetting, or a volley started
      // just before unmount keeps drawing.
      instanceRef.current?.then((instance) => instance?.reset());
      instanceRef.current = null;
    },
    []
  );

  return { containerRef, canvasRef, fire };
};
