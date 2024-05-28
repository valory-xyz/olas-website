/* eslint-disable import/no-unresolved */
import React, { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Octokit } from '@octokit/core';

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
        Install
        {' '}
        <Link
          href="https://docs.docker.com/docker-for-mac/install/"
          className="text-purple-700"
          target="_blank"
        >
          Docker Desktop↗
        </Link>
        . Make sure Docker Desktop is running before you run Pearl for the first
        time*
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
    id: 'windows',
    btnText: 'Windows is coming soon',
    downloadLink: null,
    icon: (
      <Image
        src="/images/operate-page/brand-windows.svg"
        alt="Windows is coming soon"
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
        const { assets } = data;
        const updatedLinks = links.map((link) => {
          const assetLink = assets.find((asset) => asset.browser_download_url.includes(link.id));
          return {
            ...link,
            downloadLink: assetLink ? assetLink.browser_download_url : null,
          };
        });
        setLinks(updatedLinks);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="flex flex-col flex-wrap justify-center items-center gap-6 sm:flex-row lg:flex-nowrap lg:gap-8">
      {links.map(({
        id, btnText, downloadLink, icon,
      }, index) => (
        <Fragment key={id}>
          <Button
            onClick={
              downloadLink ? () => window.open(downloadLink, '_blank') : null
            }
            disabled={!downloadLink}
            variant={downloadLink ? 'default' : 'outline'}
            size="xl"
            className="w-full md:w-auto"
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
          Install. Run an Agent. Earn OLAS. That’s It
        </h2>
        <InstallSteps />
        <p className={FOOT_NOTE_CLASS}>
          * Docker desktop app is only required during Alpha and Beta testing
        </p>
        <DownloadLinks />
      </div>
    </div>
  </SectionWrapper>
);
