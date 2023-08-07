import Bonds from "@/components/BondsPage";
import PageWrapper from "@/components/Layout/PageWrapper";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import Meta from "@/components/Meta";

const BondsPage = () =>
  <PageWrapper>
    <Meta pageTitle="Olas Bonds" />
      <Bonds />
  </PageWrapper>
  ;

export default BondsPage;