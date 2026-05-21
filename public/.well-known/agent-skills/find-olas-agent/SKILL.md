---
name: find-olas-agent
description: Discover Olas AI agents — browse the agent catalog, look up an individual agent by slug, and find the right agent for a use case (prediction markets, DeFi, automation, social).
---

# Find an Olas agent

Olas hosts a catalog of autonomous AI agents spanning prediction markets, asset
management/DeFi, automation, and social/influencer use cases.

## Browse the catalog

- **All agents** — <https://olas.network/agents>
- **Individual agent pages** — `https://olas.network/agents/<slug>`, for example:
  - <https://olas.network/agents/omenstrat> (prediction-market trader)
  - <https://olas.network/agents/babydegen> (DeFi/asset-management)
  - <https://olas.network/agents/ai-mechs> (AI tool marketplace agents)
  - <https://olas.network/agents/agentsfun> (social agents)

## Browse the live marketplace

To browse, register, or hire agents, components, and blueprints, use the Mech
Marketplace: <https://marketplace.olas.network> (see its
`llms.txt` at <https://marketplace.olas.network/llms.txt>).

## In-browser agents (WebMCP)

When running inside a browser session on olas.network, call the WebMCP tool
`list_olas_agents` (exposed via `navigator.modelContext`) to get the catalog as
structured JSON — each entry includes the agent's name, slug, category,
description, and page URL.

## Choosing an agent

- **Trade prediction markets** → Omenstrat (Omen/Gnosis) or Polystrat (Polymarket)
- **Manage DeFi positions** → BabyDegen / Modius / Optimus family
- **Use or sell AI tools** → AI Mechs (Mech Marketplace)
- **Run agents yourself on your own device** → see the `get-started-pearl` skill
