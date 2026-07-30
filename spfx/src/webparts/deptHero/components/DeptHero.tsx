import * as React from "react";

import { IDeptHeroProps } from "./IDeptHeroProps";
import { LiveClock } from "../../../common/utils/LiveClock";

const DOT_PATTERN: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
  backgroundSize: "28px 28px",
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export const DeptHero: React.FC<IDeptHeroProps> = (props) => {
  const {
    title,
    subtitle,
    userName,
    userRole,
    backgroundUrl,
    eyebrow,
    showClock,
    loading,
  } = props;

  const [bgFailed, setBgFailed] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!backgroundUrl) {
      setBgFailed(true);
      return undefined;
    }
    setBgFailed(false);
    const probe = new Image();
    probe.onerror = () => setBgFailed(true);
    probe.src = backgroundUrl;
    return () => {
      probe.onerror = null;
    };
  }, [backgroundUrl]);

  return (
    <div className="ika-root">
      <section
        className="ika-relative ika-isolate ika-overflow-hidden ika-bg-brand-navy ika-text-white"
        aria-labelledby="ika-dept-hero-title"
      >
        {backgroundUrl && !bgFailed ? (
          <img
            src={backgroundUrl}
            alt=""
            aria-hidden="true"
            className="ika-absolute ika-inset-0 -ika-z-10 ika-h-full ika-w-full ika-object-cover ika-object-center ika-opacity-30"
          />
        ) : null}

        <div
          aria-hidden="true"
          className="ika-absolute ika-inset-0 -ika-z-10 ika-bg-gradient-to-br ika-from-brand-navy-dark ika-via-brand-navy/85 ika-to-brand-navy/60"
        />
        <div
          aria-hidden="true"
          className="ika-absolute ika-inset-0 -ika-z-10 ika-opacity-[0.04]"
          style={DOT_PATTERN}
        />

        <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-12 sm:ika-px-6 sm:ika-py-16 lg:ika-px-8 lg:ika-py-20">
          <div className="ika-flex ika-flex-col ika-gap-10 lg:ika-flex-row lg:ika-items-end lg:ika-justify-between">
            <div className="ika-max-w-3xl">
              <div className="ika-inline-flex ika-items-center ika-gap-2 ika-rounded-full ika-bg-white/10 ika-px-3 ika-py-1 ika-text-xs ika-font-semibold ika-uppercase ika-tracking-wider ika-text-brand-cyan ika-backdrop-blur">
                <span
                  aria-hidden="true"
                  className="ika-h-1.5 ika-w-1.5 ika-rounded-full ika-bg-brand-cyan"
                />
                {eyebrow}
              </div>

              {loading ? (
                <div className="ika-mt-4 ika-space-y-3 ika-animate-pulse" aria-hidden="true">
                  <div className="ika-h-10 ika-w-2/3 ika-rounded ika-bg-white/20" />
                  <div className="ika-h-4 ika-w-full ika-max-w-xl ika-rounded ika-bg-white/10" />
                </div>
              ) : (
                <>
                  <h1
                    id="ika-dept-hero-title"
                    className="ika-mt-4 ika-text-3xl ika-font-bold ika-leading-tight ika-tracking-tight sm:ika-text-4xl lg:ika-text-5xl"
                  >
                    {title}
                  </h1>
                  {subtitle ? (
                    <p className="ika-mt-4 ika-max-w-2xl ika-text-base ika-text-white/80 sm:ika-text-lg">
                      {subtitle}
                    </p>
                  ) : null}
                </>
              )}
            </div>

            <div className="ika-flex ika-w-full ika-max-w-md ika-flex-col ika-gap-4 ika-rounded-2xl ika-border ika-border-white/10 ika-bg-white/5 ika-p-5 ika-backdrop-blur sm:ika-flex-row sm:ika-items-center sm:ika-gap-6">
              <div className="ika-flex ika-flex-1 ika-items-center ika-gap-4">
                <div
                  aria-hidden="true"
                  className="ika-grid ika-h-14 ika-w-14 ika-shrink-0 ika-place-items-center ika-rounded-full ika-bg-gradient-to-br ika-from-brand-cyan ika-to-brand-cyan-dark ika-text-lg ika-font-semibold ika-text-white ika-shadow-lg"
                >
                  {initials(userName)}
                </div>
                <div className="ika-min-w-0">
                  <p className="ika-text-xs ika-font-medium ika-uppercase ika-tracking-wider ika-text-brand-cyan">
                    Bonjour
                  </p>
                  <p className="ika-truncate ika-text-lg ika-font-semibold ika-leading-tight">
                    {userName}
                  </p>
                  {userRole ? (
                    <p className="ika-truncate ika-text-xs ika-text-white/70">
                      {userRole}
                    </p>
                  ) : null}
                </div>
              </div>

              {showClock ? (
                <>
                  <div
                    aria-hidden="true"
                    className="ika-hidden ika-h-12 ika-w-px ika-bg-white/15 sm:ika-block"
                  />
                  <LiveClock className="ika-min-w-[140px]" />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
