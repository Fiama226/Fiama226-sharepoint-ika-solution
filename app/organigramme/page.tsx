"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Users,
  Code2,
  ShieldCheck,
  Megaphone,
  Building2,
  X,
  Search,
  ZoomIn,
  ZoomOut,
  Crown,
  Briefcase,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────

type Membre = {
  id: string;
  nom: string;
  poste: string;
  email: string;
  telephone: string;
  avatar: string;
};

type Direction = {
  id: string;
  nom: string;
  icone: React.ElementType;
  couleur: string;
  bgCouleur: string;
  borderCouleur: string;
  gradientFrom: string;
  gradientTo: string;
  membres: Membre[];
};

type DirecteurGeneral = {
  id: string;
  nom: string;
  poste: string;
  email: string;
  telephone: string;
  avatar: string;
};

// ─── DONNÉES ─────────────────────────────────────────────────

const directeurGeneral: DirecteurGeneral = {
  id: "dg-1",
  nom: "YAYA Ouattara",
  poste: "Directeur Général",
  email: "y.ouattara@ikasolution.com",
  telephone: "+226 70 70 70 70",
  avatar: "/assets/team/DG.jpg",
};

const directions: Direction[] = [
  {
    id: "dir-1",
    nom: "Direction Générale",
    icone: Building2,
    couleur: "text-violet-700",
    bgCouleur: "bg-violet-50",
    borderCouleur: "border-violet-200",
    gradientFrom: "from-violet-500",
    gradientTo: "to-purple-600",
    membres: [
      {
        id: "m-1",
        nom: "Sandrine T. KINI",
        poste: "Assistante de Direction",
        email: "s.kini@ikasolution.com",
        telephone: "+226 70 70 70 70",
        avatar: "/assets/team/SANDRINE.jpg",
      },
    ],
  },
  {
    id: "dir-2",
    nom: "Direction Technique",
    icone: Code2,
    couleur: "text-blue-700",
    bgCouleur: "bg-blue-50",
    borderCouleur: "border-blue-200",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-600",
    membres: [
      {
        id: "m-2",
        nom: "SERGE GEDEON OUE",
        poste: "Ingénieur Principal",
        email: "s.gedeon@ikasolution.com",
        telephone: "+226 70 70 70 70",
        avatar: "/assets/team/Serge.jpg",
      },
      {
        id: "m-3",
        nom: "Daouda DAO",
        poste: "Développeur Front End",
        email: "d.dao@ikasolution.com",
        telephone: "+226 70 70 70 70",
        avatar: "/assets/team/Daouda.jpg",
      },
      {
        id: "m-4",
        nom: "Tegawende M. YAMEOGO",
        poste: "Développeur Junior",
        email: "m.yameogo@ikasolution.com",
        telephone: "+226 70 70 70 70",
        avatar: "/assets/team/Martin.jpg",
      },
    ],
  },
  {
    id: "dir-3",
    nom: "Direction Comptabilité",
    icone: ShieldCheck,
    couleur: "text-emerald-700",
    bgCouleur: "bg-emerald-50",
    borderCouleur: "border-emerald-200",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-600",
    membres: [
      {
        id: "m-5",
        nom: "Aminata HEMA",
        poste: "Comptable",
        email: "a.hema@ikasolution.com",
        telephone: "+226 70 70 70 70",
        avatar: "/assets/team/aminata.jpg",
      },
    ],
  },
  {
    id: "dir-4",
    nom: "Direction Commerciale",
    icone: Megaphone,
    couleur: "text-amber-700",
    bgCouleur: "bg-amber-50",
    borderCouleur: "border-amber-200",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-600",
    membres: [
      {
        id: "m-6",
        nom: "Roukiatou OUEDRAOGO",
        poste: "Responsable Commerciale",
        email: "r.ouedraogo@ikasolution.com",
        telephone: "+226 70 70 70 70",
        avatar: "/assets/team/Roukie.jpg",
      },
      {
        id: "m-7",
        nom: "Victorine BAZEMO",
        poste: "Assistante Commerciale",
        email: "v.bazemo@ikasolution.com",
        telephone: "+226 70 70 70 70",
        avatar: "/assets/team/Victorine.jpg",
      },
    ],
  },
];

