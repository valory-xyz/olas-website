import { VALORY_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { ExternalLink } from 'components/ui/typography';
import AuSponsors from 'data/au-sponsors.json';
import Image from 'next/image';

const ACTUAL_BLOG_POST_URL = `${VALORY_URL}/post/co-owned-ai`;

const chunkArrays = (array, sizes) => {
  const result = [];
  let index = 0;

  const sizeArr = Array.isArray(sizes) ? sizes : [sizes];

  for (let size of sizeArr) {
    result.push(array.slice(index, index + size));
    index += size;
  }

  if (index < array.length) result.push(array.slice(index));
  return result;
};

const mediumRows = chunkArrays(AuSponsors[0].mediumIcons, 6);
const smallRows = chunkArrays(AuSponsors[0].smallIcons, [7, 6, 5]);

const Sponsors = () => (
  <div className="md:mx-auto max-w-[1000px] px-4 md:px-0">
    <div className="grid grid-cols-2 sm:grid-cols-3 max-md:gap-x-4 max-md:gap-y-8 gap-y-12 mb-12 lg:mb-20">
      {AuSponsors[0].largeIcons.map((icon, index) => {
        const { name, iconFileName, width, height } = icon;
        return (
          <div
            key={name}
            className={`grayscale flex items-center max-md:justify-center ${
              (index + 1) % 3 === 2 ? 'md:justify-self-center' : ''
            } ${(index + 1) % 3 === 0 ? 'md:justify-self-end' : ''}`}
          >
            <Image src={`/images/${iconFileName}`} alt={name} width={width} height={height} />
          </div>
        );
      })}
    </div>

    <div className="space-y-8 mb-12 lg:mb-20">
      {mediumRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap md:justify-between md:items-center gap-4 md:gap-0"
        >
          {row.map((icon) => {
            const { name, iconFileName, width, height } = icon;
            return (
              <div key={name} className="grayscale flex items-center justify-center md:mb-4">
                <Image src={`/images/${iconFileName}`} alt={name} width={width} height={height} />
              </div>
            );
          })}
        </div>
      ))}
    </div>

    <div className="space-y-8 mb-12 lg:mb-20">
      {smallRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap md:justify-between gap-4 md:gap-x-6 md:gap-y-4"
        >
          {row.map((icon) => {
            const { name, iconFileName, width, height } = icon;
            return (
              <div key={name} className="grayscale flex items-center justify-center">
                <Image src={`/images/${iconFileName}`} alt={name} width={width} height={height} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

export const Content = () => (
  <SectionWrapper>
    <Sponsors />
    <div className="max-w-[1000px] mx-auto px-4 md:px-0">
      <Image
        src={`/images/au-page/au-image.png`}
        alt="Agents Unleashed"
        width={1000}
        height={800}
        className="rounded-lg mx-auto mt-24 mb-8"
      />
      <p className="mb-4">
        &apos;Agents Unleashed&apos; showcases the latest developments in AI agents, a booming area
        at the intersection of crypto and AI. Its organizers believe that{' '}
        <a href={ACTUAL_BLOG_POST_URL} className="text-purple-600" target="_blank">
          Artificial General Intelligence will likely be agentic ↗
        </a>
        . Since AI agents won&apos;t be given bank accounts, crypto (aka the world of digital money)
        is AI agents&apos; natural home. It is unsurprising then, that some of the brightest minds
        in AI and in crypto are working on AI agents. Agents Unleashed is the place to learn about
        AI agents, whether you&apos;re in crypto and curious about AI or in AI, curious about
        crypto.
      </p>{' '}
      <div>
        The &apos;Agents Unleashed&apos; event series is hosted by Olas and coordinated by{' '}
        <ExternalLink href={VALORY_URL}>Valory</ExternalLink>. Both organizations were established
        in 2021, dedicated to leveraging AI agents to enable co-owned AI. They started Agents
        Unleashed as a way to bring together those working on agents to share best practices,
        innovations and common language, ultimately unleashing AI agents for the betterment of
        humanity.
      </div>
    </div>
  </SectionWrapper>
);
