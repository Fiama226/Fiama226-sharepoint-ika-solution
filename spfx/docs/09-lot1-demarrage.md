# 09 — Lot 1 : démarrage et validation de la stack

> **Objectif de ce lot** : prouver que la chaîne complète fonctionne en
> production — SPFx 1.23.2 + React 17 + Tailwind préfixé + accès aux listes.
> Tant que ce lot n'est pas validé, **ne pas démarrer les lots suivants**.

## 1. Ce qui est livré

| Web Part | Dossier | Liste lue | Portée de |
|---|---|---|---|
| IKA — Actualités | `src/webparts/newsList/` | `Actualites` | `News.tsx` + `news-list.tsx` |
| IKA — Liens rapides | `src/webparts/quickLinks/` | `LiensRapides` | `quick-links.tsx` |
| IKA — Documents | `src/webparts/documentsList/` | `Documents` | `documents-list.tsx` |
| IKA — Événements | `src/webparts/eventsCalendar/` | `Evenements` | `events-calendar.tsx` |
| IKA — Annuaire équipe | `src/webparts/teamDirectory/` | `Collaborateurs` (hub) | `team-directory.tsx` |

Chacune suit le même découpage en 4 fichiers décrit dans
`03-migration-composants.md` §2.

### Composants partagés

| Fichier | Rôle |
|---|---|
| `src/common/utils/Icon.tsx` | **43 icônes SVG inline**, zéro dépendance |
| `src/common/utils/spUtils.ts` | Dates, images, devises, `cn()` |
| `src/services/DataService.ts` | Accès REST + cache session |
| `src/models/IIkaModels.ts` | Interfaces TypeScript |

---

## 2. Le composant Icon — pourquoi il n'utilise pas lucide-react

La maquette utilise **deux** systèmes d'icônes en parallèle :

- `components/intranet/icon.tsx` — 24 icônes SVG écrites à la main
  (`calendar`, `people`, `pdf`, `finance`…)
- `lib/lucide-icon.tsx` — 19 icônes de `lucide-react`
  (`Code2`, `Users`, `Briefcase`…)

Les données (`data/*.ts`) mélangent les deux conventions : on trouve
`icon: "calendar"` **et** `icon: "Code2"` dans les mêmes fichiers.

`src/common/utils/Icon.tsx` **fusionne les deux registres** — les 43 noms sont
reconnus, avec la même casse. Aucune donnée n'est à corriger lors de la
migration.

Pourquoi ne pas simplement installer `lucide-react` ?

| Critère | SVG inline | `lucide-react` |
|---|---|---|
| Poids ajouté au bundle | ~6 Ko | ~50 Ko minimum |
| Dépendance à valider | Aucune | Oui (`AGENTS.md` §6) |
| Compatibilité React 17 | Totale | À vérifier à chaque version |
| Noms de la maquette | Couverts | Seulement les 19 Lucide |

En SPFx, chaque kilo-octet est téléchargé par tous les utilisateurs sur toutes
les pages. Le SVG inline est le bon choix ici.

---

## 3. Ordre de mise en place

### Étape 1 — Scaffolder le projet

```bash
npm install @microsoft/spfx-cli --global
spfx create --template webpart-react --library-name ika-intranet
cd ika-intranet
npm install react@17.0.1 react-dom@17.0.1 --save-exact
```

### Étape 2 — Copier les fichiers fournis

```bash
cp -r ../spfx/src/*            ./src/
cp    ../spfx/config/tailwind.config.js  ./
cp    ../spfx/config/package-solution.json ./config/
```

Fusionner ensuite `spfx/config/package.json.template` avec le `package.json`
généré : reprendre les versions **exactes** des dépendances.

### Étape 3 — Configurer Tailwind

```bash
npm install -D tailwindcss@3 postcss autoprefixer \
               tailwindcss-scoped-preflight postcss-loader
```

Créer `src/styles/tailwind.css` :
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

L'importer dans chaque fichier `*WebPart.ts` :
```ts
import "../../styles/tailwind.css";
```

> Voir `04-styling-tailwind.md` pour la configuration PostCSS complète et
> le raccordement à la chaîne Heft.

### Étape 4 — Compiler et tester

```bash
npm run trust-cert     # heft trust-dev-cert — une seule fois
npm start              # heft start --nobrowser
```

Ouvrir une page moderne du site et ajouter :
```
?debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/manifests.js
```

