import { useState } from 'react';

export const CodeSnippet = ({ children }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <pre className="relative bg-gray-100 p-4 rounded text-sm overflow-auto">
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 text-purple-600 hover:underline"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      {children}
    </pre>
  );
};
