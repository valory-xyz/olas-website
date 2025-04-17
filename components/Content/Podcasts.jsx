import PropTypes from 'prop-types';

import { VideoPropTypes } from 'common-util/propTypes';
import { Spinner } from 'components/Spinner';
import Image from 'next/image';

import {
  CARD_CLASS,
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
} from 'common-util/classes';
import { formatDate } from 'common-util/formatDate';
import { useFetchVideos } from 'common-util/useFetchApi';
import { Button } from 'components/ui/button';
import { ExternalLink } from 'components/ui/typography';
import { AudioLines } from 'lucide-react';

const LIMIT = 3;

const Podcast = ({ podcast }) => {
  const watchLink =
    podcast.platform_link || podcast.drive_link || podcast.video_url;

  const links = [
    {
      label: 'Apple Podcasts',
      url: podcast.apple_link,
      imgSrc: 'apple-podcast.svg',
    },
    { label: 'Spotify', url: podcast.spotify_link, imgSrc: 'spotify.svg' },
    { label: 'RSS.com', url: podcast.rss_link, imgSrc: 'rss.svg' },
  ];

  return (
    <div
      className={`${CARD_CLASS} max-w-full h-full overflow-hidden min-h-[300px] `}
    >
      {podcast.imageFilename && (
        <Image
          src={`${podcast.imageFilename}`}
          alt={podcast.title}
          width={750}
          height={200}
          className="rounded-t-lg"
        />
      )}
      <div className="p-6 flex flex-col gap-2 h-full">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 truncate whitespace-normal">
          {podcast.title}
        </h2>
        <div className="text-gray-500 mb-2">
          <span className="text-sm md:text-xl lg:text-sm">
            {formatDate(podcast.date)}
          </span>
        </div>
        {watchLink && (
          <Button variant="outline" className="py-2 mt-auto mb-2">
            <a
              href={watchLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row gap-1"
            >
              <Image
                src="/images/au-page/yt-icon.svg"
                alt="watch"
                width={20}
                height={20}
              />
              Watch
            </a>
          </Button>
        )}
        <div className="flex flex-row flex-wrap gap-2 mt-auto">
          {links
            .filter((link) => link.url)
            .map((link, index) => (
              <Button key={index} variant="outline" className="flex gap-1 px-1">
                <Image
                  src={`/images/au-page/${link.imgSrc}`}
                  alt={link.label}
                  width={16}
                  height={16}
                />
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

Podcast.propTypes = {
  podcast: VideoPropTypes.isRequired,
};

export const Podcasts = () => {
  const { videos: podcasts, isLoading } = useFetchVideos({
    limit: LIMIT,
    isPodcast: true,
  });

  return (
    <section className={`max-w-7xl mx-auto ${SECTION_BOX_CLASS}`}>
      <div>
        <div className="flex flex-col gap-6">
          <h2 className={SUB_HEADER_CLASS}>Watch the Latest Podcasts</h2>

          {LIMIT !== null && podcasts.length > 0 && (
            <ExternalLink
              href="https://youtube.com/playlist?list=PLoP4p0r-X94r1FA7yoOwRqvOjiYGSNQoj&feature=shared"
              className="text-lg"
            >
              See all
            </ExternalLink>
          )}
        </div>

        {isLoading ? (
          <Spinner customClass="h-auto py-20" />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {podcasts.length === 0 && (
              <div className="rounded-lg col-span-full place-items-center text-center border py-16 text-slate-500">
                <AudioLines className="mb-2" size={40} /> Agents Unleashed
                podcasts coming soon.
              </div>
            )}
            {podcasts.map((podcast) => (
              <div key={podcast.id}>
                <Podcast podcast={podcast} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

Podcasts.propTypes = {
  isLoading: PropTypes.bool,
  podcasts: PropTypes.arrayOf(VideoPropTypes),
  limit: PropTypes.number,
};

Podcasts.defaultProps = {
  isLoading: true,
  podcasts: [],
  limit: null,
};
