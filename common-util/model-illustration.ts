/**
 * Animation for the Olas-Predict-R1-14B hero illustration: question → prediction tool →
 * model → forecast, with signals travelling the connectors and a Canvas 2D "cloud" for
 * the model. Ported from the design handoff (`olas-model-animation-handoff-2026-09-22/
 * scene.html`); the timing table and geometry are kept verbatim so the handoff's
 * `preview.html` stays the visual reference.
 *
 * `initModelIllustration(root)` binds to the DOM rendered by
 * `components/ModelsPage/OlasPredictR1/ModelIllustration.tsx` and returns `dispose()`.
 * One animation clock drives the WAAPI text entrances, the SVG connectors and the canvas
 * so they never drift apart; it pauses off-screen, in hidden tabs and in the page cache.
 * Reduced motion (or a slow-update display) shows the completed scene.
 */

type Point = { x: number; y: number };
type Box = { element: HTMLElement; x: number; y: number; w: number; h: number };
type Pose = { x: number; y: number; angle: number; scale: number; opacity: number };
type Signal = { group: SVGGElement; paths: SVGPathElement[]; gradient: SVGLinearGradientElement };
type Tracked = {
  animation: Animation;
  element: HTMLElement;
  final: Keyframe;
  at: number;
  duration: number;
  done: boolean;
};

export type ModelIllustrationOptions = {
  /** Probability of Yes (0–100) announced to screen readers once the forecast lands. */
  probability: number;
};

const TAU = Math.PI * 2;
const FRAME_INTERVAL = 1000 / 60;
const FILAMENT_BASELINES = [-32, -18, -2, 15, 33];
const FILAMENT_PHASES = [0, 0.58, 1.12, 1.9, 2.8];
const FILAMENT_WEIGHTS = [0.54, 0.75, 0.91, 0.72, 0.48];

// Seconds of visible playback — see the handoff README's motion table.
const timing = {
  question: 0.75,
  inputDraw: 2.75,
  inputDrawDuration: 0.48,
  inputPulse: 3.24,
  inputPulseDuration: 2.0,
  toolReceive: 5.24,
  toolDraw: 4.55,
  toolDrawDuration: 0.3,
  toolPulse: 4.67,
  toolPulseDuration: 2.08,
  thinking: 6.75,
  outputCard: 9.2,
  outputDraw: 9.49,
  outputDrawDuration: 0.56,
  outputPulse: 10.05,
  outputPulseDuration: 0.66,
  answer: 10.71,
  end: 11.85,
};
const SCENE_END = timing.end;
const THINK_END = timing.outputPulse;

const ease = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  return v * v * (3 - 2 * v);
};

