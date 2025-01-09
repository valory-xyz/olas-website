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
    assetId: null,
    assetName: null,
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
    assetId: null,
    assetName: null,
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
    assetId: null,
    assetName: null,
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
        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
      },
    );

    // Get all releases
    const releases = await octokit.request(
      'GET /repos/valory-xyz/olas-operate-app/releases',
      {
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

const Spinner = () => (
  <svg
    aria-hidden="true"
    class="inline w-6 h-6 text-slate-300 animate-spin fill-white"
    viewBox="0 0 100 101"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
      fill="currentColor"
    />
    <path
      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
      fill="currentFill"
    />
  </svg>
);

const DownloadLink = ({ assetId, assetName, icon, btnText }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/downloadAsset?assetId=${assetId}`);

      if (response) {
        const blob = await response.blob(); // Convert the response to a Blob
        const downloadUrl = URL.createObjectURL(blob);

        // Create a temporary link to trigger the download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = assetName;
        document.body.appendChild(link);
        link.click();

        // Clean up the links
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      } else {
        throw new Error('Error loading asset');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={assetId ? handleDownload : null}
      disabled={!assetId || isLoading}
      variant={assetId ? 'default' : 'outline'}
      size="xl"
      className="w-full lg:w-auto lg:px-6"
    >
      <div className="flex items-center">
        {isLoading ? <Spinner /> : icon}
        &nbsp;&nbsp;
        {btnText}
      </div>
    </Button>
  );
};

DownloadLink.propTypes = {
  assetId: PropTypes.number,
  assetName: PropTypes.string,
  icon: PropTypes.string.isRequired,
  btnText: PropTypes.string.isRequired,
};

DownloadLink.defaultProps = {
  assetId: null,
  assetName: null,
};

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
            name: assetLink?.name,
            assetId: assetLink?.id,
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
      {links.map(({ id, btnText, assetId, name, icon, subText }) => (
        <Fragment key={id}>
          <div className="flex flex-col gap-2 w-full align-top text-center md:text-left md:w-auto">
            <DownloadLink
              assetId={assetId}
              assetName={name}
              btnText={btnText}
              icon={icon}
            />
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
