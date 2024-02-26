const LIST = [
  {
    imageUrl: 'edge',
    heading: 'GET AN EDGE',
    subHeading:
      'Overcome the constraints of current developer tools, and get traction in an ocean of new opportunities.',
  },
  {
    imageUrl: 'pioneer',
    heading: 'BECOME A PIONEER',
    subHeading:
      'Get up to speed with our cutting-edge tech stack, and make a name driving autonomy forward.',
  },
  {
    imageUrl: 'business-model',
    heading: 'EXPLORE A NEW BUSINESS MODEL',
    subHeading:
      'Get the flexibility of open-source and the impact of entrepreneurship, all via a predictable on-chain protocol.',
  },
];

const WhyBuildOnOlas = () => (
  <div className="section bg-gray-100 py-10 p-4 rounded-lg" id="why-build-on-olas">
    <div className="header text-center" title="Why build on Olas?">
      <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-6">Why build on Olas?</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {LIST.map(({ imageUrl, heading, subHeading }, index) => (
        <div key={imageUrl} className={`flex flex-col items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white`}>
          <div className="w-24 h-24 mb-4">
            <img
              src={`/images/learn/6WhyBuildOnOlas/${imageUrl}.png`}
              alt={`${heading} Icon`}
            />
          </div>
          <div className="text-content">
            <span className="text-xl font-semibold mb-2">{heading}</span>
            <div className="sub-text">{subHeading}</div>
          </div>
        </div>
      ))}
    </div>

    <div className="divider" />
  </div>
);

export default WhyBuildOnOlas;
