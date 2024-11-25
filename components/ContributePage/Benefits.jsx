import PropTypes from 'prop-types';

const benefits = [
  {
    id: 'f1bec8d4-d16f-4ae5-b8bc-1e3b4fdc7ae7',
    title: 'Control',
    icon: '🕹️',
    description: 'Directly influence the direction of the network.',
  },
  {
    id: '36a7ce0e-035e-47ce-9e68-701773300ba9',
    title: 'Recognition',
    icon: '🌟',
    description: 'Earn points and build your reputation in the community.',
  },
  {
    id: 'd0acb20a-e87e-49af-b363-4ccf509b34b5',
    title: 'Fun',
    icon: '🎉',
    description:
      'Simply take action and enjoy the points roll in. Everything else is taken care of by AI automation and the Olas Stack.',
  },
];

const Benefit = ({ benefit }) => (
  <div className="rounded-xl border border-purple-700 p-8 ">
    <div className="text-5xl">{benefit.icon}</div>

    <h2 className="mt-4 text-2xl font-bold text-white">{benefit.title}</h2>

    <p className="mt-1 text-md text-purple-300">{benefit.description}</p>
  </div>
);

Benefit.propTypes = {
  benefit: PropTypes.shape({
    description: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};

const Benefits = () => (
  <section className="bg-purple-950 text-white py-10">
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-4xl">
          Your shortcut to
          <br />
          making an impact
        </h1>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <Benefit key={benefit.id} benefit={benefit} />
        ))}
      </div>
    </div>
  </section>
);

export default Benefits;
