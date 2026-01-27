import { SECTION_BOX_CLASS } from 'common-util/classes';
import { DOCS_BASE_URL } from 'common-util/constants';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import { Link, SubsiteLink } from 'components/ui/typography';

export const TechStacks = () => (
  <SectionWrapper backgroundType="NONE" customClasses={SECTION_BOX_CLASS} id="tech-stacks">
    <div className="max-w-[648px] mx-auto flex flex-col">
      <SectionHeading>Tech Stack for Building Olas Agents</SectionHeading>
      <p className="text-lg">
        Any agent that satisfies the <Link href="#unique-agents">above characteristics</Link> is an
        Olas agent. Developers can choose their preferred AI agent stack to implement their agent.
        Olas offers the <SubsiteLink href={DOCS_BASE_URL}>Olas Stack</SubsiteLink> which allows
        developers to build agents easily.
      </p>
    </div>
  </SectionWrapper>
);
