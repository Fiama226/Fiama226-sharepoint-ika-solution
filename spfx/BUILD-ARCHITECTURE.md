# Architecture de build SPFx (Heft-based)

> Référence rapide : comment le build SPFx est orchestré, et où intervenir
> pour personnaliser.

## Vue d'ensemble

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          package.json (scripts)                          │
│                                                                          │
│   npm run build   →   heft test --production                            │
│                  +   heft package-solution --production                  │
│   npm run start   →   heft start           (= heft build-watch --serve)  │
│   npm run clean   →   heft clean                                         │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│              config/rig.json  →  @microsoft/spfx-web-build-rig           │
│                                                                          │
│   Le rig fournit la configuration par défaut de Heft pour SPFx :         │
│   heft.json, typescript.json, sass.json, jest.config.json, etc.          │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                       config/heft.json  (étend le rig)                    │
│                                                                          │
│   - hérite de toutes les tâches par défaut                              │
│   - ajoute la tâche `copy-sharepoint-assets-extras` qui copie            │
│     `sharepoint/assets/LICENSE.md` à côté du .sppkg                      │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          config/config.json                              │
│                                                                          │
│   - déclare 2 bundles (ika-intranet-web-parts,                          │
│     ika-intranet-chrome-extension)                                       │
│   - associe chaque bundle à ses entrypoints (TS) et manifests (JSON)     │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                  config/webpack-patch.json (patch array)                 │
│                                                                          │
│   - référence config/webpack-patch.js                                   │
│   - appliqué en fin de chaîne par le `webpack-patch-plugin`              │
│   - ajoute postcss-loader pour compiler Tailwind dans le bundle         │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                  Phase `package-solution` (Heft)                        │
│                                                                          │
│   - lit config/package-solution.json                                    │
│   - génère le .sppkg dans sharepoint/solution/                          │
│   - inclut les SharePoint assets (elements.xml) depuis                  │
│     sharepoint/assets/                                                   │
│   - copie LICENSE.md grâce à `copy-sharepoint-assets-extras`            │
└──────────────────────────────────────────────────────────────────────────┘
```

## Arborescence SPFx minimale (post-migration Heft)

```
spfx/
├── package.json                 ← scripts heft, deps SPFx 1.23.2
├── tsconfig.json                ← extends @microsoft/spfx-web-build-rig
├── Dockerfile                   ← multi-stage (builder + dev)
├── docker-compose.yml           ← workbench + build + shell
├── .dockerignore
├── .gitignore
│
├── config/
│   ├── rig.json                 ← @microsoft/spfx-web-build-rig
│   ├── heft.json                ← étend le rig + ajoute des tasks
│   ├── typescript.json          ← options Heft TS plugin
│   ├── sass.json                ← options Heft SASS plugin
│   ├── config.json              ← bundles, entrypoints, manifests
│   ├── serve.json               ← config workbench (workbench URL + certs)
│   ├── package-solution.json    ← metadata du .sppkg
│   ├── tailwind.config.js       ← config Tailwind (préfixe ika-)
│   ├── postcss.config.js        ← plugins PostCSS
│   ├── webpack-patch.json       ← liste des patches webpack
│   ├── webpack-patch.js         ← patch concret (postcss-loader)
│   ├── build-tailwind.js        ← build Tailwind standalone (workbench)
│   ├── validate.js              ← validateur d'artefacts
│   ├── prefix-classes.js        ← préfixeur de classes Tailwind
│   └── typecheck/               ← config TS pour validation hors-projet
│
├── sharepoint/                  ← assets SharePoint du package
│   ├── assets/
│   │   ├── elements.xml         ← manifest de l'extension
│   │   └── LICENSE.md           ← licence copiée dans le .sppkg
│   └── solution/                ← SORTIE : .sppkg + debug/
│
├── src/                         ← code TS
│   ├── styles/
│   │   └── tailwind.css         ← entrée Tailwind (compilée par build:tailwind)
│   ├── webparts/                ← 20 web parts
│   ├── extensions/ikaChrome/    ← 1 application customizer
│   ├── common/                  ← hooks + utils
│   ├── services/                ← DataService, NavigationService
│   └── models/                  ← interfaces TS
│
└── provisioning/                ← scripts PowerShell (inchangés)
```

## Cycle de vie d'un build

1. **`npm install`** — installe `@rushstack/heft`, `@microsoft/spfx-web-build-rig`, `@microsoft/spfx-heft-plugins`, etc.

2. **`npm run build:tailwind`** — pré-compile `src/styles/tailwind.css` → `lib/styles/tailwind.css`. C'est ce fichier qui est ensuite importé par les web parts (cf. `import "../../../styles/tailwind.css";` en haut de chaque composant).

3. **`heft test --clean --production`** —
    - `clean` : supprime `lib/`, `temp/`, `dist/`, `release/`, etc.
    - `set-browserslist-ignore-old-data-env-var` : évite l'avertissement browserslist
    - `sass` : compile les `.scss` (si présents)
    - `static-asset-typings` : génère les `.d.ts` pour les images
    - `typescript` : compile les `.ts`/`.tsx` vers `lib/`
    - `lint` : ESLint (désactivé en watch mode)
    - `copy-javascript` : copie les éventuels `.js` de `src/` vers `lib/`
    - `configure-webpack` : lit `config/config.json`
    - `third-party-externals-configure-webpack` : déclare les externals
    - `configure-webpack-serve` : lit `config/serve.json`
    - `customize-configure-webpack` : applique le patch par défaut (`spfx-customize-webpack.js`)
    - `webpack-patch` : applique les patches déclarés dans `config/webpack-patch.json` (notre Tailwind PostCSS loader)
    - `webpack` : bundle final vers `dist/`
    - `jest` : tests unitaires (0 test ici, 0 erreur)

4. **`heft package-solution --production`** —
    - `copy-sharepoint-assets-extras` (notre tâche) : copie `sharepoint/assets/LICENSE.md` vers `sharepoint/solution/`
    - `package-solution` : lit `config/package-solution.json`, agrège les manifests, génère le `.sppkg`

## Cycle de vie d'un build workbench

1. **`npm run start`** = `heft start` = `heft build-watch --serve`
2. Heft lance un build incrémental puis reste en watch
3. Webpack-dev-server démarre sur `https://0.0.0.0:4321/`
4. Un certificat de dev est généré et stocké dans `~/.rushstack/`
5. L'URL du workbench est construite avec `?debugManifestsFile=...&customActions=...` :
    ```
    https://ikasolution.sharepoint.com/sites/ika-intranet/_layouts/15/workbench.aspx
      ?debugManifestsFile=https%3A%2F%2F0.0.0.0%3A4321%2Ftemp%2Fbuild%2Fmanifests.js
      &customActions={"1e7a6b9d-...":{"location":"ClientSideExtension.ApplicationCustomizer",...}}
    ```
