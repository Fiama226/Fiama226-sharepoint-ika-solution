import type { DocumentItem } from "@/types/intranet";

import { formatDateShort } from "@/lib/data";

import { Icon } from "./icon";

export interface DocumentsListProps {
  documents: DocumentItem[];
  title?: string;
}

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  pdf: { label: "PDF", cls: "bg-red-50 text-red-700" },
  docx: { label: "DOCX", cls: "bg-blue-50 text-blue-700" },
  xlsx: { label: "XLSX", cls: "bg-green-50 text-green-700" },
  pptx: { label: "PPTX", cls: "bg-amber-50 text-amber-700" },
  link: { label: "LIEN", cls: "bg-cyan-50 text-cyan-700" },
  folder: { label: "DOSSIER", cls: "bg-slate-100 text-slate-700" },
};

export function DocumentsList({ documents, title = "Documents récents" }: DocumentsListProps) {
  if (!documents.length) return null;

  return (
    <section aria-labelledby="docs-title">
      <div className="flex items-baseline justify-between">
        <h2 id="docs-title" className="text-lg font-semibold text-brand-navy">
          {title}
        </h2>
        <span className="text-sm font-medium text-brand-cyan-dark">Tous les documents</span>
      </div>

      <ul className="mt-4 divide-y divide-brand-line overflow-hidden rounded-lg border border-brand-line bg-white">
        {documents.map((doc) => {
          const badge = TYPE_BADGE[doc.type] ?? { label: doc.type.toUpperCase(), cls: "bg-slate-100 text-slate-700" };
          return (
            <li key={doc.id}>
              <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-brand-surface/60">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-surface text-brand-navy">
                  <Icon name={doc.type} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-brand-ink">{doc.title}</span>
                  <span className="mt-0.5 block text-xs text-brand-muted">
                    Modifié le {formatDateShort(doc.modifiedAt)} · {doc.modifiedBy}
                    {doc.size ? ` · ${doc.size}` : ""}
                  </span>
                </span>
                <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold tracking-wide ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
