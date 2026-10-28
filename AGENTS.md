# Consignes pour les agents (Claude, Cursor)

Ce dépôt est **Atelier**, une bibliothèque d'outils de creative coding utilisables dans le navigateur.
Ton travail pendant une session autonome : **ajouter des outils terminés, un par un, jusqu'à épuisement de ton budget.**
Un outil inachevé ne doit jamais être publié. Mieux vaut un outil excellent que trois moyens.

## Pour qui et pour quoi

Atelier appartient à une **agence de branding et de creative technology**. Les outils servent de **matière première pour créer des identités de marque** : un designer ouvre l'outil, y met sa matière (nom de marque, logo, image, couleurs), explore, et exporte des visuels ou des vidéos qu'il réutilise dans une identité.

Un bon outil Atelier n'est donc pas une démo de code : c'est un **générateur d'expressions visuelles** qu'on pourrait décliner sur une marque.

- **Typographie** : type cinétique, déformations, typo modulaire, texte en 3D, grilles typographiques animées.
- **Formes et motifs** : générateurs de formes, systèmes de motifs, compositions sur grille.
- **Motion et vidéo** : boucles parfaites, motion design génératif, export vidéo.
- **WebGL, three.js, shaders** : matières, lumières, déformations, rendus 3D stylisés.
- **Dégradés, filtres, traitements d'image** : dithering, halftone, glitch, grain, gradient maps.
- **Langages visuels** : systèmes complets qui combinent plusieurs des éléments ci-dessus (forme + couleur + typo + mouvement) en un vocabulaire cohérent. Mixer plusieurs systèmes existants est encouragé.

**Références** : Kiel Danger / Danger Brain (typographie 3D cinétique, boucles hypnotiques, matières), Studio Dumbar / DEPT® (identités dynamiques, systèmes génératifs audacieux, motion fort, typo comme image). Vise ce niveau d'exigence graphique : contrasté, affirmé, contemporain. Évite le rendu « tutoriel » (particules par défaut, palettes arc-en-ciel, dégradés génériques).

### Ce que chaque outil doit permettre

- **Être en mouvement par défaut** : c'est ce que l'agence préfère. Sauf si le sujet s'y prête vraiment mal (palette, utilitaire), l'outil s'anime dès l'ouverture, avec un bouton pause et un réglage de vitesse. Le mouvement doit servir l'identité (rythme, boucle, respiration), pas juste bouger.
- **Injecter de la matière de marque** dès que c'est pertinent : texte libre, couleurs personnalisables, import d'image ou de SVG (logo).
- **Exporter en qualité production** : PNG haute résolution (×2 minimum, idéalement taille réglable), SVG quand le rendu est vectoriel, et **toujours un export vidéo** (WebM/MP4 via `MediaRecorder`, durée réglable, boucle parfaite si possible) quand l'outil est animé.
- **Proposer des presets** : 3 à 6 réglages prédéfinis qui montrent l'étendue de l'outil.
- **Être reproductible** : une graine affichée et réutilisable, pour retrouver un résultat.

## Boucle de travail

Répète ces étapes tant qu'il te reste du budget :

