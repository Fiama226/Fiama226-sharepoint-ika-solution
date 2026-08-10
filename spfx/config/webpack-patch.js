'use strict';
/**
 * Webpack Patch pour ajouter le support de PostCSS + Tailwind à la chaîne
 * de loaders CSS du rig SPFx Heft (@microsoft/spfx-web-build-rig).
 *
 * Pourquoi ce patch est nécessaire :
 *   - Le loader par défaut du rig (@microsoft/sp-css-loader) ne reconnaît pas
 *     les directives `@tailwind` ni `@import` de PostCSS.
 *   - On insère donc `postcss-loader` AVANT le loader CSS du rig pour
 *     compiler Tailwind + autoprefixer à partir du fichier source
 *     `src/styles/tailwind.css`.
 *   - Le plugin `tailwindcss-scoped-preflight` (déjà présent dans le
 *     projet) gère l'isolation du préflight via la classe `.ika-root`,
 *     sans avoir besoin du préflight Tailwind global.
 *
 * Activation :
 *   Ce fichier est référencé par `config/webpack-patch.json` via la
 *   propriété `patchFiles`. Le Heft Webpack Patch Plugin l'applique
 *   automatiquement à la configuration webpack générée par le rig.
 *
 * Documentation officielle :
 *   https://learn.microsoft.com/en-us/sharepoint/dev/spfx/toolchain/customize-heft-toolchain-customize-webpack-config
 */
const path = require('path');

const POSTCSS_LOADER_PATH = require.resolve('postcss-loader');
const POSTCSS_CONFIG_PATH = path.resolve(__dirname, 'postcss.config.js');

/**
 * Export par défaut : fonction qui reçoit la configuration webpack
 * générée par le rig et la retourne (modifiée ou non).
 *
 * NB : on peut modifier l'objet en place, mais on doit le retourner.
 *
 * @param {object} generatedConfig Configuration webpack produite par le rig
 * @returns {object} Configuration webpack patchée
 */
module.exports = function patchTailwindPostcss(generatedConfig) {
  if (!generatedConfig || !generatedConfig.module || !Array.isArray(generatedConfig.module.rules)) {
    return generatedConfig;
  }

  const tailwindPostcssLoader = {
    loader: POSTCSS_LOADER_PATH,
    options: {
      postcssOptions: {
        config: POSTCSS_CONFIG_PATH,
      },
    },
  };

  generatedConfig.module.rules = generatedConfig.module.rules.map((rule) => {
    if (!rule || !rule.test) return rule;
    const testSource = rule.test.toString();
    // On ne patche que les règles CSS non-module. Le test du rig SPFx est
    // /(\.css|\.scss|\.sass)$/i : un match ancré en fin (/\.css$/) échoue
    // car la chaîne se termine par le flag « i ». On cherche donc « .css »
    // en sous-chaîne et on exclut explicitement les CSS modules.
    const isCssRule =
      /\.css/i.test(testSource) &&
      !/module/.test(testSource) &&
      !/scss-module/.test(testSource) &&
      !/sass-module/.test(testSource);
    if (isCssRule) {
      const use = Array.isArray(rule.use) ? rule.use.slice() : [];
      // postcss-loader (Tailwind) doit s'exécuter AVANT le sp-css-loader du
      // rig. Or Webpack applique les loaders de droite à gauche : pour qu'il
      // tourne en premier, on l'AJOUTE EN FIN de tableau (et non au début).
      return { ...rule, use: [...use, tailwindPostcssLoader] };
    }
    return rule;
  });

  return generatedConfig;
};
