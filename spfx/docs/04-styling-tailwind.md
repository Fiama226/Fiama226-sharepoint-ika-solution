# 04 — Tailwind CSS dans SPFx

## 1. Le problème à résoudre

SharePoint injecte sa propre feuille de styles sur chaque page. Tailwind, par
défaut, applique **Preflight** : un reset CSS agressif qui cible `html`, `body`,
`h1`-`h6`, `ul`, `button`, `a`… Injecté tel quel dans une page SharePoint,
Preflight **casse le chrome natif** : la barre de suite, les menus, les panneaux
d'édition et les boîtes de dialogue perdent leur mise en forme.

Le risque est réel et bidirectionnel :

| Sens | Symptôme |
|---|---|
| Tailwind → SharePoint | Barre de navigation cassée, menus sans puces, boutons délavés |
| SharePoint → Tailwind | Web parts qui héritent de marges et polices inattendues |

## 2. La stratégie retenue

Trois mesures combinées, chacune indispensable :

| Mesure | Effet |
|---|---|
| **Préfixe `ika-`** sur toutes les classes | `ika-flex` au lieu de `flex` — zéro collision |
| **Preflight scopé** à `.ika-root` | Le reset ne s'applique qu'à l'intérieur des web parts |
| **Conteneur racine** obligatoire | Chaque web part encapsule son rendu |

Résultat : SharePoint et Tailwind coexistent sans se marcher dessus.

## 3. Installation

```bash
npm install -D tailwindcss@3 postcss autoprefixer postcss-prefix-selector
```

> **Tailwind v3 et non v4.** La maquette utilise Tailwind v4 avec
> `@theme inline`, mais v4 impose `@tailwindcss/postcss` et un moteur Rust
> (Lightning CSS) qui n'est pas compatible avec la chaîne PostCSS de Heft.
> Tailwind v3 reste pleinement supporté et couvre 100 % des classes utilisées
> dans la maquette. C'est une contrainte de plateforme, pas un choix esthétique.

## 4. `tailwind.config.js`

```js
const { scopedPreflightStyles, isolateInsideOfContainer } =
  require("tailwindcss-scoped-preflight");

module.exports = {
  prefix: "ika-",
  important: ".ika-root",
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        brand: {
          navy:        "#0A2540",
          "navy-light":"#173B66",
          "navy-dark": "#061A33",
          cyan:        "#06B6D4",
          "cyan-dark": "#0891B2",
          accent:      "#E63946",
          "accent-dark":"#C8313D",
          "accent-soft":"#FDE8EA",
          ink:         "#0F172A",
          muted:       "#475569",
          surface:     "#F1F5F9",
          "surface-2": "#E2E8F0",
          line:        "#E5E7EB",
          success:     "#16A34A",
          warning:     "#D97706",
          danger:      "#DC2626",
        },
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: { marquee: "marquee 18s linear infinite" },
    },
  },
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer(".ika-root"),
    }),
  ],
};
```

Les couleurs reprennent **exactement** les tokens de `app/globals.css`, et
l'animation `marquee` celle utilisée par `announcement-marquee.tsx`.

## 5. `postcss.config.js`

```js
module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
  ],
};
```

## 6. Feuille d'entrée — `src/styles/tailwind.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Importée une seule fois dans chaque web part :
```ts
import "../../styles/tailwind.css";
```

## 7. Conteneur racine — la règle non négociable

Chaque composant racine de web part doit être encapsulé :

```tsx
export const NewsList: React.FC<INewsListProps> = (props) => {
  return (
    <div className="ika-root">
      <section className="ika-rounded-2xl ika-bg-white ika-p-6 ika-shadow-sm">
        <h2 className="ika-text-xl ika-font-semibold ika-text-brand-navy">
          {props.title}
        </h2>
        {/* ... */}
      </section>
    </div>
  );
};
```

Sans `.ika-root`, ni Preflight ni la règle `important` ne s'appliquent : le
rendu sera incohérent.

## 8. Conversion des classes — table de correspondance

| Maquette | SPFx |
|---|---|
| `flex items-center gap-4` | `ika-flex ika-items-center ika-gap-4` |
| `bg-brand-navy` | `ika-bg-brand-navy` |
| `text-brand-cyan` | `ika-text-brand-cyan` |
| `md:grid-cols-3` | `md:ika-grid-cols-3` |
| `hover:bg-brand-cyan` | `hover:ika-bg-brand-cyan` |
| `animate-marquee` | `ika-animate-marquee` |

> Le préfixe se place **après** le variant (`md:ika-grid-cols-3`), jamais avant.
> C'est la source d'erreur la plus fréquente lors du portage.

### Script de conversion assisté

```bash
node spfx/config/prefix-classes.js src/webparts/newsList/components/NewsList.tsx
```

Le script préfixe automatiquement les classes connues et **signale** celles
qu'il ne reconnaît pas plutôt que de les modifier au hasard. Une relecture
manuelle reste nécessaire.

## 9. Polices

La maquette charge Geist via `next/font/google`. En SPFx, deux options :

| Option | Avantage | Inconvénient |
|---|---|---|
| **Police du thème SharePoint** (recommandé) | Zéro requête, cohérence M365 | Perte de l'identité Geist |
| `@font-face` + fichiers dans `SiteAssets` | Fidélité visuelle | +200 Ko, FOUT possible |

Recommandation : utiliser la pile système via
`var(--fontFamily, 'Segoe UI', system-ui, sans-serif)`. L'écart visuel avec
Geist est minime et le gain de performance réel.

## 10. Validation

- [ ] Barre de suite SharePoint intacte
- [ ] Menu de navigation du hub fonctionnel
- [ ] Volet de propriétés du web part correctement stylé
- [ ] Boîtes de dialogue (partage, détails) non altérées
- [ ] Mode édition de page : bordures et poignées visibles
- [ ] Deux web parts sur la même page : pas de fuite de styles
- [ ] Affichage dans l'onglet Teams
- [ ] Application mobile SharePoint
