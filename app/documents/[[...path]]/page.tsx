import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Folder,
  FileText,
  FileCode,
  Image as ImageIcon,
  Table,
  File,
  ChevronRight,
  Home,
  Download,
  Eye,
} from "lucide-react";

import {
  getDocLocation,
  formatDocSize,
  type DocEntry,
} from "@/lib/documents-fs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Documents — Explorateur du dépôt",
  description:
    "Parcourez les fichiers du dépôt IKA Solution, département par département.",
};

function FileTypeIcon({ ext, className }: { ext?: string; className?: string }) {
  let Icon = File;
  switch (ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
      Icon = FileCode;
      break;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      Icon = ImageIcon;
      break;
    case "xlsx":
    case "csv":
      Icon = Table;
      break;
    case "md":
    case "txt":
    case "json":
    case "css":
    case "html":
    case "xml":
      Icon = FileText;
      break;
    default:
      Icon = File;
  }
  return <Icon className={className} />;
}

function iconColor(ext?: string): string {
  switch (ext) {
    case "ts":
    case "tsx":
      return "text-brand-cyan bg-cyan-50";
    case "js":
    case "jsx":
      return "text-yellow-600 bg-yellow-50";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return "text-purple-600 bg-purple-50";
    case "xlsx":
    case "csv":
      return "text-green-600 bg-green-50";
    case "md":
    case "txt":
    case "json":
    case "css":
    case "html":
    case "xml":
      return "text-brand-navy bg-brand-surface";
    default:
      return "text-brand-muted bg-brand-surface";
  }
}

const VIEWABLE = new Set([
  "ts",
  "tsx",
  "js",
  "jsx",
  "md",
  "txt",
  "json",
  "css",
  "html",
  "xml",
  "csv",
]);

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  const segments = path ?? [];

  const location = getDocLocation(segments);

  if (segments.length > 0 && !location.exists) {
    notFound();
  }

  const isRoot = segments.length === 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-cyan">
          Explorateur
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-brand-navy">
          Documents du dépôt
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-muted">
          Naviguez dans l’arborescence du dossier{" "}
          <code className="rounded bg-brand-surface px-1.5 py-0.5 text-brand-navy">
            Documents/
          </code>{" "}
          du projet, département par département.
        </p>
      </header>

      {/* Fil d'Ariane */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-brand-muted">
        <Link
          href="/documents"
          className="flex items-center gap-1 hover:text-brand-cyan"
        >
          <Home className="h-4 w-4" />
          Documents
        </Link>
        {location.breadcrumbs.slice(1).map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4 text-brand-line" />
            <Link
              href={crumb.href}
              className={
                i === location.breadcrumbs.length - 2
                  ? "font-medium text-brand-navy"
                  : "hover:text-brand-cyan"
              }
            >
              {crumb.label}
            </Link>
          </span>
        ))}
      </nav>

      {isRoot ? (
        <RootFolders entries={location.entries} />
      ) : !location.isDirectory ? (
        <FilePreview segments={segments} name={segments[segments.length - 1]} />
      ) : (
        <EntriesList entries={location.entries} baseSegments={segments} />
      )}
    </main>
  );
}

function RootFolders({ entries }: { entries: DocEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-10 text-center text-brand-muted">
        Aucun dossier trouvé dans le dépôt.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <Link
          key={entry.name}
          href={`/documents/${encodeURIComponent(entry.name)}`}
          className="group flex items-center gap-4 rounded-3xl border border-brand-navy/10 bg-white p-6 shadow-sm transition hover:border-brand-cyan/40 hover:shadow-md"
        >
          <div className="rounded-2xl bg-brand-navy/5 p-3 text-brand-navy transition group-hover:bg-brand-cyan/10 group-hover:text-brand-cyan">
            <Folder className="h-8 w-8" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-brand-navy">
              {entry.name}
            </p>
            <p className="text-sm text-brand-muted">
              {entry.childCount ?? 0} élément(s)
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function EntriesList({
  entries,
  baseSegments,
}: {
  entries: DocEntry[];
  baseSegments: string[];
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-3xl border border-brand-navy/10 bg-white p-10 text-center text-brand-muted">
        Ce dossier est vide.
      </div>
    );
  }
  return (
    <ul className="divide-y divide-brand-line overflow-hidden rounded-3xl border border-brand-navy/10 bg-white shadow-sm">
      {entries.map((entry) => {
        const href = `/documents/${[
          ...baseSegments,
          entry.name,
        ]
          .map((s) => encodeURIComponent(s))
          .join("/")}`;
        const color =
          entry.type === "dir"
            ? "text-brand-cyan bg-cyan-50"
            : iconColor(entry.ext);
        return (
          <li key={entry.name}>
            <Link
              href={href}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-brand-surface"
            >
              <div className={`rounded-xl p-2.5 ${color}`}>
                {entry.type === "dir" ? (
                  <Folder className="h-5 w-5" />
                ) : (
                  <FileTypeIcon ext={entry.ext} className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-brand-navy">
                  {entry.name}
                </p>
                <p className="text-sm text-brand-muted">
                  {entry.type === "dir"
                    ? `${entry.childCount ?? 0} élément(s)`
                    : formatDocSize(entry.size)}
                </p>
              </div>
              {entry.type === "file" && entry.ext && (
                <div className="flex items-center gap-2">
                  {VIEWABLE.has(entry.ext) && (
                    <span className="hidden items-center gap-1 rounded-full bg-brand-surface px-3 py-1 text-xs font-medium text-brand-navy sm:flex">
                      <Eye className="h-3.5 w-3.5" />
                      Aperçu
                    </span>
                  )}
                  <span className="hidden items-center gap-1 rounded-full bg-brand-surface px-3 py-1 text-xs font-medium text-brand-muted sm:flex">
                    <Download className="h-3.5 w-3.5" />
                    Ouvrir
                  </span>
                </div>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function FilePreview({ segments, name }: { segments: string[]; name: string }) {
  const href = `/api/documents/${segments
    .map((s) => encodeURIComponent(s))
    .join("/")}`;
  const ext = name.includes(".")
    ? name.split(".").pop()?.toLowerCase()
    : undefined;
  const viewable = ext ? VIEWABLE.has(ext) : false;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-brand-navy/10 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-2.5 ${iconColor(ext)}`}>
            <FileTypeIcon ext={ext} className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-brand-navy">{name}</p>
            <p className="text-sm text-brand-muted">
              {ext ? ext.toUpperCase() : "Fichier"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {viewable && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-navy-light"
            >
              <Eye className="h-4 w-4" />
              Aperçu
            </a>
          )}
          <a
            href={href}
            className="flex items-center gap-2 rounded-full bg-brand-cyan px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-cyan-dark"
          >
            <Download className="h-4 w-4" />
            Télécharger
          </a>
        </div>
      </div>
    </div>
  );
}
