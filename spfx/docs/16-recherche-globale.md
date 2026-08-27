# 16 — Recherche globale

Barre de recherche de l'en-tête : menu déroulant de suggestions + page de
résultats complète, couvrant les fichiers, dossiers, pages, actualités,
éléments de liste, sites, personnes, e-mails et messages Teams.

## Ce que remplace cette fonctionnalité

Avant, `IkaHeader` avait deux comportements selon son point de montage :

- monté par l'extension `IkaChromeApplicationCustomizer` (sans `onNavigate`),
  valider redirigeait vers `{hubUrl}/_layouts/15/search.aspx/siteall?q=…` —
  ce chemin fonctionnait ;
- monté par `IntranetMain` (avec `onNavigate`), valider naviguait vers
  `actualites?q=…`. Or `parseHashRoute()` découpait sur `?` et **jetait la
  chaîne de requête** : le terme saisi était perdu et l'utilisateur atterrissait
  sur la liste d'actualités non filtrée. Aucun code ne lisait `q`.

Le repli vers la recherche native SharePoint est conservé : il reste actif
partout où l'en-tête n'a pas de callback `onSearch`.

## Deux API, et pourquoi

| Contenu | API | Consentement |
|---|---|---|
| Fichiers, dossiers, pages, actualités, éléments de liste, sites, personnes | `POST /_api/search/postquery` (`SPHttpClient`) | aucun — s'exécute avec la session de l'utilisateur |
| E-mails | Graph `POST /search/query`, `entityTypes: ["message"]` | `Mail.Read` |
| Messages Teams | Graph `POST /search/query`, `entityTypes: ["chatMessage"]` | `Chat.Read` |

Deux contraintes de l'API Graph dictent l'architecture :

1. Le service n'accepte **qu'un seul `searchRequest` à la fois**.
2. La matrice de combinaison interdit de mélanger `message` ou `chatMessage`
   avec `driveItem` / `listItem` / `site`.

Couvrir les trois familles impose donc **trois appels séparés** — d'où des
onglets plutôt qu'une liste unique. Pour `message`, `size` est plafonné à 25 et
`from` doit valoir 0 au premier appel.

Le menu déroulant n'interroge **que SharePoint** : déclencher trois
allers-retours à chaque frappe serait coûteux pour des sources que
l'utilisateur n'a pas encore demandées. E-mails et messages Teams sont chargés
paresseusement à l'ouverture de leur onglet.

## Étape administrateur obligatoire

`config/package-solution.json` déclare :

```json
"webApiPermissionRequests": [
  { "resource": "Microsoft Graph", "scope": "Mail.Read" },
  { "resource": "Microsoft Graph", "scope": "Chat.Read" }
]
```

Après déploiement du `.sppkg` dans le catalogue d'applications, un
administrateur **général ou SharePoint** doit approuver ces demandes dans
*Centre d'administration SharePoint → Accès aux API*.

### Ce que l'administrateur doit savoir avant d'approuver

Une permission accordée via SPFx n'est **pas limitée à cette solution**. Elle
est attribuée au principal partagé *SharePoint Online Client Extensibility*,
à l'échelle du tenant. Conséquences documentées par Microsoft :

- toute autre solution côté client du tenant peut alors lire la boîte aux
  lettres de l'utilisateur connecté ;
- désinstaller cette solution **ne révoque pas** la permission ;
- révoquer la permission **n'invalide pas** les jetons déjà émis.

C'est une décision de gouvernance, prise en connaissance de cause pour ce
portail.

### Comportement tant que ce n'est pas approuvé

Rien ne casse. Microsoft précise qu'une solution ne doit jamais supposer que
ses permissions ont été accordées. `SearchService` intercepte les réponses
403/401 et renvoie `{ results: [], degraded: "…" }` ; les onglets concernés
affichent un encart explicatif au lieu d'une erreur, et **toute la partie
SharePoint reste pleinement fonctionnelle**.

L'onglet reste visible plutôt que masqué : un onglet absent laisserait croire
que la fonction n'existe pas, alors qu'elle attend seulement une action de
l'administrateur.

## Fichiers

| Fichier | Rôle |
|---|---|
| `src/services/SearchService.ts` | Les deux API, cache `sessionStorage` (`ika.search.*`, 2 min), mocks, dégradation |
| `src/common/hooks/useSearchSuggest.ts` | Temporisation 250 ms + compteur de séquence contre les réponses hors ordre |
| `src/common/utils/searchDisplay.ts` | Icône/libellé/pastille par type, définition des onglets |
| `src/extensions/ikaChrome/components/SearchSuggest.tsx` | Panneau de suggestions (présentation pure) |
| `src/webparts/searchResults/components/SearchResults.tsx` | Route `#recherche` : onglets, pagination |
| `src/extensions/ikaChrome/components/IkaHeader.tsx` | Champ, clavier (↑ ↓ Entrée Échap), `⌘K`, clic extérieur |
| `src/webparts/intranetMain/components/IntranetMain.tsx` | `parseHashRoute` corrigé (conserve `q`), route `recherche` |

## Points d'implémentation à connaître

- **Surlignage.** SharePoint et Graph renvoient tous deux `<c0>…</c0>` et
  `<ddd/>`. `highlight()` les convertit en `<mark>` / `…` **puis** assainit via
  `sanitizeHtml` (DOMPurify). L'ordre compte : assainir d'abord supprimerait
  les `<c0>` avant traduction.
- **Jamais `body.content`.** Pour les résultats Graph on rend le `summary`
  fourni par l'API, pas le corps du message : ce dernier est du HTML arbitraire.
- **Callbacks liés une fois.** `IntranetMainWebPart` expose `_searchFn` et
  `_suggestFn` comme champs de classe. `render()` étant rappelé à chaque
  chargement de données, des fermetures recréées à chaque rendu relanceraient
  le `useEffect` de `useSearchSuggest` — donc une requête réseau — à chaque
  re-rendu.
- **Deux champs coexistent.** Le formulaire bureau reste dans le DOM sur petit
  écran (`ika-hidden md:ika-flex`). Les identifiants ARIA sont donc suffixés par
  variante, et la fermeture au clic extérieur teste `[data-ika-search]` plutôt
  qu'un `ref` unique — sinon un clic sur une suggestion mobile serait vu comme
  « extérieur » et le panneau disparaîtrait avant que le `click` n'arrive.
- **Mocks fidèles.** Le Workbench tourne sur localhost, donc `SearchService`
  sert `MOCK_SEARCH_RESULTS`. Le filtre de l'onglet « Tout » exclut e-mails et
  messages Teams, exactement comme la production, où cette verticale est une
  requête SharePoint pure.

## Vérification

```bash
npx tsc --noEmit -p tsconfig.json   # types
npm run validate                    # manifestes
npm run build:tailwind              # après ajout de classes utilitaires
```

Puis, **après avoir arrêté le serveur de développement** (`npm run build`
lance `heft test --clean`, qui efface `dist/` sous un `heft start` actif) :

```bash
npm run build
```

Enfin, sur une vraie page **avant** l'approbation administrateur : vérifier que
les résultats SharePoint fonctionnent et que les onglets E-mails / Messages
Teams affichent l'encart explicatif sans erreur console.
