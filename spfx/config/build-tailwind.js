'use strict';
/**
 * Build Tailwind autonome (utilisé par le workbench).
 *
 * Contexte :
 *   - Le projet pré-compile Tailwind en un fichier `tailwind.css` statique
 *     qui est ensuite importé par chaque web part
 *     (ex. `import './styles/tailwind.css';`).
 *   - Cela évite de charger Tailwind dans le navigateur à chaque
 *     démarrage de web part et contourne les limitations du
 *     SP-CSS-loader vis-à-vis de PostCSS.
 *   - En mode workbench (`heft start`), Heft ne déclenche PAS le
 *     webpack patch à chaque sauvegarde de fichier source. Ce script
 *     est donc appelé AVANT `heft start` pour matérialiser le bundle
 *     Tailwind dans `lib/`.
 *   - En watch mode, on peut relancer ce script à la main
 *     (`npm run build:tailwind`).
 *
 * Sortie :
 *   lib/styles/tailwind.css  ←  compilé, purgé, autoprefixer appliqué
 */
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'styles', 'tailwind.css');
const OUT_DIR = path.join(ROOT, 'lib', 'styles');
const OUT_FILE = path.join(OUT_DIR, 'tailwind.css');
const TAILWIND_CONFIG = path.join(__dirname, 'tailwind.config.js');

async function build() {
  if (!fs.existsSync(SRC)) {
    console.error(
      `[build-tailwind] Fichier source introuvable : ${SRC}\n` +
        `Crée-le avec au minimum :\n` +
        `  @tailwind base;\n  @tailwind components;\n  @tailwind utilities;\n`
    );
    process.exit(1);
  }

  const css = await fs.promises.readFile(SRC, 'utf8');

  const result = await postcss([
    tailwindcss(TAILWIND_CONFIG),
    autoprefixer,
  ]).process(css, {
    from: SRC,
    to: OUT_FILE,
  });

  await fs.promises.mkdir(OUT_DIR, { recursive: true });
  await fs.promises.writeFile(OUT_FILE, result.css, 'utf8');

  const sizeKb = (result.css.length / 1024).toFixed(2);
  console.log(
    `[build-tailwind] OK  ${path.relative(ROOT, OUT_FILE)}  (${sizeKb} KB)`
  );
}

build().catch((err) => {
  console.error('[build-tailwind] ERREUR :', err);
  process.exit(1);
});
