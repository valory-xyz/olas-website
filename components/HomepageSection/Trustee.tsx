import Markdown from 'common-util/Markdown';
import { Card } from 'components/ui/card';
import Image from 'next/image';

type QuoteData = {
  quote?: string;
  userIcon?: string;
  icon?: string;
  xUrl?: string;
  name?: string;
  title?: string;
};

type TrusteeProps = {
  quote?: QuoteData;
  className?: string;
};

export const Trustee = ({ quote, className }: TrusteeProps) => (
  <Card
    className={`flex flex-col p-6 border-2 border-white rounded-2xl shadow-sm bg-white gap-4 bg-slate-50 ${className}`}
  >
    <div className="text-purple-600">
      <Markdown className="text-black">{quote?.quote}</Markdown>
    </div>
    <div className="mt-auto flex flex-row gap-3">
      <div className="aspect-square mt-auto">
        <Image
          src={`/images/homepage/${quote?.userIcon || quote?.icon || ''}`}
          alt="Build"
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col mr-auto">
        <a href={quote?.xUrl} target="_blank" rel="noopener noreferrer" className="font-semibold">
          {quote?.name}
        </a>
        <p className="text-slate-500 text-sm">{quote?.title}</p>
      </div>
    </div>
  </Card>
);

Trustee.defaultProps = {
  className: '',
};
