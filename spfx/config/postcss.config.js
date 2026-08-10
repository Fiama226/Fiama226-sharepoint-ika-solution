'use strict';
/**
 * Configuration PostCSS consommée par le webpack patch ci-dessus
 * (config/webpack-patch.js) et par le script de build Tailwind autonome
 * (config/build-tailwind.js) utilisé en mode workbench.
 *
 * IMPORTANT : on pointe explicitement Tailwind sur notre config
 * (config/tailwind.config.js). Sinon, postcss-loader laisse Tailwind
 * auto-détecter sa config à partir du cwd (racine du projet) — or notre
 * config est dans config/ et n'est pas trouvée, Tailwind retombe sur une
 * config vide (« content missing or empty ») et ne génère AUCUNE classe.
 * build-tailwind.js fait déjà ce pointage explicite ; on l'aligne ici.
 */
const path = require("path");

module.exports = {
  plugins: {
    tailwindcss: { config: path.resolve(__dirname, "tailwind.config.js") },
    autoprefixer: {},
  },
};

