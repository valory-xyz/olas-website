import SectionWrapper from 'components/Layout/SectionWrapper';
import { Link } from 'components/ui/typography';
import Image from 'next/image';
import SectionHeading from '../SectionHeading';
import builders from '../../data/builders.json';
import friends from '../../data/friends.json';

const PropelledBy = () => (
  <SectionWrapper>
    <SectionHeading
      size="max-w-[616px] mb-24"
      color="text-gray-900"
      other="text-center mx-auto"
    >
      Propelled by a growing ecosystem
    </SectionHeading>
    <section id="builders" className="max-w-screen-xl mx-auto text-center mb-16">
      <h3 className="text-2xl md:text-4xl font-bold mb-4">Builders</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 ">
        {builders.map((builder) => {
          const {
            id, name, url, iconFilename,
          } = builder;
          return (
            <div key={id} className="grayscale flex justify-center items-center">
              <Link href={url}>
                <Image
                  src={`/images/builders/${iconFilename}`}
                  alt={name}
                  width={150}
                  height={30}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
    <section id="friends" className="max-w-screen-xl mx-auto text-center">
      <h3 className="text-2xl md:text-4xl font-bold mb-4">More friends of Olas</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
        {friends.map((friend) => {
          const {
            id, name, url, imageFilename,
          } = friend;
          return (
            <div key={id} className="grayscale flex justify-center items-center">
              <Link href={url}>
                <Image
                  src={`/images/friends/${imageFilename}`}
                  alt={name}
                  width={150}
                  height={30}
                />
              </Link>
            </div>
          );
        })}

      </div>
    </section>
  </SectionWrapper>
);

export default PropelledBy;
