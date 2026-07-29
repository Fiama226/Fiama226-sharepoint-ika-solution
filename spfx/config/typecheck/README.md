# Vérification de types hors projet SPFx

## À quoi ça sert

Ce dossier permet de **compiler `spfx/src/` en TypeScript strict sans installer
les 800 Mo de dépendances SPFx**. Utile pour :

- valider le code en revue avant de scaffolder le projet
- faire tourner un contrôle rapide en CI
- détecter une régression de typage sans build complet

Ce n'est **pas** un substitut au build réel (`heft build`) : les stubs
décrivent uniquement la surface d'API réellement utilisée par le code.

## Utilisation

```bash
cd spfx
npm install --no-save typescript@5.8 @types/react@17 @types/react-dom@17
npx tsc -p config/typecheck/tsconfig.json
```

Sortie attendue : **aucune erreur**.

## Contenu des stubs

`stubs/@microsoft/` contient des déclarations minimales pour :

| Module | Ce qui est déclaré |
|---|---|
| `sp-core-library` | `Version`, `Log` |
| `sp-http` | `SPHttpClient`, `SPHttpClientResponse` |
| `sp-webpart-base` | `BaseClientSideWebPart`, `WebPartContext` |
| `sp-application-base` | `BaseApplicationCustomizer`, `PlaceholderName`, `PlaceholderContent` |
| `sp-property-pane` | Les 4 contrôles utilisés + interfaces de configuration |
| `decorators` | `@override` |

## Règle de maintenance

Si un nouveau composant utilise une API SPFx absente des stubs, **ajouter la
déclaration** plutôt que de désactiver la vérification. Le stub doit rester
fidèle à la signature réelle documentée par Microsoft — un stub trop permissif
laisserait passer une erreur qui casserait le build réel.
