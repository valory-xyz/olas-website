import NetworkApp from "./NetworkApp";
import networkApps from "@/data/networkApps.json";
import Link from "next/link";

const NetworkApps = ({ limit = null }) => {
  const sortedNetworkApps = networkApps.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  return (
    <section>
      <div>
        <div>
          <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Network Apps
          </h2>
          {limit !== null && (
            <div className="mb-4">
              <Link
                href="/network-apps"
                className="text-xl text-primary hover:text-primary-800 transition-colors duration-300"
              >
                See all ▶
              </Link>
            </div>
          )}
        </div>
        <div className="grid gap-8 lg:grid-cols-4">
          {(limit ? networkApps.slice(0, limit) : networkApps).map((networkApp) => (
            <div key={networkApp.platform_link}>
              <NetworkApp networkApp={networkApp} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NetworkApps;
