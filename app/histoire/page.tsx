"use client";
import { useState } from "react";
import {
  Rocket,
  Users,
  Globe,
  Award,
  Code2,
  TrendingUp,
  MapPin,
  Calendar,
  ArrowRight,
  ChevronDown,
  Star,
  Zap,
  Shield,
  Heart,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────

const milestones = [
  {
    year: "2015",
    quarter: "T1",
    title: "La genèse",
    description:
      "YAYA Ouattara fonde IKA Solution dans un petit bureau de Ouagadougou avec une vision claire : démocratiser l'ingénierie digitale en Afrique de l'Ouest. Les trois premiers collaborateurs rejoignent l'aventure.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    icon: Rocket,
    tag: "Fondation",
    tagColor: "bg-violet-100 text-violet-700",
    stats: [
      { label: "Fondateurs", value: "3" },
      { label: "Projets", value: "1" },
    ],
    side: "right",
  },
  {
    year: "2016",
    quarter: "T3",
    title: "Premier grand contrat",
    description:
      "Signature du premier contrat majeur avec une institution financière nationale. Développement d'une plateforme de gestion bancaire qui marque notre entrée dans le secteur Fintech.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    icon: Award,
    tag: "Milestone",
    tagColor: "bg-amber-100 text-amber-700",
    stats: [
      { label: "Équipe", value: "8" },
      { label: "Clients", value: "4" },
    ],
    side: "left",
  },
  {
    year: "2018",
    quarter: "T2",
    title: "Expansion régionale",
    description:
      "Ouverture de notre deuxième bureau à Abidjan, Côte d'Ivoire. Lancement de notre pôle Data & IA et recrutement de nos premiers data scientists. IKA Solution devient un acteur reconnu en Afrique francophone.",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    icon: Globe,
    tag: "Expansion",
    tagColor: "bg-blue-100 text-blue-700",
    stats: [
      { label: "Équipe", value: "25" },
      { label: "Pays", value: "2" },
    ],
    side: "right",
  },
  {
    year: "2020",
    quarter: "T1",
    title: "Pivot digital & résilience",
    description:
      "Face à la pandémie mondiale, IKA Solution pivote et accompagne ses clients dans leur transformation numérique d'urgence. Lancement de notre plateforme cloud interne et passage au full remote.",
    image:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    icon: Zap,
    tag: "Innovation",
    tagColor: "bg-emerald-100 text-emerald-700",
    stats: [
      { label: "Équipe", value: "40" },
      { label: "Projets actifs", value: "18" },
    ],
    side: "left",
  },
  {
    year: "2022",
    quarter: "T4",
    title: "Certification & excellence",
    description:
      "Obtention de la certification ISO 27001 en cybersécurité. Lancement du programme IKA Academy pour la formation de jeunes talents africains aux métiers du numérique.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    icon: Shield,
    tag: "Certification",
    tagColor: "bg-rose-100 text-rose-700",
    stats: [
      { label: "Certifiés", value: "12" },
      { label: "Formés", value: "80+" },
    ],
    side: "right",
  },
  {
    year: "2024",
    quarter: "T2",
    title: "IKA Solution aujourd'hui",
    description:
      "Plus de 138 collaborateurs, présents dans 4 pays, avec un portefeuille de 200+ projets livrés. Nous continuons de bâtir le digital de demain avec passion, rigueur et innovation.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    icon: TrendingUp,
    tag: "Aujourd'hui",
    tagColor: "bg-brand-accent/10 text-brand-accent",
    stats: [
      { label: "Collaborateurs", value: "138" },
      { label: "Projets livrés", value: "200+" },
    ],
    side: "left",
  },
];

const values = [
  {
    icon: Code2,
    title: "Excellence Technique",
    desc: "Chaque ligne de code reflète notre obsession de la qualité et du détail.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Heart,
    title: "Passion & Engagement",
    desc: "Nous mettons notre cœur dans chaque projet, chaque client, chaque défi.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Users,
    title: "Esprit d'équipe",
    desc: "Notre force réside dans la diversité et la complémentarité de nos talents.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Globe,
    title: "Impact africain",
    desc: "Nous croyons au potentiel du numérique pour transformer l'Afrique.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const globalStats = [
  { icon: Users, value: "138", label: "Collaborateurs" },
  { icon: Globe, value: "4", label: "Pays" },
  { icon: Code2, value: "200+", label: "Projets livrés" },
  { icon: Star, value: "98%", label: "Satisfaction client" },
  { icon: Calendar, value: "9", label: "Années d'expérience" },
  { icon: Award, value: "12", label: "Certifications" },
];

const founders = [
  {
    name: "YAYA Ouattara",
    role: "Fondateur & Directeur Général",
    quote:
      "Notre mission est de prouver que l'excellence technologique n'a pas de frontières.",
    avatar: "/assets/team/DG.jpg",
    linkedin: "#",
  },
];

// ════════════════════════════════════════════════════════════
// HERO SECTION
// ════════════════════════════════════════════════════════════

function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80"
        alt="hero"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-[92vh] flex-col justify-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-12 bg-brand-accent" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-accent">
              Notre histoire
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
            Bâtir le{" "}
            <span className="relative">
              <span className="text-brand-accent">digital</span>
            </span>{" "}
            <br />
            de demain.
          </h1>

          {/* Subtitle */}
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-400">
            Depuis 2014, IKA Solution transforme les idées en solutions
            technologiques qui font avancer l&apos;Afrique et ses entreprises.
            Une aventure humaine, passionnée, et résolument tournée vers
            l&apos;avenir.
          </p>

          {/* CTA + quick stat */}
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#timeline"
              className="group flex items-center gap-2 rounded-full bg-brand-accent px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-accent/30 transition-all duration-200 hover:bg-brand-accent-dark hover:shadow-brand-accent/50"
            >
              Découvrir notre parcours
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin size={14} className="text-brand-accent" />
              <span className="text-sm">Fondée à Ouagadougou, 2014</span>
            </div>
          </div>
        </div>

        {/* Bottom stats strip */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/60 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-around gap-6 px-6 py-5">
            {globalStats.slice(0, 4).map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-accent/10">
                    <Icon size={16} className="text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold leading-none text-white">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-slate-500">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-24 right-10 hidden animate-bounce flex-col items-center gap-1 lg:flex">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
          Défiler
        </span>
        <ChevronDown size={16} className="text-slate-600" />
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// FOUNDERS SECTION
// ════════════════════════════════════════════════════════════

function Founders() {
  return (
    <section className="w-full bg-white px-4 py-20 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-accent">
            Les visionnaires
          </span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
            Ceux qui ont tout lancé
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            IKA Solution est née de la conviction que l&apos;Afrique mérite des
            solutions technologiques de classe mondiale.
          </p>
        </div>

        {/* Founders grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {founders.map((f, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Red accent top */}
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-brand-accent to-transparent" />

              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-brand-accent/30 shadow-md">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-extrabold text-slate-900">{f.name}</h3>
                  <p className="mt-0.5 text-sm font-semibold text-brand-accent">
                    {f.role}
                  </p>

                  {/* Quote */}
                  <blockquote className="mt-4 border-l-2 border-brand-accent/30 pl-4 text-sm italic leading-relaxed text-slate-500">
                    &ldquo;{f.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// TIMELINE SECTION
// ════════════════════════════════════════════════════════════

function Timeline() {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <section
      id="timeline"
      className="w-full bg-slate-50 px-4 py-20 font-sans sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-accent">
            Chronologie
          </span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
            9 ans d&apos;innovation
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            De trois fondateurs passionnés à une équipe de 138 experts — chaque
            étape a forgé ce que nous sommes aujourd&apos;hui.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center vertical line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-brand-accent via-slate-300 to-transparent md:block" />

          <div className="flex flex-col gap-16">
            {milestones.map((m, i) => {
              const Icon = m.icon;
              const isLeft = m.side === "left";
              const isActive = activeId === i;

              return (
                <div
                  key={i}
                  className={`relative flex flex-col items-center gap-8 md:flex-row ${
                    isLeft ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* ── Content card ── */}
                  <div className="w-full md:w-5/12">
                    <div
                      onClick={() => setActiveId(isActive ? null : i)}
                      className={`group cursor-pointer overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        isActive
                          ? "border-brand-accent/40 shadow-lg"
                          : "border-slate-200"
                      }`}
                    >
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={m.image}
                          alt={m.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Year badge */}
                        <div className="absolute left-4 top-4 rounded-xl bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                          <p className="text-xs font-bold text-white/60">
                            {m.quarter}
                          </p>
                          <p className="text-2xl font-extrabold leading-none text-white">
                            {m.year}
                          </p>
                        </div>

                        {/* Tag */}
                        <div className="absolute bottom-4 left-4">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${m.tagColor}`}
                          >
                            {m.tag}
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-6">
                        <h3 className="mb-2 text-xl font-extrabold text-slate-900 transition-colors group-hover:text-brand-accent">
                          {m.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-500">
                          {m.description}
                        </p>

                        {/* Stats */}
                        <div className="mt-5 flex gap-4">
                          {m.stats.map((s, j) => (
                            <div
                              key={j}
                              className="rounded-xl bg-slate-50 px-4 py-2.5 text-center"
                            >
                              <p className="text-xl font-extrabold text-brand-accent">
                                {s.value}
                              </p>
                              <p className="text-[10px] font-semibold text-slate-500">
                                {s.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Center dot ── */}
                  <div className="hidden md:flex md:w-2/12 md:items-center md:justify-center">
                    <div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full border-4 bg-white shadow-lg transition-all duration-300 ${
                        isActive
                          ? "border-brand-accent shadow-brand-accent/30"
                          : "border-slate-300"
                      }`}
                    >
                      <Icon
                        size={22}
                        className={
                          isActive ? "text-brand-accent" : "text-slate-400"
                        }
                      />
                    </div>
                  </div>

                  {/* ── Empty side ── */}
                  <div className="hidden md:block md:w-5/12" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// VALUES SECTION
// ════════════════════════════════════════════════════════════

function Values() {
  return (
    <section className="w-full bg-white px-4 py-20 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-accent">
            Notre ADN
          </span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
            Ce qui nous guide
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="group rounded-3xl border border-slate-100 bg-slate-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${v.bg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={22} className={v.color} />
                </div>
                <h3 className="mb-2 font-extrabold text-slate-900">
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// FULL STATS SECTION
// ════════════════════════════════════════════════════════════

function FullStats() {
  return (
    <section className="relative w-full overflow-hidden py-24 font-sans">
      {/* BG */}
      <img
        src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80"
        alt="stats bg"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-slate-950/90" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-accent">
            IKA en chiffres
          </span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white">
            Une croissance continue
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {globalStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-200 hover:border-brand-accent/30 hover:bg-brand-accent/10"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent/10 transition-colors group-hover:bg-brand-accent/20">
                  <Icon size={20} className="text-brand-accent" />
                </div>
                <p className="text-3xl font-extrabold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// VISION CTA SECTION
// ════════════════════════════════════════════════════════════

function VisionCTA() {
  return (
    <section className="w-full bg-white px-4 py-24 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center shadow-2xl">
          {/* Decorative blobs */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-accent">
              Et maintenant ?
            </span>
            <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
              Notre histoire continue de s&apos;écrire.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-slate-400">
              Rejoignez IKA Solution et participez à la prochaine étape de notre
              aventure. Que vous soyez client, partenaire ou talent, votre place
              est ici.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#"
                className="group flex items-center gap-2 rounded-full bg-brand-accent px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-accent/30 transition-all hover:bg-brand-accent-dark"
              >
                Nous rejoindre
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-bold text-white transition-all hover:border-white/40 hover:bg-white/10"
              >
                Nos services
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════

export default function HistoryPage() {
  return (
    <main className="w-full">
      <Hero />
      <Founders />
      <Timeline />
      <Values />
      <FullStats />
      <VisionCTA />
    </main>
  );
}
