# Idées d'outils

Matière première pour identités de marque, en mouvement par défaut (voir AGENTS.md). Chaque idée part d'une source de `references/`. Lis la fiche citée avant de commencer, et pousse l'idée au-delà de la version tutoriel : tout réglable, interaction directe sur la scène, finition, presets.

**Priorité** : les idées marquées ★ viennent du moodboard de Noé (`references/moodboard.md`, fiche n°) ou de vrais phénomènes (`references/physique-maths.md`). Commence par elles. Utilise les palettes du moodboard (`Atelier.PALETTES`) pour les presets.

Une idée est faite quand son dossier existe dans `tools/`. Les agents ne modifient pas ce fichier. Ils peuvent partir d'une idée nouvelle si elle s'appuie sur une référence.

## Phénomènes physiques
- [ ] ★ **Chladni** : des milliers de grains de sable qui migrent vers les lignes nodales d'une plaque vibrante. Modes n/m, mélange de modes, balayage de fréquence, plaque carrée, ronde ou en forme de logo, archet au pointeur. Palette `chladni`. → moodboard 1 ; physique-maths.md (ondes)
- [ ] ★ **Ondes** : équation des ondes 2D en WebGL. Le pointeur pose des sources, un logo sert d'obstacle, des fentes produisent diffraction et interférences. Gradient map de marque sur l'amplitude. Palette `thermique`. → moodboard 8 ; physique-maths.md
- [ ] ★ **Mousse** : mousse 2D selon les lois de Plateau (Voronoï relaxé, bords épaissis aux jonctions, coarsening). Le pointeur gonfle ou crève les bulles, un logo sert de cadre. → moodboard 13 ; physique-maths.md (matière)
- [ ] ★ **Caustiques** : la lumière sous l'eau en réseaux lumineux, calculée par déformation d'un maillage de rayons. Le logo est projeté au fond. → physique-maths.md (lumière)
- [ ] ★ **Lignes de champ** : aimants et charges déplaçables, limaille et lignes de champ tracées en RK4. Le logo est fait d'aimants. → physique-maths.md (champs)
- [ ] ★ **Harmonographe** : pendules amortis couplés, rapports de fréquences, rosaces en traits fins qui se dessinent. Export SVG. → physique-maths.md (Lissajous)
- [ ] ★ **Pendulum wave** : une rangée de pendules aux périodes en progression, des vagues qui se forment et se défont. Ce sont des lettres ou des formes de marque qui pendent. → physique-maths.md (pendules)
- [ ] ★ **Fluide d'encre** : Stable Fluids (Stam) en WebGL, encre de marque injectée au pointeur, vorticité, logo comme obstacle. → physique-maths.md (fluides)
- [ ] ★ **Orbites** : les mots d'une marque sur de vraies orbites képlériennes. On attrape un mot pour changer son orbite. Palette `orbite`. → moodboard 18 ; physique-maths.md (gravitation)
- [ ] ★ **Couches minces** : iridescence de bulle de savon et d'huile sur l'eau, épaisseur animée par un fluide lent. → physique-maths.md (lumière)
- [ ] **Réaction-diffusion typographique** : Gray-Scott avec la typo de marque comme graine et masque, carte de Pearson pour choisir le régime. → Karl Sims ; physique-maths.md
- [ ] **DLA et givre** : croissance par diffusion à partir d'un logo, cristaux hexagonaux. → physique-maths.md (matière)
- [ ] **Tissu** : un drapeau ou un texte en tissu (Verlet), qu'on attrape et déchire. → physique-maths.md (ressorts)
- [ ] **Particle Life** : espèces aux couleurs de la charte, matrice d'attractions réglable, structures émergentes. → physique-maths.md (forces)

