import React from "react";
import Image from "next/image";
import affordances from "@/data/affordances.json";
import Badge from "../Badge";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "../SectionHeading";
import { Button } from "../Button";

const Item = ({ affordance, category }) => {
  return (
    <div
      className="rounded-xl border border-gray-300 shadow-sm "
    >
      <SectionWrapper
        customClasses="rounded-t-xl border-t-0"
        backgroundType="SUBTLE_GRADIENT"
      >
        <Image
          src={`/images/${category}/${affordance.imageFilename}`}
          alt={affordance.name}
          width={450}
          height={200}
          className="mx-auto p-2 border-b"
        />
      </SectionWrapper>
      <div className="p-4 md:p-6 lg:p-4">
        <h2 className="mb-2 font-bold text-2xl text-gray-700">
          {affordance.title}
        </h2>

        <div className="mb-2 min-h-[55px] text-slate-800">{affordance.description}</div>

      <Button size="md" className="mr-2" href={affordance.cta.url} isExternal={affordance.cta.external}>{affordance.cta.buttonText}</Button>
      {affordance.learnMoreUrl && <Button size="md" href={affordance.learnMoreUrl} type="secondary">Learn more</Button>}
      </div>
    </div>
  );
};

const CoreSubsection = () => {
  return (
    <section>
      <div className="mb-12 mx-auto">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-1 lg:gap-x-16">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {affordances.map((affordance) => {
              return (
                <div key={affordance.id}>
                  <Item affordance={affordance} category="affordances" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const Affordances = () => {
  return (
    <SectionWrapper>
      <div id="get-involved" />
      <div className="text-center">
        <SectionHeading color="text-slate-700">
          Get Involved
        </SectionHeading>
      </div>
      <CoreSubsection />
    </SectionWrapper>
  );
};

export default Affordances;
