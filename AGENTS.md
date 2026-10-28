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

**Références** : d'abord **le moodboard de Noé** (`references/moodboard.md` : 27 images décrites, avec leur mécanique, leur palette et l'outil à en tirer). Ensuite le livre **CodeCrafted: Generative Design in Branding** (Victionary), puis les **vrais phénomènes physiques et objets mathématiques** (`references/physique-maths.md` : ondes, Chladni, fluides, mousses, magnétisme, orbites, fractales…). Ensuite Kiel Danger / Danger Brain (typographie 3D cinétique, boucles hypnotiques, matières), Studio Dumbar / DEPT® (identités dynamiques, systèmes génératifs audacieux, motion fort, typo comme image). Vise ce niveau d'exigence graphique : contrasté, affirmé, contemporain. Évite le rendu « tutoriel » (particules par défaut, palettes arc-en-ciel, dégradés génériques).

### Ce que chaque outil doit permettre

- **Partir d'une référence** : lis `references/README.md`, `references/moodboard.md` et la fiche concernée avant de choisir. Un outil de simulation simule le vrai modèle (équation, loi physique) et nomme ses réglages avec les grandeurs réelles. L'outil s'appuie sur une technique ou une démarche documentée (livre, article, artiste, studio) et la pousse vers un usage de marque. Cite-la dans `tool.json` (`inspiration`).
- **Être une vraie expérience interactive** : on agit **directement sur la scène** (pointeur : dessiner, attirer, repousser, déplacer, semer, faire pivoter, molette pour l'échelle…), pas seulement dans le panneau. Indique le geste avec `hint`.
- **Tout est réglable** : chaque constante qui influence le rendu (tailles, vitesses, densités, couleurs, épaisseurs, formes, easing, bruit…) est un paramètre du panneau, avec des bornes qui restent belles. Viser 10 à 25 réglages bien rangés en sections. Pas de nombre magique caché dans le code.
- **Être en mouvement par défaut** : l'outil s'anime dès l'ouverture (pause et vitesse fournies par le kit). Le mouvement sert l'identité (rythme, boucle, respiration). Boucle parfaite quand c'est possible (réglage de durée de boucle).
- **S'adapter à une marque** : le kit fournit la charte (palette partagée, gradient map, typo importée, logo). L'outil doit en profiter : ses couleurs passent par des réglages `color`/`palette` (la charte s'y applique d'un clic). Ses presets utilisent les palettes du moodboard (`Atelier.PALETTES.<nom>.colors`, fond en premier) plutôt que des couleurs inventées, ses textes par `text`/`textarea`, ses typos par `font`, et il accepte une image ou un SVG quand c'est pertinent.
- **Rendu poussé** : finition (grain, vignette via `finish: true`, ou équivalent dans le shader), épaisseurs variables, palettes restreintes, composition soignée, anticrénelage. Le rendu par défaut doit pouvoir passer dans un book d'agence.
- **Exporter en qualité production** : le kit gère formats (écran, 16:9, 9:16, 4:5, 1:1, libre), définition (×1, ×2, ×4), PNG/JPEG/WebP, copie, vidéo 25/30/60 fps, séquence PNG, réglages JSON. L'outil ajoute le SVG quand le rendu est vectoriel, et ses exports spécifiques (`export.extra`).
- **Proposer des presets** : 4 à 8 réglages prédéfinis, très différents les uns des autres, qui montrent l'étendue de l'outil.
- **Être reproductible** : tout l'aléatoire passe par `app.rng()` (graine affichée).

## Boucle de travail

Répète ces étapes tant qu'il te reste du budget :

1. **Synchroniser** : `git checkout main && git pull`. Lis `ls tools/`, `IDEAS.md` et `references/README.md`.
2. **Choisir** une idée de `IDEAS.md` (chacune cite sa fiche de `references/` : lis-la) qui n'a pas encore de dossier dans `tools/` ni de branche ouverte, ou une idée nouvelle qui n'est pas une variante cosmétique d'un outil existant (même mécanique avec d'autres couleurs = doublon).
3. **Créer la branche** `<agent>/tool-<slug>` (ex. `claude/tool-voronoi`, `cursor/tool-voronoi`). Si la branche existe déjà sur `origin`, un autre agent travaille dessus : choisis une autre idée.
4. **Générer le squelette** : `npm run new -- <slug> "<Titre>" <type> <claude|cursor>`.
5. **Construire l'outil** dans `tools/<slug>/index.html` en suivant la méthode « Prendre son temps » ci-dessous.
6. **Valider** : `npm run validate -- <slug>`. Corrige jusqu'à ce que ce soit vert. Ce script génère aussi `thumbnail.jpg`.
7. **Critiquer et améliorer** (au moins trois tours, voir la méthode). Puis `npm run validate -- <slug> --thumbs` pour régénérer la miniature finale.
8. **Publier** : commit **uniquement** `tools/<slug>/` (ne modifie pas `IDEAS.md` : plusieurs agents travaillent en parallèle et ce fichier créerait des conflits ; un outil existe dès que son dossier est sur `main`). Fais `git pull --rebase origin main` juste avant de pousser, pousse la branche et ouvre une PR intitulée `Outil : <Titre>`.
   (Avec `gh pr create`, ou l'outil GitHub de ta session si `gh` n'a pas accès à l'API GraphQL.)
   La CI revalide l'outil ; s'il passe, elle fusionne la PR elle-même et le site est republié. Si elle échoue, corrige et repousse sur la même branche.
9. Reviens à l'étape 1.

**Si tu ne peux pas finir un outil** (bloqué, budget presque épuisé) : supprime le dossier, ne pousse rien. Aucun brouillon sur `main`, jamais.

Ne modifie pas le site (`index.html`, `assets/`, `scripts/`, `.github/`) pendant une session autonome : la CI refuse les PR d'agents qui touchent autre chose que `tools/`.

## Prendre son temps (méthode obligatoire)

Le budget de tokens n'est pas une contrainte à économiser : **un outil excellent vaut mieux que cinq outils moyens**. Prends tout le temps nécessaire. Pour chaque outil :

1. **Étudier** : lis la fiche de `references/` citée par l'idée, et les sources qu'elle donne si le réseau le permet. Note les leviers de la technique et ce qui fait la différence entre une version tutoriel et une version d'artiste.
2. **Planifier par écrit** (dans ta réflexion, pas dans le dépôt) : l'expérience visée, le geste au pointeur, la liste complète des réglages par section, 4 à 8 presets contrastés, ce que la charte de marque change, les exports spécifiques, le rendu par défaut.
3. **Construire** la version complète, pas un prototype.
4. **Critiquer en images, au moins trois tours** : à chaque tour, lance `npm run shots -- <slug>` (miniature, interface, formats 16:9, 9:16, 1:1, 4:5, chaque preset, état après un geste au pointeur, charte appliquée, gradient map, dans `.shots/<slug>/`), ouvre et regarde chaque image, écris ce qui est faible (composition, couleurs, épaisseurs, rythme, lisibilité, rendu « démo »), corrige. Arrête seulement quand une capture pourrait figurer dans le book d'un studio comme Dumbar.
5. **Éprouver** : bouge chaque contrôle aux extrêmes, change de format pendant l'animation, importe une image, applique une charte, exporte image, vidéo et séquence. Corrige tout ce qui casse ou devient laid.

## Interface commune (obligatoire)

Tous les outils partagent **la même interface**, générée par le kit `assets/ui/` (structure inspirée de Figma) : barre du haut (retour à la bibliothèque, titre, lecture/pause, graine, lien, thème, bouton Exporter), **scène au centre**, **panneau de propriétés à droite** avec les onglets Réglages et Exporter. Sur mobile, le panneau passe sous la scène.

Un outil **ne dessine jamais sa propre interface** : pas de panneau, de bouton ou de champ en HTML. Il décrit ses paramètres et le kit fait le reste. La validation refuse un outil qui n'utilise pas le kit.

Le kit ajoute tout seul, à chaque outil : presets, Explorer (X), Réinitialiser, **Format** (écran, 16:9, 9:16, 4:5, 1:1, libre + définition), **Charte de marque** (palette partagée entre tous les outils, extraction depuis une image, palettes du moodboard à essayer d'un clic, typo et logo importés), **Gradient map**, **Logo** (incrusté, position, taille, opacité), vitesse d'animation, et l'onglet Exporter complet (image PNG/JPEG/WebP, copie, vidéo, séquence PNG en ZIP, SVG si fourni, réglages JSON, lien partageable).

```html
<link rel="stylesheet" href="../../assets/ui/atelier.css">
…
<canvas></canvas>   <!-- ou <svg>, ou <div class="at-fill"> : la scène -->
<script src="../../assets/ui/atelier.js"></script>
<script>
  const app = Atelier.app({
    stage: document.querySelector('canvas'),
    animate: true,                 // lecture/pause, vitesse, app.loop
    seed: true,                    // graine affichée, app.rng() déterministe
    finish: true,                  // section Finition (grain, vignette) → appeler app.finish(ctx) en fin de frame
    hint: 'Glissez pour attirer les lignes · molette pour zoomer',
    pointer: {                     // interaction directe sur la scène (coordonnées en pixels d'affichage)
      down(p) {}, drag(p) {}, move(p) {}, up(p) {}, wheel(p, dy) {},   // p = { x, y, vx, vy, down, pressure, shift, alt }
    },
    params: {                      // sections du panneau, dans l'ordre
      'Forme': {
        count: { type: 'range', label: 'Nombre', min: 1, max: 100, step: 1, value: 20 },
        mode:  { type: 'segmented', label: 'Mode', options: { a: 'A', b: 'B' }, value: 'a' },
      },
      'Contenu': {
        text:  { type: 'text', label: 'Texte', value: 'ATELIER' },
        font:  { type: 'font', label: 'Typo', options: { 'Inter': 'Inter', 'serif': 'Serif' }, value: 'Inter' },  // + la typo de la charte si importée
        image: { type: 'file', label: 'Image', accept: 'image/*' },   // → HTMLImageElement (+ .svgText) ; glisser-déposer sur la scène inclus
      },
      'Couleur': {
        bg:    { type: 'color', label: 'Fond', value: '#0e0e10' },      // « fond/bg » reçoit la couleur de charte la plus proche en luminosité
        ink:   { type: 'color', label: 'Encre', value: '#ff4d1a' },
        pal:   { type: 'palette', label: 'Palette', value: ['#3d2bff', '#ff4d1a', '#f4efe6'] },
      },
    },
    presets: { 'Calme': { count: 10 }, 'Dense': { count: 90, seed: 42 } },
    export: { svg: () => svgString, extra: { 'CSS': (app) => app.download('x.css', blob) } },
    brand(colors, app) { return { bg: colors[0], ink: colors[1] }; },   // facultatif : répartition de la charte sur mes réglages
    onChange(key, value, params) {},   // key = '*' quand un preset, un lien ou Réinitialiser s'applique
    onSeed(seed) {},
    onResize({ w, h, dpr }) {},        // le canvas est déjà redimensionné (w×dpr, h×dpr) : appelé aussi quand le format change
  });
  const p = app.params;                // valeurs courantes
  app.loop((t, dt) => { /* dessiner ; t en secondes, vitesse incluse */ app.finish(ctx); });
</script>
```

**Taille et formats** : dessine toujours dans un repère de `app.size.w × app.size.h` pixels, avec `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` où `dpr = app.size.dpr`. Le kit règle le canvas à la taille cible du format (ex. 1080×1920 ×2) et l'affiche réduit : les exports sont donc exactement à la bonne taille. Les épaisseurs et tailles doivent être relatives (`Math.min(w, h) * …`) pour rester identiques d'un format à l'autre. Ne lis jamais `window.devicePixelRatio` ni `innerWidth`.

**Exports** : PNG et vidéo sont automatiques pour un canvas (2D ou WebGL). Pour une scène DOM ou SVG, fournis `export.png: (scale, app) => canvas` et `export.video: (app) => canvas` si animé. Les séquences PNG appellent ta boucle image par image avec `dt = 1/fps` : la boucle ne doit dépendre que de `t` et `dt`, jamais de `performance.now()`.

Types de contrôles : `range`, `select`, `segmented`, `color`, `palette`, `toggle`, `text`, `textarea`, `font`, `file`, `button` (`action: (app) => …`). Options de chaque réglage : `show: (p) => bool` (affichage conditionnel), `explore: false` (ignoré par Explorer ; `explore: true` pour inclure couleurs et toggles), `brand: false` (ignoré par la charte) ou `brand: 'background'`.
Utilitaires : `app.size`, `app.pointer`, `app.rng(offset)`, `app.set(key, value)`, `app.apply({…})`, `app.playing`, `app.time`, `app.brand` (`colors`, `font`, `logo`), `app.finish(ctx)`, `app.download(nom, blob)`, `Atelier.extractPalette(img, n)`.

Le CSS propre à l'outil se limite à sa scène (ex. le contenu d'un `.at-fill`). Utilise les jetons `var(--at-…)` de `assets/ui/tokens.css` plutôt que des couleurs en dur pour tout ce qui n'est pas l'œuvre elle-même.

Ne modifie jamais le kit pendant une session autonome. Si un besoin d'interface manque, contourne-le dans la scène et note l'idée dans le bilan.

## Format d'un outil

```
tools/<slug>/
├── index.html      # point d'entrée, utilise le kit ../../assets/ui/
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
  "inspiration": ["Tyler Hobbs — Flow Fields", "The Nature of Code, ch. 5"],
  "author": "claude",
  "created": "2026-10-28",
  "status": "finished"
}
```

Types autorisés : `typography`, `system` (langages visuels), `shapes`, `pattern`, `generative`, `motion`, `webgl`, `filter`, `gradient`, `color`, `audio`, `utility`.

## Barre de qualité

Un outil est « fini » quand **tout** ceci est vrai :

- **Ancré** : il part d'une référence de `references/` (citée dans `tool.json` → `inspiration`) et va plus loin que sa version tutoriel.
- **Interactif** : on agit sur la scène avec le pointeur (option `pointer`), le geste est annoncé par `hint`, et il change vraiment le résultat.
- **Tout réglable** : au moins 10 réglages propres à l'outil (hors kit), rangés en sections claires ; aucune constante visuelle importante en dur.
- **Presets** : au moins 4, très contrastés.
- **Marque** : couleurs en `color`/`palette` (la charte s'y applique), texte et typo modifiables quand l'outil en affiche, import d'image/SVG quand c'est pertinent.
- **Beau par défaut** : à l'ouverture, sans rien toucher, le rendu est déjà réussi et digne d'un studio. C'est lui qui fait la miniature.
- **Fidèle à tous les formats** : rendu correct en 16:9, 9:16, 1:1 et ×2 (tailles relatives, `app.size.dpr`).
- **Autonome** : un seul `index.html` de préférence (plus le kit commun), JavaScript natif. three.js, p5.js, regl, ogl, opentype.js, etc. sont autorisés uniquement depuis `cdn.jsdelivr.net/npm/`, `cdnjs.cloudflare.com` ou `unpkg.com`, avec une version exacte (`three@0.170.0`). Aucun appel réseau à une API.
- **Robuste** : aucune erreur console, même en bougeant tous les contrôles et en changeant de format ; reste fluide (viser 60 fps à ×1).
- **Mobile** : pas de défilement horizontal à 390px de large (le kit gère la mise en page) ; le pointeur marche au doigt.
- **Interface en français**, `<html lang="fr">`, libellés explicites.
- **Aucun marqueur d'inachevé** : pas de TODO, FIXME, lorem ipsum, « à venir ».
- **Outils audio / caméra / micro** : rendu visuel sans permission ni geste (démo par défaut), accès demandé seulement au clic.

`npm run validate` vérifie automatiquement les métadonnées, les ressources externes, le kit, le nombre de réglages et de presets, la présence d'une interaction pointeur, l'absence d'erreurs JS (chargement, chaque contrôle, changement de format, export d'image), que le rendu n'est pas vide, la largeur mobile et la taille du dossier. Il ne juge pas la qualité créative : c'est ton rôle à l'étape 7.

## Commandes

```bash
npm install && npx playwright install chromium   # une fois
npm run new -- <slug> "<Titre>" <type> <auteur>  # nouveau dossier depuis le gabarit
npm run validate -- <slug>                       # garde-fou qualité + miniature
npm run validate -- <slug> --thumbs              # régénère la miniature
npm run shots -- <slug>                          # captures de critique dans .shots/<slug>/
npm run dev                                      # aperçu du site sur http://localhost:4173
```
