import * as React from "react";

import { ITeamHomeProps } from "./ITeamHomeProps";
import { ICollaborateur } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { cn, buildImageUrl, buildUserPhotoUrl } from "../../../common/utils/spUtils";

/**
 * TeamHome — port 1:1 de la section « Notre équipe » de
 * components/intranet/before_last_home_page_section.tsx (maquette Next.js) :
 * grille de collaborateurs, recherche, filtre département, badges
 * d'anniversaire et fiche profil modale.
 */

const DEPT_COLORS: Record<string, { color: string; bg: string; icon: string }> = {
  Direction: { color: "ika-text-violet-700", bg: "ika-bg-violet-100", icon: "BarChart3" },
  "Direction Générale": {
    color: "ika-text-violet-700",
    bg: "ika-bg-violet-100",
    icon: "BarChart3",
  },
  Engineering: { color: "ika-text-blue-700", bg: "ika-bg-blue-100", icon: "Code2" },
  "Ventes & Marketing": {
    color: "ika-text-orange-700",
    bg: "ika-bg-orange-100",
    icon: "Cpu",
  },
  Comptabilité: {
    color: "ika-text-emerald-700",
    bg: "ika-bg-emerald-100",
    icon: "ShieldCheck",
  },
};

const FALLBACK_DEPT = {
  color: "ika-text-slate-700",
  bg: "ika-bg-slate-100",
  icon: "Users",
};

// Grille en mode `compact` (section mi-largeur partagée avec la Galerie).
//
// La carte horizontale a une hauteur intrinsèque fixe (~62 px) : contrairement
// à l'ancienne carte verticale, dont la photo absorbait la hauteur de rangée
// via `flex-1`, elle ne doit PAS s'étirer — une rangée haute donnerait une
// grande carte presque vide. `auto-rows-min` laisse donc chaque rangée à la
// hauteur naturelle des cartes, et c'est la grille qui défile.
//
// En dessous de `lg` les deux blocs s'empilent en hauteur naturelle : on
// retombe sur un plafond fixe de 22rem (~5 rangées de cartes).
const COMPACT_ROW_HEIGHT = "lg:ika-auto-rows-min";
const COMPACT_STACKED_MAX_HEIGHT = "ika-max-h-[22rem] lg:ika-max-h-none";

