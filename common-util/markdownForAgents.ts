import { NextApiResponse } from 'next';

// Rough token estimate (~4 chars/token) for the optional x-markdown-tokens hint.
const estimateTokens = (text: string): number => Math.ceil(text.length / 4);

/**
 * Sends a markdown response for agent content negotiation: sets
 * `Content-Type: text/markdown`, `Vary: Accept` (so caches keep HTML and
 * markdown variants separate) and an `x-markdown-tokens` size hint.
 */
export const sendMarkdown = (res: NextApiResponse, markdown: string) => {
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Vary', 'Accept');
  res.setHeader('x-markdown-tokens', String(estimateTokens(markdown)));
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  return res.status(200).send(markdown);
};