6. Toute modification d'un fichier `.ts`/`.tsx` recompile automatiquement
7. Pour modifier le CSS Tailwind : `npm run build:tailwind` puis refresh

## Personnalisation courante

### Ajouter un web part
1. Créer `src/webparts/myWebPart/MyWebPart.ts` + `.manifest.json`
2. Ajouter l'entrée dans `config/config.json` :
   ```json
   {
     "entrypoint": "./lib/webparts/myWebPart/MyWebPart.js",
     "manifest": "./src/webparts/myWebPart/MyWebPart.manifest.json"
   }
   ```
3. Référencer aussi le web part dans `config/package-solution.json` (via `componentIds` si on veut le ranger dans une feature précise, sinon c'est implicite).

### Ajouter un asset SharePoint (ex. fichier .xml provisionné)
1. Déposer le fichier dans `sharepoint/assets/`
2. Le référencer dans `config/package-solution.json` → `solution.features[].assets.elementManifests` ou `elementFiles`

### Changer le port du workbench
→ Modifier `config/serve.json` (`port`).

### Changer la cible SharePoint
→ Modifier `config/serve.json` (`serveConfigurations.default.pageUrl`).

### Ajouter une tâche Heft personnalisée
→ Étendre `config/heft.json` avec une nouvelle `tasksByName` dans la phase voulue. Voir les plugins disponibles sur [heft.rushstack.io/pages/plugins/](https://heft.rushstack.io/pages/plugins/).

### Modifier profondément la config webpack
→ Éviter d'éditer directement. Préférer ajouter un patch dans `config/webpack-patch.json` (méthode officielle, composable, compatible avec les futures versions de Heft). En dernier recours : `heft eject-webpack`.

## Pourquoi Heft plutôt que Gulp ?

| Aspect | Gulp (avant SPFx 1.22) | Heft (SPFx 1.22+) |
|---|---|---|
| Orchestrateur | Gulp | Heft (Rush Stack) |
| Config de build | `gulpfile.js` impératif | `rig.json` + `heft.json` déclaratif |
| Tasks custom | Code JS dans `gulpfile.js` | Plugins Heft déclarés en JSON |
| Héritage | Copy-paste entre projets | Rig packages (composables) |
| TypeScript | Plugin Gulp + rush-stack-compiler | Plugin TypeScript natif de Heft |
| Watch | `gulp serve` | `heft start` = `build-watch --serve` |
| Hot reload | Live reload par rechargement | Webpack-dev-server (HMR-ready) |
| Performance | Lent sur gros projets | Incrémental + cache |
| Compat SPFx | 1.0 à 1.21.1 | 1.22+ (obligatoire) |
