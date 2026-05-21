import { getEducationArticle } from 'common-util/api';
import { sendMarkdown } from 'common-util/markdownForAgents';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Markdown variant of `/learn/education-articles/[educationArticleId]`, served
 * when an agent requests `Accept: text/markdown` (middleware.ts rewrites here
 * with `?id=`). Returns the article's native CMS markdown.
 *
 * The article id arrives in the `x-olas-md-id` request header set by the
 * middleware rewrite — after a rewrite the handler sees the original req.url, so
 * neither a path segment nor a query param survives. `?id=` works for direct calls.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const headerId = req.headers['x-olas-md-id'];
  const queryId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const articleId = (Array.isArray(headerId) ? headerId[0] : headerId) || queryId;

  if (!articleId) {
    return res.status(404).send('# Not found\n');
  }

  const article = await getEducationArticle(articleId);
  if (!article?.attributes) {
    return res.status(404).send('# Not found\n');
  }

  const { title, body } = article.attributes;
  const markdown = `# ${title}\n\n${body || ''}\n`;

  return sendMarkdown(res, markdown);
}
