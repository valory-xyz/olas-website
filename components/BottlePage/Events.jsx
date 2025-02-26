import { SECTION_BOX_CLASS, SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { CalendarIcon, MapPin } from 'lucide-react';
import Image from 'next/image';

const eventsList = [
  {
    title: 'Open AGI Summit',
    date: 'Feb 26, 10:30 AM - 7:30 PM',
    imgSrc: 'open-agi.png',
    eventLink: 'https://lu.ma/asjsb6k7',
  },
  {
    title: 'Official ETHDenver AI Summit',
    date: 'Feb 27, 12:00 PM - 7:00 PM',
    imgSrc: 'ai-summit.png',
    eventLink: 'https://lu.ma/axnm4hts?tk=zbUIMt',
  },
  {
    title: 'D/Infra by 1kx',
    date: 'Feb 27, 9:30 AM - 6:00 PM',
    imgSrc: 'dinfra.png',
    eventLink: 'https://lu.ma/bwb6wqjl',
  },
  {
    title: 'AiFi Summit',
    date: 'Feb 28, 1:00 PM - 6:30 PM',
    imgSrc: 'aifi.png',
    eventLink: 'https://lu.ma/AiFiSummitDenver',
  },
  {
    title: 'Signals',
    date: 'Feb 28, 12:00 PM - 7:00 PM',
    imgSrc: 'signals.png',
    eventLink: 'https://lu.ma/c8mbzuqk',
  },
  {
    title: 'Agents Unleashed: Builders Night',
    location: 'Blanc',
    date: 'Mar 1, 6:00 PM - 10:00 PM',
    imgSrc: 'builders-night.png',
    eventLink: 'https://lu.ma/7ulasmk8',
  },
];

export const Events = () => (
  <SectionWrapper customClasses={`${SECTION_BOX_CLASS} border-b`}>
    <div className="max-w-[720px] mx-auto">
      <div className={`font-semibold text-center mb-12 ${SUB_HEADER_CLASS}`}>
        Grab your Olas reusable bottle and catch Olas at these events at ETH
        Denver:
      </div>
      <div className="grid grid-cols-1 gap-6 mx-auto">
        {eventsList.map(
          ({ title, date, imgSrc, location, eventLink }, index) => (
            <Card
              key={index}
              className="bg-white border-inherit shadow-sm flex flex-row justify-between p-4 rounded-xl"
            >
              <div className="flex flex-col md:flex-row md:gap-4 w-full">
                <Image
                  src={`/images/bottle/${imgSrc}`}
                  alt={title}
                  width={311}
                  height={240}
                  className="rounded-md md:w-[80px] md:aspect-square max-sm:w-full"
                />

                <div className="flex flex-col w-full h-full justify-between max-sm:px-4 max-sm:pt-6 max-sm:gap-4">
                  <div className="flex justify-between">
                    <div className="flex flex-row max-sm:gap-2 gap-6 max-sm:flex-col align-middle">
                      {location && (
                        <span className="flex max-sm:mt-2">
                          <MapPin className="mr-2 text-purple-700" size={20} />
                          <div>{location}</div>
                        </span>
                      )}
                      <span className="flex">
                        <CalendarIcon
                          className="mr-2 text-purple-700"
                          size={20}
                        />
                        {date}
                      </span>
                    </div>
                    <a
                      href={eventLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 max-sm:hidden"
                    >
                      Event page ↗
                    </a>
                  </div>

                  <h3 className="text-2xl font-bold md:mb-1 max-w-[500px]">
                    {title}
                  </h3>

                  <a
                    href={eventLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 md:hidden"
                  >
                    Event page ↗
                  </a>
                </div>
              </div>
            </Card>
          ),
        )}
      </div>
    </div>
  </SectionWrapper>
);
