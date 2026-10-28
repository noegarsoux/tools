# Références

La base de culture d'Atelier. **Avant de choisir ou de construire un outil, lis ce fichier puis la fiche du thème concerné.** Un outil Atelier doit partir d'une technique ou d'une démarche documentée ici (ou d'une source de même niveau), et la pousser vers un usage de marque. Cite tes sources dans `tool.json` (`"inspiration": ["Inigo Quilez — Domain warping", "Karl Gerstner — Designing Programmes"]`).

| Fiche | Contenu | À lire quand |
|---|---|---|
| [moodboard.md](moodboard.md) | **La sélection de Noé** (Figma) : 27 images, leur mécanique, leur palette, l'outil à en tirer | **Toujours, en premier** : c'est le goût de l'agence |
| [physique-maths.md](physique-maths.md) | Vrais phénomènes physiques et objets mathématiques, modèle et calcul | Pour tout outil de simulation ou de géométrie |
| [livres.md](livres.md) | Les ouvrages de référence et ce qu'on en tire concrètement | Toujours, pour situer une idée |
| [techniques.md](techniques.md) | Fiches techniques : algorithme, paramètres utiles, rendu, usage marque | Avant d'écrire la première ligne |
| [shaders.md](shaders.md) | Bibliothèques et formules GLSL (bruit, SDF, palettes, raymarching) | Outils WebGL, dégradés, filtres |
| [identites.md](identites.md) | Identités dynamiques, systèmes graphiques, studios de référence | Outils « Langages visuels », typo, motion |
| [artistes.md](artistes.md) | Pionniers et artistes génératifs contemporains, leurs procédés | Pour viser une esthétique précise |
| [en-ligne.md](en-ligne.md) | Blogs, tutoriels, galeries de code, listes de ressources | Pour approfondir une technique |

## Comment s'en servir

0. **Commencer par le moodboard.** `moodboard.md` dit le niveau visuel visé. Un outil doit pouvoir produire une image qu'on accrocherait à côté de ces références. Ses palettes sont dans le kit (`Atelier.PALETTES`) : utilise-les pour les presets.
1. **Partir d'une source, pas d'une envie vague.** « Un champ de flux » est un tutoriel ; « les flow fields de Tyler Hobbs avec collisions et épaisseurs variables, appliqués à une typo de marque » est un outil.
2. **Combiner deux fiches.** Les meilleurs outils croisent une technique ou un phénomène (techniques.md, physique-maths.md) et une démarche de design (moodboard.md, identites.md) : domain warping × gradient map de marque, Truchet × grille de Gerstner, réaction-diffusion × masque typographique.
3. **Pousser chaque paramètre.** Les sources donnent les leviers (fréquence, octaves, seuils, distributions). Expose-les tous dans le panneau, avec des bornes qui restent belles.
4. **Viser le niveau des références visuelles**, pas celui des démos. Si le rendu ressemble à un tutoriel, ajoute de la matière : grain, épaisseurs variables, palettes restreintes, composition, rythme.

Les livres sous droits sont résumés et liés, jamais copiés. Les ressources libres (The Nature of Code, The Book of Shaders, Programming Design Systems, Aesthetic Programming, The Algorithmic Beauty of Plants…) peuvent être consultées en ligne pendant une session si le réseau le permet.
