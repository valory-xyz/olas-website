import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { markdownComponents } from 'styles/globals';

interface MarkdownProps {
  className?: string;
  children?: string | React.ReactElement;
}

const Markdown = ({
  className,
  children
}: MarkdownProps) => (
  <ReactMarkdown

    // @ts-expect-error TS(2322) FIXME: Type '(options?: void | Options) => void | Transfo... Remove this comment to see the full error message
    remarkPlugins={[remarkGfm]}

    // @ts-expect-error TS(2322) FIXME: Type '(options?: void | Options) => void | Transfo... Remove this comment to see the full error message
    rehypePlugins={[rehypeRaw]}
    urlTransform={(uri) =>
      uri.startsWith('http') ? uri : `${process.env.NEXT_PUBLIC_API_URL}${uri}`
    }

    // @ts-expect-error TS(2322) FIXME: Type '{ a: ({ node, ...props }: { [x: string]: any... Remove this comment to see the full error message
    components={markdownComponents}
    className={className}
  >
    // @ts-expect-error TS(2322) FIXME: Type 'string | ReactElement<unknown, string | JSXE... Remove this comment to see the full error message
    {children}
  </ReactMarkdown>
);

Markdown.defaultProps = {
  className: '',
  children: null,
};

export default Markdown;
