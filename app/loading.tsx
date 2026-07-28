export default function HomeLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-accent" />
        <p className="text-sm font-semibold text-slate-500">
          Chargement du portail…
        </p>
      </div>
    </div>
  );
}