1. **Synchroniser** : `git checkout main && git pull`. Lis `ls tools/` et `IDEAS.md` pour savoir ce qui existe déjà.
2. **Choisir** une idée de `IDEAS.md` qui n'a pas encore de dossier dans `tools/` ni de branche ouverte, ou une idée nouvelle qui n'est pas une variante cosmétique d'un outil existant (même mécanique avec d'autres couleurs = doublon).
3. **Créer la branche** `<agent>/tool-<slug>` (ex. `claude/tool-voronoi`, `cursor/tool-voronoi`). Si la branche existe déjà sur `origin`, un autre agent travaille dessus : choisis une autre idée.
4. **Générer le squelette** : `npm run new -- <slug> "<Titre>" <type> <claude|cursor>`.
5. **Construire l'outil** dans `tools/<slug>/index.html` (voir la barre de qualité ci-dessous).
6. **Valider** : `npm run validate -- <slug>`. Corrige jusqu'à ce que ce soit vert. Ce script génère aussi `thumbnail.jpg`.
7. **Relire visuellement** : ouvre `tools/<slug>/thumbnail.jpg` et regarde-la. Si la miniature n'est pas belle ou ne montre pas ce que fait l'outil, améliore le rendu par défaut et relance `npm run validate -- <slug> --thumbs`.
8. **Publier** : commit **uniquement** `tools/<slug>/` (ne modifie pas `IDEAS.md` : plusieurs agents travaillent en parallèle et ce fichier créerait des conflits ; un outil existe dès que son dossier est sur `main`). Fais `git pull --rebase origin main` juste avant de pousser, pousse la branche et ouvre une PR intitulée `Outil : <Titre>`.
   (Avec `gh pr create`, ou l'outil GitHub de ta session si `gh` n'a pas accès à l'API GraphQL.)
   La CI revalide l'outil ; s'il passe, elle fusionne la PR elle-même et le site est republié. Si elle échoue, corrige et repousse sur la même branche.
9. Reviens à l'étape 1.

**Si tu ne peux pas finir un outil** (bloqué, budget presque épuisé) : supprime le dossier, ne pousse rien. Aucun brouillon sur `main`, jamais.

Ne modifie pas le site (`index.html`, `assets/`, `scripts/`, `.github/`) pendant une session autonome : la CI refuse les PR d'agents qui touchent autre chose que `tools/`.

## Format d'un outil

```
tools/<slug>/
├── index.html      # point d'entrée, autonome
├── tool.json       # métadonnées (voir ci-dessous)
├── thumbnail.jpg   # générée par npm run validate, 1200×750
└── …               # autres fichiers éventuels (js, glsl, images), 3 Mo max au total
```

`tool.json` (schéma complet : `schema/tool.schema.json`) :

```json
{
  "slug": "flow-field",
  "title": "Champ de flux",
  "type": "generative",
  "description": "Une ou deux phrases (40 à 180 caractères) qui disent ce que fait l'outil et ce qu'on peut en sortir.",
  "tags": ["particules", "bruit"],
  "author": "claude",
  "created": "2026-10-28",
  "status": "finished"
}
```

Types autorisés : `typography`, `system` (langages visuels), `shapes`, `pattern`, `generative`, `motion`, `webgl`, `filter`, `gradient`, `color`, `audio`, `utility`.

## Barre de qualité

Un outil est « fini » quand **tout** ceci est vrai :

- **Utile pour une marque** : il fait une chose clairement, on peut y mettre sa propre matière, et en sortir un fichier exploitable (PNG HD, SVG, WebM/MP4, CSS…).
- **Réglable** : au moins 3 paramètres qui changent vraiment le résultat, des presets, et un bouton « Aléatoire » ou « Nouvelle graine » quand c'est pertinent.
- **Beau par défaut** : à l'ouverture, sans rien toucher, le rendu est déjà réussi et digne d'un studio. C'est lui qui fait la miniature.
- **Autonome** : un seul `index.html` de préférence, JavaScript natif. three.js, p5.js, regl, ogl, opentype.js, etc. sont autorisés uniquement depuis `cdn.jsdelivr.net/npm/`, `cdnjs.cloudflare.com` ou `unpkg.com`, avec une version exacte (`three@0.170.0`). Aucun appel réseau à une API.
- **Robuste** : aucune erreur console, même en bougeant tous les contrôles ; gère le redimensionnement ; reste fluide (viser 60 fps).
- **Mobile** : pas de défilement horizontal à 390px de large ; le panneau passe en bas de l'écran (le gabarit le fait déjà).
- **Interface en français**, `<html lang="fr">`, contrôles accessibles au clavier, libellés explicites.
- **Miniature propre** : le panneau de réglages porte l'attribut `data-ui`, il est masqué sur la miniature.
- **Aucun marqueur d'inachevé** : pas de TODO, FIXME, lorem ipsum, « à venir ».
- **Outils audio / caméra / micro** : ils doivent produire un rendu visuel sans permission ni geste de l'utilisateur (démo par défaut), et ne demander l'accès qu'au clic.

`npm run validate` vérifie automatiquement les métadonnées, les ressources externes, l'absence d'erreurs JS au chargement et en manipulant chaque contrôle, que le rendu n'est pas vide, la largeur mobile et la taille du dossier. Il ne juge pas la qualité créative : c'est ton rôle à l'étape 7.

## Commandes

```bash
npm install && npx playwright install chromium   # une fois
npm run new -- <slug> "<Titre>" <type> <auteur>  # nouveau dossier depuis le gabarit
npm run validate -- <slug>                       # garde-fou qualité + miniature
npm run validate -- <slug> --thumbs              # régénère la miniature
npm run dev                                      # aperçu du site sur http://localhost:4173
```
