import { Fragment, useEffect, useRef } from 'react';

import type { ModelShape, Point } from 'common-util/model-illustration';
import { initModelIllustration } from 'common-util/model-illustration';
import { cn } from 'lib/utils';

import { MODEL_NAME } from 'components/ModelsPage/OlasPredictR1/constants';

/** Fixed illustration content from the design handoff — not a live forecast. */
const QUESTION =
  'Will the Clarity Act, the bipartisan crypto market structure bill, pass both chambers of the United States Congress and be signed into law by the President on or before February 2, 2026?';
const PROBABILITY = 20;
// Preserve this exact spelling (per the handoff) — it names the deployed tool.
const TOOL_ID = ['superforcaster-market-aware-', 'olas-predict-r1-14b'];

/**
 * Layered drop shadow for the two cards (Figma's four-stop shadow), applied to the
 * squircle outline the animation sizes to each card.
 */
const CardShadowFilter = () => (
  <svg
    width="0"
    height="0"
    aria-hidden="true"
    style={{ position: 'absolute', pointerEvents: 'none' }}
  >
    <defs>
      <filter
        id="oi-card-shadow"
        x="-35%"
        y="-30%"
        width="170%"
        height="230%"
        colorInterpolationFilters="sRGB"
      >
        <feGaussianBlur in="SourceAlpha" stdDeviation="9.489" result="blur1" />
        <feOffset in="blur1" dy="47.869" result="offset1" />
        <feFlood floodColor="#366581" floodOpacity=".02" />
        <feComposite in2="offset1" operator="in" result="shadow1" />
        <feGaussianBlur in="SourceAlpha" stdDeviation="8.0725" result="blur2" />
        <feOffset in="blur2" dy="26.909" result="offset2" />
        <feFlood floodColor="#366581" floodOpacity=".08" />
        <feComposite in2="offset2" operator="in" result="shadow2" />
        <feGaussianBlur in="SourceAlpha" stdDeviation="5.9485" result="blur3" />
        <feOffset in="blur3" dy="11.897" result="offset3" />
        <feFlood floodColor="#366581" floodOpacity=".13" />
        <feComposite in2="offset3" operator="in" result="shadow3" />
        <feGaussianBlur in="SourceAlpha" stdDeviation="3.2575" result="blur4" />
        <feOffset in="blur4" dy="3.116" result="offset4" />
        <feFlood floodColor="#366581" floodOpacity=".15" />
        <feComposite in2="offset4" operator="in" result="shadow4" />
        <feMerge>
          <feMergeNode in="shadow1" />
          <feMergeNode in="shadow2" />
          <feMergeNode in="shadow3" />
          <feMergeNode in="shadow4" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

const SignalGradient = ({ id }: { id: string }) => (
  <linearGradient id={id} gradientUnits="userSpaceOnUse">
    <stop offset="0" stopColor="#ad5ae8" stopOpacity="0" />
    <stop offset=".42" stopColor="#ad5ae8" stopOpacity=".55" />
    <stop offset=".78" stopColor="#9333ea" />
    <stop offset="1" stopColor="#f7e9ff" />
  </linearGradient>
);

/** Connectors between the cards and the signals that run along them. */
const Routes = () => (
  <svg className="oi-routes" aria-hidden="true">
    <defs>
      <filter id="oi-signal-blur" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="2" />
      </filter>
      <SignalGradient id="oi-signal-in" />
      <SignalGradient id="oi-signal-tool" />
      <SignalGradient id="oi-signal-out" />
    </defs>
    <path className="oi-route oi-route-in" pathLength={1} />
    <path className="oi-route oi-route-tool" pathLength={1} />
    <path className="oi-route oi-route-out" pathLength={1} />
    {['in', 'tool', 'out'].map((direction) => (
      <g key={direction} className={`oi-signal oi-signal-${direction}`}>
        <path className="oi-signal-glow" stroke={`url(#oi-signal-${direction})`} />
        <path className="oi-signal-core" stroke={`url(#oi-signal-${direction})`} />
      </g>
    ))}
  </svg>
);

/** Card background: the animation sets the viewBox and outline `d` to the card's size. */
const CardShape = ({ clipId }: { clipId: string }) => (
  <svg className="oi-card-shape" aria-hidden="true">
    <defs>
      <clipPath id={clipId}>
        <path className="oi-outline" />
      </clipPath>
    </defs>
    <path className="oi-outline" fill="#fff" filter="url(#oi-card-shadow)" />
    <path
      className="oi-outline"
      fill="none"
      stroke="#d7ddea"
      strokeWidth="2"
      clipPath={`url(#${clipId})`}
    />
  </svg>
);

const Corner = ({ position }: { position: 'tr' | 'br' | 'tl' | 'bl' }) => {
  const asset = position.endsWith('r') ? 'corner-right' : 'corner-left';
  return (
    <span className={`oi-corner oi-corner-${position}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/images/models-page/${asset}.svg`} alt="" />
      <span className="oi-corner-active" />
    </span>
  );
};

export type ModelIllustrationSceneProps = {
  modelName: string;
  question: string;
  /** Probability of Yes, 0–100. */
  probability: number;
  /** The middle card: its label and the lines under it (each line stays unbroken). */
  toolLabel: string;
  toolLines: string[];
  /** The model's silhouette and lines. Default: the cloud. */
  modelShape?: ModelShape;
  /**
   * Where the connectors meet the model, as offsets from its centre; pass a module-level
   * constant. Default: the cloud's.
   */
  modelAnchors?: { in: Point; out: Point };
  /** The name under the model. */
  showModelName?: boolean;
  className?: string;
};

/**
 * The animated hero scene. Renders its final layout on the server; the animation
 * (`common-util/model-illustration.ts`) takes over after mount and is torn down on
 * unmount. Single instance per page — the SVG filter/gradient ids are fixed.
 */
export const ModelIllustrationScene = ({
  modelName,
  question,
  probability,
  toolLabel,
  toolLines,
  modelShape,
  modelAnchors,
  showModelName = true,
  className,
}: ModelIllustrationSceneProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { dispose } = initModelIllustration(rootRef.current, {
      probability,
      shape: modelShape,
      modelIn: modelAnchors?.in,
      modelOut: modelAnchors?.out,
    });
    return dispose;
  }, [probability, modelShape, modelAnchors]);

  return (
    <div ref={rootRef} className={cn('oi-root', className)}>
      <div className="oi-scene" role="group" aria-label={`${modelName} example forecast`}>
        <CardShadowFilter />
        <Routes />

        <div className="oi-card oi-question">
          <CardShape clipId="oi-question-clip" />
          <div className="oi-label">Question</div>
          <p>
            {/* One span per word so the entrance can stagger them. */}
            {question.split(' ').map((word, index) => (
              <Fragment key={`${index}-${word}`}>
                {index > 0 && ' '}
                <span className="oi-word">{word}</span>
              </Fragment>
            ))}
          </p>
        </div>

        <div className="oi-model-space">
          <div className="oi-tool-head">
            <Corner position="tr" />
            <Corner position="br" />
            <Corner position="tl" />
            <Corner position="bl" />
            <div className="oi-label">{toolLabel}</div>
            <div className="oi-tool-id">
              {toolLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          </div>
          <div className="oi-model" role="img" aria-label={`Animated ${modelName} model`}>
            <canvas aria-hidden="true" />
            {showModelName && <span className="oi-model-name">{modelName}</span>}
          </div>
        </div>

        <div className="oi-card oi-forecast">
          <CardShape clipId="oi-forecast-clip" />
          <div className="oi-result">
            <div className="oi-label">Forecast</div>
            <div className="oi-values">
              <strong>{probability}%</strong>
              <span>Probability of Yes</span>
            </div>
          </div>
          <div
            className="oi-bar"
            aria-hidden="true"
            style={{ '--oi-fill': `${probability}%` } as React.CSSProperties}
          >
            <div className="oi-bar-glow" />
            <span />
          </div>
        </div>

        <div className="oi-sr" role="status" aria-live="polite" />
      </div>
    </div>
  );
};

export const ModelIllustration = () => (
  <ModelIllustrationScene
    modelName={MODEL_NAME}
    question={QUESTION}
    probability={PROBABILITY}
    toolLabel="Prediction tool"
    toolLines={TOOL_ID}
  />
);
