import { ArrowUpRight } from 'lucide-react';
import NextLink from 'next/link';

interface H1Props {
  children: React.ReactNode;
  className?: string;
}

export const H1 = ({ children, className }: H1Props) => (
  <h1
    className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
  >
    {children}
  </h1>
);

export const H2 = ({ children, className }) => (
  <h2
    className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
  >
    {children}
  </h2>
);

H1.defaultProps = { className: null };

interface LeadProps {
  children: React.ReactNode;
  className?: string;
}

export const Lead = ({ children, className }: LeadProps) => (
  <p className={`text-xl text-muted-foreground ${className}`}>{children}</p>
);

Lead.defaultProps = { className: null };

interface UpcaseProps {
  children: React.ReactNode;
}

export const Upcase = ({ children }: UpcaseProps) => (
  <div className="mb-6 text-lg tracking-widest uppercase text-slate-700">
    {children}
  </div>
);

interface ExternalLinkProps {
  children: React.ReactNode;
  href: string;
  hideArrow?: boolean;
  className?: string;
}

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

interface SubsiteLinkProps {
  children: React.ReactNode;
  href: string;
  class?: string;
  isInButton?: boolean;
  isExternal?: boolean;
}

export const SubsiteLink = ({
  children,
  // @ts-expect-error TS(2339) FIXME: Property 'className' does not exist on type 'Subsi... Remove this comment to see the full error message
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

interface LinkProps {
  children: React.ReactNode;
  href: string | object;
  className?: string;
}

export const Link = ({ children, className, href }: LinkProps) => (
  <NextLink
    className={`text-purple-600 hover:text-purple-800 transition-colors duration-300 ${className}`}
    href={href}
  >
    {children}
  </NextLink>
);

Link.defaultProps = { className: null };
