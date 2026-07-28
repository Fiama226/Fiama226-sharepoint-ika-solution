import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HomeNewsItem } from "@/types/intranet";

// Web Part SPFx ↦ « News » — données reçues par props (plain-serializable).
interface NewsProps {
  items: HomeNewsItem[];
  ctaHref?: string;
}

export default function CompanyNews({ items, ctaHref = "/histoire" }: NewsProps) {
  return (
    <section className="w-full py-10 font-sans">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
              Vie interne
            </span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Actualités de l&apos;entreprise
            </h1>
          </div>

          <p className="max-w-xl text-sm leading-relaxed text-slate-500">
            Suivez les dernières annonces internes, les évolutions techniques,
            les projets stratégiques et les initiatives d&apos;innovation.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
          {items.map((item, i) => {
            const isLastRow = i >= items.length - 2;
            const isRightCol = i % 2 === 1;

            return (
              <Link
                href={item.href}
                key={item.id}
                className={`
                  group flex cursor-pointer flex-col gap-5 p-5 transition-colors duration-300 hover:bg-slate-50 sm:flex-row sm:p-6
                  ${!isLastRow ? "md:border-b md:border-slate-200" : ""}
                  ${!isRightCol ? "md:border-r md:border-slate-200" : ""}
                  ${i !== items.length - 1 ? "border-b border-slate-200 md:border-b-0" : ""}
                `}
              >
                {/* Image */}
                <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-sm sm:h-28 sm:w-40">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 160px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col">
                  {/* Category + Date */}
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-brand-accent">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {item.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="mb-2 text-lg font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-brand-accent">
                    {item.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {item.excerpt}
                  </p>

                  {/* Read More */}
                  <div className="mt-4 flex translate-x-[-4px] items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-900 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    Lire la suite
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-center">
          <Link
            href={ctaHref}
            className="group flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition-all duration-300 hover:border-brand-accent hover:bg-brand-accent hover:text-white"
          >
            Voir toutes les actualités
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
