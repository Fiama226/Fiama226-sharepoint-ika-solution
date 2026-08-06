# IKA Solution — Intranet (maquette Next.js)

Prototype visuel d'intranet **SharePoint-like** pour la société d'ingénierie
informatique **IKA Solution**. Données **dummy**, objectif : montrer le rendu
**avant migration vers SharePoint Framework (SPFx)**.

## Démarrage

```bash
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

## Pages

| Route | Département / rôle | Design de référence |
|---|---|---|
| `/` | Accueil central | `design-references/Homepage.jpg` |
| `/comptabilite` | Comptabilité | `design-references/Finance.jpg` |
| `/administration` | Administration | `design-references/Administartion.jpg` |
| `/commerciaux` | Commerciaux | `design-references/Sales-Department-Homepage-SharePoint-Maven-scaled.jpg` |
| `/techniciens` | Techniciens | style Administration (pas d'image fournie) |

## Stack

- Next.js 16.2.10 (App Router) · React 19.2.4 · Tailwind CSS v4 · TypeScript 5
- Polices : `next/font/google` (Geist).
- Images : `next/image` (logo sous `public/assets/`).

## Thème (logo IKA)

- Bleu marine `#0A2540` (couleur principale)
- Cyan `#06B6D4` (accent)
- Tokens exposés dans `app/globals.css` (`bg-brand-navy`, `text-brand-cyan`...).

## Structure (résumé)

```
app/                # routes (accueil + 4 sous-sites)
components/layout/   # header + footer
components/intranet/ # Web Parts (Hero, News, Documents, Team, Events...)
data/               # dummy data TypeScript
lib/data.ts         # accesseurs typés
types/intranet.ts   # types partagés
docs/architecture.md # architecture détaillée
public/assets/      # logo + placeholders
```

## Pourquoi dummy data ?

Aucun backend. Toutes les données sont des exports statiques de `data/*.ts`,
consommés via les helpers `lib/data.ts`. Chaque `components/intranet/<X/>`
reçoit ses données par **props** (et non par import direct), afin de rester
1-à-1 compatible avec une future Web Part SPFx.

## Documentation

- `AGENTS.md` — consignes projet (à lire par tout agent/contributeur)
- `docs/architecture.md` — architecture, conventions, mapping SharePoint
