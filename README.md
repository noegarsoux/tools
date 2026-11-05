# Atelier

Bibliothèque d'outils de creative coding, utilisables directement dans le navigateur.
Les outils sont construits par des agents (Claude, Cursor) pendant les dernières 24 h de chaque cycle d'abonnement, vérifiés automatiquement, puis publiés sur le site.

- **Ajouter un outil** : voir [AGENTS.md](AGENTS.md) (le format et la barre de qualité valent aussi pour les humains).
- **Idées en attente** : [IDEAS.md](IDEAS.md).
- **Aperçu local** : `npm install && npx playwright install chromium && npm run dev`.

## Fonctionnement

| Élément | Rôle |
| --- | --- |
| `assets/ui/` | kit d'interface commun à tous les outils (structure Figma) et jetons de design partagés avec le site |
| `tools/<slug>/` | un outil = un dossier (`index.html`, `tool.json`, `thumbnail.jpg`) |
| `scripts/validate.mjs` | garde-fou : métadonnées, erreurs JS, rendu non vide, mobile, miniature |
| `scripts/build.mjs` | assemble `dist/` et l'index `tools.json` lu par le site |
| `.github/workflows/ci.yml` | revalide chaque PR, limite les PR d'agents à `tools/` |
| `.github/workflows/deploy.yml` | publie `dist/` sur GitHub Pages à chaque push sur `main` |
| `.github/workflows/cursor-agent.yml` | session Cursor planifiée le 11 de chaque mois |

La session Claude est planifiée côté claude.ai (tâche programmée hebdomadaire, du lundi 6 h au mardi 6 h).

## Favoris et suppression

- **Favoris** : l'étoile sur chaque bloc (et dans la fiche d'un outil) l'ajoute à la page Favoris. Les favoris sont gardés dans le navigateur de chacun.
- **Suppression définitive** : « Supprimer l'outil » en bas de la fiche ouvre une confirmation, puis la fonction `api/delete-tool.js` retire `tools/<slug>/` de `main` par un commit. Le site se republie ensuite tout seul. Ne fonctionne que sur le site Vercel, avec deux variables d'environnement dans le projet Vercel :
  - `ATELIER_ADMIN_KEY` : la clé demandée dans la confirmation (au choix de l'équipe) ;
  - `GITHUB_TOKEN` : un jeton GitHub *fine-grained* limité au dépôt, avec la permission *Contents : Read and write*.
  - Pour annuler une suppression, il suffit de revert le commit « Suppression de l'outil … ».
