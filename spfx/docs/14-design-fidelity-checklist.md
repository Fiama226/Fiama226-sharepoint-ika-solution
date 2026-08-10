# 14 — Checklist de fidélité visuelle Next.js ↔ Web Part SharePoint

> Objectif : après installation de la Web Part **« IKA Solution — Portail
> Intranet »** sur votre site SharePoint, le rendu doit être **identique** à la
> maquette Next.js (racine du repo). Ce document liste, section par section,
> les points à vérifier avec les **valeurs exactes** (couleurs, polices,
> espacements, images) et la procédure de comparaison.

---

## 0. Préparation avant l'installation

| # | Action | Détail |
|---|---|---|
| 0.1 | Déployer le `.sppkg` | `spfx/release/` (ou `sharepoint/solution/*.sppkg`) → catalogue d'apps du tenant |
| 0.2 | Créer les listes | Suivre `docs/10-listes-a-creer.md` + `../DEPLOYMENT-GUIDE.md` (20 listes) |
| 0.3 | **Uploader le logo** | `public/assets/logo.png` → **`SiteAssets/logo.png`** du site racine (obligatoire : le header affiche ce fichier, hauteur 64 px) |
| 0.4 | **Uploader les photos** | `public/assets/team/*.jpg` (DG.jpg, serge.jpg, daouda.jpg, sandrine.jpg, Martin.jpg, roukie.jpg, victorine.jpg, aminata.jpg, Serge.jpg, landry.jpeg, 12/13/14-Modifier.jpg) → **`SiteAssets/team/`** + références dans la liste `Collaborateurs` (colonne Photo) et `HeroSlides` |
| 0.5 | Page d'accueil | Créer une page vide → ajouter la Web Part en **section pleine largeur** → publier (mode lecture) |
| 0.6 | Police | La maquette rend en **Arial** (aucune webfont chargée). La Web Part force `Arial, Helvetica, sans-serif` dans `.ika-root` — ne pas changer la police du site |

