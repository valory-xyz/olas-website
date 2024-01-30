import { HowToSection } from "../ui/section/how-to";

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
      "Write code using Open Autonomy",
      "Mint your code on Olas Protocol Registry",
      "Get rewards in ETH & OLAS*"
    ],
    extra: "*Requires that somebody with at least 10k veOLAS donates to a service that uses your code."
  };

  return (
    <HowToSection sectionId={sectionId} heading={heading} image={image} body={body} />
  );
}

export default GetStarted;
