# 05 — Application Customizer : header et footer IKA

## 1. Objectif

Reproduire `components/layout/site-header.tsx` (393 lignes) et
`components/layout/site-footer.tsx` (88 lignes) sur **tous les sites** du hub,
via une extension SPFx unique.

## 2. Ce qu'un Application Customizer peut et ne peut pas faire

| Capacité | Statut |
|---|---|
| Injecter du contenu **au-dessus** de la zone de page (`Top`) | Oui |
| Injecter du contenu **en dessous** (`Bottom`) | Oui |
| S'appliquer à toutes les pages d'un site | Oui |
| Masquer la barre de suite Microsoft 365 | **Non** |
| Masquer l'en-tête de site natif | Partiellement, via `hideDefaultHeader` |
| Masquer la navigation du hub | **Non** |

### Conséquence honnête sur le rendu

Le header IKA s'affichera **sous** la barre de suite Microsoft 365 (la barre
violette avec le lanceur d'applications). Il est techniquement impossible de la
supprimer — elle est injectée par le shell M365, hors du DOM contrôlable.

Empilement réel :

```
┌──────────────────────────────────────┐
│ Barre de suite M365  (non masquable) │
├──────────────────────────────────────┤
│ Header IKA  (placeholder Top)        │  ← notre code
├──────────────────────────────────────┤
│ Contenu de la page + Web Parts       │
├──────────────────────────────────────┤
│ Footer IKA  (placeholder Bottom)     │  ← notre code
└──────────────────────────────────────┘
```

Pour masquer l'en-tête de site natif et éviter un double header :

```ts
protected onInit(): Promise<void> {
  const app = this.context.application as unknown as { hideDefaultHeader?: () => void };
  app.hideDefaultHeader?.();
  return Promise.resolve();
}
```

> `hideDefaultHeader()` n'est pas typé dans toutes les versions du SDK, d'où le
> cast. Vérifier son comportement après chaque montée de version SPFx.

## 3. Structure

```
src/extensions/ikaChrome/
├── IkaChromeApplicationCustomizer.ts
├── IkaChromeApplicationCustomizer.manifest.json
├── components/
│   ├── IkaHeader.tsx
│   ├── IkaFooter.tsx
│   ├── IkaNav.tsx
│   ├── IkaUserMenu.tsx
│   └── IkaMobileNav.tsx
└── loc/
```

## 4. Implémentation

```ts
import { override } from "@microsoft/decorators";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from "@microsoft/sp-application-base";
import * as React from "react";
import * as ReactDom from "react-dom";

export interface IIkaChromeProperties {
  navigationSource: "hub" | "list" | "static";
  showFooter: boolean;
}

export default class IkaChromeApplicationCustomizer
  extends BaseApplicationCustomizer<IIkaChromeProperties> {

  private _top?: PlaceholderContent;
  private _bottom?: PlaceholderContent;

  @override
  public onInit(): Promise<void> {
    this.context.placeholderProvider.changedEvent.add(this, this._render);
    this._render();
    return Promise.resolve();
  }

  private _render(): void {
    if (!this._top) {
      this._top = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );
      if (this._top) {
        ReactDom.render(
          React.createElement(IkaHeader, {
            siteUrl: this.context.pageContext.web.absoluteUrl,
            currentUser: this.context.pageContext.user.displayName,
            currentUserEmail: this.context.pageContext.user.email,
            currentPath: this.context.pageContext.web.serverRelativeUrl,
          }),
          this._top.domElement
        );
      }
    }

    if (this.properties.showFooter && !this._bottom) {
      this._bottom = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );
      if (this._bottom) {
        ReactDom.render(React.createElement(IkaFooter, {}), this._bottom.domElement);
      }
    }
  }

  private _onDispose = (): void => {
    if (this._top) ReactDom.unmountComponentAtNode(this._top.domElement);
    if (this._bottom) ReactDom.unmountComponentAtNode(this._bottom.domElement);
  };
}
```

