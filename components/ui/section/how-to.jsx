import Image from "next/image";
import SectionWrapper from "@/components/Layout/SectionWrapper";
import SectionHeading from "@/components/SectionHeading";
import { H1 } from "../typography";

export const HowToSection = ({ sectionId, heading, image, body }) => {
  return (
    <SectionWrapper customClasses="lg:p-24 px-4 py-12 border-y">
      {sectionId && <div id={sectionId}></div>}
      <div class="grid max-w-screen-xl lg:px-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
        <div class="lg:col-span-6 px-5 lg:p-0 mb-12">
          <H1 className="mb-8">{heading}</H1>
          {body.steps && <ol className="text-xl list-decimal mb-6 pl-5 leading-loose">
            {
              body.steps.map((step, index) => {
                return <li key={index}>{step}</li>
              })
            }
          </ol>}
          {body.extra && <div className="text-slate-500">{body.extra}</div>}
        </div>
        <div className="lg:mt-0 lg:col-span-6 lg:flex">
          <Image
            className="mx-auto rounded-lg shadow-sm border"
            alt={image.alt}
            src={image.path}
            width={image.width}
            height={image.height}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}