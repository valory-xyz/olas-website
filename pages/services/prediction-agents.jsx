import Image from 'next/image';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';
import { Button } from 'components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'components/ui/card';
import { CTASection } from 'components/ui/section/cta';
import { HowToSection } from 'components/ui/section/how-to';
import PredictionAgentsTable from 'components/PredictionAgentsTable';
import {
  ExternalLink, H1, Lead, Upcase,
} from 'components/ui/typography';

const resources = [
  {
    title: 'Broader Prediction System',
    description:
      'Learn how prediction agents contribute to a broader prediction offering.',
    action: {
      url: 'https://hackathon.olas.network/system-overview',
      text: 'See system overview',
    },
  },
  {
    title: 'Trader',
    description:
      'Visit the trader agent repo to learn more about the full implementation.',
    action: {
      url: 'https://github.com/valory-xyz/trader',
      text: 'See the code',
    },
  },
  {
    title: 'HF dashboard',
    description:
      'Check out the leaderboard to see how your agent is performing.',
    action: {
      url: 'https://huggingface.co/spaces/valory/olas-prediction-leaderboard',
      text: 'See the leaderboard',
    },
  },
];

const PredictionAgents = () => (
  <PageWrapper>
    <Meta
      pageTitle="Prediction Agents"
      siteImageUrl="/images/services/prediction-agents.png"
    />
    <SectionWrapper>
      <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
          <div className="mb-4">
            <Upcase>Prediction Agents</Upcase>
          </div>
          <H1 className="mb-4">Predict the future, autonomously</H1>
          <Lead className="mb-8">
            Run an agent designed to trade in prediction markets on your behalf.
          </Lead>
          <Button size="xl" asChild>
            <a
              href="https://operate.olas.network"
              rel="noopener noreferrer"
              target="_blank"
            >
              Run an agent now
            </a>
          </Button>
        </div>
        <div className="lg:mt-0 lg:col-span-6 lg:flex">
          <Image
            src="/images/services/prediction-agents.png"
            alt="Prediction Agents"
            width={400}
            height={400}
            className="mx-auto rounded-lg"
          />
        </div>
      </div>
    </SectionWrapper>
    <HowToSection
      sectionId="how-to"
      heading="How it works"
      image={{
        path: '/images/services/how-to.png',
        width: 400,
        height: 400,
      }}
      body={{
        steps: [
          <ExternalLink href="https://github.com/valory-xyz/trader-quickstart?tab=readme-ov-file#system-requirements">
            Get the requirements in place
          </ExternalLink>,
          <span>
            Run the
            {' '}
            <ExternalLink href="https://github.com/valory-xyz/trader-quickstart">
              quickstart script
            </ExternalLink>
            {' '}
            - choose to participate in staking programs, if available
          </span>,
          'Tweak strategy to maximize earnings',
        ],
      }}
    />
    <SectionWrapper>
      <H1 className="text-center mb-12">What Prediction Agents do</H1>
      <PredictionAgentsTable />
    </SectionWrapper>
    <SectionWrapper>
      <div className="max-w-screen-lg mx-auto">
        <H1 className="text-center mb-12">Further resources</H1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource, index) => (
            <div key={index} className="mb-4 md:mb-0">
              <Card className="max-w-sm mx-auto">
                <CardHeader>
                  <CardTitle>{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="min-h-[86px]">{resource.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <a
                      href={resource.action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-800 transition-colors duration-300"
                    >
                      {resource.action.text}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
    <CTASection
      heading="Start predicting the future"
      ctaUrl="https://operate.olas.network"
      ctaText="Run an agent now"
    />
  </PageWrapper>
);

export default PredictionAgents;
