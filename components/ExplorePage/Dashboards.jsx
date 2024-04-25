import SectionWrapper from 'components/Layout/SectionWrapper';

const resources = [
  {
    id: '209bc10a-c797-46cd-a94b-1876dca24fce',
    title: 'Ecosystem Activity',
    url: 'https://dune.com/adrian0x/autonolas-ecosystem-activity',
  },
  {
    id: 'f48a1ee0-d19c-11ee-9e5c-f9b4f0d6e638',
    title: 'OLAS',
    url: 'https://dune.com/adrian0x/olas',
  },
  {
    id: '12aad400-d19d-11ee-9e5c-f9b4f0d6e638',
    title: 'Staking',
    url: 'https://dune.com/pi_/staker-expeditions',
  },
];

const Dashboards = () => (
  <SectionWrapper id="chains" customClasses="px-8 max-w-screen-xl w-full mx-auto">
    <h3 className="text-4xl font-bold mb-2">
      Chains
    </h3>

    <p className="mt-4 text-xl font-light md:text-3xl lg:text-xl text-gray-600 max-w-[700px] mb-6">
      Olas Protocol is available on a growing list of chains. When Olas
      Protocol is deployed on a chain, it brings the power of Olas to
      that chain&apos;s ecosystem.
    </p>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {resources.map((resource) => (
        <a
          className="block rounded-xl border border-gray-300 shadow-sm hover:border-gray-300 hover:shadow-lg focus:outline-none focus:ring w-full h-[245px] flex items-center justify-center text-center"
          target="_blank"
          rel="noopener noreferrer"
          href={resource.url}
          key={resource.id}
        >
          <span className="text-2xl font-semibold max-w-[160px]">{resource.title}</span>
        </a>
      ))}
    </div>
  </SectionWrapper>
);

export default Dashboards;
