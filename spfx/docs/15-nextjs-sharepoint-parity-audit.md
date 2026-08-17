# Audit de parité Next.js ↔ SharePoint

**Référence fonctionnelle et visuelle :** prototype Next.js du dépôt  
**Implémentation cible :** SPFx `intranetMain` et composants associés  
**Dernière synchronisation :** 17 août 2026

## 1. Résultat de l'audit

La structure, les tokens, les composants, les comportements automatiques et les données de repli SPFx sont maintenant alignés sur le prototype Next.js. Les divergences de code identifiées pendant l'audit ont été corrigées dans l'application SharePoint.

Une comparaison finale par superposition de captures doit encore être réalisée sur le tenant cible après provisioning. Elle ne peut pas être remplacée par une capture locale : la largeur du Canvas moderne, le thème du tenant, la bannière de consentement et la barre Microsoft 365 n'existent que dans SharePoint.

## 2. Matrice de synchronisation

| Zone | Référence Next.js | Cible SPFx | État / correction appliquée |
|---|---|---|---|
| Tokens globaux | `app/globals.css` | `spfx/config/tailwind.config.js`, `src/styles/tailwind.css` | Palette `#0A2540`, `#06B6D4`, `#E63946`, Arial et reset scoped conservés. |
| Chrome de page | `app/layout.tsx` | `IntranetMain.tsx`, `fullPageChrome.ts` | Structure `min-height: 100vh`, header, contenu `flex-1`, footer et suppression des gutters Canvas/PageHeader. |
| Header | `site-header.tsx` | `IkaHeader.tsx` | Navigation, icônes, portrait authentifié, dropdowns et sticky header synchronisés. Le conteneur SPFx n'interrompt plus le sticky. |
| Hero | `hero-slider.tsx` | `HeroSlider.tsx` | Hauteur, overlays, captions, dots, missions, transitions et comportement automatique synchronisés. |
| Bandeau annonces | `announcement-marquee.tsx` | `AnnouncementMarquee.tsx` | Marquee 18 s, couleurs, densité, répétition et icônes de priorité synchronisés. |
| Actualités | `news-cards.tsx` | `NewsCards.tsx` | Grille, cartes, badges, méta et hover synchronisés. |
| Accès rapides | `quick-access-panel.tsx` | `QuickAccessPanel.tsx` | Section sombre, boutons, icônes et responsive synchronisés. |
| Équipe | `team.tsx` | `TeamHome.tsx` | Largeur scoped, portraits, cartes, anniversaires et liens de contact synchronisés. |
| Galerie | `gallery.tsx` | `Gallery.tsx` | Largeur scoped, grille éditoriale, overlay et hover synchronisés. |
| Collaborateur du mois | `last_home_page section.tsx` | `IntranetSections.tsx` | Contenu Serge, proportions, portrait, quote, nomination, séparateur et couleurs synchronisés. |
| Projets | `last_home_page section.tsx` | `IntranetSections.tsx` | Titres, responsables, statuts, progressions, dates, tâches, couleurs et grille synchronisés. |
| Footer | `site-footer.tsx` | `IkaFooter.tsx` | Colonnes, logo, liens, réseaux, copyright et fond synchronisés. |
| Annonces internes | `app/annonces` | `AnnouncementsList.tsx` | Suppression du double shell de largeur dans l'agrégateur. |
| Bordereau | `app/Bordereaudesprix` | `PriceSheet.tsx` | Titre, ligne initiale, montant et suppression du double shell synchronisés. |
| Histoire | `app/histoire` | `Timeline.tsx` | Shell, hero, timeline, images de jalons, tags, valeurs et statistiques synchronisés. |
| Organigramme | `app/organigramme` | `OrgChart.tsx` | Shell plein écran, DG, quatre directions, cartes membres, légende, recherche, zoom et profils synchronisés ; contrôles globaux absents du prototype supprimés. |

## 3. Collaborateur du mois — contrôle détaillé

Le composant SharePoint reprend les valeurs de géométrie du prototype :

- section : `py-16`, fond blanc ;
- titre : `text-3xl`, `font-extrabold`, `tracking-tight`, `text-slate-900` ;
- carte : fond navy, `rounded-3xl`, `shadow-2xl`, `overflow-hidden` ;
- disposition : colonne mobile, ligne à partir de `lg` ;
- bloc portrait : `h-72` en mobile, `w-72` à partir de `md`, `object-cover` ;
- overlay portrait : gradient noir vers transparent et badge absolu en bas à gauche ;
- contenu : `px-8 py-10` ;
- nom : `text-2xl`, `font-extrabold`, blanc ;
- rôle : cyan, `font-semibold` ;
- citation : `text-sm`, `leading-relaxed`, `text-slate-300` ;
- attribution : bordure blanche à 10 %, `pt-6`, légende uppercase 10 px ;
- encart droit : `rounded-xl`, fond blanc à 5 %, `px-6 py-5` ;
- photo : `Serge.jpg`, chemin déployé `/SiteAssets/team/Serge.jpg` ;
- donnée active : **SERGE GEDEON OUE**, **Lead Software Engineer**, **Juin 2026**.

Les lookups `Employee` et `Department`, ainsi que le champ Image moderne `Photo`, sont désormais renseignés explicitement par `Deploy-IkaIntranet.ps1`. Sans cette liaison, SharePoint rendait un bloc vide ou une photo de repli alors que le markup était correct.

## 4. Animations et comportements automatiques

### Hero