function formatBirthdate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getAge(dateStr: string | undefined): number | null {
  if (!dateStr) return null;
  const today = new Date();
  const birth = new Date(dateStr);
  if (isNaN(birth.getTime())) return null;
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function isBirthdaySoon(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const today = new Date();
  const birth = new Date(dateStr);
  if (isNaN(birth.getTime())) return false;
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return (next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 30;
}

function personPhoto(person: ICollaborateur): string {
  if (person.Photo) return buildImageUrl(person.Photo, 600);
  return buildUserPhotoUrl(person.Email, "L");
}

export const TeamHome: React.FC<ITeamHomeProps> = (props) => {
  const {
    title,
    description,
    members,
    loading,
    error,
    showSearch,
    showBirthdays,
    compact,
  } = props;

  // En mode `compact` la section est une colonne de hauteur pleine (elle
  // partage une rangée flex avec la Galerie) : pas de filet horizontal en
  // haut — c'est le conteneur parent qui porte la bordure de bande.
  const sectionClass = cn(
    "ika-w-full ika-border-slate-200 ika-bg-slate-50 ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8",
    compact ? "ika-flex ika-h-full ika-flex-col" : "ika-border-t"
  );
  const shellClass = cn(
    "ika-mx-auto ika-w-full ika-max-w-7xl",
    compact && "ika-flex ika-min-h-0 ika-flex-1 ika-flex-col"
  );

  const [search, setSearch] = React.useState<string>("");
  const [activeDept, setActiveDept] = React.useState<string>("Tous");
  const [selected, setSelected] = React.useState<ICollaborateur | null>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const modalCloseRef = React.useRef<HTMLButtonElement>(null);

  const deptList = [
    "Tous",
    ...Array.from(new Set(members.map((c) => c.Division || "Autre"))),
  ];

  React.useEffect(() => {
    if (!selected) return;
    modalCloseRef.current?.focus();

    const trap = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        setSelected(null);
        return;
      }
      if (e.key !== "Tab") return;
      const el = modalRef.current;
      if (!el) return;
      const focusable = el.querySelectorAll<HTMLElement>(
        'button, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [selected]);

  const selectedAge = selected ? getAge(selected.Birthdate) : null;

  const filtered = members.filter((c) => {
    const name = c.Title || "";
    const job = c.JobTitle || "";
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      job.toLowerCase().includes(search.toLowerCase());
    const matchDept =
      activeDept === "Tous" || (c.Division || "Autre") === activeDept;
    return matchSearch && matchDept;
  });

  if (loading) {
    return (
      <div className={cn("ika-root", compact && "ika-h-full")}>
        <section className={sectionClass}>
          <div className={cn(shellClass, "ika-animate-pulse")}>
            <div className="ika-mb-6 ika-h-7 ika-w-48 ika-rounded ika-bg-slate-200" />
            <div
              className={cn(
                "ika-grid ika-gap-4",
                compact
                  ? "ika-grid-cols-2"
                  : "ika-grid-cols-1 sm:ika-grid-cols-2 lg:ika-grid-cols-3 xl:ika-grid-cols-4"
              )}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "ika-rounded-2xl ika-bg-slate-100",
                    compact ? "ika-h-16" : "ika-h-16"
                  )}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("ika-root", compact && "ika-h-full")}>
        <section className={sectionClass}>
          <div
            role="alert"
            className={cn(
              shellClass,
              "ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
            )}
          >
            <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={cn("ika-root", compact && "ika-h-full")}>
      <section className={sectionClass}>
        <div className={shellClass}>
          <div className="ika-mb-2 ika-flex ika-flex-wrap ika-items-center ika-gap-3">
            <div className="ika-flex ika-items-center ika-gap-2">
              <span
                aria-hidden="true"
                className="ika-h-5 ika-w-1 ika-rounded-full ika-bg-brand-accent"
              />
              <h2 className="ika-text-3xl ika-font-extrabold ika-tracking-tight ika-text-slate-900">
                {title || "Notre équipe"}
              </h2>
            </div>
            <span className="ika-ml-auto ika-rounded-full ika-bg-white ika-px-3 ika-py-1 ika-text-xs ika-font-bold ika-text-slate-500 ika-shadow-sm">
              {filtered.length} collaborateurs
            </span>
          </div>
          <p className="ika-mb-6 ika-text-sm ika-text-slate-500">
            {description || "Les talents qui font avancer l'ingénierie digitale"}
          </p>

          {showSearch ? (
            <div className="ika-mb-8 ika-flex ika-flex-col ika-gap-3 sm:ika-flex-row">
              <div className="ika-relative ika-flex-1">
                <span className="ika-absolute ika-left-3 ika-top-1/2 ika--translate-y-1/2 ika-text-slate-400">
                  <Icon name="Search" className="ika-h-[15px] ika-w-[15px]" />
                </span>
                <input
                  type="text"
                  placeholder="Rechercher par nom ou poste…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Rechercher un collaborateur"
                  className="ika-w-full ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-py-2.5 ika-pl-9 ika-pr-4 ika-text-sm ika-text-slate-700 ika-placeholder-slate-400 ika-shadow-sm ika-transition-colors focus:ika-border-brand-accent focus:ika-outline-none"
                />
              </div>
              <div className="ika-relative">
                <span className="ika-absolute ika-left-3 ika-top-1/2 ika--translate-y-1/2 ika-text-slate-400">
                  <Icon name="Filter" className="ika-h-3.5 ika-w-3.5" />
                </span>
                <select
                  value={activeDept}
                  onChange={(e) => setActiveDept(e.target.value)}
                  aria-label="Filtrer par département"
                  className="ika-cursor-pointer ika-appearance-none ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-py-2.5 ika-pl-9 ika-pr-8 ika-text-sm ika-text-slate-700 ika-shadow-sm ika-transition-colors focus:ika-border-brand-accent focus:ika-outline-none"
                >
                  {deptList.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}

          {/* `flex-1` seulement s'il y a des résultats : sinon la grille vide
              absorberait toute la hauteur et repousserait l'état vide hors vue. */}
          <div
            className={cn(
              "ika-relative",
              compact && filtered.length > 0 && "ika-min-h-0 ika-flex-1"
            )}
          >
            <div
              // `min-w-0` : sans lui, une grille imbriquée dans un item flex
              // refuse de descendre sous la largeur intrinsèque de son contenu
              // et déborde de la demi-colonne.
              className={cn(
                "ika-grid ika-min-w-0 ika-gap-4",
                compact
                  ? // pt-1 : marge de survol (les cartes se soulèvent de 4px)
                    // pr-1 : réserve la gouttière de l'ascenseur.
                    cn(
                      // `lg:h-full` : sans hauteur definie, `overflow-y-auto`
                      // n'a aucun effet — la grille grandit a la taille de son
                      // contenu et deborde de la bande. Le parent `relative`
                      // porte deja `flex-1 min-h-0`, donc sa hauteur est bornee ;
                      // `h-full` la transmet. Effet de bord indispensable : le
                      // `100%` de `COMPACT_ROW_HEIGHT` devient calculable.
                      "ika-grid-cols-2 ika-overflow-y-auto ika-pr-1 ika-pt-1 lg:ika-h-full",
                      COMPACT_STACKED_MAX_HEIGHT,
                      COMPACT_ROW_HEIGHT
                    )
                  : "ika-grid-cols-1 sm:ika-grid-cols-2 lg:ika-grid-cols-3 xl:ika-grid-cols-4"
              )}
              // La zone défilante doit être atteignable au clavier, sinon les
              // collaborateurs hors des 6 premiers sont inaccessibles.
              tabIndex={compact ? 0 : undefined}
              role={compact ? "group" : undefined}
              aria-label={
                compact
                  ? `Liste des collaborateurs (${filtered.length}), défilement vertical`
                  : undefined
              }
            >
            {filtered.map((person) => {
              const cfg = DEPT_COLORS[person.Division] || FALLBACK_DEPT;
              const birthdaySoon = showBirthdays && isBirthdaySoon(person.Birthdate);

              return (
                <div
                  key={person.Id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Voir le profil de ${person.Title}`}
                  onClick={() => setSelected(person)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelected(person);
                  }}
                  // Carte horizontale calquée sur le composant « Personnes » de
                  // SharePoint : avatar rond à gauche, identité à droite. ~62 px,
                  // contre ~300 px pour l'ancienne carte à photo panoramique.
                  // L'identité visuelle est conservée — couleurs de département,
                  // coins arrondis, soulèvement au survol, fiche profil au clic.
                  className="ika-group ika-flex ika-cursor-pointer ika-items-center ika-gap-3 ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-p-2.5 ika-shadow-sm ika-transition-all ika-duration-200 hover:-ika-translate-y-1 hover:ika-shadow-lg"
                >
                  <div className="ika-relative ika-shrink-0">
                    <img
                      src={personPhoto(person)}
                      alt={person.Title}
                      loading="lazy"
                      className="ika-h-10 ika-w-10 ika-rounded-full ika-object-cover ika-object-top ika-transition-transform ika-duration-300 group-hover:ika-scale-105"
                    />
                    {/* Anniversaire proche : pastille en médaillon sur l'avatar
                        plutôt qu'en bandeau. Elle n'ajoute aucune hauteur à la
                        carte, ce qui était tout l'enjeu du format horizontal. */}
                    {birthdaySoon && (
                      <span
                        title="Anniversaire bientôt"
                        className="ika-absolute -ika-bottom-0.5 -ika-right-0.5 ika-flex ika-h-4 ika-w-4 ika-items-center ika-justify-center ika-rounded-full ika-bg-amber-400 ika-text-white ika-ring-2 ika-ring-white"
                      >
                        <Icon name="Cake" className="ika-h-2.5 ika-w-2.5" />
                      </span>
                    )}
                  </div>

                  {/* `min-w-0` : sans lui, un item flex refuse de descendre sous la
                      largeur de son texte et `truncate` ne s'applique jamais. */}
                  <div className="ika-min-w-0 ika-flex-1">
                    <h3 className="ika-truncate ika-text-xs ika-font-bold ika-leading-tight ika-text-slate-900 ika-transition-colors group-hover:ika-text-brand-accent">
                      {person.Title}
                    </h3>
                    <p className="ika-mt-0.5 ika-flex ika-items-center ika-gap-1 ika-text-[10px] ika-leading-tight ika-text-slate-400">
                      <Icon name="Briefcase" className="ika-h-2 ika-w-2 ika-shrink-0" />
                      <span className="ika-truncate">{person.JobTitle}</span>
                    </p>
                  </div>

                  <span
                    className={cn(
                      "ika-flex ika-max-w-[6.5rem] ika-shrink-0 ika-items-center ika-gap-1 ika-rounded-full ika-px-1.5 ika-py-0.5 ika-text-[9px] ika-font-bold",
                      cfg.bg,
                      cfg.color
                    )}
                  >
                    <Icon name={cfg.icon} className="ika-h-[9px] ika-w-[9px] ika-shrink-0" />
                    <span className="ika-truncate">{person.Division || "Autre"}</span>
                  </span>
                </div>
              );
            })}
            </div>
            {/* Dégradé de bas de zone : signale qu'il reste des collaborateurs
                sous la ligne de flottaison (l'ascenseur seul est trop discret
                sous Windows/Edge). Purement décoratif → aria-hidden. */}
            {compact && filtered.length > 6 ? (
              <div
                aria-hidden="true"
                className="ika-pointer-events-none ika-absolute ika-inset-x-0 ika-bottom-0 ika-h-12 ika-bg-gradient-to-t ika-from-slate-50 ika-to-transparent"
              />
            ) : null}
          </div>

          {filtered.length === 0 && (
            <div className="ika-py-20 ika-text-center">
              <Icon name="Users" className="ika-mx-auto ika-mb-3 ika-h-10 ika-w-10 ika-text-slate-300" />
              <p className="ika-text-sm ika-text-slate-400">
                Aucun collaborateur trouvé
              </p>
            </div>
          )}
        </div>
      </section>

      {selected ? (
        <div
          ref={modalRef}
          className="ika-fixed ika-inset-0 ika-z-50 ika-flex ika-items-center ika-justify-center ika-bg-black/60 ika-p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="ika-w-full ika-max-w-md ika-overflow-hidden ika-rounded-2xl ika-bg-white ika-shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ika-relative ika-h-52">
              <img
                src={personPhoto(selected)}
                alt={selected.Title}
                className="ika-h-full ika-w-full ika-object-cover ika-object-top"
              />
              <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-t ika-from-black/80 ika-via-black/30 ika-to-transparent" />
              <button
                ref={modalCloseRef}
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Fermer le profil"
                className="ika-absolute ika-right-3 ika-top-3 ika-flex ika-h-8 ika-w-8 ika-items-center ika-justify-center ika-rounded-full ika-bg-black/40 ika-text-white ika-transition-colors hover:ika-bg-black/60"
              >
                <Icon name="X" className="ika-h-4 ika-w-4" />
              </button>
              {showBirthdays && isBirthdaySoon(selected.Birthdate) && (
                <div className="ika-absolute ika-left-4 ika-top-4 ika-flex ika-items-center ika-gap-1 ika-rounded-full ika-bg-amber-400 ika-px-2 ika-py-0.5 ika-text-[10px] ika-font-bold ika-text-white">
                  <Icon name="Cake" className="ika-h-2.5 ika-w-2.5" />
                  Anniversaire bientôt !
                </div>
              )}
              <div className="ika-absolute ika-bottom-4 ika-left-5">
                <p className="ika-mb-0.5 ika-text-[10px] ika-font-bold ika-uppercase ika-tracking-widest ika-text-brand-accent">
                  {selected.Division || "Autre"}
                </p>
                <h2 className="ika-text-xl ika-font-extrabold ika-text-white">
                  {selected.Title}
                </h2>
                <p className="ika-text-xs ika-text-white/70">{selected.JobTitle}</p>
              </div>
            </div>

            <div className="ika-p-6">
              {[
                {
                  icon: "Cake",
                  label: "Anniversaire",
                  value:
                    selectedAge !== null
                      ? `${formatBirthdate(selected.Birthdate)} (${selectedAge} ans)`
                      : formatBirthdate(selected.Birthdate),
                },
                {
                  icon: "MapPin",
                  label: "Localisation",
                  value: selected.OfficeLocation || "—",
                },
                { icon: "Mail", label: "Email", value: selected.Email },
                {
                  icon: "Phone",
                  label: "Téléphone",
                  value: selected.Phone || "—",
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="ika-flex ika-items-center ika-gap-4 ika-border-b ika-border-slate-100 ika-py-3 last:ika-border-0"
                >
                  <div className="ika-flex ika-h-9 ika-w-9 ika-shrink-0 ika-items-center ika-justify-center ika-rounded-xl ika-bg-slate-50">
                    <Icon
                      name={row.icon}
                      className="ika-h-[15px] ika-w-[15px] ika-text-brand-accent"
                    />
                  </div>
                  <div>
                    <p className="ika-text-[10px] ika-font-bold ika-uppercase ika-tracking-wider ika-text-slate-400">
                      {row.label}
                    </p>
                    <p className="ika-text-sm ika-font-semibold ika-text-slate-800">
                      {row.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
