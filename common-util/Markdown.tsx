import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { markdownComponents } from 'styles/globals';

interface MarkdownProps {
  className?: string;
  children?: string | React.ReactElement;
}

const Markdown = ({ className, children }: MarkdownProps) => (
  <ReactMarkdown
    // @ts-expect-error TS(2322) FIXME: Type '(options?: void | Options) => void | Transfo... Remove this comment to see the full error message
    remarkPlugins={[remarkGfm]}
    // @ts-expect-error TS(2322) FIXME: Type '(options?: void | Options) => void | Transfo... Remove this comment to see the full error message
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

Markdown.defaultProps = {
  className: '',
  children: null,
};

export default Markdown;
