# Shaders et WebGL

## Bibliothèques à connaître

| Ressource | Ce qu'on y trouve | Utilisation dans Atelier |
|---|---|---|
| **LYGIA** (lygia.xyz, Patricio Gonzalez Vivo) | La plus grande bibliothèque de fonctions GLSL/WGSL : bruits (simplex, worley, curl, fbm), SDF, couleurs (espaces, blend modes, palettes, tone mapping), filtres (flous, kuwahara, dither), éclairage PBR, raymarching | Recopier les fonctions utiles **dans** le shader de l'outil (pas d'import réseau à l'exécution), en citant LYGIA en commentaire |
| **webgl-noise** (github.com/stegu/webgl-noise, Ashima Arts / Stefan Gustavson) | Simplex 2D/3D/4D, bruit cellulaire, bruit périodique (pour boucles parfaites) | Bruit de référence, sans texture |
| **hg_sdf** (mercury.sexy/hg_sdf, Mercury) | SDF 3D, opérateurs de domaine (répétition, miroirs, polaire), booléens chanfreinés | Raymarching de formes architecturales et typographiques |
| **Inigo Quilez — articles** (iquilezles.org/articles) | distfunctions (3D), distfunctions2d, smin, palettes, warp, fbm, normales, ombres douces, AO, biplanar mapping | La référence absolue ; voir formules plus bas |
| **The Book of Shaders** (thebookofshaders.com) | Cours progressif + éditeur | Pour les shaping functions et les motifs |
| **Shadertoy** (shadertoy.com) | Des dizaines de milliers de shaders publics | Inspiration ; vérifier la licence avant de reprendre du code (souvent CC BY-NC-SA) |
| **glslify / stack.gl**, **three.js examples**, **ogl**, **regl** | Écosystème WebGL | three.js et ogl autorisés via CDN avec version exacte |
| **Three.js Journey** (Bruno Simon), **The Art of Code** (Martijn Steinrucken, YouTube) | Tutoriels shaders et 3D de qualité | Approfondir |
| **Maxime Heckel — blog** (blog.maximeheckel.com) | Shaders appliqués : dithering, réfraction, post-processing, raymarching volumétrique | Effets de matière |

## Formules de poche

```glsl
// Palette cosinus (Quilez) : a + b·cos(2π(c·t + d))
vec3 pal(float t, vec3 a, vec3 b, vec3 c, vec3 d) { return a + b * cos(6.28318 * (c * t + d)); }

// Union douce polynomiale (Quilez, smin) : k = rayon de fusion
float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }

// SDF 2D de base (Quilez, distfunctions2d)
float sdCircle(vec2 p, float r) { return length(p) - r; }
float sdBox(vec2 p, vec2 b) { vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }

// fBM
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 6; i++) { v += a * noise(p); p = p * 2.0 + 17.0; a *= 0.5; } return v; }

// Domain warping à deux niveaux (Quilez, warp)
float warp(vec2 p, float k) {
  vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
  vec2 r = vec2(fbm(p + k * q + vec2(1.7, 9.2)), fbm(p + k * q + vec2(8.3, 2.8)));
  return fbm(p + k * r);
}

// Grain de film animé (hash simple)
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
```

## Raymarching (rendu de SDF 3D)

- Boucle : `t += d(ro + rd·t)` jusqu'à `d < ε` ou `t > tMax` (64 à 128 pas).
- Normales par différences finies (méthode du tétraèdre de Quilez), ombres douces (`res = min(res, k·h/t)`), occlusion ambiante à 5 échantillons.
- Opérateurs de domaine : répétition `mod`, symétries `abs`, torsion (twist), pliage (fold) pour des formes « Kiel Danger ».
- Matériaux stylisés : fresnel `pow(1 − dot(n, −rd), 5)`, matcap, chrome par réflexion d'un dégradé de marque, iridescence par palette cosinus indexée sur `dot(n, v)`.
- Source : Jamie Wong « Ray Marching and Signed Distance Functions » (jamie-wong.com) ; iquilezles.org.

## Post-processing

- Bloom (seuil + flous séparables), aberration chromatique, vignette, grain, tone mapping ACES, dithering pour éviter le banding dans les dégradés.
- Kuwahara (effet peinture), flou de Kawase, dither ordonné en écran.
- Rappel : le kit applique la gradient map, le logo et (si l'outil appelle `app.finish(ctx)`) grain et vignette ; un outil WebGL peut faire sa propre finition dans le shader.

## Contraintes Atelier

- Pas de requête réseau à l'exécution : les fonctions de LYGIA ou webgl-noise sont recopiées dans l'outil.
- three.js, ogl, regl : uniquement depuis `cdn.jsdelivr.net/npm/`, `cdnjs` ou `unpkg`, version exacte.
- `preserveDrawingBuffer` n'est pas nécessaire : le kit copie l'image juste après le rendu pour les exports.