## Mathématiques
- [ ] ★ **Bandes concentriques** : bandes autour d'une forme (SDF de polygone, de lettre, de logo) qui défilent vers le centre, avec zigzags et créneaux. Palette `kegelbahn`. → moodboard 26 ; physique-maths.md (SDF)
- [ ] ★ **Épicycles** : le contour d'un logo ou d'un mot redessiné par une série de Fourier (cercles qui tournent), nombre d'harmoniques réglable. → physique-maths.md (transformées)
- [ ] ★ **Quasi-cristaux** : somme de N ondes planes (N = 5, 7, 8), seuils et bandes, rotation lente. → physique-maths.md (cymatique)
- [ ] **Attracteurs étranges** : millions de points en log-densité, interpolation lente des paramètres, gradient map. → Paul Bourke ; physique-maths.md
- [ ] **Pavages de Penrose et hyperboliques** : substitution, disque de Poincaré, un module de marque comme tuile. → physique-maths.md (pavages)
- [ ] **Phyllotaxie** : spirale à l'angle d'or de formes ou de lettres, animée. → The Algorithmic Beauty of Plants
- [ ] **Superformule animée** : morphing entre presets, mode empilement et mode planche. → Gielis ; techniques.md
- [ ] **Hypercube** : projections de cubes 4D à 6D en rotation, arêtes partielles. → Manfred Mohr ; artistes.md

## Trames et points
- [ ] ★ **Trame liquide** : une image, un logo ou un mot en trame de points qui fusionnent en métaballes. Grille carrée, hexagonale ou en phyllotaxie, mode « trame ouverte » avec texte sur chemin, numérotation de série. Palettes `gris-0006`, `trame-nuit`. → moodboard 2 et 25
- [ ] ★ **Voxels de points** : un glyphe ou un logo extrudé dans une grille 3D de points, en rotation et en orbite au pointeur. → moodboard 3
- [ ] ★ **Trame en fuite** : une trame projetée vers un point de fuite qui suit le pointeur, traînées et flou de zoom. → moodboard 4
- [ ] ★ **Marques en points** : générateur de monogrammes en points (grilles, cisaillement, fusions), planche de variantes numérotées. Palette `papier-60`. → moodboard 7 ; Gerstner
- [ ] ★ **Trame en barres** : une image ou une vidéo rendue en tirets horizontaux, seuil animé, moiré volontaire. Palette `photocopie`. → moodboard 17
- [ ] **Dithering de marque** : Bayer, Atkinson, Floyd-Steinberg, bruit bleu avec 2 à 4 couleurs de la charte, seuil animé. → Surma, Ditherpunk ; techniques.md
- [ ] **Halftone CMJN** : trames par canal avec angles, formes de points, moiré volontaire. → techniques.md

## Répétition et rythme
- [ ] ★ **Phases** : piles de cercles décalés (croissants) qui dessinent un volume, onde qui parcourt les piles, accent avec lueur. Palette `acide`. → moodboard 5
- [ ] ★ **Pyramides** : rangées d'ellipses qui respirent, profil réglable, défilement vertical en boucle. Palette `pyramides`. → moodboard 15
- [ ] ★ **Éventail** : une lettre ou un logo répété par pas de rotation, d'échelle et de couleur autour d'un pivot qu'on déplace. Palette `eventail`. → moodboard 21
- [ ] ★ **Échos** : une forme qui laisse des contours décalés quand elle bouge, avec lueur et grain. Palette `menthe`. → moodboard 9
- [ ] ★ **String art** : nœuds sur un logo reliés par des fils pointillés, cordes qui vibrent quand on les pince. → moodboard 12 ; physique-maths.md (cordes)
- [ ] **Désordre 1 %** : grille de modules avec un curseur d'entropie croissante. → Vera Molnár, Georg Nees ; artistes.md
- [ ] **Harmonie différentielle** : points qui tournent à des vitesses proportionnelles à leur rang. → John Whitney ; artistes.md

## Motifs
- [x] Tuiles de Truchet (`truchet`)
- [ ] ★ **Bitmap raccord** : taches pixel organiques raccordables, niveaux de bruit, contours, export de tuile PNG et SVG. Palette `bitmap`. → moodboard 6
- [ ] ★ **Mosaïque de glyphes** : grille de petits motifs dont les régions viennent d'un bruit, d'une image ou d'un logo, glyphes importables en SVG. Palette `glyphes`. → moodboard 14
- [ ] ★ **Collage de motifs** : couches de motifs (rayures, damier, trame, marbrure) masquées par des formes découpées. Palette `good-room`. → moodboard 20
- [ ] **Wave Function Collapse** : motif à partir de tuiles et de règles d'adjacence, tuiles dessinées depuis le logo. → mxgmn ; techniques.md
- [ ] **17 groupes de papier peint** : un module importé répété selon chaque groupe de symétrie. → The Symmetry of Things ; techniques.md

