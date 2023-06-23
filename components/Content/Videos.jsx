import Video from "./Video";
import videos from "@/data/videos.json";
import Link from "next/link";

const Videos = ({ limit = null }) => {
  const sortedVideos = videos.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  return (
    <section>
      <div>
        <div>
          <h2 className="mb-4 text-3xl md:text-5xl lg:text-4xl tracking-tight font-extrabold text-gray-900 ">
            Videos
          </h2>
          {limit !== null && (
            <div className="mb-4">
              <Link
                href="/videos"
                className="text-xl md:text-2xl text-primary hover:text-primary-800 transition-colors duration-300"
              >
                See all ▶
              </Link>
            </div>
          )}
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {(limit ? videos.slice(0, limit) : videos).map((video) => (
            <div key={video.platform_link}>
              <Video video={video} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Videos;
