import type { Departement, DepartementSlug } from "@/types/intranet";

export const departements: Departement[] = [
  {
    slug: "comptabilite",
    name: "Comptabilité",
    tagline: "Pilotage financier & reporting",
    description:
      "Suivi budgétaire, factures fournisseurs/clients, paie, déclarations fiscales et reporting de gestion.",
    heroTitle: "Espace Comptabilité",
    heroSubtitle:
      "Vos documents financiers, rapports et échéances fiscales au même endroit.",
    accent: "navy",
    icon: "finance",
  },
  {
    slug: "administration",
    name: "Administration",
    tagline: "RH, juridique & vie de l'entreprise",
    description:
      "Congés, contrats, vie sociale, processus administratifs et ressources internes.",
    heroTitle: "Espace Administration",
    heroSubtitle:
      "Gestion administrative, RH, contrats et démarches internes.",
    accent: "cyan",
    icon: "admin",
  },
  {
    slug: "commerciaux",
    name: "Commerciaux",
    tagline: "Pipeline, devis & clients",
    description:
      "Suivi commercial, opportunités, devis, clients et objectifs par équipe.",
    heroTitle: "Espace Commerciaux",
    heroSubtitle:
      "Votre pipeline, vos opportunités et vos outils de suivi commercial.",
    accent: "navy",
    icon: "sales",
  },
  {
    slug: "techniciens",
    name: "Techniciens",
    tagline: "Support, interventions & projets",
    description:
      "Tickets d'intervention, base de connaissance, planning technique et projets clients.",
    heroTitle: "Espace Techniciens",
    heroSubtitle:
      "Suivi des interventions, ressources techniques et base de connaissance.",
    accent: "cyan",
    icon: "tech",
  },
];

export const departementSlugs: DepartementSlug[] = departements.map(
  (d) => d.slug,
);