## Typographie
- [ ] ★ **Typo liquide** : un mot qui fond (domain warp seuillé), le pointeur remue le liquide, export SVG. → moodboard 24
- [ ] ★ **Calligramme** : le texte de marque coule le long des lignes d'un champ, zones de texte et de hachures. Palette `papier-gris`. → moodboard 10
- [ ] ★ **Page pliée** : un bloc de texte sur un maillage qu'on tord au pointeur. → moodboard 11
- [ ] ★ **Pluie de texte** : texte en colonnes de pavés colorés qui tombent avec une physique simple et s'empilent. Palette `code`. → moodboard 16
- [ ] ★ **Grille de pastilles** : on tape le texte d'une affiche, la grille de carrés arrondis s'adapte, une couleur par bloc. Palette `salon`. → moodboard 19
- [ ] ★ **Écho de plaques** : un texte sur plaque répété le long d'une trajectoire qui suit le pointeur. Palette `biennale`. → moodboard 22
- [ ] ★ **Typo en colonnes** : un mot rastérisé dont les colonnes de pixels glissent et se recolorent. Palette `pixels`. → moodboard 23
- [ ] **Tunnel typographique 3D** : mot répété en anneaux extrudés qui défilent, boucle parfaite. → Kiel Danger ; shaders.md
- [ ] **Typo élastique sur grille** : chaque lettre s'étire selon une onde ou le pointeur, fonte variable. → DIA Studio ; techniques.md
- [ ] **Contours en particules** : les points des contours deviennent des agents qui se dispersent et reviennent. → The Nature of Code ch. 5

## Génératif
- [x] Champ de flux (`flow-field`)
- [x] Topographie (`topographie`)
- [ ] **Physarum GPU** : un million d'agents, réseaux filamentaires, logo comme nourriture. → Sage Jenson ; techniques.md
- [ ] **Substrate** : fissures qui poussent perpendiculairement les unes aux autres. → Jared Tarbell ; physique-maths.md
- [ ] **Stippling de Voronoï pondéré** : portrait ou logo en points (relaxation de Lloyd), animé. → Secord ; techniques.md

## WebGL & 3D
- [ ] ★ **Tubes chromés** : formes et lettres gonflées en chrome (raymarching, matcap de marque), tubes dessinés au pointeur. Palette `luzern`. → moodboard 27 ; shaders.md
- [ ] **Marbre domain warping** : warp à deux niveaux coloré par q et r, gradient map de marque. → Quilez ; shaders.md
- [ ] **Verre et réfraction** : texte ou logo derrière un bloc de verre qui disperse la lumière. → physique-maths.md (lumière) ; shaders.md

## Langages visuels (systèmes complets)
- [ ] **Boîte morphologique** : un logo ou un mot décliné selon des axes croisés (forme, couleur, rythme, densité). → Gerstner ; CodeCrafted
- [ ] **Affiches programmées** : composition sur grille avec typo de marque, formes et image, mise en page qui se recompose. → Müller-Brockmann ; Tim Rodenbröker ; CodeCrafted
- [ ] **Conteneur vivant** : une forme-logo remplie par des motifs génératifs interchangeables. → Biennale de Venise ; identites.md
- [ ] **Identité pilotée par les données** : forme du logo pilotée par une série de valeurs (CSV collé). → Patrik Hübner ; CodeCrafted ; identites.md

## Motion & vidéo
- [ ] **Animateur de logo SVG** : apparition par tracé, morphing entre deux SVG, rebond. → techniques.md
- [ ] **Rythme BPM** : formes qui pulsent sur un tempo réglable, séquenceur de 16 pas. → identites.md
- [ ] **Visuels pilotés par un fichier audio** : bandes de fréquences vers les paramètres d'un système. → identites.md

## Couleur
- [x] Harmonies de couleurs (`harmonies`)
- [ ] **Interaction des couleurs** : planches d'Albers générées depuis la charte. → Albers ; livres.md
