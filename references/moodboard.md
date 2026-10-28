# Moodboard de Noé

La sélection de Noé, sur Figma : [Creative Coding Moodboard](https://www.figma.com/design/sqrj7ge3SolPcCRfYXKf2g/Creative-Coding-Moodoard?node-id=0-1). **C'est la référence la plus importante d'Atelier** : elle dit le niveau visuel visé et le goût de l'agence. Elle grandit chaque mois. Les nouvelles images sont ajoutées à la fin de ce fichier, et les fiches déjà écrites ne changent pas.

Les images ne sont pas copiées dans le dépôt, qui est public. Chaque fiche décrit la mécanique visuelle et le phénomène qui la produit. Elle donne aussi la palette relevée sur l'image et l'outil qu'on peut en tirer.

**Palettes.** Les palettes de ce fichier existent dans le kit : `Atelier.PALETTES`. Dans chaque outil, elles sont sous Réglages → Charte de marque → Palettes. La première couleur est le fond, les suivantes sont les encres. Un outil peut s'en servir pour ses presets : `colors: Atelier.PALETTES.bitmap.colors`. Cite le nom de la palette dans `inspiration`.

## Ce qui revient dans la sélection

- **Le point et la trame.** Des points qui fusionnent en métaballes, s'étirent en perspective, deviennent des voxels ou une trame qui s'ouvre (fiches 2, 3, 4, 7, 25). La trame n'est pas un filtre : c'est la matière du dessin.
- **Les vrais phénomènes.** Figures de Chladni, ondes qui se propagent, mousses de savon, fils tendus (1, 8, 12, 13). L'image est belle parce que la physique est juste.
- **La typo comme matériau.** Texte qui remplit un champ, se plie sur une surface, coule, se répète en écho ou se fait pixel (10, 11, 16, 22, 23, 24).
- **La répétition avec décalage.** Une forme répétée en pas de rotation, d'échelle ou de position : croissants, ellipses, éventails, triangles concentriques (5, 15, 21, 26).
- **Des palettes franches et peu nombreuses.** Soit du monochrome sur papier gris ou crème, soit 4 à 6 couleurs saturées posées en aplats sur du noir ou du crème. Les dégradés sont rares et, quand il y en a, ils sont physiques (thermique, chrome, lueur).
- **Le grain.** Poussière, sable, bruit de photocopie, demi-teinte. Rien n'est lisse.

## Fiches

### 1. Figure de Chladni (sable)
Du sable sur une plaque qui vibre se range sur les lignes nodales, là où la plaque ne bouge pas. Points blancs très denses sur fond noir, avec des courbes fermées et des croisements organiques.
- **Phénomène** : modes propres d'une plaque, `cos(nπx)cos(mπy) − cos(mπx)cos(nπy) = 0` pour une plaque carrée. Mélanger deux ou trois modes donne les formes moins symétriques de l'image.
- **Palette `chladni`** : `#050505 #b4b4b4 #f2f2f2`
- **Outil** : **Chladni**. Des milliers de grains glissent vers les zones de faible amplitude (descente de gradient + bruit). Réglages : modes n et m, mélange de modes, forme de la plaque (carré, cercle, logo comme plaque), fréquence balayée dans le temps pour passer d'une figure à l'autre. Le pointeur pose un archet qui excite la plaque.

### 2. Silhouettes en métaballes tramées
Deux silhouettes humaines faites de points noirs qui fusionnent entre voisins, sur gris moyen, numérotées « 0006 » comme une série.
- **Mécanique** : trame de points dont le rayon suit la densité d'une image, puis seuil d'un champ de métaballes, donc les points proches se soudent.
- **Palette `gris-0006`** : `#aaa9a7 #040404`
- **Outil** : **Trame liquide**. Une image, un logo ou un mot devient une trame de points qui fusionnent. Réglages : pas, rayon, seuil de fusion, forme de grille (carrée, hexagonale, phyllotaxie), numérotation automatique pour des séries d'affiches.

### 3. Lettre en voxels dans un cube de points
Un cube de petits points en perspective, et à l'intérieur des points plus gros qui dessinent un volume, comme une lettre en 3D.
- **Mécanique** : grille 3D de points dont la taille vaut 1 dans la forme et presque 0 ailleurs, projection perspective, rotation lente.
- **Palette `papier`** : `#fdfdfd #0f0f0f`
- **Outil** : **Voxels de points**. Un glyphe ou un logo extrudé dans une grille 3D de points, en rotation et en orbite au pointeur. Réglages : résolution 3D, taille min/max, perspective, épaisseur d'extrusion. Exports SVG et séquence.

### 4. Trame en perspective radiale
Une trame de gros points noirs, étirée vers un point de fuite central qui fait un trou blanc, comme un zoom ou une explosion.
- **Mécanique** : chaque point est tracé comme une traînée vers le centre, avec une longueur qui dépend de sa distance et une opacité dégressive (flou de zoom).
- **Palette `papier`**
- **Outil** : **Trame en fuite**. Une trame (image ou logo) projetée vers un point de fuite qui suit le pointeur. Réglages : force du zoom, longueur des traînées, profondeur, taille du trou.

### 5. Croissants empilés et lueur acide
Des croissants gris à noirs empilés en colonnes qui ondulent, dont certains sont teintés jaune acide avec un halo flou.
- **Mécanique** : un cercle répété avec un léger décalage d'un pas à l'autre (phases de lune), et une valeur qui varie avec l'indice. Une lueur additive est posée sur une sélection.
- **Palette `acide`** : `#c3c3c2 #1c1c17 #d6ea3f #f2f2f0`
- **Outil** : **Phases**. Des piles de cercles décalés qui dessinent un volume, avec une onde qui parcourt les piles et une couleur d'accent avec lueur. Réglages : nombre de piles, décalage, ondulation, accent et rayon de la lueur.

### 6. Motifs bitmap raccordables (collection de 36)
Des taches organiques pixelisées, contourées en noir, sur crème. Typographie mono en lettres espacées autour.
- **Mécanique** : bruit seuillé à plusieurs niveaux, chaque niveau a sa couleur, puis quantification en gros pixels. Le motif est raccordable (bruit périodique).
- **Palette `bitmap`** : `#e3e0d6 #1f1e1c #e8552b #4b6cf0 #f4c53a`
- **Outil** : **Bitmap raccord**. Motifs de taches pixel raccordables. Réglages : taille de pixel, nombre de niveaux, échelle et warp du bruit, contour. Export d'une tuile raccord en PNG et SVG.

### 7. Marques en points (années 60)
Des logos faits de points ronds noirs de tailles différentes qui se touchent, se soudent ou se répartissent en éventail. Ils sont numérotés comme dans un catalogue de marques.
- **Mécanique** : une grille de points déformée (cisaillement, rotation, gradient de taille) et des points fusionnés par endroits.
- **Palette `papier-60`** : `#f4f4f2 #27262b`
- **Outil** : **Marques en points**. Générateur de monogrammes en points, avec grilles, transformations, fusions et une planche de variantes numérotées. Lié à la Boîte morphologique.

### 8. Fronts d'onde et gradient thermique
Une source émet des fronts d'onde qui s'éloignent, colorés comme une image thermique : sauge, indigo au cœur, orange et jaune sur les crêtes, violet en bas.
- **Phénomène** : équation des ondes 2D, ou plus simplement des anneaux `sin(k·r − ωt)` amortis, déformés par un champ. Le dégradé est une gradient map appliquée à l'amplitude.
- **Palette `thermique`** : `#8ea79c #3b3bb3 #e0622e #f2c06a #7a47b4 #d1bde0`
- **Outil** : **Ondes**. Une simulation d'ondes sur grille (WebGL) où le pointeur pose des sources, avec réflexions sur un logo-obstacle, interférences et diffraction par des fentes. Le rendu est une gradient map de marque.

### 9. Lignes d'écho et lueur menthe
Un triangle sombre et flou dont le contour se répète en lignes décalées, avec un liseré menthe lumineux, sur un fond gris-vert granuleux.
- **Mécanique** : courbes de niveau d'un champ de distance flouté, décalées dans une direction (balayage) avec une lueur sur le bord.
- **Palette `menthe`** : `#dce8e5 #191d1e #a4e0bc #4f9d7a`
- **Outil** : **Échos**. Une forme (logo, lettre) qui laisse des contours décalés quand elle bouge, avec lueur et grain. Réglages : nombre d'échos, décalage, flou, couleur de lueur.

### 10. Calligramme en flux
Des phrases manuscrites et des motifs de traits qui remplissent des régions qui ondulent comme du bois veiné ou des courbes de niveau.
- **Mécanique** : un champ de flux découpé en régions, avec du texte posé le long des lignes de courant et un motif par région.
- **Palette `papier-gris`** : `#ecebe8 #2a2927 #94928f`
- **Outil** : **Calligramme**. Le texte de marque coule le long des lignes d'un champ (bruit, logo, image). Les zones alternent entre texte et hachures. Lié au champ de flux.

### 11. Texte plié sur une surface
Des lignes de texte denses qui se plient et se tordent, comme si la page était une surface 3D froissée.
- **Mécanique** : texte plaqué sur un maillage déformé (bruit ou vague), avec la taille qui suit la perspective.
- **Palette `papier`**
- **Outil** : **Page pliée**. Un bloc de texte sur un maillage qu'on tord au pointeur. Réglages : amplitude, fréquence, torsion, interlignage.

### 12. Fils tendus et pointillés
Des faisceaux de traits pointillés qui partent de nœuds en étoile et se croisent, comme des fils tendus entre des clous ou des trajectoires de particules.
- **Mécanique** : lignes entre des paires de points, avec des tirets d'épaisseur variable et une densité qui augmente près des nœuds.
- **Palette `papier`**
- **Outil** : **String art**. Des nœuds placés à la main ou sur un logo, reliés par des fils tirés au hasard. Les tirets vibrent quand on pince un fil (corde vibrante).

### 13. Mousse de savon
Des cellules blanches arrondies séparées par des parois noires qui s'épaississent aux jonctions, avec à droite des lignes droites qui se croisent.
- **Phénomène** : une mousse 2D qui suit les lois de Plateau (parois qui se rejoignent à 120°, bords de Plateau épais aux jonctions). On l'approche par un Voronoï relaxé (Lloyd) avec un arrondi des cellules (SDF de Voronoï, smin).
- **Palette `papier`**
- **Outil** : **Mousse**. Une mousse vivante : les petites bulles disparaissent (coarsening), le pointeur gonfle ou crève des bulles, et un logo peut servir de cadre. Réglages : nombre de cellules, épaisseur des parois, arrondi des bords de Plateau.

### 14. Motif de glyphes en régions
Une mosaïque très dense de petits motifs (ronds, croix, rayures, damiers) sur une grille, organisés en grandes régions de couleur.
- **Mécanique** : un bruit basse fréquence choisit la région, chaque région a un glyphe et une couleur, et un bruit fin perturbe le choix.
- **Palette `glyphes`** : `#0a0a0a #f4f1ea #2f6b3a #e79ab5 #e5502a #f2c230 #3a6fd0`
- **Outil** : **Mosaïque de glyphes**. Une grille de glyphes dont les régions viennent d'un bruit, d'une image ou d'un logo. On importe ses propres glyphes en SVG.

### 15. Pyramides d'ellipses
Des ellipses colorées empilées en rangées qui s'élargissent, formant des pyramides en miroir, sur un fond taupe avec des tranches de bandes au bord.
- **Mécanique** : une grille où la largeur des rangées suit une fonction en dents de scie, et chaque cellule est une ellipse dont la couleur est tirée dans une palette.
- **Palette `pyramides`** : `#9b8f84 #2e3b25 #e0402f #e57d9e #c49a35 #524e76 #111111`
- **Outil** : **Pyramides**. Rangées d'ellipses qui respirent, avec un profil réglable (dents de scie, sinus, losange) et un défilement vertical en boucle.

### 16. Pluie de code en blocs
Des colonnes de caractères de code (FUNCTION, RETURN…) sur des pavés de couleur, qui tombent et se dispersent en bas.
- **Mécanique** : colonnes de cellules de texte, chacune avec sa couleur. La gravité fait tomber les colonnes et le bas se désagrège en cellules isolées.
- **Palette `code`** : `#d2c9c5 #e07a2e #d49be0 #2e7d32 #e8b830 #5b7fd6 #1a1a1a`
- **Outil** : **Pluie de texte**. Un texte de marque en colonnes de pavés qui tombent avec une physique simple (rebonds, empilement). Le pointeur pousse les pavés.

### 17. Arbre en barres
Une image (un arbre) rendue en tirets horizontaux de longueurs variables, avec des anneaux concentriques qui produisent un moiré.
- **Mécanique** : chaque ligne de balayage est coupée en barres dont la longueur suit la luminance. Le moiré vient d'une fréquence de lignes proche de celle de l'image.
- **Palette `photocopie`** : `#e3e4e6 #1c191b`
- **Outil** : **Trame en barres**. Une image ou une vidéo rendue en barres horizontales, avec un seuil animé et une option de moiré.

### 18. Orbite typographique
Sur un aplat orange, des lettres tournent en ellipses autour d'un centre, et des traits noirs relient le centre aux mots-clés.
- **Mécanique** : du texte posé sur des orbites elliptiques à vitesses différentes, avec des rayons vers certaines étiquettes.
- **Palette `orbite`** : `#e05527 #111111 #f2f2f1`
- **Outil** : **Orbites**. Les mots d'une marque gravitent selon de vraies orbites képlériennes (ellipses, vitesse plus grande au périhélie). On attrape un mot pour changer son orbite.

### 19. Salon Skug : grille de pastilles
Une affiche faite d'une grille de carrés arrondis de tailles différentes. Certains portent une lettre, en rouge, vert ou jaune, et les autres sont noirs.
- **Mécanique** : une grille récursive (gros modules, puis petits modules), une lettre par module, et une couleur par bloc de texte.
- **Palette `salon`** : `#e5e3e0 #0a0a0a #d6453b #5fae5c #f0e04a`
- **Outil** : **Grille de pastilles**. On tape le texte de l'affiche et la grille s'adapte, avec des tailles par ligne, une couleur par bloc et des cellules vides qui clignotent.

### 20. Good Room : collage d'aplats
Une affiche avec un damier en bordure, des rayures vertes, des zébrures orange marbrées et des formes en trame violette, découpées en collage.
- **Mécanique** : des couches de motifs (rayures, damier, trame, marbrure) masquées par des formes découpées.
- **Palette `good-room`** : `#111111 #6dbf45 #e8782f #b07ad8 #9db0ef`
- **Outil** : **Collage de motifs**. On empile des couches de motifs générés, chacune masquée par une forme qu'on dessine ou qu'on importe. Le marbrage se fait par warp.

### 21. Éventail de lettres
Une lettre « S » répétée par rotations successives, formant un éventail en bandes bleues, olive, rouges et vertes sur un fond brun.
- **Mécanique** : une forme répétée avec un pas de rotation et d'échelle autour d'un pivot, l'ordre de dessin créant les recouvrements.
- **Palette `eventail`** : `#3b2a10 #2f4fa8 #a3a03a #c9401f #4c8a5a`
- **Outil** : **Éventail**. Une lettre ou un logo répété par pas de rotation, d'échelle et de couleur autour d'un pivot qu'on déplace. Animation du pas en boucle.

### 22. Biennale de l'affiche : écho typographique
Des blocs de texte sur des plaques rose, jaune et rouge, répétés en cascade avec un décalage et une légère rotation.
- **Mécanique** : une même plaque de texte répétée le long d'une courbe, avec une couleur qui alterne et un décalage croissant.
- **Palette `biennale`** : `#f4f3f0 #111111 #e5452a #f2b0c8 #f2e640`
- **Outil** : **Écho de plaques**. Un texte sur plaque répété le long d'une trajectoire qui suit le pointeur (traînée), en boucle.

### 23. Lettres en colonnes de pixels
De grandes lettres condensées faites de colonnes de pixels de couleur, avec des glitches verticaux, sur fond gris.
- **Mécanique** : la typo est rastérisée en colonnes, et chaque colonne prend une couleur et un décalage vertical aléatoire (datamosh).
- **Palette `pixels`** : `#999899 #42956e #d0453a #3c4fd0 #a047ab #6fe0a0`
- **Outil** : **Typo en colonnes**. Un mot rastérisé dont les colonnes glissent, se recolorent et se recomposent.

### 24. Lettres liquides
Un titre noir sur blanc qui coule et ondule comme un liquide, en restant lisible.
- **Mécanique** : la typo est déformée par un bruit (domain warp) puis seuillée pour garder des bords nets.
- **Palette `papier`**
- **Outil** : **Typo liquide**. Un mot qui fond, avec amplitude, échelle et vitesse du warp, et le pointeur qui remue le liquide. Export SVG par marching squares.

### 25. Trame ouverte
Une trame régulière de points blancs sur noir. Par endroits les points grossissent jusqu'à fusionner en grandes taches blanches, et du texte suit des chemins.
- **Mécanique** : le rayon des points suit un champ (bruit ou métaballes), et le seuil fait fusionner les plus gros.
- **Palette `trame-nuit`** : `#131313 #f5f5f5 #828282`
- **Outil** : fusionné avec **Trame liquide** (fiche 2) : mode « trame ouverte », avec texte sur chemin.

### 26. Klubkegelbahn : triangles concentriques
Des bandes en zigzag qui forment des triangles concentriques jusqu'au centre, en rose, bleu, jaune, vert, orange et noir.
- **Mécanique** : la distance à un triangle (SDF) est découpée en bandes, avec un zigzag ajouté à la distance, et le cycle de couleurs défile.
- **Palette `kegelbahn`** : `#060303 #f272ba #486cfc #edd14b #297c26 #ef5a2f`
- **Outil** : **Bandes concentriques**. Des bandes autour de n'importe quelle forme (SDF de polygone, de lettre, de logo) qui défilent vers le centre, avec des zigzags et des créneaux.

### 27. Hochschule Luzern : chrome violet
Des tubes et des formes gonflées dans un dégradé chrome violet à lavande, sur un aplat orange, avec une typo noire mono qui suit les tubes.
- **Mécanique** : des SDF arrondies (smin) éclairées avec une réflexion d'environnement en dégradé (matcap), sur fond plat.
- **Palette `luzern`** : `#f25f03 #7d38e7 #b9a0e6 #1a1410 #ffffff`
- **Outil** : **Tubes chromés**. Des formes et lettres gonflées en chrome (raymarching, matcap de marque), avec des tubes qu'on dessine au pointeur.

## Ajouter des images

Quand Noé ajoute des images au tableau Figma :
1. Relire la page Figma (nœud `0:1`) et repérer les calques qui n'ont pas de fiche. Les fiches 1 à 27 correspondent aux calques `image 1` à `image 27`.
2. Écrire une fiche par image, à la suite, en suivant le même plan : mécanique ou phénomène, palette, outil.
3. Ajouter les nouvelles palettes à `PALETTES` dans `assets/ui/atelier.js`, et les idées d'outils à `IDEAS.md`.
