# The staking emissions chart

`EmissionsToOperators` on `/olas-token` plots four cumulative lines, which are the four
stages OLAS passes through on its way to a staker:

| line | means | source |
|---|---|---|
| OLAS minted for staking rewards | what left the OLAS minter for staking | Dispenser claims on Ethereum |
| OLAS dispensed to staking contracts | what arrived in staking contracts | `Deposit` on each staking chain |
| Staking rewards claimable | what services have earned | daily staking accumulator |
| Staking rewards claimed | what has been paid out | daily staking accumulator |

Each neighbouring pair differs for its own reason, which is why they are shown together:

- **minted → dispensed** is OLAS the L1/L2 depositories withheld because a staking
  contract could not take it yet. It is not lost; it nets off future transfers.
- **dispensed → claimable** is reward budget sitting in staking contracts, waiting to be
  earned by services that meet their activity requirements.
- **claimable → claimed** is earned rewards nobody has withdrawn yet.

## Why minted uses `transferAmount`

`StakingIncentivesClaimed.stakingIncentive` is the amount *allocated* to a target;
`transferAmount` is what the treasury actually moved after netting off any amount
withheld on the destination chain. Only the second is OLAS that left the minter. The two
were equal until Polygon synced a withheld amount, so using the wrong one looks correct
for a long time and then silently drifts.

## One request per subgraph

Every set the chart needs from a staking subgraph — deposits, the daily totals, and the
claimed fallback when it is used — is asked for in a **single request**, then only the
sets that came back full are requested again. One round trip covers the common case
without giving up paging.

**Every set is paged.** A bare `first: 1000` truncates silently once a set outgrows it,
which is how the previous version of this chart came to publish a third of the real
figure. That applies to the Dispenser claims too: only ~113 exist today, far under the
cap, but they are paged like everything else rather than relying on staying small.

## Why claimed has two code paths

Claimable reads `CumulativeDailyStakingGlobal.totalRewards`, which every staking
subgraph carries. Claimed reads the matching `totalRewardsClaimed`, which only exists on
subgraphs redeployed after
[autonolas-subgraph-studio#169](https://github.com/valory-xyz/autonolas-subgraph-studio/pull/169).

Chains listed in `STAKING_SUBGRAPHS_WITH_CLAIMED_TOTALS` use that field. Everything else
pages every `"Claimed"` `RewardUpdate` instead — correct, but far slower.

Gnosis, Base, Optimism and Polygon are listed: all four have been redeployed with the
field. Mode is the only chain left on the fallback, and always will be.

**Mode can never be listed.** It runs on a non-archive RPC and cannot be reindexed, so
it will never carry the field, and asking a subgraph for a field it does not have fails
the *whole request* rather than just that field. The constant's type excludes `'mode'`,
so adding it is a compile error rather than a broken refresh, and `usesClaimedTotals`
refuses it at runtime as well.

Measured on the current data: with every redeployed chain listed, the whole tokenomics
fetch costs **41 requests and 5.0s**, against **191 requests and 33.1s** when all five
chains take the fallback. Gnosis alone accounts for almost all of that difference — it
has ~137k payout rows. Where both paths are available they agree to the wei.

**Do not sum `RewardUpdate` rows with a single `first: 1000`.** That is what this chart
did before: Gnosis alone has ~137k of them, 33 of 48 epochs hit the cap, and the chart
published roughly a third of the real figure.

## Colours

In chart order: `#475569` dark gray, `#EA580C` orange, `#7D8A9E` gray, `#FFB347` amber.
Only the first two are new tokens — claimable reuses `available` and claimed reuses
`operators`, the same tokens the other emissions charts use, so changing either moves
every chart together.

The grays are doing work, not decoration. Yellow, orange and brown differ almost only
in lightness under red-green colour blindness, and the usable lightness band is too
narrow for four distinguishable warm steps — four warm lines measure ΔE 3–9 between
neighbours, against a floor of 15 that applies to full-colour vision too. As ordered
here the worst adjacent pair is ΔE 16.8 (protanopia) / 22.3 (normal), which clears it.

Order is load-bearing: two similar warm tones must not end up adjacent. Re-validate with
the dataviz skill's `validate_palette.js` before changing any of it.

Three known deviations, all accepted:

- Both grays fail the chroma floor. That check catches a hue that has accidentally gone
  gray; these are meant to be neutral.
- `#FFB347` sits above the lightness band and at 1.73:1 against the chart surface, well
  under the 3:1 mark target, so it is a faint line. It is the colour this chart already
  used for claimed, kept for continuity rather than introduced here.

## Known gaps

- **Chain coverage.** Minted counts every chain the Dispenser pays. The other three only
  cover the chains in `STAKING_GRAPH_CLIENTS`; ethereum, arbitrum and celo are commented
  out there, which is ~77k OLAS, under 1% of the minted total. Enabling them closes it.
- **Third-party top-ups.** Dispensed counts every `Deposit`, not only the depositories',
  because the line means "what arrived". Non-depository top-ups are a few thousand OLAS.
- **Epoch axis.** The lines are sampled at tokenomics epoch boundaries so this chart
  matches the three beside it. Claimable and claimed are daily underneath, so a date axis
  would suit them better if this chart ever moves off the page.
