/* eslint-disable import/no-unresolved */
import { Octokit } from '@octokit/core';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';

import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';
import { SECTION_BOX_CLASS, SUB_HEADER_CLASS, TEXT_CLASS } from './utils';

const installSteps = [
  { title: 'Install Pearl.' },
  { title: 'Add funds and start your agent.' },
  {
    title:
      'As your agent meets its performance targets, OLAS can be earned as staking rewards. It’s like magic.',
  },
];

const InstallSteps = () => (
  <ol className="flex flex-col gap-1 lg:gap-2 lg:mb-0 list-decimal">
    {installSteps.map(({ title }, index) => (
      <li key={index} className={`${TEXT_CLASS} ml-6`}>
        {title}
      </li>
    ))}
  </ol>
);

const iconProps = { width: 24, height: 24 };
const downloadLinks = [
  {
    id: 'darwin-arm64.dmg',
    btnText: 'Download for Apple Silicon - Alpha',
    downloadLink: null,
    icon: (
      <Image
        src="/images/operate-page/brand-apple.svg"
        alt="Download for Apple Silicon - Alpha"
        {...iconProps}
      />
    ),
  },
  {
    id: 'darwin-x64.dmg',
    btnText: 'Download for MacOS Intel - Alpha',
    downloadLink: null,
    icon: (
      <Image
        src="/images/operate-page/brand-apple.svg"
        alt="Download for MacOS Intel - Alpha"
        {...iconProps}
      />
    ),
  },
  {
    id: 'win32-x64.exe',
    btnText: 'Download for Windows x64 - Alpha',
    downloadLink: null,
    icon: (
      <Image
        src="/images/operate-page/brand-windows.svg"
        alt="Download for Windows x64 - Alpha"
        {...iconProps}
      />
    ),
  },
];

const octokit = new Octokit({ auth: null });

async function getLatestRelease() {
  try {
    const response = await octokit.request(
      'GET /repos/valory-xyz/olas-operate-app/releases/latest',
      {
        owner: 'valory-xyz',
        repo: 'olas-operate-app',
        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const DownloadLinks = () => {
  const [links, setLinks] = useState(downloadLinks);

  useEffect(() => {
    getLatestRelease()
      .then((data) => {
        const assets = data?.assets || [];
        const prodAssets = assets.filter(
          (asset) => !asset.name.startsWith('dev-'),
        );
        const updatedLinks = downloadLinks.map((link) => {
          const assetLink = prodAssets.find((asset) =>
            asset.browser_download_url.includes(link.id),
          );

          return {
            ...link,
            downloadLink: assetLink?.browser_download_url || null,
          };
        });
        setLinks(updatedLinks);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="flex flex-col flex-wrap justify-center items-baseline gap-4 sm:flex-row xl:flex-nowrap xl:gap-8">
      {links.map(({ id, btnText, downloadLink, icon, subText }) => (
        <Fragment key={id}>
          <div className="flex flex-col gap-2 w-full align-top text-center md:text-left md:w-auto">
            <Button
              onClick={
                downloadLink ? () => window.open(downloadLink, '_blank') : null
              }
              disabled={!downloadLink}
              variant={downloadLink ? 'default' : 'outline'}
              size="xl"
              className="w-full lg:w-auto lg:px-6"
            >
              <div className="flex items-start">
                {icon}
                &nbsp;&nbsp;
                {btnText}
              </div>
            </Button>

            <div className="text-xs text-slate-500">{subText}</div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export const InstallRunAnAgent = () => (
  <SectionWrapper
    id="download"
    customClasses={`border border-purple-200 ${SECTION_BOX_CLASS}`}
    backgroundType="SUBTLE_GRADIENT"
  >
    <div className="max-w-screen-xl px-0 mx-auto lg:grid-cols-12 lg:px-12">
      <div className="grid gap-4 col-span-12 lg:gap-8">
        <h2 className={`${SUB_HEADER_CLASS} text-left mb-6`}>
          Install. Run an Agent. Earn OLAS. That&apos;s It.
        </h2>
        <InstallSteps />
        <DownloadLinks />
      </div>
    </div>
  </SectionWrapper>
);
