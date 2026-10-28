# Physique et mathématiques

Noé veut des outils qui partent de **vrais phénomènes** et de **vrais objets mathématiques**. Un outil de ce type est beau parce que le modèle est juste : simule le phénomène, au lieu d'en imiter l'apparence avec du bruit. Expose les grandeurs physiques (fréquence, viscosité, tension, température) comme réglages, avec leur nom réel et une explication courte.

Pour chaque phénomène, cette fiche donne le modèle, la façon de le calculer dans un navigateur et ce qu'on en tire pour une marque.

## Ondes et vibrations

**Figures de Chladni.** Une plaque qui vibre a des lignes nodales immobiles où le sable s'accumule. Pour une plaque carrée : `u(x,y) = cos(nπx)·cos(mπy) − cos(mπx)·cos(nπy)`. On mélange des modes (`a·u₁ + b·u₂`) pour casser la symétrie. Les grains font une descente de gradient sur `|u|` avec un peu de bruit. Une plaque circulaire utilise les fonctions de Bessel `Jₙ(k·r)·cos(nθ)`.
→ Moodboard fiche 1. Le logo peut servir de forme de plaque (résolution numérique sur grille, voir l'équation des ondes ci-dessous).

**Équation des ondes 2D.** `∂²u/∂t² = c²∇²u − γ ∂u/∂t`. On la calcule sur une grille avec deux tampons (schéma explicite, ping-pong WebGL) : `u' = 2u − u_prev + c²Δt²·laplacien(u)`. Les obstacles (logo, fentes) sont des cellules où `u = 0`. On obtient réflexion, interférence et diffraction de façon gratuite.
→ Moodboard fiche 8. Le rendu se fait par gradient map sur l'amplitude ou sur l'énergie `u² + (∂u/∂t)²`.

**Interférences et diffraction.** Plusieurs sources ponctuelles : `Σ sin(k·|p − sᵢ| − ωt) / √|p − sᵢ|`. Les fentes de Young et les réseaux donnent des franges. La diffraction de Fraunhofer est la transformée de Fourier de l'ouverture : un logo comme ouverture donne une figure de diffraction de marque (FFT 2D).

**Lissajous et harmonographe.** `x = A₁ sin(f₁t + φ₁)·e^{−d₁t} + A₂ sin(f₂t + φ₂)·e^{−d₂t}`, de même pour y. Des rapports de fréquences proches d'entiers (2:3, 3:4) avec un léger désaccord produisent les rosaces qui tournent lentement.

**Cordes vibrantes et ondes stationnaires.** `y(x,t) = Σ aₙ sin(nπx/L) cos(nωt)`. Un fil pincé (pointeur) se décompose en harmoniques. Moodboard fiche 12.

**Cymatique et ondes de Faraday.** Des motifs carrés, hexagonaux ou en quasi-cristaux à la surface d'un liquide vibré. Le modèle simple est une somme de N ondes planes à angles réguliers : `Σ cos(k·(x cos(2πi/N) + y sin(2πi/N)))`. N = 5, 7 ou 8 donne des quasi-cristaux.

## Lumière

**Caustiques.** La lumière réfractée par une surface d'eau se concentre en réseaux lumineux. Méthode simple : un maillage de rayons, chaque sommet déplacé selon la normale de la surface (gradient d'une hauteur de bruit animée), puis l'intensité vaut le rapport entre l'aire du triangle avant et après. Rendu additif sur fond sombre.

**Couches minces et iridescence.** Bulles, huile sur l'eau : la couleur dépend de l'épaisseur `d` et de l'angle. La différence de chemin vaut `2nd·cos θ`, et chaque longueur d'onde est atténuée ou renforcée. On approche la teinte par une palette cosinus indexée par `d`.

**Réfraction, dispersion et prisme.** Loi de Snell `n₁ sin θ₁ = n₂ sin θ₂`, avec un indice qui dépend de la longueur d'onde (Cauchy : `n(λ) = A + B/λ²`). Un logo en verre qui décompose la lumière en spectre.

**Moiré.** La superposition de deux trames de fréquences `f₁` et `f₂` fait apparaître la fréquence `|f₁ − f₂|`. Moodboard fiche 17.

## Fluides et matière

**Fluides (Navier-Stokes).** La méthode « Stable Fluids » de Jos Stam (advection semi-lagrangienne, diffusion, projection pour garder la divergence nulle) tourne bien en WebGL. Encre de marque injectée au pointeur, vorticité confinée pour garder des tourbillons nets.

**Mousse et lois de Plateau.** Les parois se rejoignent par trois à 120°, avec des bords épaissis aux jonctions. Approximation : Voronoï relaxé (Lloyd), puis distance aux bords arrondie. Le coarsening (les petites bulles disparaissent au profit des grandes, loi de von Neumann en 2D : une cellule à moins de 6 côtés rétrécit) donne le mouvement. Moodboard fiche 13.

**Réaction-diffusion (Gray-Scott).** `∂A/∂t = D_A∇²A − AB² + f(1−A)`, `∂B/∂t = D_B∇²B + AB² − (k+f)B`. Les paires `(f, k)` donnent des taches, labyrinthes, mitoses ou vagues (carte de Pearson).

