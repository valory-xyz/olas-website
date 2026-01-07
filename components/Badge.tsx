interface BadgeProps {
  children: React.ReactNode;
}

// TODO: check what's the difference with components/ui/badge.jsx
const Badge = ({ children }: BadgeProps) => (
  <span className="bg-gray-100 border border-gray-300 text-gray-800 text-sm md:text-xl lg:text-sm font-medium mr-2 px-2.5 py-0.5 md:px-4 md:py-1 lg:px-2.5 lg:py-0.5 rounded">
    {children}
  </span>
);

export default Badge;
