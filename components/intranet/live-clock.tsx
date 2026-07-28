"use client";

import { useEffect, useState } from "react";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function format(date: Date): { time: string; weekday: string; date: string } {
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  const weekday = date.toLocaleDateString("fr-FR", { weekday: "long" });
  const dateStr = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return { time, weekday, date: dateStr };
}

export function LiveClock({ className = "" }: { className?: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { time, weekday, date } = format(now);
  const capitalisedWeekday =
    weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return (
    <div className={`flex h-full flex-col gap-1 text-white ${className}`}>
      <span className="font-mono text-2xl font-bold leading-none tabular-nums sm:text-3xl">
        {time}
     </span>
      <span className="text-xs font-medium uppercase tracking-wider text-white/70">
        {capitalisedWeekday}
     </span>
      <span className="text-sm text-white/85">{date}</span>
   </div>
  );
}
