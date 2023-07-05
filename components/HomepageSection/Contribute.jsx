import Friend from "./Friend";
import friends from "@/data/friends.json";
import SectionHeading from "../SectionHeading";
import SectionWrapper from "../Layout/SectionWrapper";

const Contribute = () => {
  return (
    <SectionWrapper backgroundType="SUBTLE_GRADIENT">
      <section>
        <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center">
            <SectionHeading color="text-purple-950" size="text-4xl md:text-6xl lg:text-4xl">
              Start participating today
            </SectionHeading>
            <a
              href="https://fjordfoundry.com/pools/mainnet/0x4131fD7B699155f69E0192145C36f27852BE7c11"
              class="inline-flex bg-purple-900 text-white items-center justify-center px-6 py-4 text-xl sm:text-3xl lg:text-xl sm:px-8 sm:py-5 text-center border border-primary rounded-lg hover:bg-dark-hexagons1 hover:bg-repeat hover:bg-size-50 focus:ring-4 focus:ring-gray-100  lg:px-6 lg:py-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get OLAS
            </a>
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default Contribute;
