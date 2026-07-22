import Image from 'next/image';
import Link from 'next/link';

import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';

export const ExplorerCallout = () => (
  <Card className="flex flex-col justify-between gap-6 rounded-xl border-none bg-white p-6 shadow-[0px_8px_24px_0px_rgba(24,39,75,0.12)] md:flex-row md:items-start">
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-col gap-2 text-left">
        <h5 className="text-lg font-medium text-black">Agent Economy Explorer</h5>
        <p className="text-slate-600">
          Explore a visual, time-aware view of Olas agent-economy activity.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/agent-economies/explorer">Visit Agent Economy Explorer</Link>
      </Button>
    </div>
    <Image
      src="/images/agent-economies/explorer-preview.png"
      alt="Agent Economy Explorer heatmap preview"
      width={292}
      height={146}
      className="shrink-0 [mask-image:linear-gradient(to_right,transparent,black_25%)] max-md:h-auto max-md:w-full"
    />
  </Card>
);
