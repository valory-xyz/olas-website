import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const BlogBackButton = () => (
  <div className="w-fit mb-4 gap-2 text-purple-800">
    <Link href="/blog" className="flex">
      <ChevronLeft color="#7E22CE" /> Blog
    </Link>
  </div>
);
