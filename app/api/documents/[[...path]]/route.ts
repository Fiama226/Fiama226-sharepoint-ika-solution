import { readDocFile } from "@/lib/documents-fs";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params;
  const segments = path ?? [];
  if (segments.length === 0) {
    return new Response("Dossier racine non servable", { status: 400 });
  }

  const file = readDocFile(segments);
  if (!file) {
    return new Response("Fichier introuvable", { status: 404 });
  }

  const viewable = [
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
  ].includes((file.name.split(".").pop() ?? "").toLowerCase());

  const disposition = viewable ? "inline" : "attachment";

  return new Response(new Uint8Array(file.buffer), {
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(file.buffer.length),
      "Content-Disposition": `${disposition}; filename="${encodeURIComponent(
        file.name,
      )}"`,
      "Cache-Control": "no-store",
    },
  });
}
