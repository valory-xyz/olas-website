import { MODEL_NAME } from 'components/ModelsPage/OlasPredictQwen/constants';
import { ModelIllustrationScene } from 'components/ModelsPage/OlasPredictR1/ModelIllustration';

/** Fixed illustration content: one of the example forecasts below, not a live forecast. */
const QUESTION = 'Will Catherine Trautmann be the next mayor of Strasbourg?';
const PROBABILITY = 60;
const EVIDENCE = ['Supplied in the prompt'];

/** The connectors enter the diamond at its top corner and leave from its right one. */
const MODEL_ANCHORS = { in: { x: -5, y: -64 }, out: { x: 70, y: 0 } };

/**
 * The 14B page's animated scene with this model's question and forecast. The model is drawn
 * by the same canvas code as the 14B cloud, in the shape of this model's logo: a diamond with
 * ten lines, since a bigger model gets more lines.
 */
export const ModelIllustration = () => (
  <ModelIllustrationScene
    className="oi-qwen"
    modelName={MODEL_NAME}
    question={QUESTION}
    probability={PROBABILITY}
    toolLabel="Evidence"
    toolLines={EVIDENCE}
    modelShape="diamond"
    showModelName={false}
    modelAnchors={MODEL_ANCHORS}
  />
);
