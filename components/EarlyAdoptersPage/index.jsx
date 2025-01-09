import { Octokit } from '@octokit/core';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';

import {
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
  TEXT_MEDIUM_LIGHT_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';
import { Button } from 'components/ui/button';

const iconProps = { width: 24, height: 24 };
const downloadLinks = [
  {
    id: 'darwin-arm64.dmg',
    btnText: 'Download for Apple Silicon',
    downloadLink: null,
    icon: (
      <Image
        src="/images/operate-page/brand-apple.svg"
        alt="Download for Apple Silicon"
        {...iconProps}
      />
    ),
  },
  {
    id: 'darwin-x64.dmg',
    btnText: 'Download for MacOS Intel',
    downloadLink: null,
    icon: (
      <Image
        src="/images/operate-page/brand-apple.svg"
        alt="Download for MacOS Intel"
        {...iconProps}
      />
    ),
  },
  {
    id: 'win32-x64.exe',
    btnText: 'Download for Windows x64',
    downloadLink: null,
    icon: (
      <Image
        src="/images/operate-page/brand-windows.svg"
        alt="Download for Windows x64"
        {...iconProps}
      />
    ),
  },
];

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_AUTH_TOKEN,
});

async function getLatestRelease(agentType) {
  try {
    // Get all created tags
    const tags = await octokit.request(
      'GET /repos/valory-xyz/olas-operate-app/tags',
      {
        owner: 'valory-xyz',
        repo: 'olas-operate-app',
        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
      },
    );

    // Get all releases
    const releases = await octokit.request(
      'GET /repos/valory-xyz/olas-operate-app/releases',
      {
        owner: 'valory-xyz',
        repo: 'olas-operate-app',
        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
      },
    );

    // Find the latest tag that ends with agentType
    const latestTag = tags.data.find((item) =>
      item.name.endsWith(`-${agentType}`),
    );
    if (!latestTag) return null;

    // Extract the release version from the tag
    const release = latestTag.name.match(/\d+\.\d+\.\d+-rc\d+/);
    if (!release) return null;

    // Find needed release in the list of releases
    const response = releases.data.find((item) => item.name === release[0]);

    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const DownloadLinks = ({ agentType }) => {
  const [links, setLinks] = useState(downloadLinks);

  useEffect(() => {
    getLatestRelease(agentType)
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
  }, [agentType]);

  return (
    <div className="flex flex-col flex-wrap justify-center items-baseline gap-2 sm:flex-row xl:flex-nowrap xl:gap-4">
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

DownloadLinks.propTypes = {
  agentType: PropTypes.string.isRequired,
};

const DESCRIPTIONS = {
  agentsfun: 'Get the latest version of Pearl featuring Agents.fun',
  modius: 'Get the latest version of Pearl featuring Modius',
};

export const EarlyAdoptersPage = ({ agentType }) => (
  <SectionWrapper customClasses={`border ${SECTION_BOX_CLASS}`}>
    <div className="max-w-[500px] mx-auto flex flex-col items-center text-center mb-16">
      <Image
        src={`/images/early-adopters-page/${agentType}.png`}
        alt={`Pearl ${agentType}`}
        width={260}
        height={158}
        className="mb-12"
      />
      <span className={TEXT_MEDIUM_LIGHT_CLASS}>PEARL FOR EARLY ADOPTERS</span>
      <h2 className={`${SUB_HEADER_CLASS} mt-2`}>{DESCRIPTIONS[agentType]}</h2>
    </div>
    <DownloadLinks agentType={agentType} />
  </SectionWrapper>
);

EarlyAdoptersPage.propTypes = {
  agentType: PropTypes.string.isRequired,
};

export default EarlyAdoptersPage;
