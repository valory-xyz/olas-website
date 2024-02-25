import { default as NextLink } from 'next/link';

export const H1 = ({ children, className }) => {
  return (
    <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}>
      {children}
    </h1>
  )
}

export const Lead = ({ children, className }) => (
  <p className={`text-xl text-muted-foreground ${className}`}>
    {children}
  </p>
);

export const Upcase = ({ children, className }) => {
  return (
    <div className="mb-6 text-lg tracking-widest uppercase text-slate-700">{children}</div>
  )
}

export const ExternalLink = ({ children, className, href }) => {
  return (
    <a
      className={`text-purple-600 hover:text-purple-800 transition-colors duration-300 ${className}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}&nbsp;↗
    </a>
  )
}

export const Link = ({ children, className, href }) => {
  return (
    <NextLink
      className={`text-purple-600 hover:text-purple-800 transition-colors duration-300 ${className}`}
      href={href}
    >
      {children}
    </NextLink>
  )
}