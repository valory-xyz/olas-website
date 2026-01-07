import Markdown from 'common-util/Markdown';
import { TrusteeQuotePropTypes } from 'common-util/propTypes';
import { Card } from 'components/ui/card';
import Image from 'next/image';

interface TrusteeProps {
  quote?: unknown;
  className?: string;
}

export const Trustee = ({ quote, className }: TrusteeProps) => (
  // @ts-expect-error TS(2322) FIXME: Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message
  <Card
    className={`flex flex-col p-6 border-2 border-white rounded-2xl shadow-sm bg-white gap-4 bg-slate-50 ${className}`}
  >
    <div className="text-purple-600">
      // @ts-expect-error TS(2339) FIXME: Property 'quote' does not exist on
      type 'unknown'.
      <Markdown className="text-black">{quote.quote}</Markdown>
    </div>
    <div className="mt-auto flex flex-row gap-3">
      <div className="aspect-square mt-auto">
        <Image
          // @ts-expect-error TS(2339) FIXME: Property 'userIcon' does not exist on type 'unknow... Remove this comment to see the full error message
          src={`/images/homepage/${quote.userIcon || quote.icon}`}
          alt="Build"
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col mr-auto">
        // @ts-expect-error TS(2339) FIXME: Property 'xUrl' does not exist on
        type 'unknown'.
        <a href={quote.xUrl} target="_blank" className="font-semibold">
          // @ts-expect-error TS(2339) FIXME: Property 'name' does not exist on
          type 'unknown'.
          {quote.name}
        </a>
        // @ts-expect-error TS(2339) FIXME: Property 'title' does not exist on
        type 'unknown'.
        <p className="text-slate-500 text-sm">{quote.title}</p>
      </div>
    </div>
  </Card>
);

Trustee.defaultProps = {
  className: '',
};
