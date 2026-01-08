import { ArrowUpRight } from 'lucide-react';

interface VerifyProps {
  url: string;
  text?: string;
}

const Verify = ({ url, text = 'Verify' }: VerifyProps) => (
  <a
    href={url}
    className="flex items-center gap-1 text-slate-400 border-b border-slate-400 max-w-max"
    rel="noopener noreferrer"
    target="_blank"
  >
    {text} <ArrowUpRight size={20} />
  </a>
);

export default Verify;