> `changedEvent` est **obligatoire** : les placeholders ne sont pas
> nécessairement disponibles au moment de `onInit`. Sans cet abonnement,
> le header disparaît aléatoirement selon la vitesse de chargement.

## 5. Portage du header

### Ce qui se porte sans modification

- La structure JSX et les classes Tailwind
- Le menu mobile et son état d'ouverture (`useState`)
- Le méga-menu des départements
- `live-clock.tsx` → hook `useLiveClock`

### Ce qui change

| Élément | Maquette | SPFx |
|---|---|---|
| Route active | `usePathname()` | `context.pageContext.web.serverRelativeUrl` |
| Utilisateur | `company.currentUser` (fixe) | `context.pageContext.user.displayName` |
| Photo de profil | Placeholder | `/_layouts/15/userphoto.aspx?size=S&username=` |
| Navigation | Tableau en dur | Liste `LiensRapides` ou navigation du hub |
| `<Link>` | `next/link` | `<a data-interception="propagate">` |

### Le vrai gain : l'utilisateur réel

La maquette affiche un utilisateur fictif (`AGENTS.md` §1). En SPFx,
`this.context.pageContext.user` donne l'utilisateur authentifié sans aucune
configuration. C'est gratuit et immédiat.

### Liens du header à corriger

`AGENTS.md` §8 signale que le header pointe vers `/agenda`, `/services`,
`/projects`, `/blog`, `/profile`, `/settings` — routes non implémentées.

| Lien actuel | Décision SPFx |
|---|---|
| `/agenda` | → page `Evenements.aspx` du hub |
| `/services`, `/projects`, `/blog` | **Supprimer** — jamais implémentés |
| `/profile` | → `https://delve.office.com/?u={userId}` |
| `/settings` | → paramètres du site, visible **admins uniquement** |
| `/organigramme`, `/histoire` | → pages du hub |

## 6. Navigation — trois sources possibles

| Source | Avantage | Inconvénient |
|---|---|---|
| **Navigation du hub** (recommandé) | Gérée par les admins sans code | Structure limitée à 2 niveaux |
| Liste `LiensRapides` | Contrôle total, méga-menu riche | Une liste de plus à maintenir |
| Tableau en dur | Zéro requête | Redéploiement à chaque changement |

Recommandation : **navigation du hub**, lue via
`this.context.pageContext.legacyPageContext.hubSiteId` puis l'API
`/_api/navigation/MenuState`. Elle se met à jour sans redéploiement.

## 7. Déploiement

L'extension est activée par un **Tenant-Wide Extension** ou par site.

```powershell
Add-PnPCustomAction `
  -Title "IKA Chrome" `
  -Name "IkaChrome" `
  -Location "ClientSideExtension.ApplicationCustomizer" `
  -ClientSideComponentId "GUID-DE-L-EXTENSION" `
  -ClientSideComponentProperties '{"navigationSource":"hub","showFooter":true}' `
  -Scope Web
```

## 8. Performance — le point de vigilance

L'extension s'exécute sur **chaque page de chaque site**. Un header lent
dégrade l'intranet entier.

| Règle | Cible |
|---|---|
| Taille du bundle | < 200 Ko |
| Requêtes au chargement | 0 ou 1 (navigation en cache) |
| Cache de la navigation | `sessionStorage`, 30 minutes |
| Rendu initial | Squelette immédiat, données ensuite |

Ne jamais bloquer `onInit` sur un appel réseau : afficher la structure du
header immédiatement, puis hydrater la navigation.

## 9. Checklist

- [ ] Header visible sur les 5 sites
- [ ] Pas de double header (`hideDefaultHeader` appliqué)
- [ ] Lien actif correct sur chaque site
- [ ] Menu mobile fonctionnel à 320 px
- [ ] Nom et photo de l'utilisateur réel affichés
- [ ] Aucune régression du volet d'édition de page
- [ ] Bundle < 200 Ko
- [ ] Testé dans l'onglet Teams
- [ ] Navigation clavier complète (Tab, Échap)
