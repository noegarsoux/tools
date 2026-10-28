# Livres

Classés par usage. Pour chacun : ce qu'il faut en retenir pour Atelier.

## Les fondamentaux du creative coding

**The Nature of Code** — Daniel Shiffman (2ᵉ éd. 2024, libre en ligne : natureofcode.com)
Vecteurs, forces, oscillations, systèmes de particules, autonomous agents (steering, flocking, path following), automates cellulaires, fractales et L-systems, algorithmes génétiques, réseaux de neurones.
→ Pour Atelier : comportements de flocking sur un logo, steering vers des points d'une typo, oscillateurs couplés pour des boucles, automates pour des motifs vivants.

**Generative Design** — Bohnacker, Groß, Laub, Lazzeroni (Verlag Hermann Schmidt / Princeton Architectural Press ; code libre sur generative-gestaltung.de)
Le livre le plus proche du métier d'Atelier : couleur (palettes depuis images, dégradés, règles), forme (agents, grilles, modules, superformes), typographie (texte comme forme, contours de lettres, typo générative), image (tramage, pixels, collage).
→ Reprendre ses chapitres comme catalogue d'outils : « Couleur depuis image », « Typo sur grille de modules », « Collage génératif », « Formes à partir des contours d'une lettre ».

**Form+Code in Design, Art, and Architecture** — Casey Reas, Chandler McWilliams (Princeton Architectural Press, 2010)
Cinq procédés : répétition, transformation, paramétrage, visualisation, simulation. Panorama historique (Molnár, Nees, Whitney, Mohr) relié au code.
→ Grille de lecture pour qualifier un outil : sur quel procédé il repose, lesquels il combine.

**Processing: A Programming Handbook for Visual Designers** — Casey Reas, Ben Fry (MIT Press)
Base de la culture Processing/p5 : forme, mouvement, typographie, image, interaction.

**Generative Art** — Matt Pearson (Manning, 2011)
Le bruit de Perlin utilisé avec goût, l'émergence, les systèmes simples qui produisent de la complexité. Insiste sur l'imperfection et la matière.

**Code as Creative Medium** — Golan Levin, Tega Brain (MIT Press, 2021)
Un recueil d'exercices d'école d'art pour le code : « une horloge sans chiffres », « un alphabet génératif », « un visage paramétrique », « une boucle parfaite », « un motif répété », « une interaction de dessin augmentée ». Chaque exercice est un sujet d'outil.
→ Banque de sujets : la section « Generative typography », « Interactive drawing tool » et « Looping animated GIF » sont directement transposables.

**Aesthetic Programming** — Winnie Soon, Geoff Cox (Open Humanities Press, libre : aesthetic-programming.net)
Le code comme pratique critique. Utile pour donner du sens à un outil (données, temps, automatisation).

**Programming Design Systems** — Rune Madsen (libre en ligne : programmingdesignsystems.com)
Écrit pour des designers : couleur (modèles, schémas, règles de contraste), forme (vertex, courbes de Bézier, procédés), typographie (métriques, contours), mise en page (grilles, systèmes). Le meilleur pont entre code et identité.
→ Les chapitres « Color schemes » et « Grid systems » sont la base de tout outil qui doit produire des déclinaisons cohérentes.

## Systèmes graphiques et design

**CodeCrafted: Generative Design in Branding** — Victionary (2024, 304 p.) ★ référence choisie par Noé
Le livre le plus proche de ce qu'Atelier fabrique : des identités de marque dont les visuels sont produits par du code, des algorithmes et des données, et qui s'adaptent au support (écran, installation, imprimé). Il montre des projets de studios comme DIA, Studio Dumbar/DEPT® et LAVA, avec des essais de Patrik Hübner et Tim Rodenbröker. Sources : victionary.com/products/codecrafted, creativeapplications.net/books/codecrafted-generative-design-in-branding.
→ Le niveau à viser : chaque outil doit pouvoir produire une déclinaison d'identité complète (affiche, écran, réseau social, motion), pas une démo. Patrik Hübner : identités pilotées par les données et les règles. Tim Rodenbröker : typographie et grilles programmées, outils simples avec peu de paramètres mais justes. DIA : typo cinétique. Dumbar : systèmes de motion de marque.

