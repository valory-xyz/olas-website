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
  p: ({ node: _node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,

  strong: ({ node: _node, ...props }) => <strong {...props}></strong>,
  // Apply tailwind classes to style lists
  ul: ({ node: _node, ...props }) => (
    <ul
      className="list-disc list-outside pl-6 mb-4 last:mb-0 marker:text-purple-800"
      {...props}
    />
  ),
  ol: ({ node: _node, ...props }) => (
    <ol
      className="list-none pl-0 mb-4 last:mb-0 [counter-reset:list-counter] [&>li]:[counter-increment:list-counter] [&>li]:relative [&>li]:pl-12 [&>li]:mb-3 [&>li:last-child]:mb-0 [&>li]:before:[content:counter(list-counter,decimal-leading-zero)] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0 [&>li]:before:flex [&>li]:before:items-center [&>li]:before:justify-center [&>li]:before:w-8 [&>li]:before:h-8 [&>li]:before:rounded-full [&>li]:before:bg-purple-100 [&>li]:before:text-purple-800 [&>li]:before:text-xs [&>li]:before:font-semibold"
      {...props}
    />
  ),

  li: ({ node: _node, ...props }) => <li className="mb-2 pl-1 last:mb-0" {...props} />,
  h1: ({ node: _node, ...props }) => (
    <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0" {...props} />
  ),
  h2: ({ node: _node, ...props }) => (
    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3 first:mt-0" {...props} />
  ),
  h3: ({ node: _node, ...props }) => (
    <h3 className="text-xl font-medium text-gray-900 mt-6 mb-2 first:mt-0" {...props} />
  ),
  h4: ({ node: _node, ...props }) => (
    <h4 className="text-lg font-medium text-gray-900 mt-6 mb-2 first:mt-0" {...props} />
  ),
  h5: ({ node: _node, ...props }) => (
    <h5 className="text-[17px] font-medium text-gray-900 mt-4 mb-2 first:mt-0" {...props} />
  ),
  h6: ({ node: _node, ...props }) => (
    <h6 className="text-base font-medium text-gray-900 mt-4 mb-2 first:mt-0" {...props} />
  ),
  pre: ({ node: _node, ...props }) => (
    <pre className="p-4 bg-gray-800 border rounded-md overflow-auto mb-4 last:mb-0" {...props} />
  ),

  code: ({ node: _node, ...props }) => <code className="text-sm" {...props} />,
  img: ({ node: _node, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img className="rounded-lg my-8 first:mt-0 last:mb-0 max-w-full h-auto" {...props} />
  ),
  blockquote: ({ node: _node, children, className, ...props }) => (
    <blockquote
      className={`border-l-4 border-gray-800 pl-6 my-4 last:mb-0 italic ${className || ''}`}
      {...props}
    >
      {children}
    </blockquote>
  ),
};
