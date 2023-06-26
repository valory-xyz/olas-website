import Articles from "@/components/Content/Articles";
import PageWrapper from "@/components/Layout/PageWrapper";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import Head from "next/head";

const ArticlesPage = () =>
  <PageWrapper>
    <SectionWrapper backgroundType={"SUBTLE_GRADIENT"}>
      <Articles />
    </SectionWrapper>
  </PageWrapper>
  ;

export default ArticlesPage;