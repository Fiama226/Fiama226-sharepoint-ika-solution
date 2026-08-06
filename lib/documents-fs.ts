import fs from "node:fs";
import path from "node:path";

export const DOCUMENTS_ROOT = path.join(process.cwd(), "Documents");

export type DocEntryType = "dir" | "file";

export interface DocEntry {
  name: string;
  type: DocEntryType;
  ext?: string;
  size?: number;
  childCount?: number;
}

export interface DocLocation {
  segments: string[];
  fullPath: string;
  exists: boolean;
  isDirectory: boolean;
  entries: DocEntry[];
  breadcrumbs: { label: string; href: string }[];
}

function safeResolve(segments: string[]): string | null {
  let current = DOCUMENTS_ROOT;
  for (const raw of segments) {
    const seg = decodeURIComponent(raw);
    if (
      seg === "" ||
      seg === "." ||
      seg === ".." ||
      path.isAbsolute(seg) ||
      seg.includes("\\") ||
      seg.includes("/")
    ) {
      return null;
    }
    current = path.join(current, seg);
  }
  const relative = path.relative(DOCUMENTS_ROOT, current);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return current;
}

function formatBytes(bytes?: number): string {
  if (bytes === undefined) return "";
  if (bytes < 1024) return `${bytes} o`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} Ko`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} Mo`;
}

export function getDocLocation(segments: string[]): DocLocation {
  const fullPath = safeResolve(segments) ?? "";
  const exists = fullPath !== "" && fs.existsSync(fullPath);
  const isDirectory = exists && fs.statSync(fullPath).isDirectory();

  const breadcrumbs: { label: string; href: string }[] = [
    { label: "Documents", href: "/documents" },
  ];
  let acc = "/documents";
  for (const seg of segments) {
    acc += `/${seg}`;
    breadcrumbs.push({ label: decodeURIComponent(seg), href: acc });
  }

  const entries: DocEntry[] = [];
  if (isDirectory) {
    const names = fs.readdirSync(fullPath);
    for (const name of names) {
      const entryPath = path.join(fullPath, name);
      const stat = fs.statSync(entryPath);
      if (stat.isDirectory()) {
        let childCount = 0;
        try {
          childCount = fs.readdirSync(entryPath).length;
        } catch {
          childCount = 0;
        }
        entries.push({ name, type: "dir", childCount });
      } else {
        entries.push({
          name,
          type: "file",
          ext: path.extname(name).toLowerCase().replace(".", "") || undefined,
          size: stat.size,
        });
      }
    }
    entries.sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name, "fr");
    });
  }

  return { segments, fullPath, exists, isDirectory, entries, breadcrumbs };
}

export function readDocFile(segments: string[]): {
  buffer: Buffer;
  mime: string;
  name: string;
} | null {
  const fullPath = safeResolve(segments);
  if (!fullPath || !fs.existsSync(fullPath)) return null;
  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) return null;

  const ext = path.extname(fullPath).toLowerCase();
  const mimeMap: Record<string, string> = {
    ".txt": "text/plain; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".ts": "text/plain; charset=utf-8",
    ".tsx": "text/plain; charset=utf-8",
    ".js": "text/plain; charset=utf-8",
    ".jsx": "text/plain; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".csv": "text/csv; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".zip": "application/zip",
  };

  const buffer = fs.readFileSync(fullPath);
  return {
    buffer,
    mime: mimeMap[ext] ?? "application/octet-stream",
    name: path.basename(fullPath),
  };
}

export function formatDocSize(bytes?: number): string {
  return formatBytes(bytes);
}
