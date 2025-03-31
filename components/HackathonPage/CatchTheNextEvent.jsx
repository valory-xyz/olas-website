import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { CalendarIcon, MapPin } from 'lucide-react';
import Image from 'next/image';

const list = [
  {
    title: 'Imperial College AI Agents Hackathon',
    imageSrc: 'imperial-college.png',
    location: 'London, UK + Remote',
    date: 'March - April 2025',
    link: 'https://lu.ma/aeumfimb',
    type: 'button',
    status: 'Ongoing',
    prizePool: '15,000 USD',
    projectTags: [
      'Mech Marketplace - Demand Side',
      'Mech Marketplace - Supply Side',
      'Agent Integration via Olas SDK',
      'Build an Agent Using the Olas Stack',
    ],
  },
  {
    title: 'ETHDenver Hackathon',
    imageSrc: 'ethdenver.png',
    location: 'Denver, USA',
    date: 'February 2025',
    link: 'https://ethdenver2025.devfolio.co/overview',
    type: 'external-link',
    status: 'Completed',
    prizePool: '25,000 USD',
    projectTags: [
      'Mech Marketplace - Demand Side',
      'Mech Marketplace - Supply Side',
      'Agent Integration via Olas SDK',
    ],
  },
  {
    title: 'Safe Hackathon',
    imageSrc: 'safe.png',
    location: 'Remote',
    date: 'February 2025',
    status: 'Completed',
    projectTags: [
      'Mech Marketplace - Demand Side',
      'Mech Marketplace - Supply Side',
      'Agent Integration via Olas SDK',
    ],
  },
  {
    title: 'Prediction Agent Hackathon: Coding Clarevoyance',
    imageSrc: 'prediction-agent.png',
    location: 'Remote',
    date: 'October 2023',
    status: 'Completed',
    projectTags: [
      'Build an Agent Using the Olas Stack',
      'Modify an Agent Using the Olas Stack',
    ],
  },
];

const CardImage = ({ src }) => (
  <Image
    src={`/images/hackathon-page/${src}`}
    alt="Agents Unleashed"
    width={160}
    height={160}
    className="rounded-lg"
  />
);

const EventDetails = ({ location, date }) => (
  <div className="flex flex-col md:flex-row gap-2 md:gap-8">
    <span className="flex">
      <MapPin className={`mr-2 w-[20px] text-purple-700`} />
      {location}
    </span>
    <span className="flex">
      <CalendarIcon className={`mr-2 w-[20px] text-purple-700`} />
      {date}
    </span>
  </div>
);

const ProjectTypes = ({ projectTags }) => (
  <div className="flex flex-col gap-2 cursor-default">
    <span className="text-slate-500 font-medium">Project types</span>
    <div className="flex gap-1 w-full flex-wrap">
      {projectTags.map((tag) => (
        <div
          key={tag}
          className="flex border border-slate-200 bg-slate-100 rounded-md md:whitespace-nowrap px-2 w-fit hover:bg-slate-200 duration-150"
        >
          {tag}
        </div>
      ))}
    </div>
  </div>
);

const EventLink = ({ link, type }) => (
  <div className="p-6 border-t-1.5 flex justify-center w-full">
    {type == 'button' && (
      <Button variant="default" size="lg" asChild>
        <a href={link} target="_blank" rel="noopenner noreferrer">
          Register Now
        </a>
      </Button>
    )}
    {type == 'external-link' && (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-700"
      >
        Hackathon results ↗
      </a>
    )}
  </div>
);

export const CatchTheNextEvent = () => (
  <SectionWrapper
    id="events"
    backgroundType="NONE"
    customStyle={{
      background: 'linear-gradient(180deg, #F8F9FC 100%, #E7EAF4 100%)',
    }}
  >
    <div>
      <h2 className={`${SUB_HEADER_CLASS} mb-12 text-center mx-auto`}>
        Catch the Next Event
      </h2>

      <div className="grid grid-cols-1 gap-6 max-w-[640px] lg:w-[640px] mx-auto">
        {list.map(
          (
            {
              title,
              imageSrc,
              location,
              date,
              link,
              type,
              status,
              prizePool,
              projectTags,
            },
            index,
          ) => {
            const statusClass =
              status == 'Completed'
                ? 'border-slate-200 bg-slate-100'
                : 'bg-purple-50 border-fuchsia-200 text-purple-700';

            return (
              <Card
                key={index}
                className="bg-white border-inherit shadow-sm flex flex-col justify-between rounded-xl"
              >
                <div className="p-6">
                  <div className="flex flex-col gap-1 w-full cursor-default">
                    <div className="md:hidden mx-auto">
                      <CardImage src={imageSrc} />
                    </div>
                    <div className="flex flex-row md:justify-between mb-2">
                      <div className="flex flex-col gap-4 align-middle max-w-[400px]">
                        <div
                          className={`max-sm:mt-2 rounded-md border py-1 px-2 max-w-fit max-sm:mx-auto ${statusClass}`}
                        >
                          {status}
                        </div>

                        <EventDetails location={location} date={date} />

                        <h3 className="text-2xl font-bold max-w-[500px]">
                          {title}
                        </h3>
                        {prizePool && (
                          <div className="flex flex-col gap-1 ">
                            <span className="text-slate-500 font-medium">
                              Prize Pool
                            </span>
                            <span className="text-black text-xl font-bold">
                              {prizePool}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="max-sm:hidden">
                        <CardImage src={imageSrc} />
                      </div>
                    </div>
                  </div>
                  {projectTags && <ProjectTypes projectTags={projectTags} />}
                </div>
                {link && <EventLink link={link} type={type} />}
              </Card>
            );
          },
        )}
      </div>
    </div>
  </SectionWrapper>
);
