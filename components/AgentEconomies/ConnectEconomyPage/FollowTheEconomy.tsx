import Link from 'next/link';

import { SECTION_BOX_CLASS, SECTION_H2_CLASS } from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';

import { EXPLORE_CONNECT_URL, GET_CONNECT_URL, LAUNCH_POST_URL } from './constants';

export const FollowTheEconomy = () => (
  <SectionWrapper customClasses={`${SECTION_BOX_CLASS} border-t`} backgroundType="SUBTLE_GRADIENT">
    <div className="max-w-[650px] mx-auto text-center flex flex-col items-center gap-6">
      <h2 className={SECTION_H2_CLASS}>Follow the Connect economy</h2>
      <p className="text-lg leading-6 text-slate-600">
        The Agent Economy Explorer shows Connect agents activity on Gnosis, Polygon and Robinhood
        Chain over time.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="default" asChild className="max-sm:grow">
          <Link href={EXPLORE_CONNECT_URL}>Explore Connect activity</Link>
        </Button>
        <Button variant="outline" asChild className="max-sm:grow">
          <Link href={LAUNCH_POST_URL}>Read the launch post</Link>
        </Button>
      </div>
      <p className="text-sm text-slate-500">
        Want to use Connect yourself?{' '}
        <a
          href={GET_CONNECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:underline"
        >
          Get it in Pearl ↗
        </a>
      </p>
    </div>
  </SectionWrapper>
);
