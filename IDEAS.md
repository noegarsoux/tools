# Idées d'outils

Matière première pour identités de marque, en mouvement par défaut (voir AGENTS.md). Chaque idée part d'une source de `references/` : lis la fiche citée avant de commencer, et pousse l'idée au-delà de la version tutoriel (tout réglable, interaction directe sur la scène, finition, presets).
Une idée est faite quand son dossier existe dans `tools/`. Les agents ne modifient pas ce fichier ; ils peuvent partir d'une idée nouvelle si elle s'appuie sur une référence.

## Langages visuels (systèmes complets)
- [ ] **Boîte morphologique** : un logo ou un mot décliné selon des axes croisés (forme, couleur, rythme, densité), affichés en planche ou un par un en boucle. → Gerstner, *Designing Programmes* ; identites.md
- [ ] **Grille modulaire Media Lab** : grille 7×7, un module par marque, animations d'assemblage et de dispersion. → Pentagram, MIT Media Lab 2014 ; identites.md
- [ ] **Conteneur vivant** : une forme-logo fixe remplie par des motifs génératifs interchangeables (flux, Truchet, dither, warp). → Biennale de Venise, Oi ; identites.md
- [ ] **Affiches programmées** : composition sur grille (colonnes, gouttières, ligne de base) avec typo de marque, formes et image, mise en page qui se recompose. → Müller-Brockmann ; Tim Rodenbröker ; Programming Design Systems
- [ ] **Facettes Casa da Música** : un volume à facettes dont chaque face prend la couleur dominante d'une image importée. → Sagmeister ; identites.md
- [ ] **Identité pilotée par les données** : forme du logo pilotée par une série de valeurs (CSV collé ou slider « jour de l'année »). → Nordkyn (Neue) ; identites.md

## Typographie
- [ ] **Tunnel typographique 3D** : mot répété en anneaux extrudés qui défilent, matière chrome ou plastique, boucle parfaite. → Kiel Danger ; shaders.md (raymarching, fresnel)
- [ ] **Typo élastique sur grille** : chaque lettre s'étire en hauteur/largeur selon une onde ou le pointeur, avec fonte variable. → DIA Studio ; techniques.md (typo cinétique)
- [ ] **Contours en particules** : les points des contours (opentype.js) deviennent des agents qui se dispersent au pointeur et reviennent (steering). → The Nature of Code ch. 5 ; techniques.md
- [ ] **Typo croissance différentielle** : le contour d'une lettre pousse et se plisse comme un corail. → Inconvergent ; techniques.md
- [ ] **Réaction-diffusion typographique** : la typo de marque sert de graine et de masque. → Karl Sims ; techniques.md
- [ ] **Typo isolignes** : courbes de niveau autour d'un mot (champ de distance), animées. → marching squares ; techniques.md
- [ ] **Alphabet modulaire** : lettres construites avec 3 à 5 modules (quart de cercle, carré, barre), paramétrables. → Crouwel, New Alphabet ; Generative Design (Type)
- [ ] **Texte en ruban 3D** : texte plaqué sur un ruban qui se tord et boucle. → Kiel Danger ; three.js
- [ ] **Mosaïque typographique** : image ou vidéo rendue en glyphes de la typo de marque, choix des glyphes par forme. → Knowlton ; techniques.md (ASCII)

## Formes
- [ ] **Métaballes SDF** : blobs fusionnés (smin) aux couleurs de marque, pointeur = attracteur, export SVG par marching squares. → Quilez smin ; shaders.md
- [ ] **Superformule animée** : morphing entre presets, mode empilement et mode planche. → Gielis ; techniques.md
- [ ] **Hypercube** : projections de cubes 4D/5D/6D en rotation, arêtes partielles. → Manfred Mohr ; artistes.md
- [ ] **Désordre 1 %** : grille de modules (carrés, logo) avec un curseur d'entropie croissante. → Vera Molnár, Georg Nees ; artistes.md
- [ ] **Harmonie différentielle** : points qui tournent à des vitesses proportionnelles à leur rang, figures qui se font et se défont. → John Whitney ; artistes.md

## Motifs
- [x] Tuiles de Truchet (`truchet`)
- [ ] **Truchet multi-échelles** : subdivisions récursives avec inversion de couleur. → Carlson, Bridges 2018 ; techniques.md
- [ ] **Wave Function Collapse** : motif généré à partir de tuiles et de règles d'adjacence, tuiles dessinées depuis le logo. → mxgmn ; techniques.md
- [ ] **17 groupes de papier peint** : un module importé répété selon chaque groupe de symétrie, animation de rotation des modules. → The Symmetry of Things ; techniques.md
- [ ] **Moiré** : deux trames (lignes, cercles, points) qui glissent ; le logo comme seconde trame. → op art, Riley ; artistes.md
- [ ] **Phyllotaxie** : spirale à l'angle d'or de formes ou de lettres, animée. → The Algorithmic Beauty of Plants
- [ ] **Isométrie** : grille isométrique de cubes et extrusions qui se construisent. → Programming Design Systems (grilles)

## Génératif
- [x] Champ de flux (`flow-field`)
- [x] Topographie (`topographie`)
- [ ] **Fidenza** : flow field à lignes épaisses, collisions, palette rare, quantification d'angles. → Tyler Hobbs ; techniques.md
- [ ] **Physarum GPU** : un million d'agents, réseaux filamentaires, logo comme nourriture. → Sage Jenson ; techniques.md
- [ ] **Attracteurs étranges** : millions de points en log-densité, interpolation lente des paramètres, gradient map. → Paul Bourke ; techniques.md
- [ ] **Sand spline** : traits granuleux qui suivent des splines perturbées. → Inconvergent ; artistes.md
- [ ] **Substrate** : fissures qui poussent perpendiculairement les unes aux autres. → Jared Tarbell ; artistes.md
- [ ] **Stippling de Voronoï pondéré** : portrait ou logo en points (relaxation de Lloyd), animé. → Secord ; techniques.md

## Motion & vidéo
- [ ] **Boucles parfaites géométriques** : formes, easing et stagger réglables, durée exacte exportée. → Bees & Bombs ; techniques.md (mouvement)
- [ ] **Animateur de logo SVG** : apparition par tracé, morphing entre deux SVG (rééchantillonnage), rebond. → techniques.md (interpolation de formes)
- [ ] **Transitions de marque** : wipes, masques et morphings en boucle, aux couleurs de la charte. → Studio Dumbar ; identites.md
- [ ] **Rythme BPM** : formes qui pulsent sur un tempo réglable, séquenceur de 16 pas. → identites.md (rythme)

## WebGL & 3D
- [ ] **Marbre domain warping** : warp à deux niveaux coloré par q et r, gradient map de marque. → Quilez warp ; shaders.md
- [ ] **Chrome liquide** : surface réfléchissante déformée par du bruit, reflets d'un dégradé de marque. → shaders.md (matériaux)
- [ ] **Raymarching de formes répétées** : répétition de domaine, torsion, pliage. → hg_sdf ; Kiel Danger
- [ ] **Verre et réfraction** : texte ou logo derrière un bloc de verre déformant. → Maxime Heckel ; shaders.md
- [ ] **Iridescence** : objet 3D avec palette cosinus selon l'angle de vue. → Quilez palettes ; shaders.md

## Filtres & image
- [ ] **Dithering de marque** : Bayer, Atkinson, Floyd-Steinberg, bruit bleu avec 2 à 4 couleurs de la charte, seuil animé, sur image ou vidéo. → Surma, Ditherpunk ; techniques.md
- [ ] **Halftone CMJN** : trames par canal avec angles, formes de points, moiré volontaire. → techniques.md
- [ ] **Pixel sorting** : tri par luminance entre deux seuils animés. → Kim Asendorf ; techniques.md
- [ ] **Glitch contrôlé** : décalage de canaux, blocs, scanlines, dosage fin. → techniques.md
- [ ] **Kuwahara** : effet peinture sur image importée, puis gradient map. → LYGIA ; shaders.md

## Dégradés
- [ ] **Mesh gradient** : maillage de points de couleur déplaçables à la souris, interpolation OKLab, grain. → Ottosson ; techniques.md (couleur)
- [ ] **Aurora** : bandes de couleur fluides par warp + palette cosinus. → shaders.md
- [ ] **Dégradés granuleux** : dégradés avec dither et grain fins, mouvement lent. → Maxime Heckel ; shaders.md

## Couleur
- [x] Harmonies de couleurs (`harmonies`)
- [ ] **Interaction des couleurs** : planches d'Albers générées depuis la charte (carrés imbriqués, transparences illusoires). → Albers ; livres.md
- [ ] **Contrastes d'Itten** : une palette de marque testée sur les 7 contrastes, export PDF/PNG. → Itten ; livres.md

## Audio-réactif
- [ ] **Visuels pilotés par un fichier audio** : bandes de fréquences → paramètres d'un système (démo par défaut). → identites.md (donnée / temps réel)

## Utilitaires
- [ ] **Générateur de grilles** : colonnes, gouttières, marges, ligne de base, export SVG/PNG. → Müller-Brockmann ; Programming Design Systems
