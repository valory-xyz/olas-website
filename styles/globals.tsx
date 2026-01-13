/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/jsx-filename-extension */

export const TEXT = 'text-xl font-light text-gray-600';
export const TITLE = {
  BIG: 'text-6xl text-gray-700 tracking-tight lg:text-6xl mb-12',
  SMALL: 'text-5xl font-bold text-gray-800 tracking-tight leading-normal',
};
export const BUTTON =
  'inline-flex bg-purple-900 text-white items-center justify-center px-6 py-4 text-xl sm:text-3xl lg:text-xl sm:px-8 sm:py-5 text-center border border-purple-900 rounded-lg hover:bg-purple-950 hover:bg-repeat hover:bg-size-50 focus:ring-4 focus:ring-gray-100  lg:px-6 lg:py-4';
export const BADGE =
  'rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10';
export const CARD_BG =
  'border-1.5 border-gray-200 rounded-2xl p-6 bg-gradient-to-t from-[#F2F4F7] to-white';

export const markdownComponents = {
  // Apply tailwind classes to style links
  a: ({ node: _node, ...props }) => (
    <a
      className="text-purple-800 hover:text-blue-800"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  // Apply margin to paragraphs to create space between them
  p: ({ node: _node, ...props }) => <p {...props} />,

  strong: ({ node: _node, ...props }) => <strong {...props}></strong>,
  // Apply tailwind classes to style lists
  ul: ({ node: _node, ...props }) => (
    <>
      <ul className="list-disc list-inside pl-4 inline-block w-full" {...props} />
      <br />
    </>
  ),
  ol: ({ node: _node, ...props }) => (
    <ol className="list-decimal list-inside inline-block" {...props} />
  ),

  li: ({ node: _node, ...props }) => <li className="mb-2" {...props} />,
  h1: ({ node: _node, ...props }) => <h2 className="text-3xl font-bold mb-4" {...props} />,
  h2: ({ node: _node, ...props }) => <h2 className="text-2xl font-semibold mb-3" {...props} />,
  h3: ({ node: _node, ...props }) => <h3 className="text-xl font-medium mb-2" {...props} />,
  h4: ({ node: _node, ...props }) => <h4 className="text-lg font-medium mb-2" {...props} />,
  h5: ({ node: _node, ...props }) => <h5 className="text-[17px] font-medium mb-2" {...props} />,
  h6: ({ node: _node, ...props }) => <h6 className="text-sm font-medium mb-2" {...props} />,
  pre: ({ node: _node, ...props }) => (
    <pre className="p-4 bg-gray-800 border rounded-md overflow-auto" {...props} />
  ),

  code: ({ node: _node, ...props }) => <code className="text-sm" {...props} />,
  blockquote: ({ node: _node, children, className, ...props }) => (
    <blockquote
      className={`border-l-4 border-gray-800 pl-6 mb-4 italic ${className || ''}`}
      {...props}
    >
      {children}
    </blockquote>
  ),
};