// ─── TYPE UNIFIÉ POUR LE PROFIL ──────────────────────────────

type ProfilSelectionne = {
  nom: string;
  poste: string;
  email: string;
  telephone: string;
  avatar: string;
  direction: string;
  directionCouleur: string;
  directionBg: string;
  directionBorder: string;
  directionIcone: React.ElementType;
  directionGradientFrom: string;
  directionGradientTo: string;
};

// ─── CARTE DG ────────────────────────────────────────────────

function CarteDG({
  dg,
  onSelect,
}: {
  dg: DirecteurGeneral;
  onSelect: (p: ProfilSelectionne) => void;
}) {
  return (
    <div
      onClick={() =>
        onSelect({
          nom: dg.nom,
          poste: dg.poste,
          email: dg.email,
          telephone: dg.telephone,
          avatar: dg.avatar,
          direction: "Direction Générale",
          directionCouleur: "text-violet-700",
          directionBg: "bg-violet-50",
          directionBorder: "border-violet-200",
          directionIcone: Crown,
          directionGradientFrom: "from-violet-600",
          directionGradientTo: "to-purple-700",
        })
      }
      className="group relative cursor-pointer"
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-20 blur-lg transition-all duration-500 group-hover:opacity-40 group-hover:blur-xl" />

      <div className="relative overflow-hidden rounded-3xl border border-violet-200/50 bg-white shadow-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
        {/* Header gradient */}
        <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-8 pb-14 pt-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

          <div className="relative flex items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              Directeur Général
            </span>
          </div>
        </div>

        {/* Avatar */}
        <div className="relative -mt-10 flex justify-center">
          <div className="rounded-full bg-white p-1 shadow-lg">
            <div className="h-20 w-20 overflow-hidden rounded-full ring-3 ring-violet-200">
              <img
                src={dg.avatar}
                alt={dg.nom}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="px-8 pb-6 pt-3 text-center">
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
            {dg.nom}
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">{dg.poste}</p>
        </div>
      </div>
    </div>
  );
}

// ─── CARTE MEMBRE ────────────────────────────────────────────

function CarteMembre({
  membre,
  direction,
  onSelect,
}: {
  membre: Membre;
  direction: Direction;
  onSelect: (p: ProfilSelectionne) => void;
}) {
  return (
    <div
      onClick={() =>
        onSelect({
          nom: membre.nom,
          poste: membre.poste,
          email: membre.email,
          telephone: membre.telephone,
          avatar: membre.avatar,
          direction: direction.nom,
          directionCouleur: direction.couleur,
          directionBg: direction.bgCouleur,
          directionBorder: direction.borderCouleur,
          directionIcone: direction.icone,
          directionGradientFrom: direction.gradientFrom,
          directionGradientTo: direction.gradientTo,
        })
      }
      className={`group flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${direction.borderCouleur}`}
    >
      <div
        className={`h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ${direction.borderCouleur}`}
      >
        <img
          src={membre.avatar}
          alt={membre.nom}
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-slate-900">
          {membre.nom}
        </p>
        <p
          className={`truncate text-[10px] font-semibold ${direction.couleur}`}
        >
          {membre.poste}
        </p>
      </div>
    </div>
  );
}

// ─── CARTE DIRECTION ─────────────────────────────────────────

