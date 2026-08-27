const path = require("path");
const {
  scopedPreflightStyles,
  isolateInsideOfContainer,
} = require("tailwindcss-scoped-preflight");

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "ika-",
  important: ".ika-root",
  // Chemins ABSOLUS (relatifs à ce fichier de config) : lors du build Heft,
  // le cwd n'est pas forcément la racine du projet, et Tailwind ne résolvait
  // pas le glob relatif « ./src » (avertissement « content missing or empty »
  // → aucune classe utilitaire générée). L'absolu rend le scan indépendant
  // du cwd. __dirname = config/ → ../src = racine/src.
  content: [
    path.resolve(__dirname, "../src/**/*.ts"),
    path.resolve(__dirname, "../src/**/*.tsx"),
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      // ATTENTION — tokens de largeur RÉDÉFINIS pour le mode pleine page.
      //
      // Le portail est déployé en Web Part unique plein écran (voir
      // `fullPageChrome.ts` : position fixed / 100vw). Les ~20 conteneurs de
      // section écrits en `ika-mx-auto ika-max-w-7xl` (et `6xl`) rendaient
      // donc une colonne de 1280 px centrée dans un viewport pleine largeur.
      //
      // On élargit ici les DEUX tokens de shell plutôt que de réécrire les
      // 20 sites d'appel : un seul point de contrôle, réversible en une
      // ligne, et surtout SANS toucher aux tokens étroits (`max-w-md`,
      // `xl`, `2xl`, `4xl`) qui servent volontairement à centrer les
      // cartes d'état vide, le texte du hero et la FAQ (confort de lecture).
      //
      // `6xl` et `7xl` ne signifient donc plus 72rem/80rem dans ce projet :
      // ce sont les largeurs de shell pleine page.
      // TODO(IKA) — comportement sur très grands écrans (> 1920 px).
      //
      // Valeur actuelle `100%` = bord à bord absolu : sur un écran 2560 px,
      // le contenu s'arrête à 32 px du bord (`lg:ika-px-8`) et les cartes
      // d'une rangée `lg:grid-cols-4` font ~630 px chacune.
      //
      // Alternative : mettre une borne en pixels (ex. "1800px"). Le
      // `ika-mx-auto` déjà présent sur chaque shell reprend alors son rôle
      // et recentre le contenu au-delà de cette borne — plein écran sur tout
      // moniteur normal, marges de respiration uniquement en ultra-large.
      maxWidth: {
        "6xl": "100%",
        "7xl": "100%",
      },
      colors: {
        brand: {
          navy: "#0A2540",
          "navy-light": "#173B66",
          "navy-dark": "#061A33",
          cyan: "#06B6D4",
          "cyan-dark": "#0891B2",
          accent: "#E63946",
          "accent-dark": "#C8313D",
          "accent-soft": "#FDE8EA",
          ink: "#0F172A",
          muted: "#475569",
          surface: "#F1F5F9",
          "surface-2": "#E2E8F0",
          line: "#E5E7EB",
          success: "#16A34A",
          warning: "#D97706",
          danger: "#DC2626",
        },
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 18s linear infinite",
      },
    },
  },
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer(".ika-root"),
    }),
  ],
};
