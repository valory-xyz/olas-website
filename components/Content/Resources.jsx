import Resource from "./Resource";
import resources from "@/data/resources.json";
import Link from "next/link";

const Resources = ({ limit = null }) => {
  const sortedResources = resources.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  return (
    <section>
      <div>
        <div>
        <h2 className="mb-4 text-3xl md:text-5xl lg:text-4xl tracking-tight font-extrabold text-gray-900 ">
            Resources
          </h2>
          {limit !== null && (
            <div className="mb-4">
              <Link
                href="/resources"
                className="text-xl md:text-2xl text-primary hover:text-primary-800 transition-colors duration-300"
              >
                See all ▶
              </Link>
            </div>
          )}
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {(limit ? resources.slice(0, limit) : resources).map((resource) => (
            <div key={resource.platform_link}>
              <Resource resource={resource} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;
