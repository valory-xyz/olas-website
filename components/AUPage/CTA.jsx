import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { CalendarIcon, MapPin } from 'lucide-react';
import Image from 'next/image';

const list = [
  {
    title: 'Agents Unleashed Bangkok + The Humans Unleashed Party',
    imageSrc: 'AU-bangkok.png',
    location: 'Bangkok, DevCon',
    date: "Nov 13 '24",
    eventLink: 'https://lu.ma/tdjehba6',
  },
  {
    title: 'Night at the Museum',
    imageSrc: 'night-at-museum.png',
    location: 'Singapore, Token2049',
    date: "Sep 20 '24",
    eventLink: 'https://lu.ma/nrupygoy',
    replayLink:
      'https://www.youtube.com/playlist?list=PLoP4p0r-X94pSt15zMdj4kT0uJgvWaaxe',
  },
  {
    title: 'Supercharging AI Agent Economies',
    imageSrc: 'supercharging-AI-economies.png',
    location: 'Brussels, ETHCC',
    date: "Jul 10 '24",
    eventLink: 'https://lu.ma/osid96jj',
    replayLink:
      'https://www.youtube.com/playlist?list=PLoP4p0r-X94pjWZMuBfXHe5JxRntoo5qF',
  },
  {
    title: 'San Francisco Taco Tuesday',
    imageSrc: 'taco-tuesday.png',
    location: 'San Francisco, GenAI Summit',
    date: "Jun 4 '24",
    eventLink: 'https://lu.ma/9m98xeqx',
    replayLink:
      'https://www.youtube.com/playlist?list=PLoP4p0r-X94rjJfnE00eA_wskInUO2HBj',
  },
  {
    title: 'Olas Product Launch Party',
    imageSrc: 'olas-launch-party.png',
    location: 'Berlin, Berlin Blockchain Week',
    date: "May 21 '24",
    eventLink: 'https://lu.ma/ezds98r7',
    replayLink:
      'https://www.youtube.com/playlist?list=PLoP4p0r-X94o19y92OSZlv5nbk4fO1QVV',
  },
  {
    title: 'Supercharging the Decentralized AI Stack',
    imageSrc: 'ai-stack.png',
    location: 'Denver, ETHDenver',
    date: "Mar 1 '24",
    eventLink: 'https://tokenproof.xyz/event/agentsunleashed',
    replayLink:
      'https://www.youtube.com/playlist?list=PLoP4p0r-X94pSEkgAQt13y98oVpkB3uyb',
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
  <SectionWrapper
    backgroundType="NONE"
    customStyle={{
      background: 'linear-gradient(180deg, #F8F9FC 100%, #E7EAF4 100%)',
    }}
  >
    <div className="xl:mx-[300px]">
      <h2 className={`${SUB_HEADER_CLASS} mt-24 mb-12 text-center`}>
        Catch the next event or catch up on previous talks
      </h2>

      <div className="grid grid-cols-1 gap-6 max-w-[700px] mx-auto">
        {list.map(
          (
            { title, imageSrc, location, date, eventLink, replayLink },
            index,
          ) => {
            let card_classNames = replayLink
              ? 'bg-white border-inherit'
              : 'bg-none border-purple-300';
            let card_style = replayLink
              ? {}
              : {
                  background:
                    'linear-gradient(90deg, rgba(52, 170, 255, 0.1), rgba(255, 51, 231, 0.1))',
                };
            let text = replayLink ? 'text-slate-500' : '';
            let icons = replayLink ? '' : 'text-purple-600';

            return (
              <Card
                key={index}
                className={`${card_classNames} shadow-sm flex flex-row justify-between p-4`}
                style={card_style}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="md:hidden mx-auto">
                    <CardImage src={imageSrc} />
                  </div>

                  <div
                    className={`flex flex-row gap-4 ${text} max-sm:flex-col align-middle`}
                  >
                    {!replayLink && (
                      <div className="max-sm:mt-2 rounded-xl bg-gradient-to-r from-[#34AAFF] to-[#FF33E7] text-white p-1 max-w-fit">
                        Upcoming
                      </div>
                    )}

                    <span className="flex">
                      <MapPin className={`mr-2 w-[20px] ${icons}`} />
                      {location}
                    </span>
                    <span className="flex">
                      <CalendarIcon className={`mr-2 w-[20px] ${icons}`} />
                      {date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold max-w-[450px]">{title}</h3>
                  <div className="flex flex-row gap-6 text-purple-600 mt-auto">
                    <a href={eventLink}>Event page ↗</a>
                    {replayLink ? (
                      <a href={replayLink}>Watch talk replay ↗</a>
                    ) : (
                      <span className="italic text-slate-500">
                        Talk replay coming soon...
                      </span>
                    )}
                  </div>
                </div>
                <div className="max-sm:hidden">
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