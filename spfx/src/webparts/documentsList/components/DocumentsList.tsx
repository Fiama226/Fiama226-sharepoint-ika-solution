import * as React from "react";

import { IDocumentsListProps } from "./IDocumentsListProps";
import { Icon } from "../../../common/utils/Icon";
import {
  cn,
  formatDateShort,
  getFileExtension,
} from "../../../common/utils/spUtils";

interface IBadge {
  label: string;
  cls: string;
}

const TYPE_BADGE: Record<string, IBadge> = {
  pdf: { label: "PDF", cls: "ika-bg-red-50 ika-text-red-700" },
  doc: { label: "DOC", cls: "ika-bg-blue-50 ika-text-blue-700" },
  docx: { label: "DOCX", cls: "ika-bg-blue-50 ika-text-blue-700" },
  xls: { label: "XLS", cls: "ika-bg-green-50 ika-text-green-700" },
  xlsx: { label: "XLSX", cls: "ika-bg-green-50 ika-text-green-700" },
  ppt: { label: "PPT", cls: "ika-bg-amber-50 ika-text-amber-700" },
  pptx: { label: "PPTX", cls: "ika-bg-amber-50 ika-text-amber-700" },
  one: { label: "ONE", cls: "ika-bg-violet-50 ika-text-violet-700" },
  txt: { label: "TXT", cls: "ika-bg-slate-100 ika-text-slate-700" },
  zip: { label: "ZIP", cls: "ika-bg-orange-50 ika-text-orange-700" },
};

const FALLBACK_BADGE: IBadge = {
  label: "FICHIER",
  cls: "ika-bg-slate-100 ika-text-slate-700",
};

const CONFIDENTIALITY_STYLE: Record<string, string> = {
  Public: "ika-bg-emerald-50 ika-text-emerald-700",
  Interne: "ika-bg-slate-100 ika-text-slate-700",
  Confidentiel: "ika-bg-red-50 ika-text-red-700",
};

const ICON_FOR_EXT: Record<string, string> = {
  pdf: "pdf",
  doc: "docx",
  docx: "docx",
  xls: "xlsx",
  xlsx: "xlsx",
  ppt: "pptx",
  pptx: "pptx",
};

const Skeleton: React.FC = () => (
  <ul
    className="ika-mt-4 ika-divide-y ika-divide-brand-line ika-overflow-hidden ika-rounded-lg ika-border ika-border-brand-line ika-bg-white ika-animate-pulse"
    aria-hidden="true"
  >
    {[0, 1, 2, 3].map((index) => (
      <li key={index} className="ika-flex ika-items-center ika-gap-3 ika-px-4 ika-py-3">
        <span className="ika-h-9 ika-w-9 ika-shrink-0 ika-rounded-md ika-bg-slate-200" />
        <span className="ika-min-w-0 ika-flex-1 ika-space-y-2">
          <span className="ika-block ika-h-4 ika-w-1/2 ika-rounded ika-bg-slate-200" />
          <span className="ika-block ika-h-3 ika-w-1/3 ika-rounded ika-bg-slate-100" />
        </span>
        <span className="ika-h-4 ika-w-12 ika-rounded ika-bg-slate-200" />
      </li>
    ))}
  </ul>
);

export const DocumentsList: React.FC<IDocumentsListProps> = (props) => {
  const {
    title,
    documents,
    loading,
    error,
    showAllUrl,
    showConfidentiality,
  } = props;

  const renderBody = (): React.ReactElement => {
    if (loading) return <Skeleton />;

    if (error) {
      return (
        <div
          role="alert"
          className="ika-mt-4 ika-rounded-lg ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      );
    }

    if (!documents || documents.length === 0) {
      return (
        <div className="ika-mt-4 ika-rounded-lg ika-border ika-border-dashed ika-border-brand-line ika-bg-white ika-p-8 ika-text-center">
          <p className="ika-text-sm ika-text-brand-muted">
            Aucun document pour le moment.
          </p>
        </div>
      );
    }

    return (
      <ul className="ika-mt-4 ika-divide-y ika-divide-brand-line ika-overflow-hidden ika-rounded-lg ika-border ika-border-brand-line ika-bg-white">
        {documents.map((doc) => {
          const ext = getFileExtension(doc.FileLeafRef);
          const badge = TYPE_BADGE[ext] || {
            label: ext ? ext.toUpperCase() : FALLBACK_BADGE.label,
            cls: FALLBACK_BADGE.cls,
          };
          const iconName = ICON_FOR_EXT[ext] || "doc";
          const displayName = doc.Title || doc.FileLeafRef;

          return (
            <li key={doc.Id}>
              <a
                href={doc.FileRef}
                className="ika-flex ika-items-center ika-gap-3 ika-px-4 ika-py-3 ika-transition-colors hover:ika-bg-brand-surface focus:ika-outline-none focus-visible:ika-bg-brand-surface"
              >
                <span className="ika-grid ika-h-9 ika-w-9 ika-shrink-0 ika-place-items-center ika-rounded-md ika-bg-brand-surface ika-text-brand-navy">
                  <Icon name={iconName} className="ika-h-5 ika-w-5" />
                </span>

                <span className="ika-min-w-0 ika-flex-1">
                  <span className="ika-flex ika-items-center ika-gap-2">
                    <span className="ika-block ika-truncate ika-font-medium ika-text-brand-ink">
                      {displayName}
                    </span>
                    {doc.IsPinned ? (
                      <span className="ika-shrink-0 ika-rounded ika-bg-brand-cyan/10 ika-px-1.5 ika-py-0.5 ika-text-[10px] ika-font-bold ika-text-brand-cyan-dark">
                        ÉPINGLÉ
                      </span>
                    ) : null}
                  </span>

                  <span className="ika-mt-0.5 ika-block ika-text-xs ika-text-brand-muted">
                    Modifié le {formatDateShort(doc.Modified)}
                    {doc.Editor ? ` · ${doc.Editor.Title}` : ""}
                    {doc.DocCategory ? ` · ${doc.DocCategory}` : ""}
                  </span>
                </span>

                {showConfidentiality && doc.Confidentiality ? (
                  <span
                    className={cn(
                      "ika-shrink-0 ika-rounded ika-px-2 ika-py-0.5 ika-text-[10px] ika-font-medium",
                      CONFIDENTIALITY_STYLE[doc.Confidentiality] ||
                        FALLBACK_BADGE.cls
                    )}
                  >
                    {doc.Confidentiality}
                  </span>
                ) : null}

                <span
                  className={cn(
                    "ika-shrink-0 ika-rounded ika-px-2 ika-py-0.5 ika-text-[10px] ika-font-bold ika-tracking-wide",
                    badge.cls
                  )}
                >
                  {badge.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="ika-root">
      <section aria-labelledby="ika-docs-title">
        <div className="ika-flex ika-items-baseline ika-justify-between ika-gap-4">
          <h2
            id="ika-docs-title"
            className="ika-text-lg ika-font-semibold ika-text-brand-navy"
          >
            {title}
          </h2>
          {showAllUrl ? (
            <a
              href={showAllUrl}
              data-interception="propagate"
              className="ika-text-sm ika-font-medium ika-text-brand-cyan-dark hover:ika-underline"
            >
              Tous les documents
            </a>
          ) : null}
        </div>

        {renderBody()}
      </section>
    </div>
  );
};
