import { getBlog } from 'common-util/api';
import { formatDate } from 'common-util/formatDate';
import { sendMarkdown } from 'common-util/markdownForAgents';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Markdown variant of `/blog/[id]`, served when an agent requests
 * `Accept: text/markdown` (middleware.ts rewrites here with `?id=`). Returns the
 * post's native CMS markdown (the same `body` the HTML page renders).
 *
 * The post id arrives in the `x-olas-md-id` request header set by the middleware
 * rewrite — after a rewrite the handler sees the original req.url, so neither a
 * path segment nor a query param survives. `?id=` is supported for direct calls.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const headerId = req.headers['x-olas-md-id'];
  const queryId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const blogId = (Array.isArray(headerId) ? headerId[0] : headerId) || queryId;

  if (!blogId) {
    return res.status(404).send('# Not found\n');
  }

  const blog = await getBlog(blogId);
  if (!blog?.attributes) {
    return res.status(404).send('# Not found\n');
  }

  const { title, datePublished, body } = blog.attributes;
  const markdown = `# ${title}\n\n_${formatDate(datePublished)}_\n\n${body || ''}\n`;

  return sendMarkdown(res, markdown);
}
