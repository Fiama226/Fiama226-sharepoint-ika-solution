# 07 — Sécurité et gouvernance

## 1. Modèle de permissions

### Groupes par site

Chaque site de communication crée automatiquement 3 groupes SharePoint.

| Groupe | Niveau | Qui |
|---|---|---|
| `<Site> Propriétaires` | Contrôle total | Responsable du département + admin intranet |
| `<Site> Membres` | Modification | Contributeurs du département |
| `<Site> Visiteurs` | Lecture | Tous les collaborateurs |

### Matrice cible

| Site | Propriétaires | Membres | Visiteurs |
|---|---|---|---|
| Hub intranet | Comm. interne + DSI | Rédacteurs intranet | Tous les employés |
| Comptabilité | Resp. comptable | Équipe comptable | Tous les employés |
| Administration | DRH | Équipe RH/admin | Tous les employés |
| Commerciaux | Dir. commercial | Équipe commerciale | Tous les employés |
| Techniciens | Resp. technique | Équipe technique | Tous les employés |

> Un intranet doit être **lisible par tous par défaut**. Restreindre la lecture
> d'un site entier est presque toujours une erreur de conception : c'est le
> niveau **liste** qu'il faut cibler.

### Groupes Entra ID recommandés

Plutôt que d'ajouter des personnes une par une :

| Groupe Entra ID | Usage |
|---|---|
| `IKA-Tous-Employes` | Visiteurs de tous les sites |
| `IKA-Dept-Comptabilite` | Membres du site Comptabilité |
| `IKA-Dept-Administration` | Membres du site Administration |
| `IKA-Dept-Commerciaux` | Membres du site Commerciaux |
| `IKA-Dept-Techniciens` | Membres du site Techniciens |
| `IKA-Redacteurs-Intranet` | Membres du hub |
| `IKA-Admins-Intranet` | Propriétaires du hub |

Les groupes dynamiques Entra ID peuvent alimenter automatiquement les
appartenances à partir de l'attribut `department` du profil utilisateur.

---

## 2. Permissions au niveau liste

Quatre listes exigent des permissions distinctes de celles du site.

### `ParametresSite` — hub

| Groupe | Droit |
|---|---|
| `IKA-Admins-Intranet` | Contrôle total |
| Tous les autres | **Lecture seule** |

Un paramètre modifié par erreur casse le header de tout l'intranet.

```powershell
Set-PnPList -Identity "ParametresSite" -BreakRoleInheritance -CopyRoleAssignments
Set-PnPListPermission -Identity "ParametresSite" -Group "Intranet IKA Solution Membres" -RemoveRole "Modification"
Set-PnPListPermission -Identity "ParametresSite" -Group "Intranet IKA Solution Membres" -AddRole "Lecture"
```

### `Collaborateurs` — hub

Contient des **données personnelles** (date de naissance, téléphone).

| Groupe | Droit |
|---|---|
| `IKA-Admins-Intranet` + RH | Contrôle total |
| Tous | Lecture |

### `DonneesFinancieres` — Comptabilité

| Groupe | Droit |
|---|---|
| Propriétaires Comptabilité | Contrôle total |
| Membres Comptabilité | Modification |
| **Tous les autres** | **Aucun accès** |

```powershell
Connect-PnPOnline -Url "$root/sites/ika-comptabilite" -Interactive
Set-PnPList -Identity "DonneesFinancieres" -BreakRoleInheritance
Set-PnPListPermission -Identity "DonneesFinancieres" `
                      -Group "Comptabilite Visiteurs" -RemoveRole "Lecture"
