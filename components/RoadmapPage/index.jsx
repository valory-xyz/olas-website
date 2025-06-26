import { SECTION_BOX_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Tag } from 'components/ui/tag';
import { MMPearlDiagram } from './MMPearlDiagram';

export const Roadmap = () => (
  <SectionWrapper
    customClasses={`${SECTION_BOX_CLASS} max-sm:px-0 relative overflow-hidden border border-b-1.5`}
  >
    <div className="flex flex-col mx-auto relative">
      <div className="max-lg:hidden">
        <div className="roadmap-bg" aria-hidden="true" />
      </div>
      <div className="relative z-10 w-full">
        <SectionHeading other="text-center">Olas Roadmap</SectionHeading>
        <div className="flex flex-col place-items-center cursor-default pb-12">
          <Tag variant="primary" className="w-fit">
            Co-Owned AI
          </Tag>
          <span className="text-slate-500">=</span>
          <Tag variant="secondary">
            <p>
              <span className="text-purple-700 hover:text-purple-800">
                Crypto:
              </span>{' '}
              Own Your{' '}
              <span className="text-purple-700 hover:text-purple-800">
                Keys
              </span>
              , Own Your{' '}
              <span className="text-purple-700 hover:text-purple-800">
                Coins
              </span>
            </p>
          </Tag>
          <span className="text-slate-500">+</span>
          <Tag variant="secondary">
            <p>
              <span className="text-purple-700 hover:text-purple-800">AI:</span>{' '}
              Own Your{' '}
              <span className="text-purple-700 hover:text-purple-800">
                Weights
              </span>
              , Own Your{' '}
              <span className="text-purple-700 hover:text-purple-800">
                Brain
              </span>
            </p>
          </Tag>
          <span className="text-slate-500">+</span>
          <Tag variant="secondary">
            <p>
              <span className="text-purple-700 hover:text-purple-800">
                OSS:
              </span>{' '}
              Own Your{' '}
              <span className="text-purple-700 hover:text-purple-800">
                Code
              </span>
              , Own Your{' '}
              <span className="text-purple-700 hover:text-purple-800">
                Destiny
              </span>
            </p>
          </Tag>
        </div>
        <MMPearlDiagram />
      </div>
    </div>
  </SectionWrapper>
);
