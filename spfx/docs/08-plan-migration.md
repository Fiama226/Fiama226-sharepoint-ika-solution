# 08 — Plan de migration

## 1. Phasage

| Phase | Contenu | Durée | Livrable |
|---|---|---|---|
| 0 | Cadrage et validation des listes | 1 sem. | `02-listes-sharepoint.md` approuvé |
| 1 | Provisioning des sites et listes | 1 sem. | 5 sites, 36 listes, thème |
| 2 | Socle technique SPFx | 1,5 sem. | Services, modèles, Tailwind, chrome |
| 3 | Web parts simples (lot 1 + 2) | 2,5 sem. | 10 web parts, sites départements |
| 4 | Web parts d'accueil (lot 3 + 4) | 3 sem. | Page d'accueil complète |
| 5 | Pages dédiées (lot 5) | 2 sem. | Organigramme, Histoire |
| 6 | Modules métier (lot 6) | 2 sem. | Finance, Bordereau de prix |
| 7 | Recette, contenu, formation | 2 sem. | Mise en production |

**Total : 15 semaines**, soit environ 3,5 mois pour une équipe de 2 développeurs.

---

## 2. Estimation détaillée

### Phase 2 — Socle (obligatoire avant tout)

| Tâche | Charge (j/h) |
|---|---|
| Initialisation du projet SPFx 1.23.2 | 1 |
| Configuration Tailwind + preflight scopé | 2 |
| `DataService` + cache + gestion d'erreurs | 3 |
| Modèles TypeScript | 1 |
| Application Customizer header | 3 |
| Application Customizer footer | 1 |
| Chaîne CI/CD et déploiement | 2 |
| **Total** | **13** |

### Phases 3 à 6 — Web parts

| Web Part | Charge (j/h) | Risque |
|---|---|---|
| `IkaNewsList` | 1,5 | Faible |
| `IkaQuickLinks` | 1 | Faible |
| `IkaDocumentsList` | 2 | Faible |
| `IkaEventsCalendar` | 1,5 | Faible |
| `IkaTeamDirectory` | 1,5 | Faible |
| `IkaDeptHero` | 1 | Faible |
| `IkaPageHeader` | 0,5 | Faible |
| `IkaFaqList` | 1 | Faible |
| `IkaAnnouncementMarquee` | 1,5 | Faible |
| `IkaAnnouncementsList` | 1 | Faible |
| `IkaHeroSlider` | 4 | **Moyen** — carrousel, 3 sources |
| `IkaNewsCards` | 2 | Faible |
| `IkaQuickAccessPanel` | 3 | Moyen — 3 listes |
| `IkaGallery` | 3 | Moyen — lightbox |
| `IkaTeamDirectoryHome` | 3 | Moyen — filtres, modale |
| `IkaIntranetSections` | 4 | Moyen — 3 blocs |
| `IkaOrgChart` | 6 | **Élevé** — arbre récursif, zoom |
| `IkaTimeline` | 4 | Moyen — 646 lignes |
| `IkaFinanceCharts` | 4 | **Élevé** — recharts v2 + externals |
| `IkaPriceSheet` | 6 | **Élevé** — CRUD + export Excel |
| **Total** | **52** | |

### Synthèse

| Poste | Charge (j/h) |
|---|---|
| Provisioning (phase 1) | 5 |
| Socle (phase 2) | 13 |
| Web parts (phases 3-6) | 52 |
| Recette et corrections | 10 |
| Reprise de contenu | 8 |
| Formation et documentation | 5 |
| **Total** | **93 j/h** |

À 2 développeurs, environ **10 semaines de développement** + 5 semaines de
cadrage, recette et déploiement.

---

## 3. Risques

| # | Risque | Prob. | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **React 17 casse un composant** | Élevée | Élevé | Lot 1 en validation précoce ; aucune API React 18/19 |
| R2 | Tailwind casse le chrome SharePoint | Moyenne | Élevé | Preflight scopé + préfixe, validés dès la phase 2 |
| R3 | Bundle trop volumineux | Moyenne | Moyen | Externals CDN, découpage des gros composants |
| R4 | CDN externes bloqués par la DSI | Moyenne | Moyen | Repli : héberger dans `SiteAssets` |
| R5 | Écarts visuels avec la maquette | Élevée | Faible | Recette visuelle par page, arbitrage client |
| R6 | Reprise de contenu sous-estimée | Élevée | Moyen | Identifier les propriétaires dès la phase 0 |
| R7 | Seuil des 5 000 éléments | Faible | Élevé | Index créés dès la phase 1 |
| R8 | `recharts` v3 incompatible React 17 | **Certaine** | Moyen | Rester en recharts v2.x |
| R9 | Montée SPFx pendant le projet | Faible | Faible | Figer 1.23.2, pas de mise à jour en cours de route |
| R10 | Export Excel bloqué dans Teams | Moyenne | Faible | Repli : sauvegarde en bibliothèque |

