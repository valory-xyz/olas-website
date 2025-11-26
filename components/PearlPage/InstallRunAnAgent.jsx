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
  MACOS_ARM: 'MacOS_ARM',
  MACOS_INTEL: 'MacOS_Intel',
  MACOS: 'MacOS',
  UNKNOWN: 'unknown',
};

const downloadLinks = [
  {
    id: 'darwin-arm64.dmg',
    os: OS_TYPES.MACOS_ARM,
    btnText: 'macOS M1+',
    downloadLink: null,
    iconSrc: '/images/pearl-page/brand-apple.svg',
    iconAlt: 'Download for macOS M1+',
  },
  {
    id: 'darwin-x64.dmg',
    os: OS_TYPES.MACOS_INTEL,
    btnText: 'MacOS Intel',
    downloadLink: null,
    iconSrc: '/images/pearl-page/brand-apple.svg',
    iconAlt: 'Download for MacOS Intel',
  },
  {
    id: 'win32-x64.exe',
    os: OS_TYPES.WINDOWS,
    btnText: 'Windows',
    downloadLink: null,
    iconSrc: '/images/pearl-page/brand-windows.svg',
    iconAlt: 'Download for Windows',
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

const getUserOS = async () => {
  if (typeof window === 'undefined') return OS_TYPES.UNKNOWN;
  const { userAgent, userAgentData } = window.navigator;

  // 1. Try getHighEntropyValues for architecture detection (Chromium-based browsers)
  if (userAgentData?.getHighEntropyValues) {
    try {
      const highEntropyValues = await userAgentData.getHighEntropyValues([
        'platform',
        'architecture',
      ]);
      const platform = highEntropyValues.platform?.toLowerCase();
      const architecture = highEntropyValues.architecture?.toLowerCase();

      if (platform?.indexOf('win') !== -1) return OS_TYPES.WINDOWS;
      if (platform?.indexOf('mac') !== -1) {
        // Distinguish between ARM (Apple Silicon) and x86 (Intel)
        if (architecture === 'arm') return OS_TYPES.MACOS_ARM;
        if (architecture === 'x86') return OS_TYPES.MACOS_INTEL;
        // If architecture is unknown, return generic MacOS
        return OS_TYPES.MACOS;
      }
    } catch (error) {
      console.error('Error fetching high entropy values:', error);
    }
  }

  // 2. Fallback to userAgentData.platform (doesn't return architecture.)
  if (userAgentData?.platform) {
    const platform = userAgentData.platform?.toLowerCase();
    if (platform.indexOf('win') !== -1) return OS_TYPES.WINDOWS;
    if (platform.indexOf('mac') !== -1) return OS_TYPES.MACOS;
  }

  // 3. Final fallback to userAgent string
  const ua = userAgent.toLowerCase();
  if (ua.indexOf('win') !== -1) return OS_TYPES.WINDOWS;
  if (ua.indexOf('mac') !== -1) return OS_TYPES.MACOS;
  return OS_TYPES.UNKNOWN;
};

const DownloadLinks = () => {
  const [links, setLinks] = useState(downloadLinks);

  const hash = useHash();

  useEffect(() => {
    const detectOSAndUpdateLinks = async () => {
      const data = await getLatestRelease();
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

      const userOS = await getUserOS();
      const updatedLinksWithOutlined = updatedLinks.map((link) => {
        if (userOS === OS_TYPES.MACOS) {
          return {
            ...link,
            outlined:
              link.os !== OS_TYPES.MACOS_ARM &&
              link.os !== OS_TYPES.MACOS_INTEL &&
              link.os !== OS_TYPES.MACOS,
          };
        }

        return {
          ...link,
          outlined: userOS !== OS_TYPES.UNKNOWN && link.os !== userOS,
        };
      });

      // Sort so highlighted button is in the middle if only one is highlighted
      const highlightedCount = updatedLinksWithOutlined.filter(
        (link) => !link.outlined,
      ).length;

      let sortedLinks = updatedLinksWithOutlined;
      if (highlightedCount === 1) {
        const highlighted = updatedLinksWithOutlined.filter(
          (link) => !link.outlined,
        );
        const outlined = updatedLinksWithOutlined.filter(
          (link) => link.outlined,
        );
        // Place highlighted in the middle: [outlined[0], highlighted[0], outlined[1]]
        sortedLinks =
          outlined.length >= 2
            ? [outlined[0], highlighted[0], outlined[1]]
            : updatedLinksWithOutlined;
      }

      setLinks(sortedLinks);
    };

    detectOSAndUpdateLinks().catch((error) => {
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
      <div className="mx-auto md:w-fit flex flex-row max-md:flex-col md:gap-4 mt-8 md:justify-center">
        {links.map(
          ({ id, btnText, downloadLink, iconSrc, iconAlt, outlined }) => {
            const isOutline = !downloadLink || outlined;
            return (
              <Button
                key={id}
                onClick={
                  downloadLink
                    ? () => window.open(downloadLink, '_blank')
                    : null
                }
                variant={downloadLink && !outlined ? 'default' : 'outline'}
                size="xl"
                id={id}
                className={`mb-6 h-[56px] max-w-[165px] max-sm:max-w-full text-left cursor-pointer flex flex-row
              ${
                hash === '#update'
                  ? getPlausibleUpdatePearlClass(id)
                  : getPlausibleDownloadPearlClass(id)
              }`}
              >
                <Image
                  src={iconSrc}
                  alt={iconAlt}
                  className="mr-3"
                  style={{ filter: isOutline ? 'contrast(0)' : 'contrast(1)' }}
                  {...iconProps}
                />
                <div className="flex flex-col">
                  <div className="text-sm opacity-75">Download for</div>
                  {btnText}
                </div>
              </Button>
            );
          },
        )}
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
