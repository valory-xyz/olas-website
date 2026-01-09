import { Card } from 'components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export const OlasToken = () => (
  <div className="flex flex-col place-items-center mt-auto gap-4">
    <Image
      src="/images/roadmap-page/olas-token-logo.png"
      alt="OLAS token"
      width={70}
      height={78}
    />
    <p className="text-xl font-semibold">OLAS Token</p>
    <Card className="activity-card-opaque p-4 w-[326px] text-center">
      OLAS bootstraps the{' '}
      <Link
        href="/#agent-economies"
        className="text-purple-700 hover:text-purple-800"
      >
        flywheel between Pearl and Mech Marketplace
      </Link>
    </Card>
  </div>
);
