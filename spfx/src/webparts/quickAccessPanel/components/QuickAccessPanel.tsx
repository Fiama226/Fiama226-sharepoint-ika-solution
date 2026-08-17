import * as React from "react";

import { IQuickAccessPanelProps } from "./IQuickAccessPanelProps";
import { Icon } from "../../../common/utils/Icon";
import {
  buildImageUrl,
  cn,
  formatDayMonth,
  getFileExtension,
  resolveUrl,
} from "../../../common/utils/spUtils";

/**
 * QuickAccessPanel — port 1:1 de components/intranet/firstSection.tsx
 * (maquette Next.js) : Documents clés + Accès rapide + Événements.
 */

const EVENT_TAG_COLORS: Record<string, string> = {
  Stratégie: "ika-bg-blue-100 ika-text-blue-700",
  Tech: "ika-bg-violet-100 ika-text-violet-700",
  Innovation: "ika-bg-emerald-100 ika-text-emerald-700",
  SecOps: "ika-bg-rose-100 ika-text-rose-700",
};

const ICON_FOR_DOCUMENT: Record<string, string> = {
  "Charte Développement": "Code2",
  "Architecture Patterns": "Layers",
  "Templates de Projets": "FileEdit",
  "Processus CI/CD": "GitBranch",
  "Politique de Dépenses": "CreditCard",
  "Guide Cybersécurité": "ShieldCheck",
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

function tagColor(tag: string): string {
  return EVENT_TAG_COLORS[tag] || "ika-bg-slate-100 ika-text-slate-700";
}

function formatEventDate(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
  const weekday = date
    .toLocaleDateString("fr-FR", { weekday: "short" })
    .replace(".", "");
  const day = date.getDate();
  const month = date.toLocaleDateString("fr-FR", { month: "long" });
  const time = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${cap(weekday)}, ${day} ${cap(month)}, ${time}`;
}

const SectionTitle: React.FC<{
  title: string;
  action?: React.ReactNode;
}> = (props) => (
  <div className="ika-mb-6 ika-flex ika-items-center ika-justify-between">
    <div className="ika-flex ika-items-center ika-gap-2">
      <span
        aria-hidden="true"
        className="ika-h-5 ika-w-1 ika-rounded-full ika-bg-brand-accent"
      />
      <h2 className="ika-text-xl ika-font-extrabold ika-tracking-tight ika-text-slate-900">
        {props.title}
      </h2>
    </div>
    {props.action}
  </div>
);

export const QuickAccessPanel: React.FC<IQuickAccessPanelProps> = (props) => {
  const {
    documentsTitle,
    quickLinksTitle,
    eventsTitle,
    featuredDocs,
    quickLinks,
    events,
    loading,
    error,
    eventsSeeAllUrl,
  } = props;

  if (loading) {
    return (
      <div className="ika-root">
        <section className="ika-w-full ika-bg-slate-50 ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
          <div
            className="ika-mx-auto ika-grid ika-max-w-7xl ika-grid-cols-1 ika-gap-10 ika-animate-pulse lg:ika-grid-cols-3"
            aria-hidden="true"
          >
            {[0, 1, 2].map((col) => (
              <div key={col} className="ika-space-y-4">
                <div className="ika-h-6 ika-w-40 ika-rounded ika-bg-slate-200" />
                <div className="ika-h-32 ika-rounded-2xl ika-bg-slate-200" />
                <div className="ika-h-32 ika-rounded-2xl ika-bg-slate-100" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ika-root">
      <section className="ika-w-full ika-bg-slate-50 ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
        <div className="ika-mx-auto ika-grid ika-max-w-7xl ika-grid-cols-1 ika-gap-10 lg:ika-grid-cols-3">
          {/* ── DOCUMENTS CLÉS ── */}
          <div>
            <SectionTitle title={documentsTitle || "Documents clés"} />
            <div className="ika-grid ika-grid-cols-2 ika-gap-3">
              {featuredDocs.map((doc) => {
                const ext = getFileExtension(doc.FileLeafRef);
                return (
                  <a
                    key={doc.Id}
                    href={doc.FileRef}
                    data-interception="propagate"
                    className="ika-group ika-flex ika-h-32 ika-flex-col ika-justify-between ika-rounded-2xl ika-bg-slate-900 ika-p-4 ika-text-left ika-transition-all ika-duration-200 hover:-ika-translate-y-0.5 hover:ika-bg-slate-800 hover:ika-shadow-lg"
                  >
                    <Icon
                      name={
                        doc.DocIcon ||
                        ICON_FOR_DOCUMENT[doc.Title] ||
                        ICON_FOR_EXT[ext] ||
                        "doc"
                      }
                      className="ika-h-[26px] ika-w-[26px] ika-text-white ika-opacity-60 ika-transition-opacity group-hover:ika-opacity-100"
                    />
                    <span className="ika-mt-2 ika-text-sm ika-font-semibold ika-leading-tight ika-text-white">
                      {doc.Title || doc.FileLeafRef}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── ACCÈS RAPIDE ── */}
          <div>
            <SectionTitle title={quickLinksTitle || "Accès rapide"} />
            <div className="ika-grid ika-grid-cols-2 ika-gap-2.5">
              {quickLinks.map((item) => (
                <a
                  key={item.Id}
                  href={resolveUrl(item.LinkUrl)}
                  data-interception="propagate"
                  className="ika-group ika-flex ika-cursor-pointer ika-items-center ika-gap-3 ika-rounded-xl ika-border ika-border-slate-200 ika-bg-white ika-px-3 ika-py-3 ika-text-left ika-shadow-sm ika-transition-all ika-duration-200 hover:ika-border-brand-accent/30 hover:ika-bg-brand-accent-soft hover:ika-shadow-md"
                >
                  <div className="ika-flex ika-h-9 ika-w-9 ika-shrink-0 ika-items-center ika-justify-center ika-rounded-xl ika-bg-brand-accent ika-transition-all ika-duration-200 group-hover:ika-scale-110">
                    <Icon name={item.IconName || "link"} className="ika-h-4 ika-w-4 ika-text-white" />
                  </div>
                  <span className="ika-text-xs ika-font-semibold ika-leading-tight ika-text-slate-700 group-hover:ika-text-brand-accent">
                    {item.Title}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ── ÉVÉNEMENTS ── */}
          <div>
            <SectionTitle
              title={eventsTitle || "Événements"}
              action={
                <a
                  href={eventsSeeAllUrl || "#evenements"}
                  data-interception="propagate"
                  onClick={(e) => {
                    if (!eventsSeeAllUrl) {
                      e.preventDefault();
                      window.location.hash = "#evenements";
                    }
                  }}
                  className="ika-flex ika-items-center ika-gap-1 ika-text-xs ika-font-semibold ika-text-slate-500 ika-transition-colors hover:ika-text-brand-accent"
                >
                  Voir tout <Icon name="ChevronRight" className="ika-h-3 ika-w-3" />
                </a>
              }
            />

            <div className="ika-flex ika-flex-col ika-gap-3">
              {events.map((event) => {
                const dayMonth = formatDayMonth(event.EventDate);
                return (
                  <div
                    key={event.Id}
                    className="ika-group ika-flex ika-cursor-pointer ika-items-center ika-overflow-hidden ika-rounded-2xl ika-border ika-border-slate-200 ika-bg-white ika-shadow-sm ika-transition-all ika-duration-200 hover:-ika-translate-y-0.5 hover:ika-border-brand-accent/30 hover:ika-shadow-md"
                  >
                    {/* Badge de date */}
                    <div className="ika-flex ika-w-14 ika-shrink-0 ika-flex-col ika-items-center ika-justify-center ika-bg-slate-900 ika-py-3 ika-text-white">
                      <span className="ika-text-[9px] ika-font-bold ika-uppercase ika-tracking-widest ika-opacity-60">
                        {event.DisplayMonth || dayMonth.month}
                      </span>
                      <span className="ika-text-2xl ika-font-extrabold ika-leading-tight">
                        {event.DisplayDay || dayMonth.day}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="ika-relative ika-h-16 ika-w-14 ika-shrink-0 ika-overflow-hidden">
                      {event.EventImage ? (
                        <img
                          src={buildImageUrl(event.EventImage, 80)}
                          alt={event.Title}
                          loading="lazy"
                          className="ika-h-full ika-w-full ika-object-cover ika-transition-transform ika-duration-300 group-hover:ika-scale-105"
                        />
                      ) : null}
                    </div>

                    {/* Info */}
                    <div className="ika-flex ika-flex-1 ika-flex-col ika-gap-1 ika-px-4 ika-py-2">
                      <p className="ika-text-sm ika-font-bold ika-leading-tight ika-text-slate-900 ika-transition-colors group-hover:ika-text-brand-accent">
                        {event.Title}
                      </p>
                      <div className="ika-flex ika-items-center ika-gap-2">
                        <p className="ika-text-[11px] ika-text-slate-400">
                          {event.DisplayDate || formatEventDate(event.EventDate)}
                        </p>
                        <span
                          className={cn(
                            "ika-rounded-full ika-px-2 ika-py-0.5 ika-text-[10px] ika-font-bold",
                            tagColor(event.EventCategory)
                          )}
                        >
                          {event.EventCategory}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
