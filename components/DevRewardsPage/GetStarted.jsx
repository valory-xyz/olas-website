import { HowToSection } from "../ui/section/how-to";
import { ExternalLink } from "../ui/typography";

const GetStarted = () => {
  const sectionId = "get-started";
  const heading = "Start earning rewards";
  const image = {
    alt: "OLAS Utility",
    path: "/images/dev-rewards-page/get-started.png",
    width: "500",
    height: "474"
  };
  const body = {
    steps: [
      <span>Write code using <ExternalLink href="https://docs.autonolas.network/open-autonomy">Open Autonomy</ExternalLink></span>,
      <span>Mint your code on <ExternalLink href="https://registry.olas.network/">Olas Protocol Registry</ExternalLink></span>,
      "Get rewards in ETH & OLAS*"
    ],
    extra: "*Requires that somebody with at least 10k veOLAS donates to a service that uses your code."
  };

  return (
    <HowToSection sectionId={sectionId} heading={heading} image={image} body={body} />
  );
}

export default GetStarted;
