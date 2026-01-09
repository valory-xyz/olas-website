import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import { StaleMetricContent } from "./StaleContent";
import { StaleIndicatorProps } from "./types";

export const StaleIndicator = ({ status }: StaleIndicatorProps) => {
  if (!status?.stale) return null;

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger className='text-amber-500 inline-flex items-center'>
          <Info size={20} />
        </Tooltip.Trigger>
        <Tooltip.Content
          side='top'
          className='p-2 text-sm bg-white border rounded-lg shadow-lg max-w-[320px] z-50'
        >
          <StaleMetricContent status={status} />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