### R1 — le risque principal

C'est le seul risque capable de remettre en cause l'architecture. Il se lève
dès la fin du lot 1 : si 5 web parts simples fonctionnent en production sans
écran blanc, la stack est validée. **Ne pas démarrer les lots 3+ avant cette
validation.**

---

## 4. Écarts assumés avec la maquette

| Élément maquette | Réalité SPFx | Décision |
|---|---|---|
| Barre de suite absente | Barre M365 imposée | Assumé — non masquable |
| Police Geist | Police système | Assumé — perf > fidélité |
| Server Components | Tout client | Assumé — contrainte plateforme |
| `next/image` | `getpreview.ashx` | Équivalent fonctionnel |
| Navigation instantanée | `data-interception` | Quasi équivalent |
| Images Unsplash | Bibliothèques SharePoint | À remplacer par de vraies photos |
| Utilisateur fictif | Utilisateur réel | **Amélioration** |
| Données statiques | Listes éditables | **Amélioration** |

---

## 5. Reprise de contenu

C'est le poste le plus souvent sous-estimé.

| Liste | Volume | Source | Responsable |
|---|---|---|---|
| `Departements` | 4 | Script 4 | Automatique |
| `ParametresSite` | 12 | Script 4 | Automatique |
| `Missions` | 7 | Script 4 | Automatique |
| `Indicateurs` | 8 | Script 4 | Automatique |
| `Organigramme` | 4 | Script 4 | Automatique |
| `Collaborateurs` | 138 | **Export RH** | RH |
| `Histoire` | ~10 | Rédaction | Communication |
| `HeroSlides` | ~5 | **Photos à produire** | Communication |
| `Galerie` | ~300 | **Photos existantes** | Communication |
| `Actualites` | ~50 | Rédaction | Chaque département |
| `Documents` | ~2000 | **Migration fichiers** | Chaque département |
| `LiensRapides` | ~60 | Recensement | Chaque département |
| `FAQ` | ~40 | Rédaction | RH + DSI |

### Les deux points durs

**Les 138 collaborateurs** : ne pas les saisir à la main. Exporter depuis le
SIRH ou Entra ID, puis importer en masse :

```powershell
Import-Csv "collaborateurs.csv" -Encoding UTF8 | ForEach-Object {
    Add-PnPListItem -List "Collaborateurs" -Values @{
        Title          = $_.NomComplet
        JobTitle       = $_.Fonction
        Email          = $_.Email
        Division       = $_.Direction
        HierarchyLevel = [int]$_.Niveau
        IsActive       = $true
    }
}
```

Renseigner la colonne `Manager` **dans un second passage**, une fois tous les
collaborateurs créés — sinon les références pointent dans le vide.

**Les documents** : utiliser l'outil de migration SharePoint (SPMT) plutôt
qu'un glisser-déposer, pour préserver les dates et les auteurs. Prévoir de
renseigner `DocCategory` et `Confidentiality` après migration — ces champs sont
requis et bloqueront l'affichage s'ils sont vides.

---

## 6. Stratégie de bascule

### Option retenue : bascule progressive par département

| Semaine | Action |
|---|---|
| S1 | Ouverture du hub en lecture seule à un groupe pilote (10 personnes) |
| S2 | Corrections issues du pilote |
| S3 | Ouverture du site Techniciens (population la plus tolérante) |
| S4 | Ouverture Comptabilité + Administration |
| S5 | Ouverture Commerciaux |
| S6 | Ouverture générale + communication officielle |

### Critères de passage en production

- [ ] Aucun écran blanc sur les 20 web parts, sur 3 navigateurs
- [ ] Temps de chargement de l'accueil < 3 s
- [ ] Header et footer stables sur les 5 sites
- [ ] Contenu réel importé (plus aucune donnée de démonstration)
- [ ] Permissions validées par un test croisé entre départements
- [ ] 5 rédacteurs formés
- [ ] Procédure de restauration testée

---

## 7. Après la mise en production

| Échéance | Action |
|---|---|
| J+7 | Revue des retours utilisateurs, correctifs |
| J+30 | Analyse d'usage (pages vues, web parts consultées) |
| J+90 | Revue des permissions, nettoyage |
| Trimestriel | Veille SPFx — attention à l'arrivée de React 18 |
| Annuel | Revue d'architecture et d'accessibilité |

### Le point de veille à surveiller

Microsoft a retiré React 18 du calendrier SPFx 1.24 en mai 2026. Quand le
support arrivera, la migration React 17 → 18 sera **un projet en soi** (test de
tous les web parts, mise à jour de `recharts`, validation Fluent UI). Prévoir
5 à 8 j/h et ne jamais l'improviser en correctif.
