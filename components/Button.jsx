import Link from "next/link";

export function Button({ href, className, size = "lg", isExternal = false, type = "primary", ...props }) {
  const fullClassName = `
    inline-flex
    items-center
    text-center
    justify-center
    border
    focus:ring-4

    ${
      type === "primary" && `
      bg-purple-900
      text-white
      border-primary
      hover:bg-white
      hover:text-purple-900
      focus:ring-gray-100
      `
    }

    ${
      type === "secondary" && `
      bg-white
      text-primary
      border-primary
      hover:bg-purple-900
      hover:text-white
      focus:ring-gray-100
      `
    }

    ${size === "lg" && `
      px-6
      py-4
      text-xl
      sm:text-3xl
      sm:px-8
      sm:py-5
      lg:text-xl
      lg:px-6
      lg:py-4
      rounded-lg
    `}

    ${size === "md" && `
      px-3
      py-2
      text-lg
      sm:text-2xl
      sm:px-6
      sm:py-4
      lg:text-lg
      lg:px-3
      lg:py-2
      rounded-md
    `}

    ${className}`;

  return href ? (
    <Link href={href} className={fullClassName} rel={isExternal && 'noopener noreferrer'} target={isExternal && "_blank"} {...props} />
  ) : (
    <button className={fullClassName} {...props} />
  );
}
