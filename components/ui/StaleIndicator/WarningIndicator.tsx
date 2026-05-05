import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';
import { ReactNode } from 'react';

type WarningIndicatorProps = {
  children: ReactNode;
};

export const WarningIndicator = ({ children }: WarningIndicatorProps) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger className="text-amber-500 inline-flex items-center">
          <Info size={20} />
        </Tooltip.Trigger>
        <Tooltip.Content
          side="top"
          className="p-2 text-sm bg-white border rounded-lg shadow-lg max-w-[320px] z-50"
        >
          <div className="flex flex-col items-start text-left text-gray-800">{children}</div>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
