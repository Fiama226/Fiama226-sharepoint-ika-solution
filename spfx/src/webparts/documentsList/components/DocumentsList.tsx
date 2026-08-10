import * as React from "react";

import { IDocumentsListProps } from "./IDocumentsListProps";
import { Icon } from "../../../common/utils/Icon";
import { cn, getFileExtension } from "../../../common/utils/spUtils";

/**
 * DocumentsList — port 1:1 de la page Next.js app/documents/[[...path]]/page.tsx
 * (explorateur de dépôt) : en-tête « Explorateur », fil d'Ariane, et liste de
 * fichiers avec tuile d'icône colorée + pastilles « Aperçu / Ouvrir ».
 */

function iconColor(ext: string): string {
  switch (ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      return "ika-text-brand-cyan ika-bg-cyan-50";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return "ika-text-purple-600 ika-bg-purple-50";
    case "xlsx":
    case "xls":
    case "csv":
      return "ika-text-green-600 ika-bg-green-50";
    case "pdf":
      return "ika-text-red-600 ika-bg-red-50";
    case "doc":
    case "docx":
      return "ika-text-blue-600 ika-bg-blue-50";
    case "ppt":
    case "pptx":
      return "ika-text-amber-600 ika-bg-amber-50";
    case "md":
    case "txt":
    case "json":
    case "css":
    case "html":
    case "xml":
      return "ika-text-brand-navy ika-bg-brand-surface";
    default:
      return "ika-text-brand-muted ika-bg-brand-surface";
  }
}

function fileIcon(ext: string): string {
  switch (ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      return "FileCode";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return "ImageIcon";
    case "xlsx":
    case "xls":
    case "csv":
      return "Table";
    case "md":
    case "txt":
    case "json":
    case "css":
    case "html":
    case "xml":
      return "FileText";
    default:
      return "File";
  }
}

const CONFIDENTIALITY_STYLE: Record<string, string> = {
  Public: "ika-bg-emerald-50 ika-text-emerald-700",
  Interne: "ika-bg-brand-surface ika-text-brand-muted",
  Confidentiel: "ika-bg-red-50 ika-text-red-700",
};

const Skeleton: React.FC = () => (
  <ul
    className="ika-divide-y ika-divide-brand-line ika-overflow-hidden ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-animate-pulse"
    aria-hidden="true"
  >
    {[0, 1, 2, 3].map((index) => (
      <li
        key={index}
        className="ika-flex ika-items-center ika-gap-4 ika-px-5 ika-py-4"
      >
        <span className="ika-h-10 ika-w-10 ika-shrink-0 ika-rounded-xl ika-bg-slate-200" />
        <span className="ika-min-w-0 ika-flex-1 ika-space-y-2">
          <span className="ika-block ika-h-4 ika-w-1/2 ika-rounded ika-bg-slate-200" />
          <span className="ika-block ika-h-3 ika-w-1/4 ika-rounded ika-bg-slate-100" />
        </span>
        <span className="ika-h-6 ika-w-16 ika-rounded-full ika-bg-slate-200" />
      </li>
    ))}
  </ul>
);

export const DocumentsList: React.FC<IDocumentsListProps> = (props) => {
  const { title, documents, loading, error, showConfidentiality } = props;

  const renderBody = (): React.ReactElement => {
    if (loading) return <Skeleton />;

    if (error) {
      return (
        <div
          role="alert"
          className="ika-rounded-3xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      );
    }

    if (!documents || documents.length === 0) {
      return (
        <div className="ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-p-10 ika-text-center ika-text-brand-muted">
          Aucun document pour le moment.
        </div>
      );
    }

    return (
      <ul className="ika-divide-y ika-divide-brand-line ika-overflow-hidden ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-shadow-sm">
        {documents.map((doc) => {
          const ext = getFileExtension(doc.FileLeafRef);
          const displayName = doc.Title || doc.FileLeafRef;
          const size = doc.FileSizeDisplay ? doc.FileSizeDisplay : "";

          return (
            <li key={doc.Id}>
              <a
                href={doc.FileRef}
                data-interception="propagate"
                className="ika-flex ika-items-center ika-gap-4 ika-px-5 ika-py-4 ika-transition hover:ika-bg-brand-surface"
              >
                <div
                  className={cn(
                    "ika-rounded-xl ika-p-2.5",
                    iconColor(ext)
                  )}
                >
                  <Icon name={fileIcon(ext)} className="ika-h-5 ika-w-5" />
                </div>

                <div className="ika-min-w-0 ika-flex-1">
                  <p className="ika-truncate ika-font-medium ika-text-brand-navy">
                    {displayName}
                  </p>
                  <p className="ika-text-sm ika-text-brand-muted">
                    {size || (ext ? ext.toUpperCase() : "Fichier")}
                    {doc.DocCategory ? ` · ${doc.DocCategory}` : ""}
                  </p>
                </div>

                {showConfidentiality && doc.Confidentiality ? (
                  <span
                    className={cn(
                      "ika-shrink-0 ika-rounded-full ika-px-3 ika-py-1 ika-text-xs ika-font-medium",
                      CONFIDENTIALITY_STYLE[doc.Confidentiality] ||
                        "ika-bg-brand-surface ika-text-brand-muted"
                    )}
                  >
                    {doc.Confidentiality}
                  </span>
                ) : null}

                <span className="ika-hidden ika-shrink-0 ika-items-center ika-gap-1 ika-rounded-full ika-bg-brand-surface ika-px-3 ika-py-1 ika-text-xs ika-font-medium ika-text-brand-muted sm:ika-flex">
                  <Icon name="Download" className="ika-h-3.5 ika-w-3.5" />
                  Ouvrir
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
      <section className="ika-mx-auto ika-max-w-6xl ika-px-4 ika-py-10 sm:ika-px-6 lg:ika-px-8">
        <header className="ika-mb-6">
          <p className="ika-text-sm ika-uppercase ika-tracking-[0.3em] ika-text-brand-cyan">
            Explorateur
          </p>
          <h1 className="ika-mt-3 ika-text-3xl ika-font-semibold ika-text-brand-navy">
            {title || "Documents du dépôt"}
          </h1>
          <p className="ika-mt-2 ika-max-w-2xl ika-text-sm ika-text-brand-muted">
            Naviguez dans l&apos;arborescence du dossier{" "}
            <code className="ika-rounded ika-bg-brand-surface ika-px-1.5 ika-py-0.5 ika-text-brand-navy">
              Documents/
            </code>{" "}
            du projet, département par département.
          </p>
        </header>

        {/* Fil d'Ariane */}
        <nav
          aria-label="Fil d'Ariane"
          className="ika-mb-6 ika-flex ika-flex-wrap ika-items-center ika-gap-1 ika-text-sm ika-text-brand-muted"
        >
          <span className="ika-flex ika-items-center ika-gap-1">
            <Icon name="Home" className="ika-h-4 ika-w-4" />
            Documents
          </span>
          <span className="ika-flex ika-items-center ika-gap-1">
            <Icon name="ChevronRight" className="ika-h-4 ika-w-4 ika-text-brand-line" />
            <span className="ika-font-medium ika-text-brand-navy">
              Bibliothèque documentaire
            </span>
          </span>
        </nav>

        {renderBody()}
      </section>
    </div>
  );
};
