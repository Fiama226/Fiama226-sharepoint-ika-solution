'use strict';
/**
 * Webpack Patch pour ajouter le support de PostCSS + Tailwind à la chaîne
 * de loaders CSS du rig SPFx Heft (@microsoft/spfx-web-build-rig).
 *
 * Désactive également le renommage / hashing CSS Modules sur les fichiers CSS
 * normaux (generateCssClassName: undefined) pour que toutes les classes
 * utilitaires Tailwind (.ika-*) restent littérales et s'appliquent correctement
 * aux classes JSX générées dans le code React.
 */
const path = require('path');

const POSTCSS_LOADER_PATH = require.resolve('postcss-loader');
const POSTCSS_CONFIG_PATH = path.resolve(__dirname, 'postcss.config.js');

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
    if (!rule) return rule;
    const testSource = rule.test ? rule.test.toString() : '';
    const isCssRule =
      /\.css/i.test(testSource) &&
      !/module/.test(testSource) &&
      !/scss-module/.test(testSource) &&
      !/sass-module/.test(testSource);

    if (isCssRule && Array.isArray(rule.use)) {
      const use = rule.use.map((u) => {
        if (typeof u === 'object' && u && u.loader && u.loader.includes('sp-css-loader')) {
          return {
            ...u,
            options: {
              ...u.options,
              generateCssClassName: undefined,
            },
          };
        }
        return u;
      });
      return { ...rule, use: [...use, tailwindPostcssLoader] };
    }
    return rule;
  });

  return generatedConfig;
};
