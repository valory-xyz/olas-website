import PageWrapper from "@/components/Layout/PageWrapper";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import Meta from "@/components/Meta";
import { Button } from "@/components/ui/button";
import { HowToSection } from "@/components/ui/section/how-to";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ExternalLink, H1, Lead, Small, Upcase } from "@/components/ui/typography";
import Image from "next/image";

const PredictionAgents = () =>
  <PageWrapper>
    <Meta pageTitle="Prediction Agents" siteImageUrl="/images/services/prediction-agents.png" />
    <SectionWrapper>
      <div className="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 text-center px-5 lg:p-0 lg:text-left mb-12">
          <div className="mb-4">
            <Upcase>Prediction Agents</Upcase>
          </div>
          <H1 className="mb-4">
            Predict the future, autonomously
          </H1>
          <Lead className="mb-8">
            Run an agent designed to trade in prediction markets on your behalf.
          </Lead>
          <Button size="xl" asChild>
            <a href="https://operate.olas.network" rel="noopener noreferrer" target="_blank">
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
        path: "/images/services/prediction-agents/how-to.png",
        width: 400,
        height: 400
      }}
      body={{
        steps: [
          <ExternalLink href="https://github.com/valory-xyz/trader-quickstart?tab=readme-ov-file#system-requirements">
            Get the requirements in place
          </ExternalLink>,
          <span>Run the <ExternalLink href="https://github.com/valory-xyz/trader-quickstart">quickstart script</ExternalLink> - choose to participate in staking programs, if available</span>,
          "Tweak strategy to maximize earnings"
        ]
      }}
    />
    <SectionWrapper>
      <H1 className="text-center mb-12">What Prediction Agents do</H1>
      <div className="max-w-6xl mx-auto">
        <Table className="text-lg">
          <TableBody>
            <TableRow>
              <TableCell>1. Agent watches for new prediction markets</TableCell>
              <TableCell className="text-center">
                <span className="text-6xl">🤖</span>
                <br />
                Your agent
              </TableCell>
              <TableCell className="text-center">
                <span className="text-6xl">→</span>
                <br />
                Sees new market
              </TableCell>
              <TableCell className="text-center">
                <Image
                  src="/images/services/prediction-agents/omen.svg"
                  alt="Omen prediction market"
                  width={70}
                  height={70}
                  className="mx-auto"
                />
                Prediction market
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2. Agent uses AI tools to get probability</TableCell>
              <TableCell className="text-center">
                <span className="text-6xl">🤖</span>
                <br />
                Your agent
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-between">
                  <div>
                <span className="text-6xl">←</span>
                <br />
                  <span>Probability</span>
                  </div>
                  <div>
                    <span className="text-6xl">→</span>
                    <br />
                    <span>$</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Image
                  src="/images/services/prediction-agents/mechs.svg"
                  alt="Omen prediction market"
                  width={200}
                  height={100}
                  className="mx-auto"
                />
                AI Tools Marketplace
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3. Agent bets on prediction market</TableCell>
              <TableCell className="text-center">
                <span className="text-6xl">🤖</span>
                <br />
                Your agent
              </TableCell>
              <TableCell className="text-center">
                $
                <br />
                <span className="text-6xl">→</span>
              </TableCell>
              <TableCell className="text-center">
                <Image
                  src="/images/services/prediction-agents/omen.svg"
                  alt="Omen prediction market"
                  width={70}
                  height={70}
                  className="mx-auto"
                />
                AI Tools Marketplace
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4. Agent potentially receives winnings</TableCell>
              <TableCell className="text-center">
                <span className="text-6xl">🤖</span>
                <br />
                Your agent
              </TableCell>
              <TableCell className="text-center">
                <span className="text-6xl">←</span>
                <br />
                ? $
              </TableCell>
              <TableCell className="text-center">
                <Image
                  src="/images/services/prediction-agents/omen.svg"
                  alt="Omen prediction market"
                  width={70}
                  height={70}
                  className="mx-auto"
                />
                AI Tools Marketplace
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </SectionWrapper>
  </PageWrapper>;

export default PredictionAgents;