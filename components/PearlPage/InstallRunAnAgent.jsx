/* eslint-disable import/no-unresolved */
import { Octokit } from '@octokit/core';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import {
  getPlausibleDownloadPearlClass,
  getPlausibleUpdatePearlClass,
} from 'common-util/plausible';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import { useHash } from 'hooks/useHash';

const iconProps = { width: 24, height: 24 };

const OS_TYPES = {
  WINDOWS: 'Windows',
  MACOS: 'MacOS',
  UNKNOWN: 'unknown',
};

const downloadLinks = [
  {
    id: 'darwin-arm64.dmg',
    os: OS_TYPES.MACOS,
    btnText: 'macOS M1+',
    downloadLink: null,
    icon: (
      <Image
        src="/images/pearl-page/brand-apple.svg"
        alt="Download for macOS M1+"
        className="mr-3"
        {...iconProps}
      />
    ),
  },
  {
    id: 'darwin-x64.dmg',
    os: OS_TYPES.MACOS,
    btnText: 'MacOS Intel',
    downloadLink: null,
    icon: (
      <Image
        src="/images/pearl-page/brand-apple.svg"
        alt="Download for MacOS Intel"
        className="mr-3"
        {...iconProps}
      />
    ),
  },
  {
    id: 'win32-x64.exe',
    os: OS_TYPES.WINDOWS,
    btnText: 'Windows',
    downloadLink: null,
    icon: (
      <Image
        src="/images/pearl-page/brand-windows.svg"
        alt="Download for Windows"
        className="mr-3"
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

const getUserOS = () => {
  if (typeof window === 'undefined') return OS_TYPES.UNKNOWN;
  const { userAgent, userAgentData } = window.navigator;

  // userAgentData is more reliable but isn't widely supported yet
  if (userAgentData?.platform) {
    const platform = userAgentData.platform?.toLowerCase();
    if (platform.indexOf('win') !== -1) return OS_TYPES.WINDOWS;
    if (platform.indexOf('mac') !== -1) return OS_TYPES.MACOS;
  }

  const ua = userAgent.toLowerCase();
  if (ua.indexOf('win') !== -1) return OS_TYPES.WINDOWS;
  if (ua.indexOf('mac') !== -1) return OS_TYPES.MACOS;
  return OS_TYPES.UNKNOWN;
};

const DownloadLinks = () => {
  const [links, setLinks] = useState(downloadLinks);

  const hash = useHash();

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

        const userOS = getUserOS();
        const filteredLinks = updatedLinks.filter((link) => {
          if (userOS === OS_TYPES.UNKNOWN) return true;
          return link.os === userOS;
        });

        setLinks(filteredLinks);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Card className="mt-24 max-w-[720px] mx-auto p-8 border-fuchsia-200 ring-8 ring-purple-50">
      <h2 className="tracking-tight text-3xl lg:text-4xl text-left mb-8 font-semibold lg:text-center lg:mb-12">
        Get started with Pearl in 3 simple steps
      </h2>
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-xl">
          Install Pearl (The AI Agent App Store)
        </h3>
        <p className="mb-4">Download the app suitable for your device.</p>
        <h3 className="font-semibold text-xl">Setup</h3>
        <p className="mb-4">
          Follow the displayed instructions or this guide to set up in a few
          minutes.
        </p>
        <h3 className="font-semibold text-xl">Start earning rewards</h3>
        <p className="mb-4">
          Click “Run Agent” and start earning potential rewards.
        </p>
      </div>
      <div className="mx-auto md:w-fit flex flex-row max-md:flex-col md:gap-4 mt-8">
        {links.map(({ id, btnText, downloadLink, icon }) => (
          <Button
            key={id}
            onClick={
              downloadLink ? () => window.open(downloadLink, '_blank') : null
            }
            disabled={!downloadLink}
            variant={downloadLink ? 'default' : 'outline'}
            size="xl"
            id={id}
            className={`mb-6 h-[56px] max-w-[165px] max-sm:max-w-full text-left cursor-pointer flex flex-row
              ${
                hash === '#update'
                  ? getPlausibleUpdatePearlClass(id)
                  : getPlausibleDownloadPearlClass(id)
              }`}
          >
            {icon}
            <div className="flex flex-col">
              <div className="text-sm opacity-75">Download for</div>
              {btnText}
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export const InstallRunAnAgent = () => (
  <div className="mb-12 lg:mb-24 max-sm:mx-4">
    {/** Both ids are needed for correct tracking in Plausible
     * to separate downloads and updates navigated from Pearl */}
    <div id="download" />
    <div id="update" />

    <DownloadLinks />
  </div>
);