> Le workbench local (`workbench.aspx`) ne permet **pas** de tester l'accès
> aux listes : il n'a pas de contexte de site. Toujours déboguer sur une vraie
> page SharePoint.

### Étape 5 — Déployer

```bash
npm run ship           # bundle --ship && package-solution --ship
```

Puis suivre `06-provisioning.md` §4.

---

## 4. Tests de validation obligatoires

Ce sont les tests qui lèvent le risque **R1** (React 17). Chacun doit passer
**en production**, pas seulement en local.

### 4.1 Test anti-écran-blanc

| # | Test | Attendu |
|---|---|---|
| 1 | Ajouter chaque web part sur une page publiée | Contenu visible, pas de cadre vide |
| 2 | Recharger la page 3 fois | Rendu stable |
| 3 | Console navigateur (F12) | Aucune erreur rouge |
| 4 | `React.version` dans la console | `17.0.1` exactement |

```js
// À exécuter dans la console de la page SharePoint
console.log(require("react").version);
```

### 4.2 Test des états

Chaque web part gère **4 états**. Les vérifier tous :

| État | Comment le provoquer | Attendu |
|---|---|---|
| Chargement | Recharger la page | Squelette animé |
| Données | Liste remplie | Contenu correct |
| **Vide** | Vider la liste | Message explicatif, pas d'erreur |
| **Erreur** | Renommer la liste temporairement | Message rouge lisible |

> L'état vide est le plus souvent oublié. Une liste vide ne doit **jamais**
> produire un composant qui disparaît sans explication.

### 4.3 Test de non-régression SharePoint

C'est le test du risque **R2** (Tailwind casse le chrome).

- [ ] Barre de suite Microsoft 365 intacte
- [ ] Navigation du hub fonctionnelle
- [ ] Volet de propriétés du web part correctement stylé
- [ ] Mode édition : poignées et bordures visibles
- [ ] Boîte de dialogue « Partager » non déformée
- [ ] **Deux web parts sur la même page** : aucune fuite de styles

### 4.4 Test responsive

| Largeur | Contexte |
|---|---|
| 320 px | Mobile portrait |
| 768 px | Tablette |
| 1024 px | Écran partagé |
| 1920 px | Bureau |

### 4.5 Test d'accessibilité

- [ ] Navigation complète au clavier (Tab)
- [ ] Focus visible sur tous les liens
- [ ] Lecteur d'écran : titres de section annoncés
- [ ] Images décoratives en `alt=""`

---

## 5. Pièges rencontrés lors du portage

### `Author` est un champ système

`data/news.ts` a un champ `author`. En SharePoint, `Author` désigne le
**créateur de l'élément** et ne peut pas être redéfini. D'où `NewsAuthor`
dans la liste et dans `INewsItem`.

### Les métadonnées de fichier sont natives

`documents-list.tsx` affiche `type`, `modifiedAt`, `modifiedBy`, `size`.
Aucun de ces champs n'est à créer : SharePoint fournit `File_x0020_Type`,
`Modified`, `Editor`, `File_x0020_Size`. Le composant porté déduit le type
depuis l'extension du fichier via `getFileExtension()`.

### `EventDate` porte la date **et** l'heure

La maquette sépare `date` et `time`. Le template calendrier (106) stocke les
deux dans `EventDate`. `formatTime()` extrait l'heure, et gère le cas
`fAllDayEvent` en affichant « Journée entière ».

### Les photos peuvent échouer

`TeamDirectory` tente d'abord la photo de la liste, puis la photo du profil
M365, puis **retombe sur les initiales** via `onError`. Sans ce repli, un
utilisateur sans photo affiche une image cassée.

### `group` doit être préfixé, pas `group-hover:`

Avec un préfixe Tailwind, la classe marqueur devient `ika-group`, mais le
variant reste `group-hover:ika-text-white`. Le script `prefix-classes.js`
applique correctement cette règle — la vérifier après chaque conversion.

---

## 6. Après validation du lot 1

Une fois les 5 tests passés en production :

| Étape | Action |
|---|---|
| 1 | Documenter le résultat dans le compte rendu de recette |
| 2 | Figer les versions dans `package-lock.json` (commit) |
| 3 | Démarrer le lot 2 (`03-migration-composants.md` §5) |

Si un test échoue, **ne pas contourner** : identifier la cause racine. Un
écran blanc masqué par un `try/catch` réapparaîtra ailleurs, en pire.
