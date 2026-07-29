import { ISPImageField, ISPUrlField } from "../../models/IIkaModels";

const PERSON_PLACEHOLDER = "/_layouts/15/images/person.gif";

export function buildImageUrl(
  field: ISPImageField | string | undefined,
  width?: number
): string {
  let path: string | undefined;

  if (typeof field === "string") {
    path = field;
  } else if (field) {
    path = field.serverRelativeUrl || field.serverUrl;
  }

  if (!path) return PERSON_PLACEHOLDER;

  if (!width) return path;

  return (
    "/_layouts/15/getpreview.ashx?path=" +
    encodeURIComponent(path) +
    "&resolution=" +
    String(width)
  );
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
