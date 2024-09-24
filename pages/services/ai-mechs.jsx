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
import PredictionAgentsTable from 'components/PredictionAgentsTable';
import { ExternalLink, H1, Lead, Upcase } from 'components/ui/typography';

const resources = [
  {
    title: 'Contribute a tool',
    description:
      'Contribute tools for existing Mechs and be eligible for rewards',
    actions: [
      {
        url: 'https://build.olas.network/paths/general-mechs-tool',
        text: 'See the build path',
      },
    ],
  },
  {
    title: 'Deploy your own Mechs',
    description: 'Construct your own marketplace for AI tools',
    actions: [
      {
        url: 'https://docs.autonolas.network/product/mechkit/',
        text: 'See the MechKit',
      },
    ],
  },
  {
    title: 'Learn More',
    description: 'Dive into the code',
    actions: [
      {
        url: 'https://github.com/valory-xyz/mech',
        text: 'See the github repo',
      },
    ],
  },
  {
    title: 'Press',
    actions: [
      {
        url: 'https://www.valory.xyz/post/nevermined-mechs-launch',
        text: 'Advancing AI Commerce with Mechs Integration',
      },
      {
        url: 'https://www.valory.xyz/post/mechs-nevermined',
        text: 'Mechs and Flexible Agent Payments',
      },
    ],
  },
];

const AiMechs = () => (
  <PageWrapper>
    <Meta pageTitle="Mechs" siteImageUrl="/images/services/ai-mechs.png" />
    <SectionWrapper>
      <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
          <div className="mb-4">
            <Upcase>Mechs</Upcase>
          </div>
          <H1 className="mb-4">The marketplace for AI tools</H1>
          <Lead className="mb-8">
            Outsource your agent&apos;s complex tasks and pay for them in
            crypto.
          </Lead>
          <div className="grid md:grid-cols-2 gap-8">
            <Button size="xl" asChild variant="default">
              <a href="#resourcesSection">Learn more</a>
            </Button>
            <Button size="xl" asChild variant="outline">
              <a href="#integrateMechsSection">Integrate Mechs</a>
            </Button>
          </div>
        </div>
        <div className="lg:mt-0 lg:col-span-6 lg:flex">
          <Image
            src="/images/services/ai-mechs.png"
            alt="Mechs"
            width={400}
            height={400}
            className="mx-auto rounded-lg"
          />
        </div>
      </div>
    </SectionWrapper>
    <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y">
      <div className="max-w-4xl xl:pr-12 xl:pl-0 lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left">
          <H1 className="mb-8">What are Mechs?</H1>
          <Lead className="mb-8">
            A mech is an autonomous service that listens for on-chain requests
            and performs the needed actions off-chain in exchange for a small
            payment. These requests are usually LLM requests (although they can
            be other generic jobs), and their metadata is stored on IPFS while
            its hash is written to a smart contract that also handles the
            payment. We can think of a mech as an on-demand brain for your
            applications.
          </Lead>

          <ExternalLink href="https://aimechs.autonolas.network/mech/0x77af31De935740567Cf4fF1986D04B2c964A786a">
            Check out Mechs in action
          </ExternalLink>
        </div>
      </div>
    </SectionWrapper>
    <SectionWrapper>
      <div className="max-w-4xl xl:pr-12 xl:pl-0 lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left">
          <H1 className="mb-8">Why do we need mechs?</H1>
          <Lead>
            Mechs implement different AI-oriented tools and pay for private API
            access like OpenAI API. Mechs act as a central hub or library where
            your applications can make LLM requests and avoid having to pay for
            multiple APIs or implementing different API interfaces. Think of it
            as a generic interface to multiple LLMs and smart tools.
          </Lead>
        </div>
      </div>
    </SectionWrapper>
    <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y">
      <div className="max-w-4xl xl:pr-12 xl:pl-0 lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 px-5 lg:p-0">
          <H1 className="mb-8">How it works</H1>
          <ol className="text-xl list-decimal mb-6 pl-5 leading-loose">
            <li>
              An agent or application sends an on-chain request to use an AI
              tool to a Mech service, paying a fee in crypto
            </li>
            <li>
              The Mech service reads the request and identifies the tool to use
              to process it. It executes the request and retrieves the response.
            </li>
            <li>
              The Mech records the response on-chain, making it available to the
              agent or application to use.
            </li>
          </ol>
          <div className="text-slate-500">
            Check out{' '}
            <ExternalLink href="https://github.com/valory-xyz/mech/tree/main?tab=readme-ov-file#mech-request-response-flow">
              the repo
            </ExternalLink>{' '}
            for more details on the architecture
          </div>
        </div>
      </div>
    </SectionWrapper>
    <SectionWrapper>
      <H1 className="text-center mb-12">Case study: Mechs Predictions</H1>
      <PredictionAgentsTable />
      <Lead className="mt-12 text-center">
        Check out{' '}
        <ExternalLink href="https://olas.network/services/prediction-agents">
          this page
        </ExternalLink>{' '}
        for more information on Prediction Agents
      </Lead>
    </SectionWrapper>
    <SectionWrapper
      customClasses="lg:p-24 px-4 py-12 border-y"
      id="integrateMechsSection"
    >
      <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-start">
        <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
          <H1 className="mb-8">Integrate Mechs into your application</H1>
          <h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">
            For generic apps and scripts
          </h2>
          <Lead className="mb-8">
            Use the&nbsp;
            <ExternalLink href="https://github.com/valory-xyz/mech-client">
              mech-client
            </ExternalLink>
            &nbsp;for command line or Python script integrations.
          </Lead>
          <h2 className="text-2xl font-semibold leading-none tracking-tight mb-4">
            For other autonomous services
          </h2>
          <Lead className="mb-8">
            Implement the&nbsp;
            <ExternalLink href="https://github.com/valory-xyz/IEKit/tree/main/packages/valory/skills/mech_interact_abci">
              mech_interact_abci skill
            </ExternalLink>
            &nbsp;to streamline IPFS and blockchain interactions
          </Lead>
          <Lead className="mb-8">
            Refer to&nbsp;
            <ExternalLink href="https://github.com/valory-xyz/mech/tree/main?tab=readme-ov-file#integrating-mechs-into-your-application">
              the guide in the docs
            </ExternalLink>
            &nbsp;for more precise instructions.
          </Lead>
        </div>
        <div className="lg:mt-0 lg:col-span-6 lg:flex">
          <Image
            src="/images/services/ai-mechs/integrate-mechs.png"
            alt="Integrate Mechs"
            width={400}
            height={400}
            className="mx-auto rounded-lg"
          />
        </div>
      </div>
    </SectionWrapper>
    <SectionWrapper
      customClasses="lg:p-24 px-4 py-12 border-b"
      id="resourcesSection"
    >
      <div className="max-w-screen-lg mx-auto">
        <H1 className="text-center mb-12">Further resources</H1>
        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((resource, index) => {
            const FooterTag =
              resource.actions.length > 1 ? CardContent : CardFooter;
            return (
              <div key={index} className="mb-4 md:mb-0">
                <Card className="max-w-sm mx-auto h-full">
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                  </CardHeader>
                  {resource.description && (
                    <CardContent>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardContent>
                  )}
                  <FooterTag className="space-y-4">
                    {resource.actions.map((action, actionIndex) => (
                      <Button
                        asChild
                        key={actionIndex}
                        className="whitespace-normal"
                      >
                        <a
                          href={action.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-800 transition-colors duration-300"
                        >
                          {action.text}
                        </a>
                      </Button>
                    ))}
                  </FooterTag>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  </PageWrapper>
);

export default AiMechs;
