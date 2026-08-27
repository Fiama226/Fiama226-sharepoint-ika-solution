import { SearchResultKind, SearchVertical } from "../../models/IIkaModels";

export interface IKindDisplay {
  /** Clé du registre `Icon.tsx`. */
  icon: string;
  label: string;
  /** Classes de la pastille d'icône (fond + texte). */
  chip: string;
}

const KIND_DISPLAY: Record<SearchResultKind, IKindDisplay> = {
  file: {
    icon: "FileText",
    label: "Fichier",
    chip: "ika-bg-blue-50 ika-text-blue-600",
  },
  folder: {
    icon: "folder",
    label: "Dossier",
    chip: "ika-bg-amber-50 ika-text-amber-600",
  },
  page: {
    icon: "File",
    label: "Page",
    chip: "ika-bg-slate-100 ika-text-slate-600",
  },
  news: {
    icon: "newspaper",
    label: "Actualité",
    chip: "ika-bg-rose-50 ika-text-rose-600",
  },
  listItem: {
    icon: "Table",
    label: "Élément",
    chip: "ika-bg-slate-100 ika-text-slate-600",
  },
  site: {
    icon: "Globe",
    label: "Site",
    chip: "ika-bg-cyan-50 ika-text-cyan-600",
  },
  person: {
    icon: "Users",
    label: "Personne",
    chip: "ika-bg-green-50 ika-text-green-600",
  },
  email: {
    icon: "Mail",
    label: "E-mail",
    chip: "ika-bg-purple-50 ika-text-purple-600",
  },
  chat: {
    icon: "MessageSquare",
    label: "Message Teams",
    chip: "ika-bg-indigo-50 ika-text-indigo-600",
  },
};

const FALLBACK: IKindDisplay = {
  icon: "File",
  label: "Résultat",
  chip: "ika-bg-slate-100 ika-text-slate-600",
};

export function displayForKind(kind: SearchResultKind): IKindDisplay {
  return KIND_DISPLAY[kind] || FALLBACK;
}

export interface IVerticalTab {
  key: SearchVertical;
  label: string;
  /** Vrai si l'onglet dépend d'une permission Graph accordée par l'admin. */
  requiresGraph: boolean;
}

export const SEARCH_TABS: IVerticalTab[] = [
  { key: "tout", label: "Tout", requiresGraph: false },
  { key: "fichiers", label: "Fichiers", requiresGraph: false },
  { key: "personnes", label: "Personnes", requiresGraph: false },
  { key: "emails", label: "E-mails", requiresGraph: true },
  { key: "messages", label: "Messages Teams", requiresGraph: true },
];