| Comportement | Valeur commune |
|---|---:|
| Changement de slide | 5 000 ms |
| Changement de mission | 6 000 ms |
| Fondu principal | 1 000 ms |
| Transition caption / mission | 700 ms |
| Interaction dots | changement immédiat |
| Pause au survol | aucune |
| Réduction de mouvement | autoplay désactivé si `prefers-reduced-motion: reduce` |

Dans le webpart agrégateur, `animationsEnabled` pilote maintenant réellement `autoPlay`. Dans le webpart Hero autonome, la propriété `autoPlay` est transmise jusqu'au composant. Les temporisateurs sont nettoyés à chaque démontage et ne tournent pas lorsqu'il n'y a qu'une seule entrée.

### Autres transitions

- marquee : `18s linear infinite` ;
- cartes actualités, équipe, galerie et timeline : transition de transformation/couleur identique au prototype ;
- images timeline : zoom de groupe en 500 ms ;
- révélations IntersectionObserver propres à SPFx : supprimées, car elles n'existaient pas dans le prototype ;
- sticky header : son ancêtre SPFx est désormais `display: contents`, évitant de limiter le sticky à la hauteur du webpart header.

## 5. Corrections SharePoint structurelles

1. Les wrappers `CanvasZone`, `CanvasSection`, `CanvasControl`, `ControlZone`, `CanvasZoneContainer` et `pageHeader` sont neutralisés en mode portail plein écran.
2. Les composants internes ne reçoivent plus deux fois `max-width`, padding ou shell vertical depuis l'agrégateur.
3. Les racines Team et Gallery déclarent explicitement `width: 100%`, y compris pour loading/error.
4. La colonne principale du layout homepage est `w-full min-w-0`; la sidebar est la seule zone à largeur fixe en desktop.
5. Les icônes SVG Lucide utilisent `stroke-width: 2`; les glyphes Font Awesome utilisent leur propre viewBox. L'icône `Shield` manquante a été ajoutée.
6. Les tags de timeline issus des listes SharePoint passent par une table de classes préfixées `ika-`; une valeur externe ne peut plus injecter une classe Tailwind non générée.
7. Chaque jalon sans champ Image utilise une image de repli par année, comme le prototype.
8. Les dates françaises n'imposent plus un zéro initial absent du prototype.

## 6. Synchronisation des contenus de repli et du provisioning

Les données mock SPFx sont synchronisées avec `data/home.ts` pour :

- slides Hero et images réelles `12-Modifier.jpg`, `13-Modifier.jpg`, `14-Modifier.jpg` ;
- collaborateurs, rôles, bureaux, anniversaires, portraits et ordre d'affichage ;
- collaborateur du mois Serge ;
- six documents clés, leurs icônes et leur ordre ;
- dix accès rapides globaux, filtrés par `Scope` pour ne pas mélanger les liens départementaux ;
- quatre événements avec libellés de date figés, catégories, ordre et images identiques ;
- quatre projets de la homepage ;
- jalons et contenu Histoire déjà fourni par les CSV ;
- statistiques Histoire dédiées : 138 collaborateurs, 4 pays, 200+ projets livrés, 98 % de satisfaction, 9 années d'expérience et 12 certifications ;
- valeurs Histoire : Excellence Technique, Passion & Engagement, Esprit d'équipe et Impact africain.

`DataService` trie les collaborateurs live et mock par `SortOrder`. Seuls les huit profils présents dans la maquette sont actifs dans les vues Équipe et Organigramme ; les profils supplémentaires du jeu historique restent archivés. Le provisioning relie leurs managers et départements. Les photos, les trois images Hero et le logo sont copiés dans `SiteAssets`, avec la casse exacte du dépôt, puis les portraits sont écrits en JSON de champ Image moderne dans `Collaborateurs.Photo` et `CollaborateurDuMois.Photo`.

## 7. Validation reproductible

Depuis `spfx/` :

```bash
npm run validate:design
npm run validate
npm run build:tailwind
npm run test
npm run build
```

Depuis la racine :

```bash
npm run lint
npm run build
```

`npm run validate:design` contrôle les contrats de parité qui ne doivent pas régresser : tokens, timings, classes structurantes du collaborateur du mois, autoplay, wrappers SharePoint, provisioning des photos et présence/casse des assets.

## 8. Recette visuelle sur le tenant

Effectuer la recette après exécution du provisioning et déploiement du `.sppkg` :

1. ajouter uniquement le webpart **IKA — Intranet (composant principal)** sur une page pleine largeur ;
2. vérifier les résolutions **375 × 812**, **768 × 1024**, **1440 × 900** et **1920 × 1080** ;
3. utiliser le même contenu et le même utilisateur dans les deux cibles ;
4. attendre l'arrêt des transitions, puis capturer Next.js et SharePoint à la même largeur ;
5. superposer les captures à 50 % d'opacité ou utiliser un diff de pixels ;
6. accepter uniquement les différences de chrome Microsoft 365 hors de `.ika-root` ;
7. vérifier le Hero à `t=0`, `t=5s`, `t=6s` et `t=10s` ;
8. activer `prefers-reduced-motion` et confirmer l'absence de rotation automatique ;
9. tester clavier, focus visible, dropdowns, dots du Hero, filtres, recherche et zoom ;
10. confirmer dans l'onglet Réseau qu'aucun asset `SiteAssets/team` ne retourne 404.

Toute différence à l'intérieur de `.ika-root` doit être corrigée dans le composant concerné, et non masquée par un zoom navigateur, un transform global ou une largeur arbitraire du webpart.
