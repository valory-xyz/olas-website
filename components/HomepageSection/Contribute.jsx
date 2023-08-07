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
              href="#get-involved"
              class="inline-flex bg-purple-900 text-white items-center justify-center px-6 py-4 text-xl sm:text-3xl lg:text-xl sm:px-8 sm:py-5 text-center border border-primary rounded-lg hover:bg-purple-950 hover:bg-repeat hover:bg-size-50 focus:ring-4 focus:ring-gray-100  lg:px-6 lg:py-4"
            >
              Get involved
            </a>
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default Contribute;
