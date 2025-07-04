import { SUB_HEADER_CLASS } from 'common-util/classes';
import { X_OLAS_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { CalendarIcon, MapPin } from 'lucide-react';
import Image from 'next/image';

const list = [
  {
    title: 'EthCC Cannes 🇫🇷',
    imageSrc: 'EthCC-Cannes.png',
    location: 'Cannes',
    date: "Jun 30 '25",
    eventLink: 'https://lu.ma/tp6rhykz',
  },
  {
    title: 'Builders Night',
    imageSrc: 'AU-ETHDenver.png',
    location: 'Denver, ETHDenver',
    date: "Mar 1 '25",
    eventLink: 'https://lu.ma/7ulasmk8',
    replayLink:
      'https://www.youtube.com/playlist?list=PLoP4p0r-X94q7eRSr-tr79asIfBIqMRtN',
  },
  {
    title: 'Agents Unleashed Bangkok + The Humans Unleashed Party',
    imageSrc: 'AU-bangkok.png',
    location: 'Bangkok, DevCon',
    date: "Nov 13 '24",
    eventLink: 'https://lu.ma/tdjehba6',
    replayLink:
      'https://www.youtube.com/watch?v=65P2B8xmyac&list=PLoP4p0r-X94pHCR8ARMw014ykrIEWuCok',
  },
  {
    title: 'Night at the Museum',
    imageSrc: 'night-at-museum.png',
    location: 'Singapore, Token2049',
    date: "Sep 20 '24",
    eventLink: 'https://lu.ma/nrupygoy',
    replayLink:
      'https://www.youtube.com/watch?v=xrPngzB67sE&list=PLoP4p0r-X94pSt15zMdj4kT0uJgvWaaxe',
  },
  {
    title: 'Supercharging AI Agent Economies',
    imageSrc: 'supercharging-AI-economies.png',
    location: 'Brussels, ETHCC',
    date: "Jul 10 '24",
    eventLink: 'https://lu.ma/osid96jj',
    replayLink:
      'https://www.youtube.com/watch?v=yDbPSDgGpsM&list=PLoP4p0r-X94pjWZMuBfXHe5JxRntoo5qF',
  },
  {
    title: 'San Francisco Taco Tuesday',
    imageSrc: 'taco-tuesday.png',
    location: 'San Francisco, GenAI Summit',
    date: "Jun 4 '24",
    eventLink: 'https://lu.ma/9m98xeqx',
    replayLink:
      'https://www.youtube.com/watch?v=BoIoXMpOpEY&list=PLoP4p0r-X94rjJfnE00eA_wskInUO2HBj',
  },
  {
    title: 'Olas Product Launch Party',
    imageSrc: 'olas-launch-party.png',
    location: 'Berlin, Berlin Blockchain Week',
    date: "May 21 '24",
    eventLink: 'https://lu.ma/ezds98r7',
    replayLink:
      'https://www.youtube.com/watch?v=s7Nh86mo7AU&list=PLoP4p0r-X94o19y92OSZlv5nbk4fO1QVV',
  },
  {
    title: 'Supercharging the Decentralized AI Stack',
    imageSrc: 'ai-stack.png',
    location: 'Denver, ETHDenver',
    date: "Mar 1 '24",
    eventLink: `${X_OLAS_URL}/status/1754535517566431633`,
    replayLink:
      'https://www.youtube.com/watch?v=0_DkEF-r69s&list=PLoP4p0r-X94pSEkgAQt13y98oVpkB3uyb',
  },
];

const CardImage = ({ src }) => (
  <Image
    src={`/images/au-page/events/${src}`}
    alt="Agents Unleashed"
    width={160}
    height={160}
    className="rounded-lg"
  />
);

export const CTA = () => (
  <SectionWrapper id="events" backgroundType="GRAY">
    <div>
      <h2
        className={`${SUB_HEADER_CLASS} mb-12 text-center max-w-[700px] mx-auto`}
      >
        Catch the next event or catch up on previous talks
      </h2>

      <div className="grid grid-cols-1 gap-6 max-w-[800px] lg:w-[800px] mx-auto">
        {list.map(
          (
            { title, imageSrc, location, date, eventLink, replayLink },
            index,
          ) => {
            let cardClassNames = replayLink
              ? 'bg-white border-inherit'
              : 'bg-none border-purple-300';
            let cardStyle = replayLink
              ? {}
              : {
                  background:
                    'linear-gradient(90deg, rgba(52, 170, 255, 0.1), rgba(255, 51, 231, 0.1))',
                };
            let textClassName = replayLink ? 'text-slate-500' : '';
            let iconsClassName = replayLink ? '' : 'text-purple-600';

            return (
              <Card
                key={index}
                className={`${cardClassNames} shadow-sm flex flex-row justify-between p-4 rounded-xl`}
                style={cardStyle}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="md:hidden mx-auto">
                    <CardImage src={imageSrc} />
                  </div>

                  <div
                    className={`flex flex-row md:items-center max-sm:gap-2 gap-6 ${textClassName} max-sm:flex-col align-middle`}
                  >
                    {!replayLink && (
                      <div className="max-sm:mt-2 rounded-full bg-gradient-to-r from-[#34AAFF] to-[#FF33E7] text-white py-1 px-2 max-w-fit max-sm:mx-auto">
                        Upcoming
                      </div>
                    )}

                    <span className="flex max-sm:mt-2">
                      <MapPin className={`mr-2 w-[20px] ${iconsClassName}`} />
                      {location}
                    </span>
                    <span className="flex">
                      <CalendarIcon
                        className={`mr-2 w-[20px] ${iconsClassName}`}
                      />
                      {date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold max-w-[500px] my-4">
                    {title}
                  </h3>
                  <div className="flex flex-row max-sm:flex-col max-sm:gap-2 gap-6 text-purple-600 mt-auto max-sm:text-left">
                    <a
                      href={eventLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Event page ↗
                    </a>
                    {replayLink ? (
                      <a
                        href={replayLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Watch talk replay ↗
                      </a>
                    ) : (
                      <span className="italic text-slate-500">
                        Talk replay coming soon...
                      </span>
                    )}
                  </div>
                </div>
                <div className="hidden md:block">
                  <CardImage src={imageSrc} />
                </div>
              </Card>
            );
          },
        )}
      </div>
    </div>
  </SectionWrapper>
);
