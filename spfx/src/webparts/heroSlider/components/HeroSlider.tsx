import "../../../styles/tailwind.css";

import * as React from "react";

import { IHeroSliderProps } from "./IHeroSliderProps";
import { useLiveClock } from "../../../common/hooks/useLiveClock";
import { usePrefersReducedMotion } from "../../../common/hooks/usePrefersReducedMotion";
import { buildImageUrl, cn } from "../../../common/utils/spUtils";

const SLIDE_INTERVAL_MS = 5000;
const MISSION_INTERVAL_MS = 6000;

function useRotator(
  count: number,
  intervalMs: number,
  paused: boolean
): [number, (index: number) => void] {
  const [index, setIndex] = React.useState<number>(0);

  React.useEffect(() => {
    if (paused || count <= 1) return undefined;
    const id = window.setInterval(
      () => setIndex((prev) => (prev + 1) % count),
      intervalMs
    );
    return () => window.clearInterval(id);
  }, [paused, count, intervalMs]);

  React.useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  return [index, setIndex];
}

const Dots: React.FC<{
  count: number;
  active: number;
  onSelect: (index: number) => void;
  label: string;
  itemLabel: string;
  size: "lg" | "sm";
}> = (props) => {
  const { count, active, onSelect, label, itemLabel, size } = props;
  if (count <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("ika-flex ika-items-center", size === "lg" ? "ika-gap-2" : "ika-gap-1.5")}
    >
      {Array.apply(null, Array(count)).map((_unused, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={index === active}
          aria-label={`${itemLabel} ${index + 1} sur ${count}`}
          onClick={() => onSelect(index)}
          className={cn(
            "ika-rounded-full ika-transition-all ika-duration-500",
            "focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-white",
            size === "lg" ? "ika-h-1" : "ika-h-1",
            index === active
              ? size === "lg"
                ? "ika-w-8 ika-bg-brand-accent"
                : "ika-w-6 ika-bg-brand-accent"
              : size === "lg"
                ? "ika-w-3 ika-bg-white/40 hover:ika-bg-white/70"
                : "ika-w-2 ika-bg-white/30 hover:ika-bg-white/60"
          )}
        />
      ))}
    </div>
  );
};

