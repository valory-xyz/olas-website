import { SCREEN_WIDTH_XL, TITLE_CLASS } from 'common-util/classes';
import { DaaSeriesPoint } from 'common-util/explorer';
import { DaaActivityHeatmap } from 'components/ExplorerPage/DaaActivityHeatmap';

type ExplorerProps = {
  omenstratDaa: DaaSeriesPoint[];
};

const Explorer = ({ omenstratDaa }: ExplorerProps) => (
  <>
    <div className="p-14 border-b-1.5 text-center">
      <h1 className={TITLE_CLASS}>Explore agent-economy activity over time</h1>
      <p className="text-lg text-gray-500 max-w-2xl mx-auto">
        A visual, time-aware view of agent-economy activity across the Olas ecosystem.
      </p>
    </div>

    <div className={`${SCREEN_WIDTH_XL} gap-8 px-4 py-12`}>
      <DaaActivityHeatmap series={omenstratDaa} title="Omenstrat Daily Active Agents" />
    </div>
  </>
);

export default Explorer;
