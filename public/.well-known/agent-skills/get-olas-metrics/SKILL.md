---
name: get-olas-metrics
description: Retrieve live Olas network metrics — daily active agents, OLAS staked, transactions, agent-to-agent transactions, mech fees, and operators — and per-economy breakdowns.
---

# Get Olas network metrics

Olas publishes headline, network-wide metrics that are refreshed regularly from
on-chain subgraphs across all supported chains (Ethereum, Gnosis, Base,
Optimism, Mode, Celo, Arbitrum, Polygon).

## Where to read them

- **Homepage** — <https://olas.network> shows the current headline metrics:
  - Daily active agents
  - OLAS staked
  - Transactions (cumulative, cross-chain)
  - Agent-to-agent (ATA) transactions
  - Mech fees (USD)
  - Total operators
- **Per-economy metrics** — <https://olas.network/agent-economies> and its
  sub-pages break metrics down by economy:
  - Predict (prediction-market agents): <https://olas.network/agent-economies/predict>
  - BabyDegen (DeFi agents): <https://olas.network/agent-economies/babydegen>
  - Mech (AI tool marketplace): <https://olas.network/agent-economies/mech>
  - Agents.Fun: <https://olas.network/agent-economies/agentsfun>

## In-browser agents (WebMCP)

When running inside a browser session on olas.network, call the WebMCP tool
`get_olas_metrics` (exposed via `navigator.modelContext`) to read the current
headline metrics as structured JSON without scraping the page.

## Notes

- Metrics are snapshots and may carry a staleness indicator when an underlying
  subgraph is lagging; treat values as "last known good".
- For ecosystem-level facts (token, tokenomics, governance), read
  <https://olas.network/llms.txt>.