export const HeroSlider: React.FC<IHeroSliderProps> = (props) => {
  const {
    slides,
    missions,
    stats,
    currentUser,
    currentUserRole,
    loading,
    error,
    heightClass,
    showClock,
    showPanel,
  } = props;

  const [hovered, setHovered] = React.useState<boolean>(false);
  const reduced = usePrefersReducedMotion();
  const clock = useLiveClock("fr-FR");

  const paused = hovered || reduced;
  const [slideIndex, setSlideIndex] = useRotator(
    slides.length,
    SLIDE_INTERVAL_MS,
    paused
  );
  const [missionIndex, setMissionIndex] = useRotator(
    missions.length,
    MISSION_INTERVAL_MS,
    paused
  );

  if (loading) {
    return (
      <div className="ika-root">
        <section
          className={cn(
            "ika-relative ika-w-full ika-animate-pulse ika-bg-brand-navy",
            heightClass
          )}
          aria-busy="true"
        />
      </div>
    );
  }

  if (error || slides.length === 0) {
    return (
      <div className="ika-root">
        <section
          className={cn(
            "ika-relative ika-flex ika-w-full ika-items-center ika-justify-center ika-bg-brand-navy ika-px-8 ika-text-center ika-text-white",
            heightClass
          )}
        >
          <div>
            <h1 className="ika-text-3xl ika-font-extrabold md:ika-text-5xl">
              Bienvenue sur l&apos;intranet IKA Solution
            </h1>
            <p className="ika-mt-3 ika-text-white/70">
              {error
                ? "Les visuels d'accueil sont momentanément indisponibles."
                : "Ajoutez des diapositives dans la bibliothèque « HeroSlides »."}
            </p>
          </div>
        </section>
      </div>
    );
  }

  const activeSlide = slides[slideIndex];

  return (
    <div className="ika-root">
      <section
        aria-roledescription="carrousel"
        aria-label="Actualités de l'entreprise"
        className={cn("ika-relative ika-w-full ika-overflow-hidden", heightClass)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.Id}
            aria-hidden={index !== slideIndex}
            className="ika-absolute ika-inset-0 ika-transition-opacity ika-duration-1000"
            style={{
              opacity: index === slideIndex ? 1 : 0,
              zIndex: index === slideIndex ? 1 : 0,
            }}
          >
            <img
              src={buildImageUrl(slide.EncodedAbsUrl || slide.FileRef)}
              alt={slide.AltText || ""}
              className="ika-h-full ika-w-full ika-object-cover"
            />
            <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-r ika-from-black/80 ika-via-black/40 ika-to-black/10" />
            <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-t ika-from-black/60 ika-via-transparent ika-to-transparent" />
          </div>
        ))}

        <div className="ika-absolute ika-inset-0 ika-z-10 ika-flex ika-flex-col ika-justify-between ika-p-8 md:ika-p-14">
          <div className="ika-flex ika-items-center ika-justify-between">
            <div
              aria-hidden="true"
              className="ika-h-8 ika-w-1 ika-rounded-full ika-bg-brand-accent"
            />
            {showClock ? (
              <div
                className="ika-hidden ika-flex-col ika-items-end md:ika-flex"
                aria-live="polite"
              >
                <span className="ika-text-xl ika-font-bold ika-tabular-nums ika-tracking-widest ika-text-white">
                  {clock.time}
                </span>
                <span className="ika-mt-0.5 ika-text-xs ika-capitalize ika-text-white/60">
                  {clock.date}
                </span>
              </div>
            ) : null}
          </div>

          <div className="ika-flex ika-items-end ika-justify-between ika-gap-6">
            <div className="ika-max-w-xl">
              <div key={activeSlide.Id} className="ika-transition-all ika-duration-700">
                {activeSlide.SubCaption ? (
                  <p className="ika-mb-3 ika-text-xs ika-font-semibold ika-uppercase ika-tracking-[4px] ika-text-brand-accent">
                    {activeSlide.SubCaption}
                  </p>
                ) : null}
                <h1 className="ika-text-3xl ika-font-extrabold ika-leading-tight ika-text-white ika-drop-shadow-xl md:ika-text-5xl">
                  {activeSlide.Caption}
                </h1>
              </div>

              <div className="ika-mt-6">
                <Dots
                  count={slides.length}
                  active={slideIndex}
                  onSelect={setSlideIndex}
                  label="Choisir un visuel"
                  itemLabel="Visuel"
                  size="lg"
                />
              </div>
            </div>

            {showPanel ? (
              <div className="ika-hidden ika-w-[340px] ika-shrink-0 ika-flex-col ika-gap-4 lg:ika-flex">
                <div className="ika-flex ika-items-center ika-gap-4 ika-rounded-2xl ika-border ika-border-white/20 ika-bg-white/10 ika-px-5 ika-py-4 ika-backdrop-blur-md">
                  <div className="ika-min-w-0">
                    <p className="ika-text-xs ika-uppercase ika-tracking-widest ika-text-white/60">
                      Bienvenue
                    </p>
                    <p className="ika-truncate ika-text-base ika-font-bold ika-leading-tight ika-text-white">
                      {currentUser}
                    </p>
                    {currentUserRole ? (
                      <p className="ika-mt-0.5 ika-truncate ika-text-xs ika-text-brand-accent">
                        {currentUserRole}
                      </p>
                    ) : null}
                  </div>
                  <div className="ika-ml-auto ika-flex ika-flex-col ika-items-center ika-gap-1">
                    <span
                      aria-hidden="true"
                      className="ika-h-2.5 ika-w-2.5 ika-rounded-full ika-bg-green-400 ika-animate-pulse motion-reduce:ika-animate-none"
                    />
                    <span className="ika-text-[10px] ika-text-white/40">
                      En ligne
                    </span>
                  </div>
                </div>

                {missions.length > 0 ? (
                  <div className="ika-min-h-[180px] ika-rounded-2xl ika-border ika-border-white/20 ika-bg-white/10 ika-px-5 ika-py-5 ika-backdrop-blur-md">
                    {missions.map((mission, index) => (
                      <div
                        key={mission.Id}
                        aria-hidden={index !== missionIndex}
                        className="ika-flex-col ika-gap-2 ika-transition-opacity ika-duration-700"
                        style={{
                          opacity: index === missionIndex ? 1 : 0,
                          display: index === missionIndex ? "flex" : "none",
                        }}
                      >
                        <div className="ika-mb-1 ika-flex ika-items-center ika-gap-2">
                          <span aria-hidden="true" className="ika-text-xl">
                            {mission.IconName}
                          </span>
                          <span className="ika-text-xs ika-font-semibold ika-uppercase ika-tracking-widest ika-text-brand-accent">
                            {mission.Tag}
                          </span>
                        </div>
                        <h3 className="ika-text-sm ika-font-bold ika-leading-snug ika-text-white">
                          {mission.Title}
                        </h3>
                        <p className="ika-text-xs ika-leading-relaxed ika-text-white/60">
                          {mission.MissionText}
                        </p>
                      </div>
                    ))}

                    <div className="ika-mt-4">
                      <Dots
                        count={missions.length}
                        active={missionIndex}
                        onSelect={setMissionIndex}
                        label="Choisir une mission"
                        itemLabel="Mission"
                        size="sm"
                      />
                    </div>
                  </div>
                ) : null}

                {stats.length > 0 ? (
                  <div className="ika-grid ika-grid-cols-3 ika-gap-2">
                    {stats.slice(0, 3).map((stat) => (
                      <div
                        key={stat.Id}
                        className="ika-flex ika-flex-col ika-items-center ika-rounded-xl ika-border ika-border-white/20 ika-bg-white/10 ika-px-3 ika-py-3 ika-text-center ika-backdrop-blur-md"
                      >
                        <span aria-hidden="true" className="ika-mb-1 ika-text-lg">
                          {stat.IconName}
                        </span>
                        <span className="ika-text-lg ika-font-extrabold ika-leading-none ika-text-white">
                          {stat.StatValue}
                        </span>
                        <span className="ika-mt-0.5 ika-text-[10px] ika-leading-tight ika-text-white/50">
                          {stat.Title}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};
