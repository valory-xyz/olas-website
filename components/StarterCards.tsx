import { TEXT_LARGE_CLASS } from 'common-util/classes';
import Image from 'next/image';
import { Card } from './ui/card';

interface StarterCardsProps {
  title: string;
  subtitle?: string;
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
  subtitle,
  content,
  button,
  className,
  imgClassName,
  titleClassName,
  contentClassName,
  buttonClassName,
}: StarterCardsProps) => (
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
