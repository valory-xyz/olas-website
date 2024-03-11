import PropTypes from 'prop-types';
import Image from 'next/image';
import { TEXT } from 'styles/globals';

const NetworkApp = ({ networkApp }) => (
  <a href={networkApp.url} target="_blank" rel="noopener noreferrer">
    <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md min-h-max hover:shadow-xl">
      <div className="flex justify-between items-center">
        <div className="mx-auto mb-4">
          <Image
            src={`/images/network-apps/network-app-icon-${networkApp.name}.svg`}
            alt={networkApp.name}
            width="300"
            height="300"
            className="h-[150px] md:h-[300px] lg:h-[150px]"
          />
        </div>
      </div>
      <div className="min-h-[100px] md:min-h-[100px] lg:min-h-[100px]">
        <h2 className="mb-2 text-2xl md:text-4xl lg:text-2xl font-bold tracking-tight text-gray-900 ">
          {networkApp.name}
        </h2>
        <div className={TEXT}>{networkApp.description}</div>
      </div>
    </article>
  </a>
);

NetworkApp.propTypes = {
  networkApp: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

export default NetworkApp;
