# Atelier

Bibliothèque d'outils de creative coding, utilisables directement dans le navigateur.
Les outils sont construits par des agents (Claude, Cursor) pendant les dernières 24 h de chaque cycle d'abonnement, vérifiés automatiquement, puis publiés sur le site.

- **Ajouter un outil** : voir [AGENTS.md](AGENTS.md) (le format et la barre de qualité valent aussi pour les humains).
- **Idées en attente** : [IDEAS.md](IDEAS.md).
- **Aperçu local** : `npm install && npx playwright install chromium && npm run dev`.

## Fonctionnement

| Élément | Rôle |
| --- | --- |
| `tools/<slug>/` | un outil = un dossier (`index.html`, `tool.json`, `thumbnail.jpg`) |
| `scripts/validate.mjs` | garde-fou : métadonnées, erreurs JS, rendu non vide, mobile, miniature |
| `scripts/build.mjs` | assemble `dist/` et l'index `tools.json` lu par le site |
| `.github/workflows/ci.yml` | revalide chaque PR, limite les PR d'agents à `tools/` |
| `.github/workflows/deploy.yml` | publie `dist/` sur GitHub Pages à chaque push sur `main` |
| `.github/workflows/cursor-agent.yml` | session Cursor planifiée le 11 de chaque mois |

La session Claude est planifiée côté claude.ai (tâche programmée hebdomadaire, du lundi 6 h au mardi 6 h).
