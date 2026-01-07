import { ArrowUpRight } from 'lucide-react';

interface VerifyProps {
  url: string;
}

const Verify = ({
  url,
  // @ts-expect-error TS(2339) FIXME: Property 'text' does not exist on type 'VerifyProp... Remove this comment to see the full error message
  text = 'Verify',
}: VerifyProps) => (
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
