/**
 * Builders for the JSON-LD blocks published on olas.network.
 *
 * Structured data is the one part of the page written *for* machines, so it is held to the
 * same rules as the metric text layer (docs/metric-text-layer.md): every block is generated
 * from the same data the visible page renders — the FAQ arrays, the /data section list, the
 * blog record — never typed out a second time, so the two cannot drift. Kept free of JSX so
 * Node's type-stripping test runner can load this module directly.
 *
 * See docs/structured-data.md.
 */

export const SCHEMA_CONTEXT = 'https://schema.org';

/**
 * The Organization's `@id`, always the production entity whatever host renders the page —
 * the same one `Meta` declares on the homepage and the app-suite `SeoHead` points at. A
 * preview must not mint its own `https://<preview>/#organization`.
 */
export const ORGANIZATION_ID = 'https://olas.network/#organization';

export type FaqItem = { question: string; answer: string };

/**
 * Turns whatever a FAQ component renders as its answer into plain text.
 *
 * The answers are JSX — paragraphs, links, the odd image — and `acceptedAnswer.text` wants a
 * string. Walking the element tree and keeping only the text nodes is deterministic on the
 * server and the client alike, which a `renderToStaticMarkup` call is not guaranteed to be
 * (and it would drag `react-dom/server` into the browser bundle). Links lose their href; the
 * question-and-answer pair is what the schema is for.
 */
/** Elements that end a run of text in the rendered page. */
const BLOCK_ELEMENTS = new Set([
  'p',
  'div',
  'li',
  'ul',
  'ol',
  'br',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]);

export const reactNodeToText = (node: unknown): string => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(reactNodeToText).join('');
  if (typeof node === 'object' && 'props' in node) {
    const { type, props } = node as { type?: unknown; props?: { children?: unknown } };
    const text = reactNodeToText(props?.children);
    // A block element ends a sentence in the rendered page; without a boundary here two
    // paragraphs run together as "…of AI.With Pearl…". Inline elements keep their spacing.
    return typeof type === 'string' && BLOCK_ELEMENTS.has(type) ? `${text} ` : text;
  }
  return '';
};

/** Collapses the whitespace that JSX line breaks leave behind. */
const tidy = (text: string) => text.replace(/\s+/g, ' ').trim();

const MIN_ANSWER_WORDS = 8;

export const buildFaqPage = (items: FaqItem[]) => ({
  '@context': SCHEMA_CONTEXT,
  '@type': 'FAQPage' as const,
  mainEntity: items
    .map(({ question, answer }) => ({ question: tidy(question), answer: tidy(answer) }))
    // An empty answer is a malformed entry, and one of a few words is a caption under a
    // diagram ("For full technical detail, check the whitepaper.") — neither is an answer
    // worth quoting as the site's own.
    .filter(({ question, answer }) => question && answer.split(' ').length >= MIN_ANSWER_WORDS)
    .map(({ question, answer }) => ({
      '@type': 'Question' as const,
      name: question,
      acceptedAnswer: { '@type': 'Answer' as const, text: answer },
    })),
});

export type DatasetEntry = {
  /** The section's `id` attribute on /data, which is also its anchor. */
  id: string;
  /** The section's visible `<h2>`, verbatim. */
  name: string;
  description: string;
};

/**
 * The /data page as a catalog of datasets, one per section.
 *
 * Cited statistics are the strongest measured lever for being quoted by generative engines
 * (Aggarwal et al., KDD 2024), and /data is where every number on the site sends its reader.
 * Each dataset's `@id` is the section anchor, so a tile's `/data#…` link and the machine-
 * readable record resolve to the same thing.
 */
export const buildDataCatalog = ({
  siteUrl,
  datasets,
}: {
  siteUrl: string;
  datasets: DatasetEntry[];
}) => {
  const catalogUrl = `${siteUrl}/data`;
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'DataCatalog' as const,
    '@id': catalogUrl,
    name: 'Olas network metrics',
    url: catalogUrl,
    description:
      'Every metric published on olas.network, with the subgraph queries and methodology behind it.',
    creator: { '@id': ORGANIZATION_ID },
    dataset: datasets.map(({ id, name, description }) => ({
      '@type': 'Dataset' as const,
      '@id': `${catalogUrl}#${id}`,
      name,
      description: tidy(description),
      url: `${catalogUrl}#${id}`,
      creator: { '@id': ORGANIZATION_ID },
      includedInDataCatalog: { '@id': catalogUrl },
      isAccessibleForFree: true,
    })),
  };
};

export type ArticleInput = {
  siteUrl: string;
  path: string;
  title: string;
  description?: string;
  datePublished?: string | null;
  dateModified?: string | null;
  imageUrl?: string;
  /** Free-text author from the CMS, when it has one. */
  author?: string | null;
};

/** Names the CMS has used for posts published by Olas itself rather than a person. */
const ORGANISATION_AUTHORS = new Set(['olas', 'autonolas', 'valory']);

/** ISO 8601 or nothing — an unparseable date is worse than no date. */
const isoDate = (value?: string | null) => {
  if (!value) return undefined;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : undefined;
};

export const buildArticle = ({
  siteUrl,
  path,
  title,
  description,
  datePublished,
  dateModified,
  imageUrl,
  author,
}: ArticleInput) => {
  const organization = { '@id': ORGANIZATION_ID };
  const published = isoDate(datePublished);
  const modified = isoDate(dateModified);
  // The CMS author is free text and a couple of posts name the organisation in it; those
  // must not ship as `Person: Autonolas`.
  const isOrganisationAuthor = author && ORGANISATION_AUTHORS.has(tidy(author).toLowerCase());
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Article' as const,
    mainEntityOfPage: `${siteUrl}${path}`,
    headline: tidy(title),
    ...(description ? { description: tidy(description) } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    // The CMS carries a name for some posts; the rest are published under the organisation.
    author:
      author && !isOrganisationAuthor
        ? { '@type': 'Person' as const, name: tidy(author) }
        : organization,
    publisher: organization,
  };
};

/**
 * Serialises a block for a `<script type="application/ld+json">` tag.
 *
 * The one thing JSON.stringify does not do: a `</script>` inside a string would end the
 * tag early. Escaping `<` covers it (and `<!--`), and JSON parsers read `\u003c` as `<`.
 */
export const serializeJsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, '\\u003c');
