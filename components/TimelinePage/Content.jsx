import { Accordion } from 'common-util/Accordion';
import { HEADER_LARGE_CLASS, TEXT_LARGE_CLASS } from 'common-util/classes';
import Markdown from 'common-util/Markdown';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import timeline from 'data/timeline.json';
import { useState } from 'react';

const categories = [
  {
    name: 'Products',
    items: ['Pearl', 'Mech Marketplace'],
  },
  {
    name: 'DAO',
    items: [
      'Tokenomics',
      'Operate',
      'Build',
      'Contribute',
      'Govern',
      'Launch',
      'Bond',
    ],
  },
  {
    name: 'Events',
    items: ['Agents Unleashed', 'Hackathons', 'Other events'],
  },
  {
    name: 'Growth',
    items: [
      'Key milestones',
      'Activity Metrics',
      'Media appearances',
      'Fundraising',
    ],
  },
];

const quarterRanges = {
  1: ['Jan', 'Mar'],
  2: ['Apr', 'Jun'],
  3: ['Jul', 'Sep'],
  4: ['Oct', 'Dec'],
};

function getQuarterLength(label) {
  const matches = label.match(/\d/g);
  if (!matches || matches.length === 0) return '???';

  const quarters = matches.map(Number).sort((a, b) => a - b);
  const start = quarterRanges[quarters[0]]?.[0];
  const end = quarterRanges[quarters[quarters.length - 1]]?.[1];

  return start && end ? `${start} - ${end}` : '???';
}

const Categories = ({ toggleFilters }) => (
  <SectionWrapper>
    <Card className="max-w-[856px] mx-auto p-8 border border-slate-200 outline outline-slate-100 outline-[8px] rounded-xl">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Categories</h2>
        {categories.map((category) => (
          <div
            key={category.name}
            className="w-full justify-start flex flex-col lg:flex-row lg:place-items-center"
          >
            <h3 className="font-semibold w-[100px] max-md:pb-4">
              {category.name}
            </h3>
            <div className="flex gap-2 flex-wrap">
              {category.items.map((item) => (
                <div
                  key={item}
                  onClick={() => toggleFilters(item)}
                  className="bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-2xl cursor-pointer"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  </SectionWrapper>
);

const Timeline = ({ filters, setFilters }) => {
  return (
    <SectionWrapper customClasses="pt-0 py-12">
      <div className="max-w-[872px] mx-auto max-lg:mx-4">
        <div className="justify-end flex flex-row place-items-center mb-10 gap-4">
          <div>{filters.length} filters applied.</div>
          <Button
            variant="outline"
            className="px-1"
            onClick={() => setFilters([])}
          >
            Reset all
          </Button>
        </div>
        {timeline.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-12 md:gap-[120px] w-full"
          >
            <h3
              className={`${HEADER_LARGE_CLASS} md:sticky top-[120px] h-fit max-md:text-center`}
            >
              {item.year}
            </h3>
            <div className="w-full flex flex-col">
              {item.quarters.map((quarter, index) => (
                <div key={`quarter ${index}`} className="mb-14">
                  <div className="w-full justify-between bg-slate-100 rounded-lg flex flex-row place-items-center px-6 py-4 mb-4">
                    <h4 className={`${TEXT_LARGE_CLASS} font-bold`}>
                      {quarter.quarter}
                    </h4>
                    <p className="text-slate-600">
                      {quarter.date || getQuarterLength(quarter.quarter)}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    {quarter.topics
                      .filter((topic) => {
                        return (
                          filters.length === 0 ||
                          filters.every((filter) =>
                            topic.category.includes(filter),
                          )
                        );
                      })
                      .map((topic) => (
                        <div key={topic} className="px-6 py-4 border-b-1.5">
                          <Accordion
                            titleClass="bg-white px-0 py-0 flex flex-row justify-between w-full"
                            dropdownClass="border-none"
                            label={topic.topic}
                            defaultOpen={false}
                          >
                            <Markdown>{topic.content}</Markdown>
                          </Accordion>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export const Content = () => {
  const [filters, setFilters] = useState([]);

  const toggleFilters = (label) => {
    setFilters((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label],
    );
  };

  return (
    <>
      <Categories toggleFilters={toggleFilters} />
      <Timeline filters={filters} setFilters={setFilters} />
    </>
  );
};
