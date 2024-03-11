import PropTypes from 'prop-types';
import Link from 'next/link';
import networkApps from 'data/networkApps.json';
import NetworkApp from './NetworkApp';
import SectionWrapper from '../Layout/SectionWrapper';

const NetworkApps = ({ limit }) => (
  <SectionWrapper id="network-apps" backgroundType="NONE">
    <div>
      <div>
        <h2 className="mb-4 text-3xl md:text-5xl lg:text-4xl tracking-tight font-extrabold text-gray-900 ">
          Network Apps
        </h2>
        {limit !== null && (
        <div className="mb-4">
          <Link
            href="/network-apps"
            className="text-xl md:text-2xl text-primary hover:text-primary-800 transition-colors duration-300"
          >
            See all ▶
          </Link>
        </div>
        )}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        {(limit ? networkApps.slice(0, limit) : networkApps).map((networkApp) => (
          <div key={networkApp.platform_link}>
            <NetworkApp networkApp={networkApp} />
          </div>
        ))}
      </div>
    </div>
  </SectionWrapper>
);

NetworkApps.propTypes = { limit: PropTypes.number };
NetworkApps.defaultProps = { limit: null };

export default NetworkApps;
