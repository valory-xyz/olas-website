import Image from 'next/image';
import NextLink from 'next/link';
import type { CSSProperties } from 'react';

type EconomyPillProps = {
  slug: string;
  label: string;
  icon: string;
  pillStyle?: CSSProperties;
  style?: CSSProperties;
};

export const EconomyPill = ({ slug, label, icon, pillStyle, style }: EconomyPillProps) => (
  <NextLink href={`/agent-economies/${slug}`} className="absolute z-10" style={style}>
    <div
      className="flex flex-row items-center gap-2.5 rounded-lg px-4 py-2 shadow-sm hover:-translate-y-0.5 duration-150"
      style={pillStyle}
    >
      <Image src={icon} alt={label} width={30} height={30} className="rounded-md" />
      <span className="text-gray-900 font-normal text-base leading-6 whitespace-nowrap">
        {label}
      </span>
    </div>
  </NextLink>
);
