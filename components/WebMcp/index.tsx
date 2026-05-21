import agentsData from 'data/agents.json';
import { useEffect } from 'react';

/**
 * Registers read-mostly site tools with the browser's WebMCP API
 * (`navigator.modelContext`) so in-browser AI agents can act on olas.network
 * without scraping. Spec: https://webmachinelearning.github.io/webmcp/
 *
 * The API is experimental and not yet in stable browsers, so everything is
 * behind a feature check and unregistered on unmount via AbortController.
 */

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  execute: (input: Record<string, unknown>) => Promise<unknown>;
};

type ModelContext = {
  registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => void;
};

// Sections an agent can navigate to. Keep in sync with top-level routes.
const SECTIONS: Record<string, string> = {
  home: '/',
  about: '/about',
  agents: '/agents',
  'agent-economies': '/agent-economies',
  staking: '/staking',
  operate: '/operate',
  build: '/build',
  govern: '/govern',
  bond: '/bond',
  'olas-token': '/olas-token',
  blog: '/blog',
  faq: '/faq',
  whitepaper: '/whitepaper',
};

type Agent = {
  name: string;
  slug: string;
  serviceCategory?: string;
  shortDescription?: string;
  description?: string;
  deprecated?: boolean;
};

const getModelContext = (): ModelContext | null => {
  if (typeof navigator === 'undefined') return null;
  const candidate = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
  return candidate && typeof candidate.registerTool === 'function' ? candidate : null;
};

const WebMcp = () => {
  useEffect(() => {
    const modelContext = getModelContext();
    if (!modelContext) return undefined;

    const controller = new AbortController();
    const { signal } = controller;

    modelContext.registerTool(
      {
        name: 'navigate_to_section',
        description:
          'Navigate the current browser to a section of olas.network. Returns the destination URL.',
        annotations: { readOnlyHint: false },
        inputSchema: {
          type: 'object',
          properties: {
            section: {
              type: 'string',
              enum: Object.keys(SECTIONS),
              description: 'The site section to open.',
            },
          },
          required: ['section'],
        },
        execute: async (input) => {
          const section = String(input.section);
          const pathname = SECTIONS[section];
          if (!pathname) {
            return {
              error: `Unknown section "${section}". Known: ${Object.keys(SECTIONS).join(', ')}`,
            };
          }
          const url = new URL(pathname, window.location.origin).toString();
          window.location.assign(url);
          return { navigatedTo: url };
        },
      },
      { signal }
    );

    modelContext.registerTool(
      {
        name: 'list_olas_agents',
        description:
          'List the Olas AI agents in the catalog, including name, category, description, and page URL.',
        annotations: { readOnlyHint: true },
        inputSchema: {
          type: 'object',
          properties: {
            includeDeprecated: {
              type: 'boolean',
              description: 'Include deprecated/legacy agents. Defaults to false.',
            },
          },
        },
        execute: async (input) => {
          const includeDeprecated = Boolean(input.includeDeprecated);
          const agents = (agentsData as Agent[])
            .filter((agent) => includeDeprecated || !agent.deprecated)
            .map((agent) => ({
              name: agent.name,
              slug: agent.slug,
              category: agent.serviceCategory ?? null,
              description: agent.shortDescription || agent.description || '',
              url: `https://olas.network/agents/${agent.slug}`,
            }));
          return { count: agents.length, agents };
        },
      },
      { signal }
    );

    modelContext.registerTool(
      {
        name: 'get_olas_facts',
        description:
          'Get a curated, machine-readable summary of Olas (mission, apps, token, tokenomics, governance) from llms.txt.',
        annotations: { readOnlyHint: true },
        inputSchema: { type: 'object', properties: {} },
        execute: async () => {
          const res = await fetch('/llms.txt');
          if (!res.ok) return { error: `Failed to load llms.txt (${res.status})` };
          return { format: 'text/plain', content: await res.text() };
        },
      },
      { signal }
    );

    modelContext.registerTool(
      {
        name: 'get_olas_metrics',
        description:
          'Get current headline Olas network metrics (daily active agents, OLAS staked, transactions, agent-to-agent transactions, mech fees, operators).',
        annotations: { readOnlyHint: true },
        inputSchema: { type: 'object', properties: {} },
        execute: async () => {
          const res = await fetch('/api/agent-tools/metrics');
          if (!res.ok) return { error: `Failed to load metrics (${res.status})` };
          return res.json();
        },
      },
      { signal }
    );

    return () => controller.abort();
  }, []);

  return null;
};

export default WebMcp;
