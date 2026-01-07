import { Accordion } from 'common-util/Accordion';
import { HEADER_LARGE_CLASS, TEXT_LARGE_CLASS } from 'common-util/classes';
import Markdown from 'common-util/Markdown';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import timeline from 'data/timeline.json';
import { ChevronUp } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const categories = [
  {
    name: 'Products',
    items: ['Pearl', 'Marketplace'],
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

const Categories = ({ filters, toggleFilters }) => {
  return (
    <SectionWrapper id="categories">
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
                {category.items.map((item) => {
                  const isSelected = filters.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => toggleFilters(item)}
                      className={`px-3 py-1 rounded-2xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-white border border-purple-700 text-purple-700'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </SectionWrapper>
  );
};

const Timeline = ({ filters, setFilters }) => {
  const filteredTimeline = useMemo(() => {
    return timeline
      .map((item) => ({
        ...item,
        quarters: item.quarters
          .map((quarter) => ({
            ...quarter,
            topics: quarter.topics.filter((topic) => {
              return (
                filters.length === 0 ||
                filters.some((filter) => topic.category.includes(filter))
              );
            }),
          }))
          .filter((quarter) => quarter.topics.length > 0),
      }))
      .filter((item) => item.quarters.length > 0);
  }, [filters]);

  return (
    <SectionWrapper customClasses="pt-0 py-12">
      <div className="max-w-[872px] mx-auto max-lg:mx-4">
        {filters.length > 0 && (
          <div className="justify-end flex flex-row place-items-center mb-10 gap-4">
            <div>
              {filters.length} filter{`${filters.length === 1 ? '' : 's'}`}{' '}
              applied.
            </div>
            <Button
              variant="outline"
              className="px-1"
              onClick={() => setFilters([])}
            >
              Reset all
            </Button>
          </div>
        )}
        {filteredTimeline.map((item, index) => (
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
                <div
                  id={`${item.year}-${quarter.quarter}`}
                  key={`quarter ${index}`}
                  className="mb-14"
                >
                  <div className="w-full justify-between bg-slate-100 rounded-lg flex flex-row place-items-center px-6 py-4 mb-4">
                    <h4 className={`${TEXT_LARGE_CLASS} font-bold`}>
                      {quarter.quarter}
                    </h4>
                    <p className="text-slate-600">{quarter.date || '???'}</p>
                  </div>
                  <div className="flex flex-col">
                    {quarter.topics.map((topic) => (
                      // @ts-expect-error TS(2322) FIXME: Type '{ topic: string; content: string; category: ... Remove this comment to see the full error message
                      <div key={topic} className="px-6 py-4 border-b-1.5">
                        <Accordion
                          titleClass="bg-white px-0 py-0 flex flex-row justify-between w-full"
                          dropdownClass="border-none"
                          // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
                          label={<Markdown>{topic.topic}</Markdown>}
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

const ScrollUpButton = () => {
  const scrollToTop = useCallback(() => {
    const element = document.getElementById('categories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={scrollToTop}
        className="bg-slate-100 hover:bg-slate-200 p-3 rounded-full cursor-pointer transition-colors"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export const Content = () => {
  const [filters, setFilters] = useState([]);

  const toggleFilters = useCallback((label) => {
    setFilters((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label],
    );
  }, []);

  return (
    <>
      <Categories filters={filters} toggleFilters={toggleFilters} />
      <Timeline filters={filters} setFilters={setFilters} />
      <ScrollUpButton />
    </>
  );
};
