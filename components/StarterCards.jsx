import { TEXT_LARGE_CLASS } from 'common-util/classes';
import Image from 'next/image';
import { Card } from './ui/card';

export const StarterCards = ({ imgUrl, title, content, button }) => (
  <Card className="flex flex-col">
    <div className="border-b-1.5 text-left flex flex-row gap-3 place-items-center p-6">
      <Image alt={title} src={imgUrl} width={40} height={40} />
      <h2 className={`${TEXT_LARGE_CLASS} font-bold`}>{title}</h2>
    </div>
    <div className="h-full flex flex-col p-6">
      <div className="text-left">{content}</div>
      <div className=" mt-auto">{button}</div>
    </div>
  </Card>
);
