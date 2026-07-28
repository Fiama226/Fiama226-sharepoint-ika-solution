import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

import type { DocumentItem } from "@/types/intranet";
import { formatDateShort } from "@/lib/data";
import { Icon } from "@/components/intranet/icon";

type Props = {
  documents: DocumentItem[];
};

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  pdf: { label: "PDF", cls: "bg-red-50 text-red-700" },
  docx: { label: "DOCX", cls: "bg-blue-50 text-blue-700" },
  xlsx: { label: "XLSX", cls: "bg-emerald-50 text-emerald-700" },
  pptx: { label: "PPTX", cls: "bg-amber-50 text-amber-700" },
  link: { label: "LIEN", cls: "bg-brand-cyan/10 text-brand-cyan-dark" },
  folder: { label: "DOSSIER", cls: "bg-brand-surface text-brand-navy" },
};

export function HomeDocuments({ documents }: Props) {
  if (!documents.length) return null;

  return (
    <section aria-labelledby="docs-title" className="bg-white">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-cyan-dark">
            <FileText className="h-4 w-4" /> Documentations
          </p>
          <h2
            id="docs-title"
            className="mt-1 text-xl font-bold tracking-tight text-brand-navy sm:text-2xl"
          >
            Documents récents
          </h2>
        </div>
        <Link
          href="#"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-cyan-dark transition hover:text-brand-cyan"
        >
          Centre documentaire
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ul className="divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line bg-white">
        {documents.map((doc) => {
          const badge =
            TYPE_BADGE[doc.type] ?? {
              label: doc.type.toUpperCase(),
              cls: "bg-brand-surface text-brand-navy",
            };
          return (
            <li key={doc.id}>
              <Link
                href="#"
                className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-brand-surface/60"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-surface text-brand-navy transition-colors group-hover:bg-brand-cyan group-hover:text-white">
                  <Icon name={doc.type} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-brand-ink group-hover:text-brand-navy">
                    {doc.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-brand-muted">
                    Modifié le {formatDateShort(doc.modifiedAt)} · {doc.modifiedBy}
                    {doc.size ? ` · ${doc.size}` : ""}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold tracking-wide ${badge.cls}`}
                >
                  {badge.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
