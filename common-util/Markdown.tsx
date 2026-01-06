import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import PropTypes from 'prop-types';
import { markdownComponents } from 'styles/globals';

const Markdown = ({ className, children }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeRaw]}
    urlTransform={(uri) =>
      uri.startsWith('http') ? uri : `${process.env.NEXT_PUBLIC_API_URL}${uri}`
    }
    components={markdownComponents}
    className={className}
  >
    {children}
  </ReactMarkdown>
);

Markdown.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

Markdown.defaultProps = {
  className: '',
  children: null,
};

export default Markdown;
