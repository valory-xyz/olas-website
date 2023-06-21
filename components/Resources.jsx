import SectionWrapper from "./SectionWrapper";
import Videos from "./Videos";

const Resources = () => {
  return (
    <SectionWrapper backgroundType={"SUBTLE_GRADIENT"}>
      <h1 className="text-heading mb-12">Resources</h1>
      <Videos limit={2} />
    </SectionWrapper>
  );
};

export default Resources;
