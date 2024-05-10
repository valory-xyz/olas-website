import React, { Fragment } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { kebabCase } from 'lodash';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/Button';
import {
  DESCRIPTION_CLASS,
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
} from './utils';

const installSteps = [
  { title: 'Download the App' },
  { title: 'Install and Set Up' },
  { title: 'Fund your wallet and start earning OLAS' },
];

const iconProps = {
  width: 24,
  height: 24,
  style: { alignItems: 'flex-start' },
};

const downloadLinks = [
  {
    btnText: 'Download for Apple Silicon',
    href: 'https://www.apple.com/', // TODO
    icon: <Image src="/images/operate-page/brand-apple.svg" {...iconProps} />,
  },
  {
    btnText: 'Download for MacOS Intel',
    href: 'https://www.intel.com/', // TODO
    icon: <Image src="/images/operate-page/brand-apple.svg" {...iconProps} />,
  },
  {
    btnText: 'Windows is coming soon',
    disabled: true, // TODO
    icon: <Image src="/images/operate-page/brand-windows.svg" {...iconProps} />,
  },
];

export const GettingStartedIsSimple = () => (
  <SectionWrapper
    id="download"
    customClasses={`border border-purple-200 ${SECTION_BOX_CLASS}`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="max-w-screen-xl px-4 py-12 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12 lg:px-12">
      <div className="grid gap-1 col-span-12 lg:gap-12">
        <h2 className={SUB_HEADER_CLASS}>
          <div className="text-left lg:text-center">
            Getting started is simple
          </div>
        </h2>

        <div className="flex flex-col justify-center items-center gap-1 mb-8 md:flex lg:flex-row lg:gap-4 lg:mb-0">
          {installSteps.map(({ title }, index) => (
            <Fragment key={index}>
              <div className={DESCRIPTION_CLASS}>{title}</div>
              {index !== downloadLinks.length - 1 && (
                <ArrowRight size={16} className="rotate-90 lg:rotate-0" />
              )}
            </Fragment>
          ))}
        </div>

        <div className="flex flex-col justify-center items-center gap-6 lg:gap-8 sm:flex sm:flex-row">
          {downloadLinks.map(({
            btnText, href, disabled, icon,
          }, index) => (
            <Fragment key={kebabCase(btnText)}>
              <Button
                href={disabled ? null : href}
                disabled={disabled}
                isHoverCssEnabled={false}
                type={disabled ? 'disabled' : 'primary'}
              >
                <div className="flex items-start">
                  {icon}
                  <div className="ml-2">{btnText}</div>
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
