import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Link from 'next/link';

export const PredictionMarkets = () => (
  <SectionWrapper>
    <div className="max-w-[650px] mx-auto flex flex-col gap-6">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="rounded-lg shadow-none mb-8"
      >
        <source
          src="/videos/prediction-agents-page/pred-agent.mp4"
          type="video/mp4"
        />
      </video>
      <h2 className={SUB_HEADER_CLASS}>
        Prediction Markets, Without the Manual Grind
      </h2>
      <p>
        A Prediction Agent is an autonomous AI agent that interacts with
        decentralized forecasting markets — platforms where users trade on the
        outcomes of future events. With the Prediction Agent, you don&apos;t
        need to manually browse markets or calculate odds. Your agent does all
        that — getting new markets, AI-powered predictions, placing bets, and
        even collecting rewards. You just run the agent. It does the rest —
        hands-free.
      </p>
      <p>
        Curious how it fits into a broader autonomous system? Learn more on the{' '}
        <Link href="/agent-economies/predict" className="text-purple-600">
          Predict Economy page.
        </Link>
      </p>
    </div>
  </SectionWrapper>
);
