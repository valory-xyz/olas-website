import SectionWrapper from "components/Layout/SectionWrapper";
import { Card, CardTitle } from "components/ui/card";
import Image from "next/image";
import Link from "next/link";

const ways = [
  {
    title: "Earn Dev Rewards by building on Olas Protocol",
    imageSrc: "/images/build-page/earn-dev-rewards.jpg",
    description: (
      <>
        <p className="mb-4">
          Contribute valuable code units — like agents or components — to the
          Olas protocol and have a chance at receiving Developer Rewards.
        </p>
        <p className="mb-4">
          Dev Rewards is a part of the protocol that facilitates the
          distribution of capital to developers who contribute to various
          services in the ecosystem.
        </p>
        <p>
          This system is designed to reward both the contribution of code
          components and entire agents.
        </p>
      </>
    ),
    linkText: "Learn more about Dev Rewards",
    link: "/dev-rewards", //leads to build page also
  },
  {
    title: "Explore opportunities with external projects",
    imageSrc: "/images/build-page/explore-opportunities.jpg",
    description: (
      <>
        Collaborate with external projects seeking skilled developers and
        discover opportunities that align with your expertise, with compensation
        handled directly by the third-party projects. <br />
        <h3 className="font-semibold mt-4">Browse opportunities</h3>
        Discover a list of projects that match your skills. <br />
        <h3 className="font-semibold mt-4">Get in touch</h3>
        Find projects that align with your expertise and interests.
      </>
    ),
    linkText: "Get matched with an opportunity",
    link: "/opportunities", //page not yet created
  },
];

export const WaysToGrow = () => (
  <SectionWrapper
    backgroundType="NONE"
    customClasses="py-16 md:py-24 px-4"
    id="grow"
  >
    <h2 className="text-4xl lg:mb-6 xl:mb-8 font-extrabold my-6 lg:my-auto text-center">
      Two ways to grow and earn as an Olas Builder
    </h2>
    <p className="text-gray-600 text-center mb-12">
      Embark on one or both ways of building to maximize your impact and
      earnings in the Olas ecosystem.
    </p>

    <div className="grid md:grid-cols-2 gap-x-10 md:gap-x-4 gap-y-4 max-w-5xl mx-auto ">
      {ways.map((item) => (
        <Card
          className="flex flex-col overflow-hidden border-t border-[#0000000d]"
          key={item.title}
        >
          <Image
            src={item.imageSrc}
            alt={item.title}
            width={495}
            height={260}
            className="rounded-lg py-auto object-cover"
          />
          <div className="p-6">
            <CardTitle className="mb-6 text-center">
              <span>{item.title}</span>
            </CardTitle>
            <div className="mb-6 text-start">{item.description}</div>
            <Link href={item.link} className="text-purple-600">
              {item.linkText} ↗
            </Link>
          </div>
        </Card>
      ))}
    </div>
  </SectionWrapper>
);
