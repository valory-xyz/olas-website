import Image from 'next/image';
import { useRouter } from 'next/router';

import { STACK_URL } from 'common-util/constants';
import kits from 'data/kits.json';
import { BUTTON } from 'styles/globals';
import Meta from '../Meta';

export const KitPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const kit = kits.find((item) => item.id === id);

  if (!kit) {
    return <div>Kit not found</div>;
  }

  return (
    <>
      {/* @ts-expect-error TS(2304) FIXME: Cannot find name 'title'. */}{' '}
      {/* @ts-expect-error TS(2322): Type '{ title: string; description: string; }' is ... Remove this comment to see the full error message */}{' '}
      {/* @ts-expect-error TS(2322) FIXME: Type '{ title: string; description: string; }' is ... Remove this comment to see the full error message */}{' '}
      <Meta title={kit.title} description={kit.description} />
      <section className="bg-white text-black py-16 px-4 border-y">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-6xl font-bold mb-6">{kit.title}</h1>
            <p className="text-xl mb-6">{kit.description}</p>
            <a
              className={`${BUTTON} mr-4`}
              href={kit.liveLink.url}
              target={kit.liveLink.external ? '_blank' : '_self'}
              rel={kit.liveLink.external ? 'noopener noreferrer' : ''}
            >
              See live demo
            </a>
            <a
              className={BUTTON}
              href={`${STACK_URL}/product/${kit.id}kit`}
              target={kit.liveLink.external ? '_blank' : '_self'}
              rel={kit.liveLink.external ? 'noopener noreferrer' : ''}
            >
              Docs
            </a>
          </div>
          <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
            <Image
              alt={`${kit.title} Illustration`}
              src={`/images/kits/${kit.id}kit.svg`}
              height="300"
              width="300"
            />
          </div>
        </div>
      </section>
    </>
  );
};
