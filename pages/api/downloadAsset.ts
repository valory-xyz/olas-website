import { Octokit } from '@octokit/core';
import https from 'https';

// Caching for a day
const CACHE_HEADER = 'public, s-maxage=86400, immutable';

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_AUTH_TOKEN,
});

export default async function handler(req, res) {
  const { assetId } = req.query;

  if (!assetId) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    const response = await octokit.request(
      `GET /repos/valory-xyz/olas-operate-app/releases/assets/${assetId}`,
      {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          Accept: 'application/octet-stream',
        },
      }
    );

    if (!response.url) {
      return res.status(500).json({ error: 'Failed to fetch the file' });
    }

    // Make a direct request to download the file using the asset's URL
    https.get(
      response.url,
      {
        headers: {
          Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_AUTH_TOKEN}`,
          Accept: 'application/octet-stream',
        },
      },
      (githubRes) => {
        if (githubRes.statusCode !== 200) {
          res.status(500).json({ error: 'Failed to stream the file from GitHub' });
          return;
        }

        // Set headers for file download
        const typedResponse = response as { name?: string };
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${typedResponse.name || 'download'}"`
        );
        res.setHeader('Content-Type', 'application/octet-stream');
        // Caching for a day
        res.setHeader('Cache-Control', CACHE_HEADER);
        res.setHeader('Vercel-CDN-Cache-Control', CACHE_HEADER);

        // Stream the GitHub response directly to the client
        githubRes.pipe(res);
      }
    );
  } catch (error) {
    console.error('Error fetching or streaming the file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
