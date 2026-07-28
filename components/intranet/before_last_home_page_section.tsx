"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  Cake,
  Briefcase,
  Search,
  Filter,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { LucideIcon } from "@/lib/lucide-icon";
import type { HomeCollaborator, HomeGalleryImage } from "@/types/intranet";

// Web Part SPFx ↦ « Galerie + Notre équipe ».
// Données par props (plain-serializable). Icônes département =
// nom string → LucideIcon lookup. Composants lucide pour UI fixe
// (Search, Filter, etc.) importés directement.

interface GalleryAndTeamProps {
  galleryImages: HomeGalleryImage[];
  collaborators: HomeCollaborator[];
}

const categories = ["Tous", "Événements", "Formation", "Projets"];

const deptColors: Record<string, { color: string; bg: string; icon: string }> = {
  Direction: { color: "text-violet-700", bg: "bg-violet-100", icon: "BarChart3" },
  Engineering: { color: "text-blue-700", bg: "bg-blue-100", icon: "Code2" },
  "Ventes & Marketing": { color: "text-orange-700", bg: "bg-orange-100", icon: "Cpu" },
  Comptabilité: { color: "text-emerald-700", bg: "bg-emerald-100", icon: "ShieldCheck" },
};

const fallbackDept = { color: "text-slate-700", bg: "bg-slate-100", icon: "Users" };