function CarteDirection({
  direction,
  onSelect,
}: {
  direction: Direction;
  onSelect: (p: ProfilSelectionne) => void;
}) {
  const [estOuverte, setEstOuverte] = useState(true);
  const Icone = direction.icone;

  return (
    <div className="flex flex-col items-center">
      <div className="group relative w-64">
        {/* Subtle glow */}
        <div
          className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${direction.gradientFrom} ${direction.gradientTo} opacity-0 blur transition-all duration-300 group-hover:opacity-15`}
        />

        <div
          className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 group-hover:shadow-lg ${direction.borderCouleur}`}
        >
          {/* Header */}
          <div
            className={`relative bg-gradient-to-r ${direction.gradientFrom} ${direction.gradientTo} px-4 py-3`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <Icone size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">
                    {direction.nom}
                  </h3>
                  <p className="text-[10px] text-white/70">
                    {direction.membres.length}{" "}
                    {direction.membres.length > 1 ? "membres" : "membre"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEstOuverte((v) => !v)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                {estOuverte ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
              </button>
            </div>
          </div>

          {/* Membres */}
          {estOuverte && (
            <div className="space-y-2 p-3">
              {direction.membres.map((membre) => (
                <CarteMembre
                  key={membre.id}
                  membre={membre}
                  direction={direction}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PANNEAU PROFIL ──────────────────────────────────────────

function PanneauProfil({
  profil,
  onFermer,
}: {
  profil: ProfilSelectionne;
  onFermer: () => void;
}) {
  const Icone = profil.directionIcone;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm"
      onClick={onFermer}
    >
      <div
        className="h-full w-full max-w-sm animate-in slide-in-from-right overflow-y-auto bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div
          className={`relative overflow-hidden bg-gradient-to-br ${profil.directionGradientFrom} ${profil.directionGradientTo} px-6 pb-16 pt-6`}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

          <button
            onClick={onFermer}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <X size={16} />
          </button>

          <div className="relative text-center">
            <div className="mx-auto mb-3 flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
              <Icone size={11} className="text-white" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                {profil.direction}
              </span>
            </div>
          </div>
        </div>

        {/* Avatar flottant */}
        <div className="relative -mt-12 flex justify-center">
          <div className="rounded-full bg-white p-1.5 shadow-xl">
            <div
              className={`h-24 w-24 overflow-hidden rounded-full ring-3 ${profil.directionBorder}`}
            >
              <img
                src={profil.avatar}
                alt={profil.nom}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Infos */}
        <div className="px-6 pt-4 text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            {profil.nom}
          </h2>
          <p
            className={`mt-1 text-sm font-semibold ${profil.directionCouleur}`}
          >
            {profil.poste}
          </p>
        </div>

        {/* Coordonnées */}
        <div className="px-6 pb-8 pt-8">
          <h3 className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            Coordonnées
            <span className="h-px flex-1 bg-slate-200" />
          </h3>

          <div className="space-y-3">
            {[
              { icone: Mail, libelle: "Email", valeur: profil.email },
              {
                icone: Phone,
                libelle: "Téléphone",
                valeur: profil.telephone,
              },
              {
                icone: Briefcase,
                libelle: "Direction",
                valeur: profil.direction,
              },
            ].map((ligne, i) => {
              const LigneIcone = ligne.icone;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-slate-50 ${profil.directionBorder}`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${profil.directionBg}`}
                  >
                    <LigneIcone size={16} className={profil.directionCouleur} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {ligne.libelle}
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {ligne.valeur}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL — ORGANIGRAMME
// ════════════════════════════════════════════════════════════

export default function Organigramme() {
  const [selectionne, setSelectionne] = useState<ProfilSelectionne | null>(
    null,
  );
  const [recherche, setRecherche] = useState("");
  const [zoom, setZoom] = useState(100);

  // Aplatir pour la recherche
  const tousLesMembres: {
    nom: string;
    poste: string;
    avatar: string;
    direction: Direction;
    membre: Membre;
  }[] = directions.flatMap((dir) =>
    dir.membres.map((m) => ({
      nom: m.nom,
      poste: m.poste,
      avatar: m.avatar,
      direction: dir,
      membre: m,
    })),
  );

  const totalPersonnes = tousLesMembres.length + 1; // +1 pour le DG

  const resultatsRecherche =
    recherche.length > 1
      ? [
          // Inclure le DG dans la recherche
          ...(directeurGeneral.nom
            .toLowerCase()
            .includes(recherche.toLowerCase()) ||
          directeurGeneral.poste.toLowerCase().includes(recherche.toLowerCase())
            ? [
                {
                  id: directeurGeneral.id,
                  nom: directeurGeneral.nom,
                  poste: directeurGeneral.poste,
                  avatar: directeurGeneral.avatar,
                  couleur: "text-violet-700",
                  onClick: () =>
                    setSelectionne({
                      nom: directeurGeneral.nom,
                      poste: directeurGeneral.poste,
                      email: directeurGeneral.email,
                      telephone: directeurGeneral.telephone,
                      avatar: directeurGeneral.avatar,
                      direction: "Direction Générale",
                      directionCouleur: "text-violet-700",
                      directionBg: "bg-violet-50",
                      directionBorder: "border-violet-200",
                      directionIcone: Crown,
                      directionGradientFrom: "from-violet-600",
                      directionGradientTo: "to-purple-700",
                    }),
                },
              ]
            : []),
          ...tousLesMembres
            .filter(
              (p) =>
                p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                p.poste.toLowerCase().includes(recherche.toLowerCase()),
            )
            .map((p) => ({
              id: p.membre.id,
              nom: p.nom,
              poste: p.poste,
              avatar: p.avatar,
              couleur: p.direction.couleur,
              onClick: () =>
                setSelectionne({
                  nom: p.membre.nom,
                  poste: p.membre.poste,
                  email: p.membre.email,
                  telephone: p.membre.telephone,
                  avatar: p.membre.avatar,
                  direction: p.direction.nom,
                  directionCouleur: p.direction.couleur,
                  directionBg: p.direction.bgCouleur,
                  directionBorder: p.direction.borderCouleur,
                  directionIcone: p.direction.icone,
                  directionGradientFrom: p.direction.gradientFrom,
                  directionGradientTo: p.direction.gradientTo,
                }),
            })),
        ]
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans">
      {/* ── Barre supérieure ── */}
      <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-4">
          {/* Titre */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200">
              <Building2 size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                Organigramme
              </h1>
              <p className="text-[10px] font-medium text-slate-400">
                IKA Solution
              </p>
            </div>
          </div>

          {/* Recherche */}
          <div className="relative flex-1 max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Rechercher un collaborateur…"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-50"
            />
            {resultatsRecherche.length > 0 && (
              <div className="absolute top-full mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl z-50">
                {resultatsRecherche.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      p.onClick();
                      setRecherche("");
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-100">
                      <img
                        src={p.avatar}
                        alt={p.nom}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {p.nom}
                      </p>
                      <p className={`text-[10px] font-semibold ${p.couleur}`}>
                        {p.poste}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Légende */}
          <div className="hidden xl:flex items-center gap-3">
            {directions.map((dir) => {
              const DirIcone = dir.icone;
              return (
                <div
                  key={dir.id}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 ${dir.bgCouleur}`}
                >
                  <DirIcone size={11} className={dir.couleur} />
                  <span className={`text-[10px] font-bold ${dir.couleur}`}>
                    {dir.nom.replace("Direction ", "")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Zoom */}
          <div className="ml-auto flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <ZoomOut size={14} />
            </button>
            <span className="w-10 text-center text-xs font-bold text-slate-600">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Compteur */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
            <Users size={14} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-600">
              {totalPersonnes} collaborateurs
            </span>
          </div>
        </div>
      </div>

      {/* ── Espace organigramme ── */}
      <div className="overflow-auto px-6 py-12">
        <div
          className="mx-auto flex min-w-max flex-col items-center transition-transform duration-300 origin-top"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* DG */}
          <CarteDG dg={directeurGeneral} onSelect={setSelectionne} />

          {/* Ligne verticale DG → barre horizontale */}
          <div className="h-10 w-px bg-gradient-to-b from-violet-300 to-slate-300" />

          {/* Point central */}
          <div className="h-3 w-3 rounded-full border-2 border-slate-300 bg-white shadow-sm" />

          {/* Barre horizontale */}
          <div className="relative flex items-start">
            {/* Ligne horizontale */}
            <div
              className="absolute top-0 h-px bg-slate-300"
              style={{
                left: "calc(128px)",
                right: "calc(128px)",
              }}
            />

            <div className="flex gap-6">
              {directions.map((direction) => (
                <div key={direction.id} className="flex flex-col items-center">
                  {/* Ligne verticale vers la direction */}
                  <div className="h-8 w-px bg-slate-300" />
                  <div
                    className={`mb-2 h-2.5 w-2.5 rounded-full bg-gradient-to-br ${direction.gradientFrom} ${direction.gradientTo} shadow-sm`}
                  />
                  <CarteDirection
                    direction={direction}
                    onSelect={setSelectionne}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Panneau profil */}
      {selectionne && (
        <PanneauProfil
          profil={selectionne}
          onFermer={() => setSelectionne(null)}
        />
      )}
    </div>
  );
}
