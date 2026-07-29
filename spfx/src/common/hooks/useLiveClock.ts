import * as React from "react";

export interface ILiveClock {
  time: string;
  date: string;
}

export function useLiveClock(locale: string = "fr-FR"): ILiveClock {
  const [now, setNow] = React.useState<Date>(() => new Date());

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return {
    time: now.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: now.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
  };
}
