import React, { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import {
  FOOT_NOTE_CLASS,
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
  TEXT_CLASS,
} from './utils';

const installSteps = [
  {
    title: (
      <>
        Install the
        {' '}
        <Link
          href="https://docs.docker.com/docker-for-mac/install/"
          className="text-purple-700"
          target="_blank"
        >
          Docker desktop app ↗
        </Link>
        {' '}
        Make sure Docker Desktop is running before you run Pearl for the first
        time.
      </>
    ),
  },
  { title: 'Install Pearl.' },
  { title: 'Add funds and start your agent.' },
  {
    title:
      'As your agent meets its performance targets, OLAS can be earned as staking rewards. It’s like magic.',
  },
];

const iconProps = {
  width: 24,
  height: 24,
};

const downloadLinks = [
  {
    btnText: 'Download for Apple Silicon - Alpha',
    href: 'https://www.apple.com/', // TODO
    icon: <Image src="/images/operate-page/brand-apple.svg" {...iconProps} />,
  },
  {
    btnText: 'Download for MacOS Intel - Alpha',
    href: 'https://www.intel.com/', // TODO
    icon: <Image src="/images/operate-page/brand-apple.svg" {...iconProps} />,
  },
  {
    btnText: 'Windows is coming soon',
    disabled: true, // TODO
    icon: <Image src="/images/operate-page/brand-windows.svg" {...iconProps} />,
  },
];

export const InstallRunAnAgent = () => (
  <SectionWrapper
    id="download"
    customClasses={`border border-purple-200 ${SECTION_BOX_CLASS}`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="max-w-screen-xl px-0 py-6 mx-auto lg:grid-cols-12 lg:px-12">
      <div className="grid gap-1 col-span-12 lg:gap-8">
        <h2 className={SUB_HEADER_CLASS}>
          <div className="text-left">
            Install. Run an Agent. Earn OLAS. That’s It
          </div>
        </h2>

        <ol className="flex flex-col gap-1 lg:gap-2 lg:mb-0 list-decimal">
          {installSteps.map(({ title }, index) => (
            <li key={index} className={`${TEXT_CLASS} ml-6`}>
              {title}
            </li>
          ))}
        </ol>

        <p className={FOOT_NOTE_CLASS}>
          * Docker desktop app is only required during Alpha and Beta testing
        </p>

        <div className="flex flex-col justify-center items-center gap-6 lg:gap-8 sm:flex sm:flex-row">
          {downloadLinks.map(({
            btnText, href, disabled, icon,
          }, index) => (
            <Fragment key={btnText}>
              {/* TODO: check button CSS */}
              <Button
                onClick={disabled ? null : () => window.open(href, '_blank')}
                disabled={disabled}
                variant={disabled ? 'outline' : 'default'}
                size="xl"
              >
                <div className="flex items-start">
                  {icon}
                  &nbsp;&nbsp;
                  {btnText}
                </div>
              </Button>

              {index !== downloadLinks.length - 1 ? (
                <div className="font-bold text-lg text-purple-200 hidden md:block">
                  |
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  </SectionWrapper>
);
