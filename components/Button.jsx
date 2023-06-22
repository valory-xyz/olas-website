import Link from 'next/link'

export function Button({ href, className, ...props }) {
  const fullClassName = `inline-flex justify-center rounded-lg bg-pink-500 p-4 text-xl font-semibold text-white hover:bg-pink-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:text-white/70 ${className}`
  
  return href ? (
    <Link href={href} className={fullClassName} {...props} />
  ) : (
    <button className={fullClassName} {...props} />
  )
}
