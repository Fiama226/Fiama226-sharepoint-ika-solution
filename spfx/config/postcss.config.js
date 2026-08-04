'use strict';
/**
 * Configuration PostCSS consommée par le webpack patch ci-dessus
 * (config/webpack-patch.js) et par le script de build Tailwind autonome
 * (config/build-tailwind.js) utilisé en mode workbench.
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
