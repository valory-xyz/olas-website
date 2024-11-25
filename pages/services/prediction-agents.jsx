import { OPERATE_AGENTS_URL } from 'common-util/constants';
import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import Meta from 'components/Meta';
import PredictionAgentsTable from 'components/PredictionAgentsTable';
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
import { ExternalLink, H1, Lead, Upcase } from 'components/ui/typography';
import Image from 'next/image';

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
    title: 'Olas Predict Benchmark',
    description:
      'Check out the Hugging Face dashboard for the best performing prediction Mech tools.',
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
      description="Run an agent designed to trade in prediction markets on your behalf. Predict the future, autonomously."
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
              href={OPERATE_AGENTS_URL}
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
          <ExternalLink
            key="1"
            href="https://github.com/valory-xyz/trader-quickstart?tab=readme-ov-file#system-requirements"
          >
            Get the requirements in place
          </ExternalLink>,
          <span key="2">
            Run the{' '}
            <ExternalLink href="https://github.com/valory-xyz/trader-quickstart">
              quickstart script
            </ExternalLink>{' '}
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
                  <CardDescription>{resource.description}</CardDescription>
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
      ctaUrl={OPERATE_AGENTS_URL}
      ctaText="Run an agent now"
    />
  </PageWrapper>
);

export default PredictionAgents;