```

### `BordereauPrix` / `BordereauLignes` — hub

| Groupe | Droit |
|---|---|
| Direction + Commerciaux | Modification |
| Autres | Aucun accès |

---

## 3. Données personnelles

| Donnée | Liste | Sensibilité | Mesure |
|---|---|---|---|
| Date de naissance | `Collaborateurs` | Élevée | Envisager jour/mois seuls |
| Téléphone personnel | `Collaborateurs` | Moyenne | Numéro professionnel uniquement |
| Photo | `Collaborateurs` | Moyenne | Consentement à l'embauche |
| Annonces familiales | `Annonces` | Élevée | **Consentement explicite obligatoire** |
| Salaires | — | — | **Jamais dans l'intranet** |

### Le point à trancher avec les RH

Publier un mariage ou une naissance nommément suppose l'accord de la personne.
Recommandation : un champ `ConsentGiven` (Boolean, requis) sur `Annonces`, et
une approbation RH avant publication — d'où l'approbation de contenu activée.

### Rétention

| Liste | Durée | Action |
|---|---|---|
| `Annonces` | 12 mois après `DisplayUntil` | Suppression automatique |
| `Actualites` | 3 ans | Archivage |
| `BordereauPrix` refusés | 2 ans | Suppression |
| `BordereauPrix` acceptés | 10 ans | Obligation comptable |
| `Collaborateurs` partis | Désactivation immédiate | `IsActive = Non`, jamais de suppression |

> Ne jamais supprimer un collaborateur : les Lookup `Manager`, `Employee` et
> `RelatedPerson` pointant vers lui deviendraient invalides et casseraient
> l'organigramme.

---

## 4. Gouvernance éditoriale

### Rôles

| Rôle | Responsabilité | Qui |
|---|---|---|
| Propriétaire de l'intranet | Vision, arbitrages, budget | Communication interne |
| Administrateur technique | Déploiements, incidents | DSI |
| Rédacteur départemental | Contenu de son site | 1 référent par département |
| Approbateur | Valide actualités et annonces | Communication interne |

### Circuit de publication

```
Rédacteur crée      →  Brouillon
     ↓
Soumet pour approbation
     ↓
Approbateur valide  →  Publié
     ↓
Visible par tous
```

L'approbation de contenu est activée sur `Actualites` et `Annonces` : un
élément non approuvé n'est visible que de son auteur et des approbateurs.

### Rythme de revue

| Fréquence | Action |
|---|---|
| Hebdomadaire | Modération des annonces en attente |
| Mensuelle | Collaborateur du mois, revue des projets |
| Trimestrielle | Nettoyage des liens morts, revue des documents expirés |
| Annuelle | Revue des permissions, archivage |

---

## 5. Sécurité technique

| Mesure | Statut |
|---|---|
| Pas de secrets dans le code SPFx | **Impératif** — le bundle est public |
| Aucun appel à une API externe non autorisée | À valider avec la DSI |
| CDN externes (`recharts`, `xlsx`) | À valider ou héberger en interne |
| Permissions Graph | Aucune requise dans la conception actuelle |
| `isDomainIsolated` | `false` — pas d'appel à des API tierces |
| `requiresCustomScript` | `false` — pas de script personnalisé requis |

### Le rappel qui compte

Un bundle SPFx est téléchargé par le navigateur de chaque utilisateur. Tout ce
qu'il contient est lisible : **aucune clé d'API, aucun mot de passe, aucun
identifiant de service** ne doit y figurer. Pour un secret, passer par Azure
Functions avec authentification Entra ID.

---

## 6. Sauvegarde et restauration

| Élément | Mécanisme natif | Rétention |
|---|---|---|
| Éléments supprimés | Corbeille 1er niveau | 93 jours |
| Corbeille site | Corbeille 2e niveau | 93 jours |
| Versions | Historique de version | Selon config liste |
| Site supprimé | Corbeille tenant | 93 jours |

Pour aller au-delà, prévoir un export PnP mensuel :

```powershell
Get-PnPSiteTemplate -Out "ika-intranet-$(Get-Date -Format yyyyMMdd).pnp" `
                    -Handlers Lists,Fields,ContentTypes,Navigation
```

---

## 7. Accessibilité

L'intranet doit être utilisable par tous.

| Critère | Application |
|---|---|
| Contraste | Navy `#0A2540` sur blanc = 15.8:1 ✓ |
| Cyan `#06B6D4` sur blanc | 2.6:1 — **insuffisant pour du texte** |
| Texte alternatif | Champ `AltText` requis sur `Galerie` et `HeroSlides` |
| Navigation clavier | Tab, Échap sur tous les menus |
| Focus visible | Ne jamais supprimer l'outline |

> **Le cyan `#06B6D4` ne doit jamais servir de couleur de texte sur fond blanc.**
> Le réserver aux bordures, fonds et accents décoratifs. Pour du texte, utiliser
> `#0891B2` (cyan-dark) qui atteint 3.9:1, ou le navy pour le corps de texte.
