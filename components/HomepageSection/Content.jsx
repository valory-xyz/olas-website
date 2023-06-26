import SectionWrapper from "@/components/Layout/SectionWrapper";
import Videos from "../Content/Videos";
import Articles from "../Content/Articles"
import Resources from "../Content/Resources"
import NetworkApps from "../Content/NetworkApps"

const Content = () => {
  return (
    <SectionWrapper backgroundType={"SUBTLE_GRADIENT"}>
      <div id="resources" />
      <h1 className="text-heading text-gray-800 mb-12">Dive in</h1>
      <div className="mb-12">
        <Videos limit={2} />
      </div>
      <div className="mb-12">
        <Articles limit={3} />
      </div>
      <div className="mb-12">
        <Resources />
      </div>
      <NetworkApps />
    </SectionWrapper>
  );
};

export default Content;
