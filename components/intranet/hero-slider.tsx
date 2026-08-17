"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import type {
  HomeHeroSlide,
  HomeHeroStat,
  HomeMission,
} from "@/types/intranet";

interface HeroSliderProps {
  slides: HomeHeroSlide[];
  missions: HomeMission[];
  stats: HomeHeroStat[];
  currentUser: string;
  currentUserRole: string;
}

export function HeroSlider({
  slides,
  missions,
  stats,
  currentUser,
  currentUserRole,
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [missionSlide, setMissionSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const SLIDE_TICKS = 5;
    const MISSION_TICKS = 6;
    let tick = 0;
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      tick += 1;
      if (prefersReduced) return;
      if (tick % SLIDE_TICKS === 0) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
      if (tick % MISSION_TICKS === 0) {
        setMissionSlide((prev) => (prev + 1) % missions.length);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [prefersReduced, slides.length, missions.length]);

  const formatDate = () =>
    currentTime.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = () =>
    currentTime.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Actualités de l'entreprise"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== currentSlide}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: i === currentSlide ? 1 : 0,
            zIndex: i === currentSlide ? 1 : 0,
          }}
        >
          <Image
            src={slide.image}
            alt={slide.caption}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* ── OVERLAY CONTENT ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-14">
        {/* TOP BAR: date + time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-brand-accent rounded-full" />
          </div>
          <div className="hidden md:flex flex-col items-end" aria-live="polite">
            <span className="text-white font-bold text-xl tabular-nums tracking-widest">
              {formatTime()}
            </span>
            <span className="text-white/60 text-xs capitalize mt-0.5">
              {formatDate()}
            </span>
          </div>
        </div>

        {/* MIDDLE: Slide caption (bottom-left) + Right floating panel */}
        <div className="flex items-end justify-between gap-6">
          {/* ── Slide caption ── */}
          <div className="max-w-xl">
            {slides.map((slide, i) => (
              <div
                key={i}
                aria-hidden={i !== currentSlide}
                className="transition-all duration-700"
                style={{
                  opacity: i === currentSlide ? 1 : 0,
                  display: i === currentSlide ? "block" : "none",
                }}
              >
                <p className="text-brand-accent text-xs font-semibold tracking-[4px] uppercase mb-3">
                  {slide.sub}
                </p>
                <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-xl">
                  {slide.caption}
                </h1>
              </div>
            ))}

            {/* Slide dots */}
            <div className="flex items-center gap-2 mt-6" role="tablist" aria-label="Choisir un visuel">
              {slides.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === currentSlide}
                  aria-label={`Visuel ${i + 1} sur ${slides.length}`}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === currentSlide
                      ? "w-8 bg-brand-accent"
                      : "w-3 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT FLOATING PANEL ─────────────────────────── */}
          <div className="hidden lg:flex flex-col gap-4 w-[340px] shrink-0">
            {/* Welcome card */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest">
                  Bienvenue
                </p>
                <p className="text-white font-bold text-base leading-tight">
                  {currentUser}
                </p>
                <p className="text-brand-accent text-xs mt-0.5">
                  {currentUserRole}
                </p>
              </div>
              {/* Online badge */}
              <div className="ml-auto flex flex-col items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/40 text-[10px]">En ligne</span>
              </div>
            </div>

            {/* Mission / Vision / Valeurs slider */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-5 min-h-[180px]">
              {missions.map((m, i) => (
                <div
                  key={i}
                  aria-hidden={i !== missionSlide}
                  className="transition-opacity duration-700"
                  style={{
                    opacity: i === missionSlide ? 1 : 0,
                    display: i === missionSlide ? "flex" : "none",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl" aria-hidden>
                      {m.icon}
                    </span>
                    <span className="text-brand-accent text-xs font-semibold tracking-widest uppercase">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-sm leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {m.text}
                  </p>
                </div>
              ))}

              {/* Mission dots */}
              <div className="flex gap-1.5 mt-4" role="tablist" aria-label="Choisir une mission">
                {missions.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === missionSlide}
                    aria-label={`Mission ${i + 1} sur ${missions.length}`}
                    onClick={() => setMissionSlide(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === missionSlide
                        ? "w-6 bg-brand-accent"
                        : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-3 flex flex-col items-center text-center"
                >
                  <span className="text-lg mb-1" aria-hidden>
                    {stat.icon}
                  </span>
                  <span className="text-white font-extrabold text-lg leading-none">
                    {stat.value}
                  </span>
                  <span className="text-white/50 text-[10px] mt-0.5 leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