> **Vérification rapide** : ouvrir la maquette (`npm run dev` à la racine →
> http://localhost:3000) dans un onglet et la page SharePoint dans un autre.
> Passer en revue les sections ci-dessous de haut en bas.

---

## 1. Header (identique à `components/layout/site-header.tsx`)

| # | Point de contrôle | Valeur attendue |
|---|---|---|
| 1.1 | Barre sticky | Header collant en haut, fond `bg-white/80` + `backdrop-blur-md`, bordure basse `gray-200`, z-index 50 |
| 1.2 | Barre supérieure (desktop ≥1024 px) | Hauteur 40 px, fond `gray-50/50`, bordure basse `gray-100`, texte 14 px ; à gauche un lien invisible (260 px), à droite : **Organigramme · Agenda · Histoire** (icônes 14 px ; actif `text-blue-700 font-medium`, inactif `text-gray-500 hover:text-blue-600`) |
| 1.3 | Barre principale | Hauteur 64 px, logo réel (hauteur 64 px, largeur auto), actions à droite |
| 1.4 | Recherche | Pill arrondi `rounded-full`, fond `gray-100`, largeur 224 px (256 px ≥1024 px), icône loupe à gauche `gray-400`, **raccourci ⌘K** à droite (pastille `gray-200`, visible ≥1024 px) ; au focus : fond blanc + anneau bleu `blue-500/20` |
| 1.5 | Bouton Documents | Icône dossier + libellé « Documents » (visible ≥1280 px) ; au clic : panneau 288 px avec **« Repository »**, lien **« Tous les documents »** (bleu), 4 départements avec pastilles colorées — Comptabilité bleu, Administration violet, Commerciaux vert, Techniciens orange — et **« All Documents »** en bas |
| 1.6 | Cloche notifications | Icône cloche `gray-500`, point rouge `red-500` avec liseré blanc en haut à droite |
| 1.7 | Profil | Bouton pilule bordé `gray-200`, photo ronde 32 px + chevron ; menu 224 px : nom + email, **Mon profil**, **Paramètres**, séparateur, **Déconnexion** (rouge `red-600`) |
| 1.8 | Menu mobile (<1024 px) | Hamburger → panneau : recherche, navigation **Accueil · Comptabilité · Administration · Commerciaux · Techniciens**, séparateur, bloc « Ressources » (Organigramme · Agenda · Histoire), bloc profil avec photo |
| 1.9 | Icônes | Mêmes glyphes que la maquette (lucide) : Home, Calculator, ShieldCheck, Users, Wrench, GitBranch, Calendar, BookOpen, Bell, Search, FolderOpen, ChevronDown, Menu, X |

> **Différence assumée (contenu, pas design)** : le nom/email du profil et le
> message « Bienvenue » du hero affichent **l'utilisateur SharePoint réellement
> connecté**, alors que la maquette montre un utilisateur fictif (« Landry » /
> « Awa Kaboré »). La structure et le style sont identiques.

---

## 2. Hero slider (identique à `components/intranet/hero-slider.tsx`)

| # | Point de contrôle | Valeur attendue |
|---|---|---|
| 2.1 | Hauteur | **Pleine hauteur d'écran** (100vh) par défaut (propriété `height = screen`) |
| 2.2 | Diapositives | 3 visuels plein écran, fondu 1 000 ms toutes les 5 s ; dégradés `from-black/80 via-black/40 to-black/10` + `from-black/60 to-transparent` |
| 2.3 | Barre du haut | Liseré accent rouge `#E63946` (32×4 px, arrondi) à gauche ; **heure + date** en blanc à droite (visible ≥768 px) |
| 2.4 | Légende | Sous-titre rouge `#E63946` (12 px, `tracking-[4px]`, majuscules), titre blanc 30 px (48 px ≥768 px) `font-extrabold`, ombre portée |
| 2.5 | Points de navigation | Sous le titre : point actif 32×4 px rouge, inactifs 12×4 px `white/40` (hover `white/70`) |
| 2.6 | Panneau droit (≥1024 px, 340 px) | Carte **Bienvenue** (nom réel + rôle « Responsable communication interne » + pastille verte « En ligne » animée), carte **Mission/Vision/Valeurs** (emoji 20 px, libellé rouge, titre blanc, texte `white/60`, points de navigation), **3 statistiques** (📁 24 Projets actifs, 👥 138 Collaborateurs, 🎯 12 Tickets ouverts) |
| 2.7 | Pas de bouton CTA | La maquette n'a **aucun** bouton dans le hero (retiré de la Web Part) |

---

## 3. Bandeau d'annonces (identique à `components/intranet/announcement-marquee.tsx`)

| # | Point de contrôle | Valeur attendue |
|---|---|---|
| 3.1 | Conteneur | `rounded-2xl`, fond `from-white via-slate-50/50 to-white`, bordure `slate-200/60`, ombre `slate-900/5`, pleine largeur (dans le padding 16/24/32 px) |
| 3.2 | Badge « Actualités » | Pilule avec point cyan animé (ping), libellé 12 px gras espacé, compteur cyan |
| 3.3 | Titre | Tuile dégradée cyan→bleu avec mégaphone blanc + « **Célébrations & événements** » 20/24 px gras (dégradé navy) |
| 3.4 | Bouton CTA | « Toutes les annonces » — dégradé navy, arrondi 12 px, effet de brillance au survol, flèche animée |
| 3.5 | Marquee | Défilement continu 18 s, pause au survol ; cartes blanches avec **barre latérale dégradée** (bleu→cyan, violet→rose, orange→rouge, émeraude→teal, en alternance), icône de priorité (🔥 orange pour la 1ʳᵉ, ⭐ jaune pour la 2ᵉ, 📣 grise ensuite), badge **« Nouveau »** rouge pulsant sur la 1ʳᵉ carte, pastille date colorée avec calendrier |
| 3.6 | État vide | Cadre pointillé, mégaphone gris, « Aucune annonce pour le moment » |

---

## 4. Actualités (identique à `components/intranet/News.tsx`)

| # | Point de contrôle | Valeur attendue |
|---|---|---|
| 4.1 | En-tête | « VIE INTERNE » 12 px rouge espacé (`tracking-[0.3em]`) + titre 30/36 px `font-extrabold` `slate-900` + paragraphe descriptif 14 px `slate-500` |
| 4.2 | Grille | 2 colonnes (desktop), bordure `slate-200`, fond blanc, coins 16 px, ombre légère ; séparateurs internes 1 px `slate-200` |
| 4.3 | Carte | Image 176×… px mobile / 112×160 px desktop (coins 12 px), catégorie rouge 11 px espacée, date grise, titre 18 px gras (rouge au survol), extrait 2 lignes max, « LIRE LA SUITE » révélé au survol |
| 4.4 | CTA bas de page | Pilule bordée `slate-300`, texte gras `slate-900` ; au survol fond rouge `#E63946` + texte blanc + flèche |

---

## 5. Documents clés + Accès rapide + Événements
(identique à `components/intranet/firstSection.tsx`)

| # | Point de contrôle | Valeur attendue |
|---|---|---|
| 5.1 | Fond de section | `bg-slate-50`, padding vertical 48 px |
| 5.2 | Titres de colonnes | Liseré rouge 20×4 px + titre 20 px `font-extrabold` `slate-900` |
| 5.3 | Documents clés | 2 colonnes de **cartes sombres** (`slate-900`, hauteur 128 px, coins 16 px) : icône blanche à 60 % (100 % au survol) + libellé blanc ; survol : remontée 2 px + ombre |
| 5.4 | Accès rapide | 2 colonnes de cartes blanches bordées `slate-200` : tuile rouge 36×36 px avec icône blanche (zoom au survol), libellé 12 px gras ; survol : fond rose pâle `#FDE8EA` + bordure rouge |
| 5.5 | Événements | Lien « Voir tout » (chevron), cartes blanches : badge date **fond `slate-900`** (mois 9 px majuscules espacées + jour 24 px gras), **image 56×64 px**, titre 14 px gras (rouge au survol), date « Mar, 10 Juin, 10:00 » + pastille catégorie colorée (Stratégie bleu, Tech violet, Innovation émeraude, SecOps rose) |

---

## 6. Notre équipe + Galerie
(identique à `components/intranet/before_last_home_page_section.tsx`)

| # | Point de contrôle | Valeur attendue |
|---|---|---|
| 6.1 | Disposition | **Côte à côte** sur desktop (Équipe à gauche, Galerie à droite), empilées en mobile |
| 6.2 | Équipe — en-tête | « Notre équipe » 30 px gras + compteur « N collaborateurs » (pilule blanche ombrée) + sous-titre |
| 6.3 | Équipe — recherche/filtre | Champ avec loupe (« Rechercher par nom ou poste… ») + liste déroulante « Filtrer par département » avec icône filtre ; focus bordure rouge |
| 6.4 | Équipe — cartes | Photo 192 px (haut de l'image), badge « Bientôt ! » ambre si anniversaire ≤30 j, dégradé bas, pastille département colorée (Direction violet, Engineering bleu, Ventes & Marketing orange, Comptabilité émeraude), nom gras, poste gris, anniversaire + âge en pied de carte ; survol : remontée 4 px + ombre |
| 6.5 | Équipe — fiche modale | Photo 208 px avec dégradé, bouton fermer rond, « Anniversaire », « Localisation », « Email », « Téléphone » avec icônes rouges ; fermeture Échap + piège de focus |
| 6.6 | Galerie — en-tête | « Galerie » 30 px gras + compteur « N photos » (pilule `slate-100`) + sous-titre |
| 6.7 | Galerie — filtres | Pilules « Tous · Événements · Formation · Projets » (active : fond rouge) |
| 6.8 | Galerie — mosaïque | 2 colonnes (mobile) / 4 (desktop) ; **la 1ʳᵉ image et chaque 5ᵉ occupe 2×2** (260 px min), autres 130 px ; légende + catégorie révélées au survol |
| 6.9 | Galerie — lightbox | Fond noir 90 %, navigation ← →, fermeture ✕, légende + catégorie en bandeau `slate-900`, Échap + flèches clavier |

---

## 7. Collaborateur du mois + Projets
(identique à `components/intranet/last_home_page section.tsx`)

| # | Point de contrôle | Valeur attendue |
|---|---|---|
| 7.1 | Disposition | Les deux sections **côte à côte** (`flex-row`), fond blanc |
| 7.2 | Collaborateur du mois | Trophée ambre + titre 30 px + pastille mois (« Juin 2026 », ambre translucide) ; carte **fond navy `#0A2540`** : photo 288 px, badge « TOP PERFORMER » ambre, 5 étoiles ambre, département cyan, nom blanc 24 px, citation sur `white/5` avec guillemet ambre, « — Nominateur » en cyan |
| 7.3 | Projets — en-tête | Icône tendance rouge + « Tableau de bord Projets » 30 px + sous-titre |
| 7.4 | Projets — pilules | 3 compteurs : Projets actifs (gris), Dans les délais (émeraude), Tâches réalisées (ambre) |
| 7.5 | Projets — cartes | 2 colonnes, séparateurs 1 px ; nom + « Lead : X · Échéance date », pastille statut (En cours émeraude / À risque ambre / En retard rose), **barre de progression** 6 px avec % , « N/M tâches complétées » |

---

## 8. Vues internes (navigation par hash)

| # | Vue | Point de contrôle |
|---|---|---|
| 8.1 | **#annonces** | En-tête « ANNONCES » cyan + « Toutes les annonces » 30 px + description ; cartes blanches `rounded-3xl` bordure `brand-navy/10` : emoji 30 px, titre navy, date, texte `brand-ink` — **sans pastille de type** (retirée) |
| 8.2 | **#documents** | En-tête « EXPLORATEUR » cyan + « Documents du dépôt » + description avec `<code>Documents/</code>` ; fil d'Ariane « Documents › Bibliothèque documentaire » ; liste à lignes séparées : tuile d'icône colorée (PDF rouge, DOCX bleu, XLSX vert, PPT ambre…), nom navy, taille/catégorie, pastille confidentialité, pastille « Ouvrir » |
| 8.3 | **#histoire** | Page complète portée : hero 92vh (photo + « Bâtir le digital de demain. » + CTA rouge + bandeau stats), section Fondateur, frise chronologique (cartes avec image, badge année, tag, stats ; points centraux ; alternance gauche/droite ; clic = état actif), valeurs « Ce qui nous guide », chiffres clés sur fond sombre, CTA « Notre histoire continue de s'écrire. » |
| 8.4 | **#organigramme** | En-tête violet (tuile dégradé `violet-500→purple-600`, titre `slate-900`), recherche avec focus violet, arbre hiérarchique, fiche profil au clic |
| 8.5 | **#bordereau** | Tableau classique à bordure `gray-800` sur fond `gray-50` : titre centré souligné « BORDEREAU DES PRIX POUR LES FOURNITURES », double ligne d'en-tête (1-6 + Actions, puis libellés), cellules éditables sans bordure interne, totaux HT / TVA 18 % / TTC en pied de tableau |

---

## 9. Footer (identique à `components/layout/site-footer.tsx`)

| # | Point de contrôle | Valeur attendue |
|---|---|---|
| 9.1 | Fond | Dégradé navy `from-brand-navy via-brand-navy to-brand-navy/95`, bordure haute `brand-navy/20` |
| 9.2 | Bloc société | Logo dans cadre blanc avec **halo rouge/bleu flouté**, « IKA Solution » en dégradé blanc→gris, description, lien mail avec icône enveloppe rouge |
| 9.3 | Colonnes | « Liens rapides » (Accueil, À propos, Services, Contact) et « Informations légales » — titres avec soulignement dégradé rouge, lien avec tiret animé au survol |
| 9.4 | Réseaux sociaux | 5 boutons ronds 44 px (`bg-white/5`, bordure `white/10`, blur) : Facebook (hover `#1877F2`), Instagram (dégradé violet→rose), X (noir), LinkedIn (`#0A66C2`), WhatsApp (`#25D366`) ; survol : zoom + remontée + ombre rouge |
| 9.5 | Bas | Copyright « © 2026 IKA Solution. Tous droits réservés. » + **barre décorative rouge** 4 px en bas de page |

---

## 10. Typographie & couleurs (récapitulatif)

| Token | Valeur | Usage |
|---|---|---|
| Bleu marine | `#0A2540` | `bg-brand-navy` : footer, cartes docs, boutons, collaborateur du mois |
| Cyan | `#06B6D4` | `text-brand-cyan` : eyebrows des vues, accents |
| Rouge accent | `#E63946` | `bg-brand-accent` : liserés, tuiles d'icônes, CTA, boutons |
| Texte | `#0F172A` (ink) / `#475569` (muted) | titres / corps |
| Surfaces | `#F1F5F9` (surface) / `#E2E8F0` (surface-2) / `#E5E7EB` (line) | fonds, séparateurs |
| Header (blues) | `blue-700` `#1D4ED8`, `blue-600` `#2563EB`, `gray-50`→`gray-900` | navigation, recherche, profils |
| Police | `Arial, Helvetica, sans-serif` | tout le contenu `.ika-root` |

---

## 11. Pièges connus à vérifier en priorité sur le tenant

1. **Logo manquant** → le header affiche une icône « IKA » générée : vérifier `SiteAssets/logo.png`.
2. **Photos manquantes** (équipe, hero, collaborateur du mois) → cases grises : vérifier les colonnes Photo des listes (`Collaborateurs`, `HeroSlides`, `CollaborateurDuMois`) et l'upload `SiteAssets/team/`.
3. **Chrome SharePoint visible** → la Web Part masque le chrome natif en **mode lecture** uniquement (`fullPageChrome.ts`) : ne pas juger le rendu en mode édition.
4. **Police Segoe UI** → si le texte diffère de la maquette, vérifier que `.ika-root { font-family: Arial, … }` est bien présent dans `src/styles/tailwind.css` (compilé dans le bundle).
5. **Mode édition** : les sections s'affichent sans animations (comportement voulu pour ne pas casser l'édition SharePoint).
6. **Hauteur du hero** : propriété `height` de la Web Part = `screen` (100vh) ; si le client préfère 70vh, changer en `large` — la maquette Next.js utilise 100vh.
7. **Emojis hero** : la colonne Icône de `Missions` / `Indicateurs` doit contenir les **emojis** (🚀 🌍 ⚡ 📁 👥 🎯), pas des noms d'icônes.

---

## 12. Procédure de recette rapide (5 min)

1. `npm run dev` à la racine → http://localhost:3000 (maquette).
2. Ouvrir la page SharePoint publiée avec la Web Part.
3. Fenêtre côte à côte, zoom navigateur à 100 %, largeur ≥1280 px.
4. Parcourir : header → hero → marquee → actualités → accès rapide → équipe+galerie → collaborateur+projets → footer.
5. Cliquer les vues : Annonces, Documents, Histoire, Organigramme, Bordereau.
6. Refaire le parcours en largeur mobile (≤768 px) : menu hamburger, empilement des sections.
7. Cocher chaque point des sections 1 à 9 ; toute différence = anomalie à signaler.

> Toute divergence constatée doit être comparée au composant Next.js de
> référence (tableau `docs/03-migration-composants.md`) avant correction côté SPFx.
