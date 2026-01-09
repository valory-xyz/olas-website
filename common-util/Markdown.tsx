import { getApiUrl } from 'common-util/getApiUrl';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { markdownComponents } from 'styles/globals';
import type { PluggableList } from 'unified';

type MarkdownProps = {
  className?: string;
  children?: string | React.ReactElement;
};

const Markdown = ({ className, children }: MarkdownProps) => {
  let childrenString: string;
  if (typeof children === 'string') {
    childrenString = children;
  } else if (React.isValidElement(children)) {
    const props = children.props as { children?: string };
    childrenString =
      typeof props?.children === 'string'
        ? props.children
        : String(children || '');
  } else {
    childrenString = String(children || '');
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm] as PluggableList}
      rehypePlugins={[rehypeRaw] as PluggableList}
      urlTransform={(uri) => {
        if (uri.startsWith('http')) return uri;
        const apiUrl = getApiUrl();
        return apiUrl ? `${apiUrl}${uri}` : uri;
      }}
      components={markdownComponents}
      className={className}
    >
      {childrenString}
    </ReactMarkdown>
  );
};

Markdown.defaultProps = {
  className: '',
  children: null,
};

export default Markdown;
