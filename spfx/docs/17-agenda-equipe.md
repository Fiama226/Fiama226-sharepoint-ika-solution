# 17 — Agenda d'équipe

La route `#agenda` (libellé **Agenda** dans la navigation secondaire) affiche
les rendez-vous Outlook de l'utilisateur connecté et les événements
d'entreprise, réunis en une liste groupée par jour, surmontée d'une frise de
disponibilité de ses collègues pour la journée en cours.

## Ce que remplace cette fonctionnalité

`Agenda` pointait vers `#evenements`, qui rendait `EventsCalendar` : une liste
plate des prochains éléments de la liste SharePoint `Evenements`, sans notion
de jour ni de personne. Le composant existe toujours et reste utilisable
ailleurs ; il n'est simplement plus la destination du menu.

Les deux routes `#agenda` et `#evenements` mènent désormais à la même vue, afin
de ne pas casser les liens déjà partagés.

## Trois sources, et pourquoi

| Contenu | API | Consentement |
|---|---|---|
| Événements d'entreprise | `Evenements` via `SPHttpClient` | aucun |
| Membres de l'équipe | `/_api/web/associatedMemberGroup/users` | aucun |
| Mes rendez-vous Outlook | Graph `GET /me/calendarView` | `Calendars.Read.Shared` |
| Disponibilité des collègues | Graph `POST /me/calendar/getSchedule` | `Calendars.Read.Shared` |

Le choix de `Calendars.Read.Shared` plutôt que `Calendars.Read` est délibéré.
`getSchedule` respecte les **réglages de partage de chaque personne** : un
collègue qui ne partage pas son calendrier ressort avec zéro créneau, ce qui
est un résultat valide et non une panne. Aucune permission de type « lire le
calendrier de tout le monde » n'est demandée.

Deux contraintes de l'API dictent l'implémentation :

1. `getSchedule` plafonne à **20 boîtes aux lettres par appel** — la liste est
   donc découpée en lots.
2. Graph renvoie `dateTime` **sans suffixe de fuseau**, exprimé dans le fuseau
   demandé. L'en-tête `Prefer: outlook.timezone="UTC"` est envoyé et le `Z`
   est ajouté à la lecture, faute de quoi les heures glissent.

La frise de disponibilité ne couvre que **la journée en cours**, même quand la
liste affiche 7 ou 30 jours : demander un mois de créneaux à `getSchedule`
serait lent et illisible. Le nombre de collègues interrogés est plafonné
(`MAX_TEAM_MEMBERS`, 12) pour la même raison.

### Résolution des membres

Le groupe « Membres » du site est interrogé en premier. Sur un site connecté à
un groupe Microsoft 365, ce groupe SharePoint ne contient souvent **qu'un seul
principal de sécurité** au lieu des personnes une à une ; seuls les principaux
de type utilisateur (`PrincipalType === 1`) sont donc retenus, et un résultat
vide déclenche le repli sur la liste `Collaborateurs`. L'utilisateur connecté
est exclu de sa propre frise.

## Étape administrateur obligatoire

`config/package-solution.json` déclare désormais :

```json
"webApiPermissionRequests": [
  { "resource": "Microsoft Graph", "scope": "Mail.Read" },
  { "resource": "Microsoft Graph", "scope": "Chat.Read" },
  { "resource": "Microsoft Graph", "scope": "Calendars.Read.Shared" }
]
```

Après déploiement du `.sppkg`, un administrateur **général ou SharePoint** doit
approuver la nouvelle demande dans *Centre d'administration SharePoint → Accès
aux API*. Un administrateur de **collection de sites ne peut pas** le faire :
la page est réservée aux administrateurs du tenant, la portée est tenant-wide
par conception, et un catalogue d'applications de collection de sites ignore
purement et simplement les demandes de permission d'API.

### Ce que l'administrateur doit savoir avant d'approuver

Les mêmes réserves de gouvernance que pour la recherche
(voir [16-recherche-globale.md](16-recherche-globale.md)) s'appliquent : la
permission est attribuée au principal partagé *SharePoint Online Client
Extensibility* à l'échelle du tenant, la désinstallation de la solution ne la
révoque pas, et une révocation n'invalide pas les jetons déjà émis.

Deux points jouent en faveur de cette demande-ci :

- elle est **déléguée** — le composant n'agit jamais qu'au nom de la personne
  connectée, chacun ne voit que son propre calendrier ;
- elle est **moins sensible que `Mail.Read`**, déjà approuvée pour la
  recherche : lire un calendrier expose strictement moins qu'une boîte aux
  lettres.

### Comportement tant que ce n'est pas approuvé

Rien ne casse, et **rien n'est signalé à l'utilisateur** — c'est un choix
explicite. `CalendarService` renvoie `undefined` (jamais une exception) quand
Graph refuse ou quand l'hôte n'expose pas de client Graph ; la vue affiche
alors les seuls événements d'entreprise, groupés par jour, et la frise de
disponibilité disparaît au lieu de s'afficher vide. Le refus est journalisé en
console pour le diagnostic.

D'où la distinction, dans `IAgendaPayload`, entre `personalConnected: false`
(Graph n'a rien pu fournir) et une liste `entries` vide (l'agenda est
réellement vide) : les deux cas ne doivent pas produire le même rendu.

## Workbench local

`CalendarService` détecte `localhost` / `127.0.0.1` et sert `MOCK_MY_CALENDAR`
et `MOCK_TEAM_BUSY`. Ces jeux d'essai sont **calés sur la date du jour** via
`atDay()` : des dates codées en dur rendraient le Workbench vide dès qu'elles
seraient dépassées.

## Fichiers

| Fichier | Rôle |
|---|---|
| `src/services/CalendarService.ts` | Les deux appels Graph, les membres du site, la fusion des sources, la dégradation silencieuse |
| `src/webparts/groupCalendar/components/GroupCalendar.tsx` | Présentation pure : groupement par jour, frise de disponibilité, sélecteur de période |
| `src/webparts/groupCalendar/components/AgendaView.tsx` | Conteneur : état (période, chargement) et appel du callback `agenda` |
| `src/webparts/groupCalendar/components/IGroupCalendarProps.ts` | Contrat de présentation |
| `src/models/IIkaModels.ts` | `ICalendarEntry`, `IBusySlot`, `ITeamMemberBusy`, `IAgendaPayload` |
| `src/webparts/intranetMain/IntranetMainWebPart.ts` | `_loadAgenda`, `_resolveTeamMembers`, callback `_agendaFn` lié une seule fois |
| `src/webparts/intranetMain/components/IntranetMain.tsx` | Routes `agenda` / `evenements` |
| `src/services/NavigationService.ts` | Lien « Agenda » → `#agenda` |
| `config/package-solution.json` | Demande `Calendars.Read.Shared` |

## Pourquoi le callback est lié une seule fois

`_agendaFn` est un champ de classe fléché, comme `_searchFn` et `_suggestFn`.
`render()` est rappelé à chaque chargement de données ; recréer la fonction à
chaque rendu changerait son identité et relancerait le `useEffect` de
`AgendaView` — donc les appels Graph — à chaque re-rendu du web part.
