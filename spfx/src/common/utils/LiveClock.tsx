import * as React from "react";

import { useLiveClock } from "../hooks/useLiveClock";
import { cn } from "./spUtils";

export interface ILiveClockProps {
  className?: string;
}

export const LiveClock: React.FC<ILiveClockProps> = (props) => {
  const clock = useLiveClock("fr-FR");

  return (
    <div className={cn("ika-text-right", props.className)}>
      <p className="ika-text-2xl ika-font-semibold ika-leading-none ika-tabular-nums">
        {clock.time}
      </p>
      <p className="ika-mt-1 ika-text-xs ika-capitalize ika-text-white/70">
        {clock.date}
      </p>
    </div>
  );
};
