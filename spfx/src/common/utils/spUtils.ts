import { ISPImageField, ISPUrlField } from "../../models/IIkaModels";

const PERSON_PLACEHOLDER = "/_layouts/15/images/person.gif";

/**
 * Valeur brute d'une colonne « Image » moderne SharePoint Online telle que
 * renvoyée par l'API REST (odata=nometadata) :
 * `{"fileName":"Reserved_ImageAttachment_[5]_[Photo][32]_[guid]_[1]_[2].jpg",
 *  "originalImageName":"DG","serverRelativeUrl":"...","serverUrl":"..."}`.
 *
 * ⚠️ Piège SharePoint : avec `odata=nometadata` la colonne arrive sous forme de
 * **JSON string** (pas d'objet), et lorsque la liste a les pièces jointes
 * activées (défaut des nouvelles listes), le fichier est stocké dans
 * `/Lists/<Liste>/Attachments/<Id>/` et `serverRelativeUrl` est **absent**.
 */
export interface IModernImageFieldValue {
  fileName?: string;
  originalImageName?: string;
  serverRelativeUrl?: string;
  serverUrl?: string;
}

function extractImagePath(
  value: IModernImageFieldValue | undefined
): string | undefined {
  if (!value) return undefined;
  if (value.serverRelativeUrl) return value.serverRelativeUrl;
  if (value.serverUrl) return value.serverUrl;
  if (value.fileName && /^https?:\/\//i.test(value.fileName)) {
    return value.fileName;
  }
  // `fileName` seul ne peut pas être résolu sans le contexte de la liste
  // (nom de liste + Id d'élément) : c'est DataService qui reconstruit l'URL.
  return undefined;
}

function parseImageField(
  field: ISPImageField | string | undefined
): string | undefined {
  if (!field) return undefined;

  if (typeof field === "string") {
    const trimmed = field.trim();
    if (trimmed.startsWith("{")) {
      try {
        return extractImagePath(
          JSON.parse(trimmed) as IModernImageFieldValue
        );
      } catch {
        // Pas du JSON : chemin/URL direct (FileRef, URL externe, data URI…)
        return trimmed;
      }
    }
    return trimmed;
  }

  return extractImagePath(field);
}

export function buildImageUrl(
  field: ISPImageField | string | undefined,
  width?: number
): string {
  const path = parseImageField(field);

  if (!path) return PERSON_PLACEHOLDER;

  if (!width) return path;

  // getpreview.ashx est réservé aux chemins serveur-relative de bibliothèques :
  // il est notoirement instable pour les fichiers de pièces jointes
  // (`/Lists/.../Attachments/...`) et ne sait rien faire des URL externes.
  const isServerRelative = path.startsWith("/") && !path.startsWith("//");
  const isAttachment = /\/attachments\//i.test(path);
  const isExternalOrData = /^(https?:|data:)/i.test(path);

  if (isServerRelative && !isAttachment && !isExternalOrData) {
    return (
      "/_layouts/15/getpreview.ashx?path=" +
      encodeURIComponent(path) +
      "&resolution=" +
      String(width)
    );
  }

  return path;
}

export function buildUserPhotoUrl(
  email: string | undefined,
  size: "S" | "M" | "L" = "M"
): string {
  if (!email) return PERSON_PLACEHOLDER;
  return `/_layouts/15/userphoto.aspx?size=${size}&username=${encodeURIComponent(email)}`;
}

export function resolveUrl(field: ISPUrlField | string | undefined): string {
  if (!field) return "#";
  return typeof field === "string" ? field : field.Url || "#";
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDayMonth(iso: string | undefined): {
  day: string;
  month: string;
} {
  if (!iso) return { day: "", month: "" };
  const date = new Date(iso);
  if (isNaN(date.getTime())) return { day: "", month: "" };
  return {
    day: String(date.getDate()),
    month: date
      .toLocaleDateString("fr-FR", { month: "short" })
      .replace(".", "")
      .toUpperCase(),
  };
}

export function formatCurrency(
  amount: number | undefined,
  currency: string = "XOF"
): string {
  if (amount === undefined || amount === null || isNaN(amount)) return "";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatFileSize(bytes: number | undefined): string {
  if (!bytes || bytes <= 0) return "";
  const units = ["o", "Ko", "Mo", "Go"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value = value / 1024;
    unit++;
  }
  return `${value.toFixed(value < 10 && unit > 0 ? 1 : 0).replace(".", ",")} ${units[unit]}`;
}

export function getFileExtension(fileName: string | undefined): string {
  if (!fileName) return "";
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function truncate(text: string | undefined, max: number): string {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.substring(0, max).trim()}…`;
}

export function stripHtml(html: string | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}