**Croissance limitée par diffusion (DLA).** Des particules en marche aléatoire se collent à un germe : coraux, givre, éclairs. Les cristaux de neige suivent un modèle hexagonal de Reiter (automate sur grille hexagonale).

**Fissures et craquelures.** Le retrait d'une couche qui sèche crée des fissures qui se rejoignent à 90° ou 120°. Voir Substrate (Tarbell) et les modèles à ressorts qui cassent au-delà d'un seuil.

**Tissu, cordes et ressorts.** Intégration de Verlet avec des contraintes de distance. Un drapeau de marque, un logo suspendu à des fils, un texte en tissu qu'on attrape.

**Sable et tas.** Automate de tas de sable (Bak-Tang-Wiesenfeld) : avalanches fractales. Écoulement granulaire simple : une cellule tombe si la cellule du dessous est vide, puis en diagonale.

## Champs et forces

**Magnétisme et lignes de champ.** Champ d'un dipôle `B ∝ (3(m·r̂)r̂ − m)/r³`. On trace les lignes de champ par intégration (RK4) depuis des graines autour des pôles. Plusieurs aimants déplaçables : la limaille s'oriente en temps réel.

**Électrostatique et potentiel.** Les charges ponctuelles donnent un potentiel `Σ qᵢ/|p − pᵢ|`. Ses équipotentielles sont des courbes de niveau (marching squares) et ses lignes de champ suivent le gradient. C'est la base des métaballes (fiches 2, 7, 25).

**Gravitation et orbites.** Kepler : ellipses, vitesse plus grande au périhélie. N-corps avec intégrateur symplectique (leapfrog) pour garder des orbites stables. Moodboard fiche 18.

**Pendules.** Le pendule double est chaotique (Lagrangien, RK4) : une petite différence initiale donne des trajectoires divergentes. Un ensemble de 100 pendules presque identiques fait un éventail qui se déchire. Le « pendulum wave » (longueurs réglées pour des périodes en progression) fait des vagues qui se forment et se défont.

**Systèmes de particules à forces.** Particle Life : chaque couple de couleurs a une attraction ou une répulsion, d'où des structures émergentes. La palette de marque devient la matrice des espèces.

## Objets mathématiques

**Courbes et surfaces.** Spirographes (hypotrochoïdes), rosaces `r = cos(kθ)`, superformule de Gielis, courbes de Bézier et B-splines, surfaces minimales (Enneper, gyroïde), nœuds (tores, nœuds de Lissajous en 3D).

**Champs de distance (SDF).** Toutes les formes se combinent (union, smin, soustraction), se répètent et se plient. Inigo Quilez : 2D et 3D distance functions.

**Pavages et symétries.** Les 17 groupes de papier peint, les pavages de Penrose (règles de substitution, de Bruijn), les pavages hyperboliques (disque de Poincaré, Escher Circle Limit), les quasi-cristaux.

**Fractales.** Mandelbrot et Julia (zoom profond, coloriage lisse), IFS (fougère de Barnsley, flammes fractales de Scott Draves), L-systems, courbes de Hilbert et de Peano qui parcourent une image.

**Chaos et attracteurs.** Lorenz, Rössler, Clifford, De Jong, Aizawa. Des millions de points rendus en log-densité, avec interpolation lente des paramètres.

**Théorie des nombres.** Spirale d'Ulam, phyllotaxie (angle d'or 137,5°), suites de Fibonacci, tables de multiplication modulo n sur un cercle (cardioïde), suite de Recamán.

**Topologie et géométrie.** Diagrammes de Voronoï et triangulations de Delaunay, enveloppes convexes, champs de vecteurs et leurs singularités, courbes de niveau.

**Transformées.** Fourier : une forme dessinée par des épicycles (série de Fourier d'un contour de logo). Transformée de Hough, ondelettes.

## Sources

- **The Nature of Code** (Shiffman), chapitres forces, oscillations, particules : natureofcode.com
- **Jos Stam, Real-Time Fluid Dynamics for Games** (GDC 2003) et **GPU Gems ch. 38** (Harris) pour les fluides en WebGL.
- **Karl Sims, Reaction-Diffusion Tutorial** : karlsims.com/rd.html
- **Paul Bourke**, géométrie, attracteurs, Chladni, harmonographes : paulbourke.net
- **Inigo Quilez**, SDF, palettes, warp : iquilezles.org
- **Evan Wallace**, WebGL Water (caustiques en temps réel) : madebyevan.com/webgl-water
- **Wolfram MathWorld** pour les formules exactes (fonctions de Bessel, courbes, surfaces).
- **Steven Strogatz, Nonlinear Dynamics and Chaos** pour les pendules, oscillateurs couplés et attracteurs.
- **3Blue1Brown** (vidéos sur Fourier, épicycles, lumière) pour comprendre avant de coder.
- **Daniel Piker** (Kangaroo, physique pour designers) et **Nervous System** (croissance, Floraform) pour la physique au service de la forme.
- **Bridges Archive** (archive.bridgesmathart.org) : art et maths, articles avec algorithmes.
