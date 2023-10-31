import Image from "next/image";
import Badge from "../Badge";
import { Button } from "../Button";
import SectionWrapper from "../Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";

const AppShowcase = () => {
  return (
    <SectionWrapper  backgroundType={"GOVERNATOOORR"}>
      <div className="text-center bg-white max-w-[600px] mx-auto p-6 rounded-3xl">
        <div className="text-2xl md:text-3xl lg:text-2xl text-gray-600 mb-4">App showcase</div>
        <SectionHeading size="text-4xl md:text-6xl lg:text-4xl break-words">
          Meet The Governatooorr
        </SectionHeading>
        <Badge>AI x Crypto</Badge>
        <Image
          src="/images/app-showcase.png"
          alt="Governatooorr product screenshot"
          width="600"
          height="400"
          className="my-8 rounded-xl border-2 border-pink-500 shadow-lg"
        />
        <div>
          <p className="text-xl font-light text-gray-600 mb-4">
            Governatooorr is the world&apos;s first autonomous, AI-powered
            governor.
          </p>
          <p className="text-xl font-light text-gray-600">
            Governatooorr depends on an Olas service that automatically assesses
            DAO proposals and votes according to delegator preferences.{" "}
            <a
              href="https://twitter.com/valoryag/status/1643670672521195523"
              className="text-link underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the announcement tweet thread for more detail
            </a>
            .
          </p>
          <br />
          <Button
            className="mt-12"
            href="https://governatooorr.autonolas.network"
          >
            Visit the app
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AppShowcase;
