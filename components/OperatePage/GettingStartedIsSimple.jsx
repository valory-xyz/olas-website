import React, { Fragment } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { kebabCase } from 'lodash';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/Button';
import SectionHeading from '../SectionHeading';

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
    customClasses="py-20 border border-purple-200"
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="grid gap-12">
      <SectionHeading size="mb-0">
        <div className="text-center">Getting started is simple</div>
      </SectionHeading>

      <div className="flex justify-center items-center gap-8">
        {installSteps.map(({ title }, index) => (
          <Fragment key={index}>
            <div className="ml-2">{title}</div>
            {index !== downloadLinks.length - 1 && <ArrowRight size={16} />}
          </Fragment>
        ))}
      </div>

      <div className="flex justify-center items-center gap-8">
        {downloadLinks.map(({
          btnText, href, disabled, icon,
        }, index) => (
          <Fragment key={kebabCase(btnText)}>
            <Button
              onClick={disabled ? null : () => window.open(href, '_blank')}
              disabled={disabled}
              isHoverCssEnabled={false}
              type={disabled ? 'disabled' : 'primary'}
            >
              <div className="flex items-start">
                {icon}
                <div className="ml-2">{btnText}</div>
              </div>
            </Button>

            {index !== downloadLinks.length - 1 && (
            <div className="font-bold text-lg text-purple-200">|</div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  </SectionWrapper>
);
