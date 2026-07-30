import * as React from "react";

import { IGalleryProps } from "./IGalleryProps";
import { IGalleryImage } from "../../../models/IIkaModels";
import { useFocusTrap } from "../../../common/hooks/useFocusTrap";
import { buildImageUrl, cn } from "../../../common/utils/spUtils";

const ALL = "Tous";

const Chevron: React.FC<{ direction: "left" | "right" }> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
    focusable="false"
    className="ika-h-6 ika-w-6"
  >
    <path
      d={props.direction === "left" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
    focusable="false"
    className="ika-h-6 ika-w-6"
  >
    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
  </svg>
);

const Lightbox: React.FC<{
  image: IGalleryImage;
  total: number;
  position: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}> = (props) => {
  const { image, total, position, onClose, onPrevious, onNext } = props;

  const trapOptions = React.useMemo(
    () => ({
      onClose,
      onPrevious: total > 1 ? onPrevious : undefined,
      onNext: total > 1 ? onNext : undefined,
    }),
    [onClose, onPrevious, onNext, total]
  );

  const containerRef = useFocusTrap<HTMLDivElement>(true, trapOptions);

  return (
    <div
      className="ika-fixed ika-inset-0 ika-z-[1000] ika-flex ika-items-center ika-justify-center ika-bg-black/90 ika-p-4"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={image.Caption}
        className="ika-relative ika-flex ika-max-h-full ika-w-full ika-max-w-5xl ika-flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="ika-mb-3 ika-flex ika-items-center ika-justify-between ika-gap-4 ika-text-white">
          <p className="ika-text-sm ika-text-white/70">
            {position} / {total}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="ika-rounded-full ika-bg-white/10 ika-p-2 ika-transition-colors hover:ika-bg-white/20 focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-white"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="ika-relative ika-flex ika-items-center ika-justify-center">
          {total > 1 ? (
            <button
              type="button"
              onClick={onPrevious}
              aria-label="Image précédente"
              className="ika-absolute ika-left-2 ika-z-10 ika-rounded-full ika-bg-black/50 ika-p-2 ika-text-white ika-transition-colors hover:ika-bg-black/70 focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-white"
            >
              <Chevron direction="left" />
            </button>
          ) : null}

          <img
            src={image.FileRef}
            alt={image.AltText || image.Caption}
            className="ika-max-h-[70vh] ika-w-auto ika-max-w-full ika-rounded-xl ika-object-contain"
          />

          {total > 1 ? (
            <button
              type="button"
              onClick={onNext}
              aria-label="Image suivante"
              className="ika-absolute ika-right-2 ika-z-10 ika-rounded-full ika-bg-black/50 ika-p-2 ika-text-white ika-transition-colors hover:ika-bg-black/70 focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-white"
            >
              <Chevron direction="right" />
            </button>
          ) : null}
        </div>

        <div className="ika-mt-4 ika-text-center ika-text-white">
          <p className="ika-text-base ika-font-semibold">{image.Caption}</p>
          <p className="ika-mt-1 ika-text-xs ika-text-white/60">
            {image.GalleryCategory}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Gallery: React.FC<IGalleryProps> = (props) => {
  const {
    title,
    description,
    images,
    loading,
    error,
    showFilters,
    mosaicLayout,
  } = props;

  const [category, setCategory] = React.useState<string>(ALL);
  const [openIndex, setOpenIndex] = React.useState<number>(-1);

  const categories: string[] = [ALL];
  images.forEach((image) => {
    if (image.GalleryCategory && categories.indexOf(image.GalleryCategory) === -1) {
      categories.push(image.GalleryCategory);
    }
  });

  const filtered =
    category === ALL
      ? images
      : images.filter((image) => image.GalleryCategory === category);

  React.useEffect(() => {
    setOpenIndex(-1);
  }, [category]);

  const move = (delta: number): void => {
    if (filtered.length === 0) return;
    setOpenIndex((current) => {
      const next = (current + delta + filtered.length) % filtered.length;
      return next;
    });
  };

  const renderBody = (): React.ReactElement => {
    if (loading) {
      return (
        <div
          className="ika-grid ika-grid-cols-2 ika-gap-3 ika-animate-pulse md:ika-grid-cols-4"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <div
              key={index}
              className="ika-h-32 ika-rounded-2xl ika-bg-slate-200"
            />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div
          role="alert"
          className="ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
        >
          <p className="ika-text-sm ika-font-medium ika-text-red-800">{error}</p>
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="ika-rounded-2xl ika-border ika-border-dashed ika-border-slate-300 ika-bg-white ika-p-10 ika-text-center">
          <p className="ika-text-sm ika-font-medium ika-text-brand-navy">
            Aucune photo à afficher
          </p>
          <p className="ika-mt-1 ika-text-sm ika-text-slate-500">
            {category === ALL
              ? "Ajoutez des images dans la bibliothèque « Galerie »."
              : "Aucune photo dans cette catégorie."}
          </p>
        </div>
      );
    }

    return (
      <div className="ika-grid ika-grid-cols-2 ika-gap-3 md:ika-grid-cols-4">
        {filtered.map((image, index) => {
          const featured = mosaicLayout && index % 5 === 0;

          return (
            <button
              key={image.Id}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Agrandir : ${image.Caption}`}
              className={cn(
                "ika-group ika-relative ika-overflow-hidden ika-rounded-2xl ika-shadow-sm",
                "focus:ika-outline-none focus-visible:ika-ring-2 focus-visible:ika-ring-brand-accent",
                featured ? "md:ika-col-span-2 md:ika-row-span-2" : ""
              )}
              style={{ minHeight: featured ? 260 : 130 }}
            >
              <img
                src={buildImageUrl(image.FileRef, featured ? 800 : 400)}
                alt={image.AltText || image.Caption}
                loading="lazy"
                className="ika-absolute ika-inset-0 ika-h-full ika-w-full ika-object-cover ika-transition-transform ika-duration-500 group-hover:ika-scale-105"
              />
              <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-t ika-from-black/70 ika-via-transparent ika-to-transparent ika-opacity-0 ika-transition-opacity ika-duration-300 group-hover:ika-opacity-100" />
              <div className="ika-absolute ika-bottom-0 ika-left-0 ika-right-0 ika-translate-y-2 ika-p-3 ika-text-left ika-opacity-0 ika-transition-all ika-duration-300 group-hover:ika-translate-y-0 group-hover:ika-opacity-100">
                <p className="ika-text-xs ika-font-bold ika-leading-tight ika-text-white">
                  {image.Caption}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ika-root">
      <section
        className="ika-w-full ika-border-t ika-border-slate-200 ika-bg-white ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8"
        aria-labelledby="ika-gallery-title"
      >
        <div className="ika-mx-auto ika-max-w-7xl">
          <div className="ika-mb-2 ika-flex ika-flex-wrap ika-items-center ika-gap-3">
            <div className="ika-flex ika-items-center ika-gap-2">
              <span
                aria-hidden="true"
                className="ika-h-5 ika-w-1 ika-rounded-full ika-bg-brand-accent"
              />
              <h2
                id="ika-gallery-title"
                className="ika-text-3xl ika-font-extrabold ika-tracking-tight ika-text-slate-900"
              >
                {title}
              </h2>
            </div>
            {!loading && !error ? (
              <span className="ika-ml-auto ika-rounded-full ika-bg-slate-100 ika-px-3 ika-py-1 ika-text-xs ika-font-bold ika-text-slate-500">
                {filtered.length} photo{filtered.length > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>

          {description ? (
            <p className="ika-mb-6 ika-text-sm ika-text-slate-500">
              {description}
            </p>
          ) : null}

          {showFilters && categories.length > 1 && !loading && !error ? (
            <div
              role="group"
              aria-label="Filtrer par catégorie"
              className="ika-mb-8 ika-flex ika-flex-wrap ika-gap-2"
            >
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={cn(
                    "ika-rounded-full ika-border ika-px-4 ika-py-1.5 ika-text-sm ika-font-semibold ika-transition-all ika-duration-200",
                    category === item
                      ? "ika-border-brand-accent ika-bg-brand-accent ika-text-white"
                      : "ika-border-slate-200 ika-bg-white ika-text-slate-600 hover:ika-border-brand-accent hover:ika-text-brand-accent"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}

          {renderBody()}
        </div>
      </section>

      {openIndex >= 0 && filtered[openIndex] ? (
        <Lightbox
          image={filtered[openIndex]}
          total={filtered.length}
          position={openIndex + 1}
          onClose={() => setOpenIndex(-1)}
          onPrevious={() => move(-1)}
          onNext={() => move(1)}
        />
      ) : null}
    </div>
  );
};
