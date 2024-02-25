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
  <div className="section bg-gray-100 py-10" id="why-build-on-olas">
    <div className="header text-center" title="Why build on Olas?">
      <h2>Why build on Olas?</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {LIST.map(({ imageUrl, heading, subHeading }, index) => (
        <div key={imageUrl} className={`column column-${index + 1}`}>
          <div className="img-container">
            <img
              src={`/images/learn/6WhyBuildOnOlas/${imageUrl}.png`}
              alt={`${heading} Icon`}
            />
          </div>
          <div className="text-content">
            <div className="header-text">{heading}</div>
            <div className="sub-text">{subHeading}</div>
          </div>
        </div>
      ))}
    </div>

    <div className="divider" />
  </div>
);

export default WhyBuildOnOlas;
