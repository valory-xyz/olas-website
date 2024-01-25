import SectionWrapper from "@/components/Layout/SectionWrapper";
import Videos from "../Content/Videos";
import Articles from "../Content/Articles";
import Resources from "../Content/Resources";
import NetworkApps from "../Content/NetworkApps";

const Content = () => {
  return (
    <SectionWrapper backgroundType={"SUBTLE_GRADIENT"}>
      <div id="resources" />
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-heading text-gray-800 mb-12">
          Learn more about Olas Contribute
        </h1>
        <div className="mb-12">
          <Articles limit={3} tagFilter="contribute" showSeeAll />
        </div>
        <div className="mb-12">
          <Resources tagFilter="contribute" />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Content;