const color = (hue: number, saturation: number, lightness: number, alpha = 1) =>
  `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

function shape(ctx: CanvasRenderingContext2D, points: Point[]) {
  const end = points[points.length - 1];
  const start = points[0];
  ctx.beginPath();
  ctx.moveTo((end.x + start.x) / 2, (end.y + start.y) / 2);
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    ctx.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
  });
  ctx.closePath();
}

function cloudOutline(time: number, energy: number, padding = 0) {
  const points: Point[] = [];
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * TAU;
    const wave =
      5.8 * Math.sin(a * 3 + time * 0.3) +
      6 * Math.cos(a * 2 - time * 0.23 + 1.1) +
      1.8 * Math.sin(a * 5 + time * 0.22);
    const r = (67 + padding + wave) * (1 - energy * 0.045);
    points.push({ x: Math.cos(a) * r * 1.08, y: Math.sin(a) * r * 0.96 });
  }
  return points;
}

function colorField(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  hue: number,
  energy: number,
  opacity: number
) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  const pinkSoftness = hue >= 290 ? energy * 6 : 0;
  gradient.addColorStop(0, color(hue, 62 + energy * 16 - pinkSoftness, 81 - energy * 17, opacity));
  gradient.addColorStop(
    0.42,
    color(hue + 4, 60 + energy * 17 - pinkSoftness, 81 - energy * 15, opacity * 0.74)
  );
  gradient.addColorStop(1, color(hue + 8, 60, 86, 0));
  ctx.fillStyle = gradient;
  ctx.fillRect(-110, -110, 220, 220);
}

function filamentPoint(
  progress: number,
  line: number,
  time: number,
  energy: number,
  variant: string
): Point {
  const startX = -76 + line * 4;
  const endX = 68 - line * 3;
  const x = startX + (endX - startX) * progress;
  let y =
    FILAMENT_BASELINES[line] +
    Math.sin(x * 0.023 + time * 0.32 + FILAMENT_PHASES[line]) * 11 +
    Math.cos(x * 0.031 - time * 0.22) * 5;
  const focusX = 17 + Math.sin(time * 0.17) * 4;
  const focusY = -3 + Math.cos(time * 0.21) * 3;
  const focus = variant === 'focus' ? 0.85 : variant === 'signals' ? 0.2 : 0;
  const gather = Math.exp(-Math.pow((x - focusX) / 31, 2)) * Math.min(1, energy) * focus;
  y = y * (1 - gather) + (focusY + (line - 2) * 2.1) * gather;
  if (variant === 'wave') {
    const waveX = ((time * 0.24) % 1) * 250 - 125;
    const local = Math.exp(-Math.pow((x - waveX) / 28, 2));
    y += local * Math.sin(line * 0.75 + 0.4) * 11 * energy;
  }
  return { x, y };
}

function traceFilament(
  ctx: CanvasRenderingContext2D,
  line: number,
  time: number,
  energy: number,
  variant: string,
  from = 0,
  to = 1,
  steps = 64
) {
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const point = filamentPoint(from + ((to - from) * i) / steps, line, time, energy, variant);
    if (i === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  }
}

function drawSignals(ctx: CanvasRenderingContext2D, line: number, time: number, energy: number) {
  const cycle = (((time * 0.26 - line * 0.22) % 1) + 1) % 1;
  if (cycle > 0.35 || energy < 0.01) return;
  const travel = cycle / 0.35;
  const strength = Math.sin(travel * Math.PI) * Math.min(1, energy * energy);
  const from = Math.max(0, travel - 0.16);
  const to = Math.min(1, travel + 0.035);
  const start = filamentPoint(from, line, time, energy, 'signals');
  const end = filamentPoint(to, line, time, energy, 'signals');
  const light = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
  light.addColorStop(0, 'rgba(255,255,255,0)');
  light.addColorStop(0.6, `rgba(255,255,255,${strength * 0.9})`);
  light.addColorStop(1, 'rgba(255,255,255,0)');
  traceFilament(ctx, line, time, energy, 'signals', from, to, 20);
  ctx.strokeStyle = `rgba(247,222,255,${strength * 0.17})`;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.strokeStyle = light;
  ctx.lineWidth = 1.65;
  ctx.stroke();
}

function drawWave(ctx: CanvasRenderingContext2D, time: number, energy: number) {
  if (energy < 0.01) return;
  const waveX = ((time * 0.24) % 1) * 250 - 125;
  ctx.save();
  ctx.rotate(-0.21);
  const light = ctx.createLinearGradient(waveX - 34, 0, waveX + 34, 0);
  light.addColorStop(0, 'rgba(255,239,255,0)');
  light.addColorStop(0.5, `rgba(255,239,255,${0.19 * Math.min(1, energy)})`);
  light.addColorStop(1, 'rgba(255,239,255,0)');
  ctx.fillStyle = light;
  ctx.fillRect(-125, -120, 250, 240);
  ctx.restore();
}

function drawFilaments(
  ctx: CanvasRenderingContext2D,
  time: number,
  energy: number,
  variant: string
) {
  if (variant === 'wave') drawWave(ctx, time, energy);
  if (variant === 'focus' && energy > 0.01) {
    ctx.save();
    ctx.translate(18, -3);
    ctx.scale(1.2, 0.55);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 35);
    glow.addColorStop(0, `rgba(255,237,255,${energy * 0.16})`);
    glow.addColorStop(1, 'rgba(255,237,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(-40, -40, 80, 80);
    ctx.restore();
  }
  for (let line = 0; line < 5; line++) {
    const start = filamentPoint(0, line, time, energy, variant);
    const end = filamentPoint(1, line, time, energy, variant);
    const fade = ctx.createLinearGradient(start.x, 0, end.x, 0);
    const alpha = FILAMENT_WEIGHTS[line] * (0.67 + energy * 0.23);
    fade.addColorStop(0, 'rgba(255,255,255,0)');
    fade.addColorStop(0.28, `rgba(255,255,255,${alpha * 0.62})`);
    fade.addColorStop(0.64, `rgba(255,255,255,${alpha})`);
    fade.addColorStop(1, 'rgba(255,255,255,0)');
    traceFilament(ctx, line, time, energy, variant);
    ctx.strokeStyle = fade;
    ctx.lineWidth = 0.72 + energy * 0.16;
    ctx.stroke();
    if (variant === 'signals') drawSignals(ctx, line, time, energy);
  }
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  time: number,
  filamentTime: number,
  energy: number,
  variant: string
) {
  ctx.save();
  ctx.translate(Math.sin(time * 0.18) * 2.6, Math.cos(time * 0.22) * 2.4);
  ctx.rotate(Math.sin(time * 0.14) * 0.065);
  ctx.save();
  ctx.translate(-4.2 + Math.sin(time * 0.25) * 1.2, 2.8 + Math.cos(time * 0.22));
  shape(ctx, cloudOutline(time, energy, 1.4));
  const membrane = ctx.createLinearGradient(-72, -43, 23, 57);
  membrane.addColorStop(0, color(278, 58, 75 - energy * 8, 0.22));
  membrane.addColorStop(1, color(291, 59, 85 - energy * 9, 0.06));
  ctx.fillStyle = membrane;
  ctx.fill();
  ctx.restore();
  const outline = cloudOutline(time, energy);
  shape(ctx, outline);
  const base = ctx.createLinearGradient(-66 + Math.sin(time * 0.18) * 10, -63, 55, 68);
  base.addColorStop(0, color(294, 60 + energy * 12, 88 - energy * 10, 0.96));
  base.addColorStop(0.45, color(283, 54 + energy * 19, 80 - energy * 11, 0.94));
  base.addColorStop(1, color(267, 53 + energy * 20, 71 - energy * 12, 0.96));
  ctx.fillStyle = base;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const convergence = 1 - energy * 0.3;
  colorField(
    ctx,
    (Math.sin(time * 0.34) * 34 - 20) * convergence,
    (Math.cos(time * 0.26) * 23 - 27) * convergence,
    81,
    309,
    energy,
    0.79
  );
  colorField(
    ctx,
    (Math.cos(time * 0.28 + 1.2) * 29 + 31) * convergence,
    (Math.sin(time * 0.36) * 25 + 23) * convergence,
    70,
    262,
    energy,
    0.73
  );
  colorField(
    ctx,
    (Math.sin(time * 0.31 + 2) * 30 - 29) * convergence,
    (Math.cos(time * 0.33) * 18 + 22) * convergence,
    68,
    289,
    energy,
    0.59
  );

  const folds = [
    { phase: 0.8, hue: 293, alpha: 0.25 },
    { phase: 3.1, hue: 272, alpha: 0.18 },
  ];
  folds.forEach((fold) => {
    const points: Point[] = [];
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * TAU;
      const radius = 49 + 5 * Math.sin(a * 3 + time * 0.24 + fold.phase);
      points.push({
        x: Math.cos(a) * radius * 1.18 + Math.sin(time * 0.28 + fold.phase) * 26,
        y: Math.sin(a) * radius * 0.85 + Math.cos(time * 0.25 + fold.phase) * 23,
      });
    }
    shape(ctx, points);
    const wash = ctx.createLinearGradient(-56, -49, 47, 53);
    wash.addColorStop(0, color(fold.hue, 66 + energy * 15, 94 - energy * 8, fold.alpha));
    wash.addColorStop(0.64, color(fold.hue, 64 + energy * 16, 88 - energy * 9, 0.05));
    wash.addColorStop(1, color(fold.hue, 64, 86, 0));
    ctx.fillStyle = wash;
    ctx.fill();
  });
  drawFilaments(ctx, filamentTime, energy, variant);
  ctx.restore();
  ctx.restore();
}

/** Rounded-rectangle outline for the card shapes (Figma's 21.6px squircle corners). */
function squircle(w: number, h: number) {
  return `M0 21.6 C0 12.601 0 8.101 2.292 4.947 C3.032 3.928 3.928 3.032 4.947 2.292 C8.101 0 12.601 0 21.6 0 L${w - 21.6} 0 C${w - 12.601} 0 ${w - 8.101} 0 ${w - 4.947} 2.292 C${w - 3.928} 3.032 ${w - 3.032} 3.928 ${w - 2.292} 4.947 C${w} 8.101 ${w} 12.601 ${w} 21.6 L${w} ${h - 21.6} C${w} ${h - 12.601} ${w} ${h - 8.101} ${w - 2.292} ${h - 4.947} C${w - 3.032} ${h - 3.928} ${w - 3.928} ${h - 3.032} ${w - 4.947} ${h - 2.292} C${w - 8.101} ${h} ${w - 12.601} ${h} ${w - 21.6} ${h} L21.6 ${h} C12.601 ${h} 8.101 ${h} 4.947 ${h - 2.292} C3.928 ${h - 3.032} 3.032 ${h - 3.928} 2.292 ${h - 4.947} C0 ${h - 8.101} 0 ${h - 12.601} 0 ${h - 21.6} L0 21.6 Z`;
}

const curvePath = (points: Point[]) =>
  `M${points[0].x},${points[0].y} C${points[1].x},${points[1].y} ${points[2].x},${points[2].y} ${points[3].x},${points[3].y}`;

function curvePoint(points: Point[], t: number): Point {
  const a = 1 - t;
  return {
    x:
      a * a * a * points[0].x +
      3 * a * a * t * points[1].x +
      3 * a * t * t * points[2].x +
      t * t * t * points[3].x,
    y:
      a * a * a * points[0].y +
      3 * a * a * t * points[1].y +
      3 * a * t * t * points[2].y +
      t * t * t * points[3].y,
  };
}

function arcTable(points: Point[]) {
  const table = [{ t: 0, length: 0, point: points[0] }];
  for (let i = 1; i <= 32; i++) {
    const point = curvePoint(points, i / 32);
    const prev = table[i - 1];
    table.push({
      t: i / 32,
      length: prev.length + Math.hypot(point.x - prev.point.x, point.y - prev.point.y),
      point,
    });
  }
  return table;
}

function arcParameter(table: ReturnType<typeof arcTable>, progress: number) {
  const distance = Math.max(0, Math.min(1, progress)) * table[table.length - 1].length;
  for (let i = 1; i < table.length; i++) {
    if (table[i].length < distance) continue;
    const prev = table[i - 1];
    const fraction = (distance - prev.length) / Math.max(0.001, table[i].length - prev.length);
    return prev.t + (table[i].t - prev.t) * fraction;
  }
  return 1;
}

function transformAnchor(box: Box, pose: Pose, x: number, y: number): Point {
  const angle = (pose.angle * Math.PI) / 180;
  const dx = (x - box.w / 2) * pose.scale;
  const dy = (y - box.h / 2) * pose.scale;
  return {
    x: box.x + box.w / 2 + pose.x + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: box.y + box.h / 2 + pose.y + dx * Math.sin(angle) + dy * Math.cos(angle),
  };
}

export function initModelIllustration(root: HTMLElement, options: ModelIllustrationOptions) {
  const q = <T extends Element>(selector: string) => root.querySelector<T>(selector);
  const scene = q<HTMLElement>('.oi-scene');
  const question = q<HTMLElement>('.oi-question');
  const output = q<HTMLElement>('.oi-forecast');
  const art = q<HTMLElement>('.oi-model');
  const canvas = art.querySelector('canvas');
  const context = canvas.getContext('2d');
  const status = q<HTMLElement>('.oi-sr');
  const routes = q<SVGSVGElement>('.oi-routes');
  const inputPath = q<SVGPathElement>('.oi-route-in');
  const outputPath = q<SVGPathElement>('.oi-route-out');
  const toolPath = q<SVGPathElement>('.oi-route-tool');
  const toolHead = q<HTMLElement>('.oi-tool-head');
  const cornerHighlights = [...root.querySelectorAll<HTMLElement>('.oi-corner-active')];
  const signals: Signal[] = ['in', 'out', 'tool'].map((direction) => ({
    group: q<SVGGElement>(`.oi-signal-${direction}`),
    paths: [...root.querySelectorAll<SVGPathElement>(`.oi-signal-${direction} path`)],
    gradient: q<SVGLinearGradientElement>(`#oi-signal-${direction}`),
  }));
  const reduced = matchMedia('(prefers-reduced-motion: reduce), (update: slow)');

  let THINK_START = timing.thinking;
  let modelActivated = false;
  const animations: Tracked[] = [];
  let disposed = false;
  let frozenForPageCache = false;
  let frame = 0;
  let lastUpdate = 0;
  let nextFrame = 0;
  let visible = false;
  let sceneTime = 0;
  let motionTime = 0;
  let bodyPhase = 0;
  let phase = 0;
  let activity = 0;
  let width = 0;
  let height = 0;
  let geometry: { boxes: Box[]; cx: number; cy: number; toolBox: Omit<Box, 'element'> } = null;
  let previousStatus = '';
  if (context) art.dataset.ready = 'true';

  function track(
    element: HTMLElement,
    keyframes: Keyframe[],
    at: number,
    duration: number,
    easing = 'cubic-bezier(.2,.7,.2,1)'
  ) {
    const animation = element.animate(keyframes, {
      duration: duration * 1000,
      fill: 'both',
      easing,
    });
    animation.pause();
    animation.currentTime = 0;
    animations.push({
      animation,
      element,
      final: keyframes[keyframes.length - 1],
      at,
      duration,
      done: false,
    });
  }
  function entrance(element: HTMLElement, at: number, duration: number, shift: number) {
    track(
      element,
      [
        { opacity: 0, transform: `translateY(${shift}px)` },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      at,
      duration
    );
  }
  track(art, [{ opacity: 0 }, { opacity: 1 }], 4.35, 0.42);
  entrance(toolHead, 2.2, 0.42, 5);
  entrance(question.querySelector('.oi-label'), 0.94, 0.32, 4);
  // The question's words are pre-split into `.oi-word` spans by the component.
  question.querySelectorAll<HTMLElement>('.oi-word').forEach((span, index) => {
    entrance(span, 1.1 + index * 0.019, 0.34, 4);
  });
  entrance(output.querySelector('.oi-label'), timing.answer, 0.32, 4);
  entrance(output.querySelector('.oi-values'), timing.answer + 0.12, 0.4, 5);
  track(
    output.querySelector('.oi-bar'),
    [{ opacity: 0 }, { opacity: 1 }],
    timing.answer + 0.16,
    0.3
  );
  track(
    output.querySelector('.oi-bar span'),
    [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
    timing.answer + 0.2,
    0.68
  );
  track(
    output.querySelector('.oi-bar-glow'),
    [
      { opacity: 0, transform: 'scaleX(0)' },
      { opacity: 0.82, transform: 'scaleX(1)' },
    ],
    timing.answer + 0.2,
    0.68
  );

  function cardPose(index: number): Pose {
    const start = index === 0 ? timing.question : timing.outputCard;
    const progress = Math.max(0, Math.min(1, (sceneTime - start) / 0.52));
    const enter = 1 - Math.pow(1 - progress, 4);
    const t = motionTime;
    const still = reduced.matches;
    const x = still ? 0 : index === 0 ? Math.sin(t * 0.51) * 1.6 : Math.sin(t * 0.44 + 1.4) * 1.8;
    const y = still
      ? 0
      : index === 0
        ? Math.sin(t * 0.65 + 0.6) * 2
        : Math.sin(t * 0.54 + 2.1) * 2.3;
    const angle = still ? 0 : Math.sin(t * (index === 0 ? 0.41 : 0.34) + index * 1.2) * 0.16;
    return {
      x,
      y: y + (1 - enter) * 10,
      angle,
      scale: 0.976 + enter * 0.024,
      opacity: Math.min(1, progress * 1.8),
    };
  }
  function pathReveal(path: SVGPathElement, points: Point[], start: number, duration: number) {
    const progress = Math.max(0, Math.min(1, (sceneTime - start) / duration));
    path.setAttribute('d', curvePath(points));
    path.style.strokeDashoffset = String(1 - ease(progress));
    path.style.opacity = String(Math.min(1, progress * 12) * 0.76);
  }
  function travel(signal: Signal, points: Point[], start: number, duration: number) {
    const progress = (sceneTime - start) / duration;
    if (reduced.matches || progress <= 0 || progress >= 1.22) {
      signal.group.style.opacity = '0';
      return;
    }
    const table = arcTable(points);
    const from = arcParameter(table, Math.max(0, progress - 0.22));
    const to = arcParameter(table, Math.min(1, progress));
    const tail = curvePoint(points, from);
    const head = curvePoint(points, to);
    const pieces = Array.from({ length: 15 }, (_, i) =>
      curvePoint(points, from + ((to - from) * i) / 14)
    );
    const d = pieces.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    signal.paths.forEach((path) => path.setAttribute('d', d));
    signal.gradient.setAttribute('x1', String(tail.x));
    signal.gradient.setAttribute('y1', String(tail.y));
    signal.gradient.setAttribute('x2', String(head.x));
    signal.gradient.setAttribute('y2', String(head.y));
    signal.group.style.opacity = String(
      Math.max(0, Math.min(1, progress * 12, (1.22 - progress) * 7))
    );
  }
  function centeredTravel(
    signal: Signal,
    points: Point[],
    windowStart: number,
    windowDuration: number,
    referenceDistance: number
  ) {
    const distance = arcTable(points).at(-1).length;
    const duration = (distance / referenceDistance) * timing.outputPulseDuration * 2;
    // Include the trailing fade when centering the full visible pulse.
    const visibleDuration = duration * 1.22;
    const start = windowStart + (windowDuration - visibleDuration) / 2;
    travel(signal, points, start, duration);
    return start + duration;
  }
  function updateGeometry() {
    if (!geometry) return;
    const { boxes, cx, cy, toolBox } = geometry;
    const poses = [cardPose(0), cardPose(1)];
    [question, output].forEach((card, index) => {
      const pose = poses[index];
      card.style.transform = `translate(${pose.x}px,${pose.y}px) rotate(${pose.angle}deg) scale(${pose.scale})`;
      card.style.opacity = String(pose.opacity);
    });
    const source = transformAnchor(
      boxes[0],
      poses[0],
      toolBox.x + toolBox.w * 0.5 - 28 - boxes[0].x,
      boxes[0].h - 0.5
    );
    const target = transformAnchor(boxes[1], poses[1], boxes[1].w * 0.8, 0.5);
    const toolIn = { x: toolBox.x + toolBox.w * 0.5, y: toolBox.y };
    const toolOut = { x: toolBox.x + toolBox.w * 0.5, y: toolBox.y + toolBox.h + 2 };
    const modelIn = { x: cx - 28, y: cy - 58 };
    const inputGap = toolIn.y - source.y;
    const input = [
      source,
      { x: source.x, y: source.y + inputGap * 0.45 },
      { x: toolIn.x, y: toolIn.y - inputGap * 0.45 },
      toolIn,
    ];
    const middleGap = modelIn.y - toolOut.y;
    const middle = [
      toolOut,
      { x: toolOut.x, y: toolOut.y + middleGap * 0.45 },
      { x: modelIn.x, y: modelIn.y - middleGap * 0.45 },
      modelIn,
    ];
    const outputCurve = [
      { x: cx + 48, y: cy + 14 },
      { x: cx + 114, y: cy + 14 },
      { x: target.x, y: target.y - 40 },
      target,
    ];
    pathReveal(inputPath, input, timing.inputDraw, timing.inputDrawDuration);
    pathReveal(toolPath, middle, timing.toolDraw, timing.toolDrawDuration);
    pathReveal(outputPath, outputCurve, timing.outputDraw, timing.outputDrawDuration);
    const referenceDistance = arcTable(outputCurve).at(-1).length;
    centeredTravel(
      signals[0],
      input,
      timing.inputPulse,
      timing.inputPulseDuration,
      referenceDistance
    );
    const modelArrival = centeredTravel(
      signals[2],
      middle,
      timing.toolPulse,
      timing.toolPulseDuration,
      referenceDistance
    );
    // The model wakes the moment the signal head lands, wherever the layout put it.
    if (!modelActivated) {
      THINK_START = modelArrival;
      modelActivated = sceneTime >= modelArrival;
    }
    travel(signals[1], outputCurve, timing.outputPulse, timing.outputPulseDuration);
    const sinceConnected = sceneTime - (timing.inputDraw + timing.inputDrawDuration);
    const activating = sinceConnected >= 0.46;
    const blink =
      sinceConnected < 0
        ? 0
        : 0.55 * Math.pow(Math.sin(Math.min(1, sinceConnected / 0.46) * Math.PI), 2);
    const toolEnergy = reduced.matches
      ? 1
      : activating
        ? ease((sinceConnected - 0.46) / 0.2)
        : blink;
    const expansionProgress = Math.max(0, Math.min(1, (sinceConnected - 0.46) / 0.45));
    // Quintic smootherstep for the corners' outward nudge.
    const expansion = reduced.matches
      ? 1
      : expansionProgress ** 3 * (expansionProgress * (expansionProgress * 6 - 15) + 10);
    toolHead.dataset.state =
      reduced.matches || sinceConnected >= 0.91
        ? 'active'
        : sinceConnected >= 0
          ? 'activating'
          : 'idle';
    cornerHighlights.forEach((corner) => {
      corner.style.opacity = String(toolEnergy);
      const bracket = corner.parentElement;
      const right =
        bracket.classList.contains('oi-corner-tr') || bracket.classList.contains('oi-corner-br');
      const bottom =
        bracket.classList.contains('oi-corner-bl') || bracket.classList.contains('oi-corner-br');
      bracket.style.translate = `${right ? 1.5 * expansion : -1.5 * expansion}px ${
        bottom ? 1.5 * expansion : -1.5 * expansion
      }px`;
    });
  }
  function draw() {
    if (!context || !width) return;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    const scale = canvas.width / width;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.translate(width / 2, height / 2);
    context.scale(Math.min(width, height) / 210, Math.min(width, height) / 210);
    drawCloud(context, bodyPhase, phase, activity, 'signals');
  }
  function resize() {
    const bounds = scene.getBoundingClientRect();
    const artBounds = art.getBoundingClientRect();
    const boxes: Box[] = [question, output].map((element) => ({
      element,
      x: element.offsetLeft,
      y: element.offsetTop,
      w: element.offsetWidth,
      h: element.offsetHeight,
    }));
    width = artBounds.width;
    height = artBounds.height;
    const cx = artBounds.left - bounds.left + width / 2;
    const cy = artBounds.top - bounds.top + height / 2;
    const toolBounds = toolHead.getBoundingClientRect();
    const toolBox = {
      x: toolBounds.left - bounds.left,
      y: toolHead.parentElement.offsetTop + toolHead.offsetTop,
      w: toolHead.offsetWidth,
      h: toolHead.offsetHeight,
    };
    geometry = { boxes, cx, cy, toolBox };
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    routes.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    boxes.forEach((box) => {
      box.element.querySelector('.oi-card-shape').setAttribute('viewBox', `0 0 ${box.w} ${box.h}`);
      box.element
        .querySelectorAll('.oi-outline')
        .forEach((path) => path.setAttribute('d', squircle(box.w, box.h)));
    });
    updateGeometry();
    draw();
  }
  function updateScene() {
    updateGeometry();
    activity =
      sceneTime < THINK_START
        ? 0
        : sceneTime < THINK_START + 0.3
          ? ease((sceneTime - THINK_START) / 0.3)
          : sceneTime < THINK_END
            ? 1
            : 1 - ease((sceneTime - THINK_END) / timing.outputPulseDuration);
    const next =
      sceneTime >= SCENE_END
        ? 'complete'
        : sceneTime >= timing.answer
          ? 'answer'
          : sceneTime >= timing.outputPulse
            ? 'delivery'
            : sceneTime >= THINK_START
              ? 'thinking'
              : sceneTime >= timing.toolPulse
                ? 'model-transfer'
                : sceneTime >= timing.toolReceive
                  ? 'tool'
                  : sceneTime >= timing.inputPulse
                    ? 'transfer'
                    : sceneTime >= timing.inputDraw
                      ? 'connecting'
                      : sceneTime >= timing.question
                        ? 'question'
                        : 'intro';
    if (next !== previousStatus) {
      previousStatus = next;
      scene.dataset.stage = next;
      if (next === 'thinking') status.textContent = 'The model is processing the example question.';
      if (next === 'answer') {
        status.textContent = `Example forecast: ${options.probability}% probability of Yes.`;
      }
    }
    animations.forEach((item) => {
      if (item.done || sceneTime < item.at) return;
      item.animation.currentTime = Math.max(0, Math.min(item.duration, sceneTime - item.at)) * 1000;
      if (sceneTime >= item.at + item.duration) {
        Object.entries(item.final).forEach(([property, value]) => {
          item.element.style[property] =
            property === 'transform' && (value === 'translateY(0)' || value === 'scaleX(1)')
              ? 'none'
              : value;
        });
        item.animation.cancel();
        item.done = true;
      }
    });
  }
  function canAnimate() {
    return (
      !disposed &&
      !reduced.matches &&
      !document.hidden &&
      !frozenForPageCache &&
      root.isConnected &&
      visible &&
      (Boolean(context) || sceneTime < SCENE_END)
    );
  }
  function tick(now: number) {
    frame = 0;
    if (!root.isConnected) {
      dispose();
      return;
    }
    if (reduced.matches) {
      sync();
      return;
    }
    if (!canAnimate()) {
      root.dataset.running = 'false';
      return;
    }
    if (now >= nextFrame - 0.5) {
      const dt = Math.min((now - lastUpdate) / 1000, 0.08);
      lastUpdate = now;
      nextFrame += Math.max(1, Math.floor((now - nextFrame) / FRAME_INTERVAL) + 1) * FRAME_INTERVAL;
      sceneTime = Math.min(SCENE_END, sceneTime + dt);
      motionTime += dt;
      updateScene();
      bodyPhase += dt;
      phase += dt * (1 + activity * 1.5);
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (disposed) return;
    if (!root.isConnected) {
      dispose();
      return;
    }
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (reduced.matches) {
      sceneTime = SCENE_END;
      updateScene();
      draw();
    }
    const running = canAnimate();
    root.dataset.running = String(running);
    if (running) {
      lastUpdate = performance.now();
      nextFrame = lastUpdate + FRAME_INTERVAL;
      frame = requestAnimationFrame(tick);
    }
  }
  function onPageHide(event: PageTransitionEvent) {
    if (event.persisted) {
      frozenForPageCache = true;
      sync();
    } else dispose();
  }
  function onPageShow() {
    frozenForPageCache = false;
    sync();
  }
  function replay() {
    if (disposed || reduced.matches) return;
    sceneTime = 0;
    modelActivated = false;
    motionTime = 0;
    bodyPhase = 0;
    phase = 0;
    activity = 0;
    previousStatus = '';
    status.textContent = '';
    animations.forEach((item) => {
      item.done = false;
      item.animation.currentTime = 0;
      item.animation.pause();
    });
    updateScene();
    draw();
    sync();
  }
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      sync();
    },
    { threshold: 0.12 }
  );
  const sizeObserver = new ResizeObserver(resize);
  function dispose() {
    if (disposed) return;
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    visibilityObserver.disconnect();
    sizeObserver.disconnect();
    animations.forEach((item) => item.animation.cancel());
    reduced.removeEventListener('change', sync);
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
  }
  visibilityObserver.observe(scene);
  [scene, art, question, output, toolHead].forEach((element) => sizeObserver.observe(element));
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  resize();
  updateScene();
  sync();

  return { dispose, replay };
}
