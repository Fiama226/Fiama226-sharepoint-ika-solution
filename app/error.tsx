"use client";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 font-sans">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent-soft">
          <span className="text-2xl font-bold text-brand-accent">!</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Une erreur est survenue
        </h2>
        <p className="text-sm leading-relaxed text-slate-500">
          Le portail n&apos;a pas pu charger correctement. Veuillez réessayer.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-full bg-brand-accent px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-accent-dark"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}