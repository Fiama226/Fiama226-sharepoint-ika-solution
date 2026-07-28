import Image from "next/image";

import { LiveClock } from "@/components/intranet/live-clock";

type Props = {
  title: string;
  subtitle: string;
  userName: string;
  userRole: string;
  backgroundSrc?: string;
};

export function DeptHero({
  title,
  subtitle,
  userName,
  userRole,
  backgroundSrc = "/assets/BackgroundImage_IKA_Sharepoint.png",
}: Props) {
  return (
    <section
      className="relative isolate overflow-hidden bg-brand-navy text-white"
      aria-labelledby="dept-hero-title"
    >
      <Image
        src={backgroundSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-30"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-navy-dark via-brand-navy/85 to-brand-navy/60"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-cyan backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" aria-hidden />
              Espace département
           </div>
            <h1
              id="dept-hero-title"
              className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            >
              {title}
           </h1>
            <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
              {subtitle}
           </p>
         </div>

          <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:flex-row sm:items-center sm:gap-6">
            <div className="flex flex-1 items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-cyan-dark text-lg font-semibold text-white shadow-lg">
                {userName
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)}
             </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-brand-cyan">
                  Bonjour
               </p>
                <p className="truncate text-lg font-semibold leading-tight">
                  {userName}
               </p>
                <p className="truncate text-xs text-white/70">{userRole}</p>
             </div>
           </div>
            <div className="hidden h-12 w-px bg-white/15 sm:block" aria-hidden />
            <LiveClock className="min-w-[140px]" />
         </div>
       </div>
     </div>
   </section>
  );
}