const formatBirthdate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("fr-FR", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const getAge = (dateStr: string) => {
  const today = new Date();
  const birth = new Date(dateStr);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const isBirthdaySoon = (dateStr: string) => {
  const today = new Date();
  const birth = new Date(dateStr);
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return (next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 30;
};

function GalleryA({ galleryImages }: { galleryImages: HomeGalleryImage[] }) {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [lightbox, setLightbox] = useState<HomeGalleryImage | null>(null);

  const filtered =
    activeCategory === "Tous"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const navigate = useCallback(
    (dir: number) => {
      if (!lightbox) return;
      const idx = filtered.findIndex((i) => i.id === lightbox.id);
      setLightbox(filtered[(idx + dir + filtered.length) % filtered.length]);
    },
    [lightbox, filtered],
  );

  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Focus trap + keyboard nav when lightbox is open
  useEffect(() => {
    if (!lightbox) return;
    closeBtnRef.current?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
        return;
      }
      if (e.key === "ArrowLeft") { navigate(-1); return; }
      if (e.key === "ArrowRight") { navigate(1); return; }
      if (e.key !== "Tab") return;

      const el = lightboxRef.current;
      if (!el) return;
      const focusable = el.querySelectorAll<HTMLElement>(
        'button, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [lightbox, navigate]);

  return (
    <section className="w-full border-t border-slate-200 bg-white px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-brand-accent" />
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Galerie
            </h2>
          </div>
          <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
            {filtered.length} photos
          </span>
        </div>
        <p className="mb-6 text-sm text-slate-500">
          Moments forts de la vie de l&apos;entreprise
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              aria-label={`Filtrer par catégorie ${cat}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "border-brand-accent bg-brand-accent text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-accent hover:text-brand-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {filtered.map((img, i) => (
            <div
              key={img.id}
              role="button"
              tabIndex={0}
              aria-label={`Agrandir : ${img.caption}`}
              onClick={() => setLightbox(img)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLightbox(img); }}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl shadow-sm ${
                i % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              style={{ minHeight: i % 5 === 0 ? "260px" : "130px" }}
            >
              <Image
                src={img.url}
                alt={img.caption}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ minHeight: "inherit" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-xs font-bold leading-tight text-white">
                  {img.caption}
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-accent">
                  {img.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeBtnRef}
              onClick={() => setLightbox(null)}
              aria-label="Fermer la lightbox"
              className="absolute -top-10 right-0 text-white transition-colors hover:text-brand-accent"
            >
              <X size={28} />
            </button>
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={lightbox.url}
                alt={lightbox.caption}
                width={1200}
                height={700}
                sizes="(max-width: 1024px) 100vw, 896px"
                className="max-h-[70vh] w-full object-cover"
              />
              <div className="flex items-center justify-between bg-slate-900 px-6 py-4">
                <div>
                  <p className="font-bold text-white">{lightbox.caption}</p>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-accent">
                    {lightbox.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  {([-1, 1] as const).map((dir) => (
                    <button
                      key={dir}
                      onClick={() => navigate(dir)}
                      aria-label={dir === -1 ? "Image précédente" : "Image suivante"}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
                    >
                      {dir === -1 ? (
                        <ChevronLeft size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CollaboratorsA({ collaborators }: { collaborators: HomeCollaborator[] }) {
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState("Tous");
  const [selected, setSelected] = useState<HomeCollaborator | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);

  const deptList = [
    "Tous",
    ...Array.from(new Set(collaborators.map((c) => c.department))),
  ];

  useEffect(() => {
    if (!selected) return;
    modalCloseRef.current?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSelected(null); return; }
      if (e.key !== "Tab") return;
      const el = modalRef.current;
      if (!el) return;
      const focusable = el.querySelectorAll<HTMLElement>(
        'button, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [selected]);

  const filtered = collaborators.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.occupation.toLowerCase().includes(search.toLowerCase());
    const matchDept = activeDept === "Tous" || c.department === activeDept;
    return matchSearch && matchDept;
  });

  return (
    <section className="w-full border-t border-slate-200 bg-slate-50 px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-brand-accent" />
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Notre équipe
            </h2>
          </div>
          <span className="ml-auto rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-sm">
            {filtered.length} collaborateurs
          </span>
        </div>
        <p className="mb-6 text-sm text-slate-500">
          Les talents qui font avancer l&apos;ingénierie digitale
        </p>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Rechercher par nom ou poste…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher un collaborateur"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition-colors focus:border-brand-accent focus:outline-none"
            />
          </div>
          <div className="relative">
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={activeDept}
              onChange={(e) => setActiveDept(e.target.value)}
              aria-label="Filtrer par département"
              className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-700 shadow-sm transition-colors focus:border-brand-accent focus:outline-none"
            >
              {deptList.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((person) => {
            const cfg = deptColors[person.department] ?? fallbackDept;

            return (
              <div
                key={person.id}
                role="button"
                tabIndex={0}
                aria-label={`Voir le profil de ${person.name}`}
                onClick={() => setSelected(person)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelected(person); }}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={person.avatar}
                    alt={person.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  {isBirthdaySoon(person.birthdate) && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-white">
                      <Cake size={10} />
                      Bientôt !
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.color}`}
                    >
                      <LucideIcon name={cfg.icon} size={9} />
                      {person.department}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="truncate font-bold text-slate-900 transition-colors group-hover:text-brand-accent">
                    {person.name}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                    <Briefcase size={10} />
                    {person.occupation}
                  </p>
                  <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                    <Cake size={11} className="text-amber-500" />
                    <span>{formatBirthdate(person.birthdate)}</span>
                    <span className="ml-auto font-bold text-slate-700">
                      {getAge(person.birthdate)} ans
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <Users size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm text-slate-400">Aucun collaborateur trouvé</p>
          </div>
        )}
      </div>

      {selected && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-52">
              <Image
                src={selected.avatar}
                alt={selected.name}
                fill
                sizes="(max-width: 448px) 100vw, 448px"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                ref={modalCloseRef}
                onClick={() => setSelected(null)}
                aria-label="Fermer le profil"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
              >
                <X size={16} />
              </button>
              {isBirthdaySoon(selected.birthdate) && (
                <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-white">
                  <Cake size={10} />
                  Anniversaire bientôt !
                </div>
              )}
              <div className="absolute bottom-4 left-5">
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                  {selected.department}
                </p>
                <h2 className="text-xl font-extrabold text-white">
                  {selected.name}
                </h2>
                <p className="text-xs text-white/70">{selected.occupation}</p>
              </div>
            </div>

            <div className="p-6">
              {[
                {
                  icon: Cake,
                  label: "Anniversaire",
                  value: `${formatBirthdate(selected.birthdate)} (${getAge(selected.birthdate)} ans)`,
                },
                {
                  icon: MapPin,
                  label: "Localisation",
                  value: selected.location,
                },
                { icon: Mail, label: "Email", value: selected.email },
                { icon: Phone, label: "Téléphone", value: selected.phone },
              ].map((row, i) => {
                const Icon = row.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 border-b border-slate-100 py-3 last:border-0"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                      <Icon size={15} className="text-brand-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {row.label}
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {row.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function GalleryAndTeam({
  galleryImages,
  collaborators,
}: GalleryAndTeamProps) {
  return (
    <div className="flex flex-col lg:flex-row">
      <CollaboratorsA collaborators={collaborators} />
      <GalleryA galleryImages={galleryImages} />
    </div>
  );
}