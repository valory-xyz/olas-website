import SectionWrapper from "@/components/Layout/SectionWrapper";
import Articles from "../Content/Articles";
import Resources from "../Content/Resources";

const Content = () => {
  return (
    <SectionWrapper backgroundType={"SUBTLE_GRADIENT"}>
      <div id="resources" />
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-heading text-gray-800 mb-12">
          Learn more about Olas Dev Rewards
        </h1>
        <div className="mb-12">
          <Articles tagFilter="dev-rewards" />
        </div>
        <div className="mb-12">
          <Resources tagFilter="dev-rewards" />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Content;
