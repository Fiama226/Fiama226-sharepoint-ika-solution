import * as React from "react";

import { IGalleryProps } from "./IGalleryProps";
import { IGalleryImage } from "../../../models/IIkaModels";
import { Icon } from "../../../common/utils/Icon";
import { cn, buildImageUrl } from "../../../common/utils/spUtils";

/**
 * Gallery — port 1:1 de la section « Galerie » de
 * components/intranet/before_last_home_page_section.tsx (maquette Next.js) :
 * mosaïque de photos, filtres par catégorie, lightbox avec navigation
 * clavier (Échap / flèches) et piège de focus.
 */

const CATEGORIES = ["Tous", "Événements", "Formation", "Projets"];

export const Gallery: React.FC<IGalleryProps> = (props) => {
  const { title, description, images, loading, error, showFilters, mosaicLayout } =
    props;

  const [activeCategory, setActiveCategory] = React.useState<string>("Tous");
  const [lightbox, setLightbox] = React.useState<IGalleryImage | null>(null);

  const filtered =
    activeCategory === "Tous"
      ? images
      : images.filter((img) => img.GalleryCategory === activeCategory);

  const navigate = React.useCallback(
    (dir: number): void => {
      if (!lightbox) return;
      const idx = filtered.findIndex((i) => i.Id === lightbox.Id);
      if (idx === -1) return;
      setLightbox(
        filtered[(idx + dir + filtered.length) % filtered.length]
      );
    },
    [lightbox, filtered]
  );

  const lightboxRef = React.useRef<HTMLDivElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!lightbox) return;
    closeBtnRef.current?.focus();

    const trap = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        setLightbox(null);
        return;
      }
      if (e.key === "ArrowLeft") {
        navigate(-1);
        return;
      }
      if (e.key === "ArrowRight") {
        navigate(1);
        return;
      }
      if (e.key !== "Tab") return;

      const el = lightboxRef.current;
      if (!el) return;
      const focusable = el.querySelectorAll<HTMLElement>(
        'button, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [lightbox, navigate]);

  if (loading) {
    return (
      <div className="ika-root ika-w-full">
        <section className="ika-w-full ika-border-t ika-border-slate-200 ika-bg-white ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
          <div className="ika-mx-auto ika-animate-pulse ika-max-w-7xl">
            <div className="ika-mb-6 ika-h-7 ika-w-40 ika-rounded ika-bg-slate-200" />
            <div className="ika-grid ika-grid-cols-2 ika-gap-3 md:ika-grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "ika-rounded-2xl ika-bg-slate-100",
                    i === 0 ? "ika-h-64" : "ika-h-32"
                  )}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ika-root ika-w-full">
        <section className="ika-w-full ika-border-t ika-border-slate-200 ika-bg-white ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
          <div
            role="alert"
            className="ika-mx-auto ika-max-w-7xl ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
          >
            <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ika-root ika-w-full">
      <section className="ika-w-full ika-border-t ika-border-slate-200 ika-bg-white ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
        <div className="ika-mx-auto ika-max-w-7xl">
          <div className="ika-mb-2 ika-flex ika-flex-wrap ika-items-center ika-gap-3">
            <div className="ika-flex ika-items-center ika-gap-2">
              <span
                aria-hidden="true"
                className="ika-h-5 ika-w-1 ika-rounded-full ika-bg-brand-accent"
              />
              <h2 className="ika-text-3xl ika-font-extrabold ika-tracking-tight ika-text-slate-900">
                {title || "Galerie"}
              </h2>
            </div>
            <span className="ika-ml-auto ika-rounded-full ika-bg-slate-100 ika-px-3 ika-py-1 ika-text-xs ika-font-bold ika-text-slate-500">
              {filtered.length} photos
            </span>
          </div>
          <p className="ika-mb-6 ika-text-sm ika-text-slate-500">
            {description || "Moments forts de la vie de l'entreprise"}
          </p>

          {showFilters ? (
            <div className="ika-mb-8 ika-flex ika-flex-wrap ika-gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  aria-label={`Filtrer par catégorie ${cat}`}
                  className={cn(
                    "ika-rounded-full ika-border ika-px-4 ika-py-1.5 ika-text-sm ika-font-semibold ika-transition-all ika-duration-200",
                    activeCategory === cat
                      ? "ika-border-brand-accent ika-bg-brand-accent ika-text-white"
                      : "ika-border-slate-200 ika-bg-white ika-text-slate-600 hover:ika-border-brand-accent hover:ika-text-brand-accent"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : null}

          <div className="ika-grid ika-grid-cols-2 ika-gap-3 md:ika-grid-cols-4">
            {filtered.map((img, i) => (
              <div
                key={img.Id}
                role="button"
                tabIndex={0}
                aria-label={`Agrandir : ${img.Caption}`}
                onClick={() => setLightbox(img)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setLightbox(img);
                }}
                className={cn(
                  "ika-group ika-relative ika-cursor-pointer ika-overflow-hidden ika-rounded-2xl ika-shadow-sm",
                  mosaicLayout && i % 5 === 0
                    ? "md:ika-col-span-2 md:ika-row-span-2"
                    : ""
                )}
                style={{
                  minHeight: mosaicLayout && i % 5 === 0 ? "260px" : "130px",
                }}
              >
                <img
                  src={buildImageUrl(img.FileRef, 600)}
                  alt={img.Caption}
                  loading="lazy"
                  className="ika-h-full ika-w-full ika-object-cover ika-transition-transform ika-duration-500 group-hover:ika-scale-105"
                  style={{ minHeight: "inherit" }}
                />
                <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-t ika-from-black/70 ika-via-transparent ika-to-transparent ika-opacity-0 ika-transition-opacity ika-duration-300 group-hover:ika-opacity-100" />
                <div className="ika-absolute ika-bottom-0 ika-left-0 ika-right-0 ika-translate-y-2 ika-p-3 ika-opacity-0 ika-transition-all ika-duration-300 group-hover:ika-translate-y-0 group-hover:ika-opacity-100">
                  <p className="ika-text-xs ika-font-bold ika-leading-tight ika-text-white">
                    {img.Caption}
                  </p>
                  <span className="ika-text-[10px] ika-font-bold ika-uppercase ika-tracking-wider ika-text-brand-accent">
                    {img.GalleryCategory}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox ? (
        <div
          ref={lightboxRef}
          className="ika-fixed ika-inset-0 ika-z-50 ika-flex ika-items-center ika-justify-center ika-bg-black/90 ika-p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="ika-relative ika-w-full ika-max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Fermer la lightbox"
              className="ika-absolute ika-right-0 ika-top-[-40px] ika-text-white ika-transition-colors hover:ika-text-brand-accent"
            >
              <Icon name="X" className="ika-h-7 ika-w-7" />
            </button>
            <div className="ika-overflow-hidden ika-rounded-2xl ika-shadow-2xl">
              <img
                src={buildImageUrl(lightbox.FileRef, 1200)}
                alt={lightbox.Caption}
                className="ika-max-h-[70vh] ika-w-full ika-object-cover"
              />
              <div className="ika-flex ika-items-center ika-justify-between ika-bg-slate-900 ika-px-6 ika-py-4">
                <div>
                  <p className="ika-font-bold ika-text-white">
                    {lightbox.Caption}
                  </p>
                  <span className="ika-text-[11px] ika-font-bold ika-uppercase ika-tracking-wider ika-text-brand-accent">
                    {lightbox.GalleryCategory}
                  </span>
                </div>
                <div className="ika-flex ika-gap-2">
                  {([-1, 1] as const).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => navigate(dir)}
                      aria-label={
                        dir === -1 ? "Image précédente" : "Image suivante"
                      }
                      className="ika-flex ika-h-9 ika-w-9 ika-items-center ika-justify-center ika-rounded-full ika-border ika-border-white/20 ika-text-white ika-transition-colors hover:ika-bg-white/10"
                    >
                      <Icon
                        name={dir === -1 ? "ChevronLeft" : "ChevronRight"}
                        className="ika-h-[18px] ika-w-[18px]"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
