"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
};

type Props = {
  items: GalleryItem[];
};

export function HomeGallery({ items }: Props) {
  const [active, setActive] = useState<number | null>(null);

  if (!items.length) return null;

  const close = () => setActive(null);
  const next = () =>
    setActive((i) => (i === null ? null : (i + 1) % items.length));
  const prev = () =>
    setActive((i) => (i === null ? null : (i - 1 + items.length) % items.length));

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-cyan-dark">
              <Images className="h-4 w-4" /> Vie d&apos;entreprise
           </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
              Ils font IKA Solution
           </h2>
         </div>
          <p className="text-sm text-brand-muted">
            {items.length} photos récentes
         </p>
       </div>

        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&_li]:mb-3 [&_li]:break-inside-avoid">
          <ul className="contents">
            {items.map((img, i) => (
              <li key={img.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className="group relative block w-full overflow-hidden rounded-xl border border-brand-line bg-brand-surface transition hover:border-brand-cyan/60 hover:shadow-md"
                  aria-label={`Voir ${img.caption}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={600}
                    height={400}
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="block text-left text-xs font-semibold text-white">
                      {img.caption}
                   </span>
                    <span className="mt-0.5 block text-left text-[10px] font-bold uppercase tracking-wider text-brand-cyan">
                      {img.category}
                   </span>
                 </span>
               </button>
             </li>
            ))}
         </ul>
       </div>
     </div>

      {active !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Fermer"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
         </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Photo précédente"
            className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
         </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Photo suivante"
            className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight className="h-5 w-5" />
         </button>
          <figure
            className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-brand-navy-dark"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[active].src}
              alt={items[active].alt}
              width={1200}
              height={800}
              className="h-auto max-h-[85vh] w-full object-contain"
              sizes="100vw"
              priority
            />
            <figcaption className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm text-white">
              <span className="font-semibold">{items[active].caption}</span>
              <span className="rounded-full bg-brand-cyan/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-cyan">
                {items[active].category}
             </span>
           </figcaption>
         </figure>
       </div>
      ) : null}
   </section>
  );
}
