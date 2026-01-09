import { ArrowUpRight } from 'lucide-react';
import NextLink from 'next/link';

type H1Props = {
  children: React.ReactNode;
  className?: string;
};

export const H1 = ({ children, className }: H1Props) => (
  <h1
    className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
  >
    {children}
  </h1>
);

type H2Props = {
  children: React.ReactNode;
  className?: string;
};

export const H2 = ({ children, className = '' }: H2Props) => (
  <h2
    className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
  >
    {children}
  </h2>
);

H1.defaultProps = { className: null };

type LeadProps = {
  children: React.ReactNode;
  className?: string;
};

export const Lead = ({ children, className }: LeadProps) => (
  <p className={`text-xl text-muted-foreground ${className}`}>{children}</p>
);

Lead.defaultProps = { className: null };

type UpcaseProps = {
  children: React.ReactNode;
};

export const Upcase = ({ children }: UpcaseProps) => (
  <div className="mb-6 text-lg tracking-widest uppercase text-slate-700">
    {children}
  </div>
);

type ExternalLinkProps = {
  children: React.ReactNode;
  href: string;
  hideArrow?: boolean;
  className?: string;
};

export const ExternalLink = ({
  children,
  className,
  href,
  hideArrow,
}: ExternalLinkProps) => (
  <a
    className={`inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors duration-300 ${className}`}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
    {hideArrow ? null : <ArrowUpRight size={16} />}
  </a>
);

ExternalLink.defaultProps = { className: null, hideArrow: false };

type SubsiteLinkProps = {
  children: React.ReactNode;
  href: string;
  className?: string;
  isInButton?: boolean;
  isExternal?: boolean;
};

export const SubsiteLink = ({
  children,
  className,
  href,
  isInButton = false,
  isExternal = false,
}: SubsiteLinkProps) => {
  const textClass = isInButton
    ? 'text-white'
    : 'text-purple-600 hover:text-purple-800 transition-colors duration-300';

  return (
    <a
      className={`cursor-pointer ${textClass} ${className}`}
      href={href}
      rel="noopener noreferrer"
      target={isExternal ? '_blank' : undefined}
    >
      {children}
    </a>
  );
};

type LinkProps = {
  children: React.ReactNode;
  href: string | object;
  className?: string;
};

export const Link = ({ children, className, href }: LinkProps) => (
  <NextLink
    className={`text-purple-600 hover:text-purple-800 transition-colors duration-300 ${className}`}
    href={href}
  >
    {children}
  </NextLink>
);

Link.defaultProps = { className: null };
