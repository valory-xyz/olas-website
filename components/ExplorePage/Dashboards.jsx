import SectionWrapper from 'components/Layout/SectionWrapper';

export const Dashboards = () => (
  <SectionWrapper
    id="dashboards"
    customClasses="px-8 max-w-screen-xl w-full mx-auto"
  >
    <h3 className="text-4xl font-bold mb-8">Olas Ecosystem Data</h3>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <a
        className="rounded-xl border border-gray-300 shadow-sm hover:border-gray-300 hover:shadow-lg focus:outline-none focus:ring w-full h-[245px] flex items-center justify-center text-center"
        target="_blank"
        rel="noopener noreferrer"
        href="https://flipsidecrypto.xyz/flipsideteam/olas-key-activity-metrics-pnPjda"
      >
        <span className="flex flex-col text-2xl font-semibold">
          <span>Olas: Key Activity Metrics</span>
          <span>By Flipside</span>
        </span>
      </a>
    </div>
  </SectionWrapper>
);
