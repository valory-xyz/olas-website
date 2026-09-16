# Structured data (JSON-LD)

The homepage carries `Organization` and `WebSite` in one `@graph`; the FAQ pages carry
`FAQPage`; blog posts carry `Article`; `/data` carries a `DataCatalog` with one `Dataset`
per section. All of it is invisible — **nothing users read changes.**

Why it exists: generative engines and search features read schema.org markup as the
authoritative statement of what a page *is*. Cited statistics are the strongest measured
lever for being quoted by generative engines (Aggarwal et al., KDD 2024, arXiv 2311.09735),
and `/data` is where every number on the site sends its reader — so each of its sections
is a citable `Dataset` whose `@id` is the same `/data#…` anchor the metric tiles link to.

## Rules

**Build from what the page renders, never a second copy.** The builders in
[`common-util/structured-data.ts`](../common-util/structured-data.ts) take the same
arrays and records the visible components render — the FAQ list, the blog record, the
section registry — so a block cannot describe something the page does not show. This is
the same principle as the metric text layer (`docs/metric-text-layer.md`).

**Answers are extracted, not retyped.** FAQ answers are JSX. `reactNodeToText` walks the
element tree and keeps the text, inserting a boundary after block elements so paragraphs
do not run together. It is deterministic on server and client, unlike
`renderToStaticMarkup`, and drags nothing into the browser bundle.

**`/data` sections are registered, and the registry is checked.**
[`components/DataPage/datasets.ts`](../components/DataPage/datasets.ts) lists each
section's `id` and `<h2>` verbatim plus a one-sentence description. The post-build check
fails if an `id` is not an anchor on the page, if a `name` is not one of the page's own
headings, or if a heading exists that the registry does not list. Add a section, add an
entry — the build tells you if you forget.

**The Organization lives on the homepage only, from `Meta`.** That is the page search
engines read the site name and logo from (#585). Its `@id` is always the production
`https://olas.network/#organization`, whatever host renders the page — the app-suite
`SeoHead` and the Article and Dataset blocks here all point at that one `@id`, so every
property resolves to one entity and a preview never mints its own. The check requires
exactly one Organization and one WebSite on the homepage and none anywhere else.

**Serialise with `serializeJsonLd`.** It escapes `<` so a `</script>` inside a string
cannot close the tag early.

**Only claim what is true.** No `license`, `aggregateRating`, `datePublished` on things
that have no date, or an `author` the CMS did not provide. A block with a made-up field is
worse than a thinner one.

## What is not covered

- Blog posts are server-rendered (`getServerSideProps`), so the post-build check never
  sees them. The Article builder is pinned by unit tests instead.
- `StackFaq` carries an `FAQPage` block but the component is commented out on `/stack`;
  it activates with the component.

## Testing

- `yarn structured-data:test` — the builders. In CI.
- `yarn structured-data:check:test` — the post-build check's own fixtures, each a page
  that looks fine and must be reported. In CI.
- `yarn structured-data:check` — reads every block back out of the built HTML. Runs in
  `postbuild`, so every Vercel build checks it.
