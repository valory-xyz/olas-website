import { SUB_HEADER_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Card } from 'components/ui/card';
import { ExternalLink } from 'components/ui/typography';
import { Info } from 'lucide-react';
import Link from 'next/link';

export const ProgramStructure = () => (
  <SectionWrapper customClasses="py-12 border-b-1.5">
    <div className="max-w-[720px] mx-auto flex flex-col gap-4">
      <h1 className={`${SUB_HEADER_CLASS} font-semibold mb-4`}>
        Program structure
      </h1>
      <div className="text-3xl font-semibold">Funding and milestones</div>
      <p>
        Each selected team can receive up to <strong>$100,000</strong> in
        milestone-based funding in addition to potential OLAS rewards:
      </p>
      <ul className="list-disc mb-2 ml-6">
        <li className="mb-2">
          <strong>$10,000</strong> on selection: for teams with the most
          promising agent concepts and detailed implementation plans.
        </li>
        <li className="mb-2">
          <strong>$40,000</strong> on delivering a new agent to Pearl users: The
          Agent MVP must be usable, meet integration requirements, and pass
          quality assurance checks.
        </li>
        <li className="mb-2">
          <strong>$10,000</strong> on achieving 100 users of this agent, this is
          measured as 100 Daily Active Agents per Olas Staking.{' '}
        </li>
        <li className="mb-2">
          <strong>$40,000</strong> on achieving 1000 users of this agent,
          measured as 1000 Daily Active Agents per Olas Staking.
        </li>
      </ul>
      <Card className="p-4 bg-slate-100 text-slate-500 flex flex-row gap-2 border-none">
        <div className="mb-auto">
          <Info size={20} />
        </div>
        <div className="flex flex-col">
          <div>
            On top of the USDC rewards contributed by{' '}
            <ExternalLink href="https://x.com/valoryag">@valoryag</ExternalLink>
            , teams who register their agent code in the Olas Protocol can
            receive Dev Rewards. Current developers earn thousands of OLAS in
            rewards each month for contributing agent code.
          </div>
          <Link href="/build" className="text-purple-600 mt-2">
            Learn more
          </Link>
        </div>
      </Card>
      <p>
        Optionally showcase your agent in the Agents Unleashed Denver Spotlight
        series, 6min presentation on what you&apos;re building.
      </p>
      <h1 className={`${SUB_HEADER_CLASS} font-semibold mb-4 mt-8`}>
        Application process
      </h1>
      <div>
        <ol className="list-decimal ml-6">
          <li>
            <div className="mb-2">
              <strong>
                Developers or teams apply by submitting a proposal to Valory
                that includes:
              </strong>
            </div>
            <ol className="list-[lower-alpha] ml-6">
              <li className="mb-2">
                The agent&apos;s purpose, core functionality, and target users.
              </li>
              <li className="mb-2">
                A technical implementation plan, highlighting integration with
                Pearl.
              </li>
              <li className="mb-2">
                An adoption strategy to achieve the 100 DAA user milestone.
              </li>
            </ol>
          </li>
          <li>
            <div className="mb-2">
              <strong>Proposals are reviewed based on:</strong>
            </div>
            <ol className="list-[lower-alpha] ml-6">
              <li className="mb-2">
                <strong>Potential:</strong> Creativity of the agent concept.
              </li>
              <li className="mb-2">
                <strong>Feasibility:</strong> Clarity and practicality of the
                implementation plan.
              </li>
              <li className="mb-2">
                <strong>Impact:</strong> Potential to drive adoption and enhance
                Pearl and the Olas ecosystem.
              </li>
            </ol>
          </li>
          <li>
            <div className="mb-2">
              <strong>
                Do you want to showcase your agent during the Agents Unleashed
                Denver Spotlight series?
              </strong>
            </div>
            <div>
              <ExternalLink href="https://forms.gle/UoSrHnAKYTzVPeTy7">
                Fill out the form
              </ExternalLink>
              .
            </div>
          </li>
        </ol>
      </div>
      <h1 className={`${SUB_HEADER_CLASS} font-semibold mb-4 mt-8`}>
        Development and support
      </h1>
      <div>
        Selected teams will enter a{' '}
        <strong>6-12 week self-paced development phase</strong> to build their
        MVPs.
      </div>
      <div>
        <strong>Valory will provide:</strong>
      </div>
      <ul className="list-disc ml-6">
        <li className="mb-2">Technical documentation, SDKs, and APIs.</li>
        <li className="mb-2">
          Dedicated developer support channels and workshops, as needed.
        </li>
        Marketing Support.
      </ul>
      <h1 className={`${SUB_HEADER_CLASS} font-semibold mb-4 mt-8`}>
        Adoption and performance phase
      </h1>
      <div>
        After delivering the MVP, teams focus on user acquisition to meet the
        DAA milestones.
      </div>
    </div>
  </SectionWrapper>
);
