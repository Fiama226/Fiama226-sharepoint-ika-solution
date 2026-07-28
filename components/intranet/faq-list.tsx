"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

type Item = { q: string; a: string };

function FaqRow({ q, a }: Item) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-brand-line bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-brand-surface/60"
        aria-expanded={open}
      >
        <span className="font-medium text-brand-ink">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-brand-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
     </button>
      {open ? (
        <div className="border-t border-brand-line bg-brand-surface/40 px-4 py-3 text-sm leading-relaxed text-brand-muted">
          {a}
       </div>
      ) : null}
   </div>
  );
}

export function FaqList({ items }: { items: Item[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {items.map((f) => (
        <FaqRow key={f.q} q={f.q} a={f.a} />
      ))}
   </div>
  );
}