**Designing Programmes** — Karl Gerstner (1964, réédité Lars Müller)
La source de la pensée « programme » en design : une identité est un système de règles, pas une forme figée. Le « morphological box » (tableau de paramètres croisés) génère toutes les variations d'un logo ou d'une typo.
→ Tout outil « Langages visuels » doit être une boîte morphologique : des axes de variation explicites, chacun réglable.

**Grid Systems in Graphic Design** — Josef Müller-Brockmann
Grilles modulaires, rythme, colonnes, marges. → Outils de mise en page générative, compositions d'affiches qui respectent une grille.

**Point and Line to Plane** — Wassily Kandinsky
Grammaire des éléments (point, ligne, plan) et de leurs tensions. → Outils de composition abstraite à vocabulaire réduit.

**Visual Grammar** — Christian Leborg
Objets abstraits, structures, activités, relations. → Vocabulaire pour nommer les paramètres d'un outil de composition.

**Interaction of Color** — Josef Albers
La couleur est relative : interactions, vibrations, transparences illusoires. → Outils couleur qui montrent une palette de marque en interaction, pas en nuancier.

**The Elements of Color** — Johannes Itten
Sept contrastes de couleur (de teinte, clair-obscur, chaud-froid, complémentaire, simultané, de qualité, de quantité). → Règles de génération de palettes.

**Shape: Talking about Seeing and Doing** — George Stiny
Les grammaires de formes (shape grammars) : règles de remplacement visuelles. → Logos dynamiques, motifs qui se réécrivent.

## Nature, mathématiques, simulation

**The Algorithmic Beauty of Plants** — Przemysław Prusinkiewicz, Aristid Lindenmayer (libre : algorithmicbotany.org/papers)
L-systems, phyllotaxie (angle d'or 137,5°), croissance. → Motifs botaniques, phyllotaxie de points typographiques.

**The Computational Beauty of Nature** — Gary William Flake (MIT Press)
Fractales, chaos, attracteurs, automates cellulaires, systèmes complexes, auto-organisation.

**On Growth and Form** — D'Arcy Thompson
Transformations de coordonnées entre formes vivantes. → Déformations de grille appliquées à un logo.

**The Symmetry of Things** — Conway, Burgiel, Goodman-Strauss
Les 17 groupes de papier peint, notation orbifold. → Outil de motifs qui couvre tous les groupes de symétrie à partir d'un module de marque.

**Geometric Patterns with Creative Coding** — Selçuk Artut (Springer)
Motifs géométriques islamiques et modulaires en code.

## Rendu et shaders

**The Book of Shaders** — Patricio Gonzalez Vivo, Jen Lowe (libre : thebookofshaders.com)
Fonctions de mise en forme (shaping functions), couleurs, formes, matrices, motifs, bruit, cellular noise, fBM. → Base de tout outil WebGL d'Atelier.

**Real-Time Rendering** — Akenine-Möller, Haines, Hoffman. Référence pour l'éclairage et les matériaux (PBR, fresnel, tone mapping).

**Ray Tracing in One Weekend** — Peter Shirley (libre en ligne). Principes du lancer de rayons, utiles pour le raymarching stylisé.

## Histoire et culture

**White Heat Cold Logic: British Computer Art 1960–1980** — Brown, Gere, Lambert, Mason (MIT Press)
**Digital Art** — Christiane Paul (Thames & Hudson)
**Digital Design Theory** — Helen Armstrong (Princeton Architectural Press) : textes fondateurs (Gerstner, Crouwel, Müller-Brockmann, Maeda) sur le design comme système.
**Design by Numbers** / **Maeda@Media** — John Maeda : la typographie et la forme calculées, l'esthétique minimaliste du code.
