#!/usr/bin/env node
"use strict";

/**
 * Prefixe les classes Tailwind d'un fichier .tsx pour SPFx.
 *
 *   flex items-center      ->  ika-flex ika-items-center
 *   md:grid-cols-3         ->  md:ika-grid-cols-3
 *
 * Le script ne modifie que les classes qu'il reconnait. Toute classe inconnue
 * est laissee intacte et signalee, afin d'eviter les faux positifs.
 *
 * Usage:
 *   node config/prefix-classes.js <fichier.tsx> [--write]
 */

const fs = require("fs");
const path = require("path");

const KNOWN_PREFIXES = [
  "absolute", "animate-", "aspect-", "backdrop-", "bg-", "block", "border",
  "bottom-", "box-", "capitalize", "col-", "container", "cursor-", "delay-",
  "divide-", "duration-", "ease-", "fill-", "fixed", "flex", "float-",
  "font-", "gap-", "grid", "grow", "h-", "hidden", "inline", "inset-",
  "items-", "justify-", "leading-", "left-", "line-", "list-", "m-", "max-",
  "mb-", "me-", "min-", "ml-", "mr-", "ms-", "mt-", "mx-", "my-", "object-",
  "opacity-", "order-", "origin-", "outline-", "overflow-", "p-", "pb-",
  "pe-", "pl-", "place-", "pointer-", "pr-", "ps-", "pt-", "px-", "py-",
  "relative", "resize", "right-", "ring-", "rotate-", "rounded", "row-",
  "scale-", "select-", "shadow", "shrink", "size-", "space-", "sr-only",
  "static", "sticky", "stroke-", "table", "text-", "top-", "tracking-",
  "transform", "transition", "translate-", "truncate", "underline",
  "uppercase", "lowercase", "visible", "w-", "whitespace-", "z-", "grid-",
  "self-", "content-", "basis-", "flex-", "gap-x-", "gap-y-", "inline-",
  "not-", "isolate", "antialiased", "break-", "indent-", "align-",
  "group", "peer",
];

const VARIANT_RE =
  /^(sm|md|lg|xl|2xl|hover|focus|focus-visible|focus-within|active|disabled|group-hover|group-focus|peer-hover|peer-focus|first|last|odd|even|dark|motion-safe|motion-reduce|print|rtl|ltr|aria-\w+|data-\[[^\]]+\])$/;

const PREFIX = "ika-";

function prefixToken(token) {
  if (!token) return { value: token, changed: false, unknown: false };

  const parts = token.split(":");
  const base = parts.pop();
  const variants = parts;

  for (const variant of variants) {
    if (!VARIANT_RE.test(variant)) {
      return { value: token, changed: false, unknown: true };
    }
  }

  if (base.startsWith(PREFIX)) {
    return { value: token, changed: false, unknown: false };
  }

  let core = base;
  let negation = "";
  if (core.startsWith("-")) {
    negation = "-";
    core = core.substring(1);
  }

  const isKnown = KNOWN_PREFIXES.some((p) =>
    p.endsWith("-")
      ? core.startsWith(p)
      : core === p || core.startsWith(`${p}-`)
  );

  if (!isKnown) {
    return { value: token, changed: false, unknown: true };
  }

  const rebuilt = [...variants, `${negation}${PREFIX}${core}`].join(":");
  return { value: rebuilt, changed: true, unknown: false };
}

function processContent(content) {
  const unknown = new Set();
  let changedCount = 0;

  const result = content.replace(
    /className=("([^"]*)"|\{`([^`]*)`\})/g,
    (match, _full, dq, tpl) => {
      const raw = dq !== undefined ? dq : tpl;
      if (raw === undefined) return match;

      const converted = raw
        .split(/(\s+)/)
        .map((chunk) => {
          if (/^\s+$/.test(chunk) || chunk === "") return chunk;
          if (chunk.indexOf("${") !== -1) return chunk;

          const res = prefixToken(chunk);
          if (res.changed) changedCount++;
          if (res.unknown) unknown.add(chunk);
          return res.value;
        })
        .join("");

      return dq !== undefined
        ? `className="${converted}"`
        : `className={\`${converted}\`}`;
    }
  );

  return { result, unknown: Array.from(unknown), changedCount };
}

function main() {
  const args = process.argv.slice(2);
  const write = args.indexOf("--write") !== -1;
  const target = args.filter((a) => a !== "--write")[0];

  if (!target) {
    console.error("Usage: node config/prefix-classes.js <fichier.tsx> [--write]");
    process.exit(1);
  }

  const filePath = path.resolve(target);
  if (!fs.existsSync(filePath)) {
    console.error(`Fichier introuvable : ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf8");
  const { result, unknown, changedCount } = processContent(content);

  console.log(`Fichier   : ${path.relative(process.cwd(), filePath)}`);
  console.log(`Prefixees : ${changedCount} classes`);

  if (unknown.length > 0) {
    console.log(`\nNon reconnues (${unknown.length}) - a verifier manuellement :`);
    unknown.forEach((u) => console.log(`  ${u}`));
  }

  if (write) {
    fs.writeFileSync(filePath, result, "utf8");
    console.log(`\nFichier mis a jour.`);
  } else {
    console.log(`\nMode simulation. Ajouter --write pour appliquer.`);
  }
}

main();
