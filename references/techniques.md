# Fiches techniques

Chaque fiche : le principe, les leviers à exposer dans le panneau, ce qui fait un rendu « studio » plutôt que « tutoriel », un usage marque, les sources.

---

## Bruit et champs

### Bruit de gradient (Perlin, simplex), fBM
- **Principe** : valeur pseudo-aléatoire continue. fBM = somme d'octaves : `Σ amp^i · noise(p · lac^i)`, typiquement lacunarité 2, gain 0,5.
- **Leviers** : échelle, octaves (1–8), lacunarité (1,5–3), gain (0,3–0,7), vitesse d'évolution (3ᵉ dimension = temps), seuil, ridged (`1 - |n|`), turbulence (`|n|`).
- **Studio** : boucle parfaite en échantillonnant le bruit sur un cercle dans l'espace (`noise(x, y, cos(t)·r, sin(t)·r)`) ; quantifier en paliers ; superposer deux échelles.
- **Marque** : texture de fond animée aux couleurs de la charte, matière pour typo.
- **Sources** : The Book of Shaders ch. 11–13 ; Ken Perlin « Improving Noise » (2002) ; Stefan Gustavson « Simplex noise demystified » ; bibliothèque `webgl-noise` (stegu).

### Domain warping
- **Principe** (Inigo Quilez) : `f(p) = fbm(p + k·q)`, `q = (fbm(p), fbm(p + (5.2, 1.3)))`, et une seconde couche `r = (fbm(p + k·q + (1.7, 9.2)), fbm(p + k·q + (8.3, 2.8)))`, `f = fbm(p + k·r)`. k ≈ 4.
- **Leviers** : force k, nombre de niveaux (1–3), échelle, octaves, vitesse, palette mappée sur f puis mélangée selon |q| et r.y.
- **Studio** : colorer avec q et r en plus de f (c'est ce qui donne le marbre) ; gradient map de marque ; grain.
- **Marque** : matières liquides, fonds d'affiches, transitions.
- **Sources** : iquilezles.org/articles/warp ; iquilezles.org/articles/fbm.

### Flow fields (champs de flux)
- **Principe** : grille d'angles (souvent du bruit) ; des particules ou des lignes suivent le champ.
- **Leviers** : résolution de la grille, échelle et distorsion du bruit, longueur des pas, nombre de lignes, distribution des points de départ (grille, aléatoire, Poisson, le long d'une forme), épaisseur variable, **collisions** (une ligne s'arrête près d'une autre : séparation minimale), palette par zone.
- **Studio** (Tyler Hobbs, Fidenza) : lignes épaisses non superposées, palettes très restreintes avec couleurs rares, angles quantifiés, marges, densité variable.
- **Marque** : motif-signature, champs qui contournent un logo (le logo devient un obstacle ou une source).
- **Sources** : Tyler Hobbs « Flow Fields » (tylerxhobbs.com/words) ; The Nature of Code ch. 5 (Flow field following).

### Courbes de niveau (marching squares)
- **Principe** : on échantillonne un champ scalaire sur une grille et on trace les isolignes par cas (16 configurations), interpolation linéaire sur les arêtes.
- **Leviers** : nombre de niveaux, champ source (bruit, distance à un texte, image), lissage, épaisseur alternée, remplissage par bandes.
- **Marque** : cartographie d'un logo (distance au logo → isolignes), relief typographique.
- **Sources** : Jamie Wong « Metaballs and Marching Squares » ; Paul Bourke « Conrec ».

---

## Croissance et simulation

### Réaction-diffusion (Gray-Scott)
- **Principe** : deux substances A et B. `A' = A + (Da·∇²A − A·B² + f·(1−A))·dt`, `B' = B + (Db·∇²B + A·B² − (k+f)·B)·dt`. Da = 1, Db = 0,5, Laplacien 3×3 (centre −1, côtés 0,2, diagonales 0,05).
- **Leviers** : feed f et kill k (mitose f=0,0367 k=0,0649 ; coraux f=0,0545 k=0,062 ; labyrinthes f=0,029 k=0,057 ; explorer la carte Xmorphia pour les autres régimes), vitesse (itérations par image), graine initiale (**un texte ou un logo**), anisotropie, f/k variables dans l'espace.
- **Studio** : calcul sur GPU (ping-pong de textures), rendu par gradient map, relief avec éclairage par normales.
- **Sources** : Karl Sims « Reaction-Diffusion Tutorial » (karlsims.com/rd.html) ; Robert Munafo « Xmorphia » (carte des paramètres f/k).

### Croissance différentielle
- **Principe** (Inconvergent) : une ligne fermée de nœuds ; attraction entre voisins, répulsion entre nœuds proches (grille spatiale), on insère un nœud quand un segment dépasse une longueur.
- **Leviers** : distance de répulsion, force d'attraction, longueur max avant division, bruit, forme de départ (cercle, **contour d'une lettre**).
- **Sources** : inconvergent.net/generative (Differential Line, Hyphae) ; Jason Webb « morphogenesis-resources » (GitHub).

### Physarum (moisissure)
- **Principe** (Jeff Jones, puis Sage Jenson) : agents qui déposent une trace et s'orientent selon trois capteurs (gauche, devant, droite) ; la carte de traces diffuse et s'évapore.
- **Leviers** : angle et distance des capteurs, angle de rotation, dépôt, évaporation, diffusion, nombre d'agents (GPU : 1 M+).
- **Studio** : rendu en dégradé de marque, réseaux de filaments très fins.
- **Sources** : Sage Jenson « Physarum » (cargocollective.com/sagejenson/physarum) ; Jeff Jones (2010) « Characteristics of pattern formation and evolution in approximations of Physarum transport networks ».

### Systèmes de particules, flocking
- **Principe** : forces (gravité, vent, ressorts, attraction), steering (`désiré − vitesse`, limité), boids (séparation, alignement, cohésion).
- **Usage** : nuée qui forme un logo, typo qui se disperse au pointeur.
- **Sources** : The Nature of Code ch. 4–6 ; Craig Reynolds « Boids » (red3d.com/cwr/boids).

### Automates cellulaires
- **Principe** : règles locales sur grille (Jeu de la vie, règles élémentaires 1D comme 30/90/110, cycliques, Larger than Life).
- **Usage** : motifs typographiques en pixels, textures qui évoluent.
- **Sources** : The Nature of Code ch. 7 ; Stephen Wolfram « A New Kind of Science » (consultable en ligne).

### L-systems, phyllotaxie
- **Principe** : réécriture de chaînes interprétées par une tortue ; phyllotaxie : point n à angle `n·137,508°` et rayon `c·√n`.
- **Usage** : motifs botaniques, tournesols de points typographiques.
- **Sources** : The Algorithmic Beauty of Plants.

### Attracteurs étranges
- **Principe** : itérer `x' = sin(a·y) − cos(b·x)`, `y' = sin(c·x) − cos(d·y)` (Clifford, de Jong), accumuler des millions de points dans un histogramme, rendu en log-densité.
- **Studio** : tone mapping logarithmique + gradient map ; interpolation lente des paramètres.
- **Sources** : Paul Bourke « Strange attractors » (paulbourke.net/fractals).

---

## Géométrie et pavages

### Échantillonnage de Poisson (Bridson)
Points aléatoires séparés d'au moins r, en O(n). Base de toute distribution « naturelle » (points de départ, pointillisme, stippling).
Source : Robert Bridson « Fast Poisson Disk Sampling in Arbitrary Dimensions » (2007) ; Mike Bostock « Visualizing Algorithms » (bost.ocks.org/mike/algorithms).

### Voronoï, Delaunay, relaxation de Lloyd
Cellules, triangulations, stippling pondéré par une image (Adrian Secord, « Weighted Voronoi Stippling »). Bibliothèque `d3-delaunay`.
Usage : mosaïques de marque, vitraux, portraits en points.

### Pavages, Truchet, Wang, symétries
- Truchet : quart de cercles ou diagonales, rotation aléatoire ; variantes multi-échelles (Christopher Carlson, « Multi-scale Truchet patterns », Bridges 2018).
- Wang tiles et **Wave Function Collapse** (Maxim Gumin, github.com/mxgmn/WaveFunctionCollapse) : motifs qui respectent des règles d'adjacence.
- 17 groupes de papier peint : un module de marque répété selon p4m, p6m, etc. (The Symmetry of Things).

### Superformule, SDF 2D, booléens doux
- Superformule de Gielis : `r(φ) = (|cos(mφ/4)/a|^n2 + |sin(mφ/4)/b|^n3)^(−1/n1)`.
- SDF 2D et union douce (`smin`) : blobs et métaballes nets, morphing entre formes. Sources : iquilezles.org/articles/distfunctions2d, /smin.

### Subdivision et compositions récursives
Rectangles subdivisés (à la Mondrian), quadtrees, packing de cercles. Usage : compositions d'affiches sur grille de marque.

---

## Image et filtres

### Dithering
- Ordonné (matrice de Bayer 2×2 à 8×8), diffusion d'erreur (Floyd-Steinberg, Atkinson, Stucki, Jarvis), bruit bleu.
- Studio : palettes de 2 à 4 couleurs de marque, pixels agrandis, dither animé (seuil qui bouge).
- Sources : Surma « Ditherpunk » (surma.dev/things/ditherpunk) ; Lucas Pope, devlog de Return of the Obra Dinn.

### Halftone et trames
Points, lignes, croix dont la taille suit la luminance ; angles par canal (CMJN : 15°, 75°, 0°, 45°) ; moiré volontaire. Usage : traitement photo de marque.

### Gradient map, posterisation, duotone
Luminance → rampe de couleurs. Le kit applique déjà une gradient map à tout outil ; un outil « filtre » peut aller plus loin (rampe éditable, courbes, posterisation par paliers).

### Pixel sorting
Trier les pixels d'une ligne par luminance entre deux seuils (Kim Asendorf, ASDFPixelSort). Animer le seuil.

### Glitch
Décalage de canaux RVB, déplacement de blocs, data-moshing simulé, scanlines. Doser : le glitch doit rester lisible et graphique.

### ASCII et mosaïques typographiques
Chaque cellule devient un caractère choisi par densité (ou par forme : comparer les cellules aux glyphes). Avec la typo de marque importée.

---

## Typographie

- **Contours de lettres** : `opentype.js` donne les chemins d'une police (contours en Bézier) → échantillonnage de points, offsets, déformations, particules qui forment le texte. Avec la typo importée dans la charte (le kit expose `AtelierBrand`).
- **Texte comme masque** : dessiner le texte dans un canvas hors écran et s'en servir comme champ (distance, densité, obstacle, graine de réaction-diffusion).
- **Typo cinétique** : chaque ligne/lettre a une phase ; boucles parfaites par `sin(2π·t/T + φ)` ; étirement vertical, repetition en tunnel, défilement sur cylindre (three.js ou projection 2D).
- **Fontes variables** : interpoler `font-variation-settings` (poids, largeur) par lettre selon le temps ou la distance au pointeur.
- **Sources** : Tim Rodenbröker (timrodenbroeker.de, cours « Programming Posters » et typo cinétique) ; Generative Design, section Type ; DIA Studio (kinetic type).

---

## Mouvement

- **Boucles parfaites** : tout paramètre animé est fonction de `t mod T` avec des fonctions périodiques ; bruit bouclé sur cercle ; exporter exactement T secondes.
- **Easing** : courbes de Robert Penner, `easeInOutCubic`, ressorts amortis ; décaler les phases (stagger) pour un rythme.
- **Interpolation de formes** : rééchantillonner deux contours au même nombre de points avant de les interpoler.
- **Sources** : Bees & Bombs (Dave Whyte), « Easing functions » (easings.net), Matt DesLauriers sur les boucles (mattdesl.svbtle.com).

---

## Couleur

- **Palettes cosinus** (Inigo Quilez) : `color(t) = a + b·cos(2π(c·t + d))`, 4 vecteurs RGB. Animables, compactes, toujours harmonieuses. Source : iquilezles.org/articles/palettes.
- **Espaces perceptuels** : interpoler en OKLab/OKLCH (Björn Ottosson, « A perceptual color space for image processing ») pour des dégradés sans zones boueuses.
- **Règles de palette** : contraste de quantité (Itten), couleur d'accent rare, une teinte dominante + neutres. Toujours partir de la charte (`app.brand.colors`).
- **Extraction depuis image** : k-moyennes ou median cut (le kit fournit `Atelier.extractPalette(img, n)`).
