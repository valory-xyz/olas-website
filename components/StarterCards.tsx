import { TEXT_LARGE_CLASS } from 'common-util/classes';
import Image from 'next/image';
import { Card } from './ui/card';

interface StarterCardsProps {
  title: string;
  content: React.ReactNode;
  button?: React.ReactNode;
  imgUrl?: string;
  className?: string;
  imgClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  buttonClassName?: string;
}

export const StarterCards = ({
  imgUrl,
  title,
  // @ts-expect-error TS(2339) FIXME: Property 'subtitle' does not exist on type 'Starte... Remove this comment to see the full error message
  subtitle,
  content,
  button,
  className,
  imgClassName,
  titleClassName,
  contentClassName,
  buttonClassName,
}: StarterCardsProps) => (
  // @ts-expect-error TS(2322) FIXME: Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message
  <Card className={`flex flex-col w-full ${className || ''}`}>
    <div className="border-b-1.5 text-left flex flex-row gap-3 place-items-center p-6">
      <Image
        alt={title}
        src={imgUrl}
        width={48}
        height={48}
        className={imgClassName}
      />
      <div className="flex flex-col">
        <h2 className={`${TEXT_LARGE_CLASS} font-bold`}>{title}</h2>
        {subtitle && <div className="text-slate-600">{subtitle}</div>}
      </div>
    </div>
    <div
      className={`h-full flex flex-col p-6 w-full ${contentClassName || ''}`}
    >
      <div className="text-left w-full">{content}</div>
      <div className={`mt-auto ${buttonClassName || ''}`}>{button}</div>
    </div>
  </Card>
);
