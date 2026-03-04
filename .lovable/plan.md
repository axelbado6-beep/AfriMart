

## Refonte visuelle : Style professionnel bleu/blanc attractif

L'objectif est de transformer l'identité visuelle d'AfriMart d'un style vibrant orange/or/vert vers un design **professionnel, épuré et addictif** avec une palette bleu/blanc, tout en gardant l'app engageante pour le scroll.

### Palette de couleurs cible

```text
Primary:    Bleu profond (#1E40AF → hsl 224 76% 40%)
Secondary:  Bleu clair (#3B82F6 → hsl 217 91% 60%)  
Accent:     Indigo (#6366F1 → hsl 239 84% 67%)
Background: Blanc cassé (#F8FAFC)
Cards:      Blanc pur
Touches:    Bleu nuit (#0F172A), Gris doux (#64748B)
CTA:        Gradient bleu → indigo
```

### Fichiers à modifier

**1. `src/index.css`** — Refonte complète des CSS variables
- Nouvelles couleurs `:root` et `.dark` en bleu/blanc/indigo
- Remplacer toutes les `--afrimart-*` par des tons bleu/indigo/slate
- Supprimer les classes `.african-pattern`, `.gradient-text` orange, `.story-ring` orange
- Garder les animations (float, shimmer, hover) mais adapter les couleurs
- `.btn-client` → gradient bleu, `.btn-business` → gradient indigo
- `.product-card` et `.category-pill` → accents bleu

**2. `tailwind.config.ts`** — Mettre à jour les couleurs custom
- `afrimart` palette → `blue-50` à `blue-900`, indigo, slate
- Garder les animations existantes (bounce, fade, scale)

**3. `src/components/layout/LoadingScreen.tsx`** — Loading bleu élégant
- Gradient de fond `from-blue-900 via-blue-800 to-indigo-900`
- Remplacer les dots orange/or/vert par des bleus/indigo
- Orbes de fond en bleu/indigo
- Supprimer les emojis flottants → remplacer par des particules géométriques subtiles

**4. `src/components/home/HeroCarousel.tsx`** — Hero slides professionnels
- Slides avec gradients bleu (`from-blue-700 to-indigo-600`, `from-slate-800 to-blue-700`, `from-indigo-600 to-blue-500`)
- Supprimer les emojis flottants → remplacer par des formes géométriques subtiles (cercles, lignes)
- Supprimer `african-pattern` overlay
- CTA boutons blancs avec texte bleu

**5. `src/components/home/PublicHeader.tsx`** — Header épuré
- Supprimer le glow orange du logo hover → glow bleu subtil
- `text-gradient` sur "Mart" → bleu au lieu d'orange
- Search focus → `focus:border-blue-400 focus:shadow-blue-100`
- Bouton Dashboard → gradient bleu au lieu de `btn-client`

**6. `src/components/home/PublicFooter.tsx`** — Footer bleu nuit
- `bg-primary` garde le nouveau bleu profond automatiquement

**7. `src/components/home/FeaturedProducts.tsx`** — Section produits
- Décoration de fond → blobs bleu/indigo au lieu d'orange/vert
- Icon badge → gradient bleu
- Badge "HOT" → bleu au lieu d'or
- Bouton "Voir tout" → hover bleu

**8. `src/components/home/PopularBusinesses.tsx`** — Entreprises
- Spinner gradient → bleu/indigo
- Section header icon → bleu
- Badge "TOP" → bleu/indigo

**9. `src/components/home/CategoryNav.tsx`** — Catégories
- Supprimer l'emoji section title 🌍
- Garder les gradients individuels par catégorie (ils sont déjà variés) mais uniformiser les hovers avec du bleu

**10. `src/components/home/CategoryTabs.tsx`** — Tabs catégories
- Header icon → bleu au lieu d'orange/or

**11. `src/components/products/ProductCard.tsx`** — Cards produits
- Les classes comme `text-primary`, `hover:text-primary` s'adapteront automatiquement au nouveau bleu
- Les boutons panier gardent le style `bg-primary`

**12. `src/components/auth/UserTypeSelector.tsx`** — Sélection type
- Gradient de fond → bleu/indigo
- Cards client/business → accents bleu

### Approche
- 80% du travail se fait dans `index.css` et `tailwind.config.ts` (variables CSS)
- Les composants qui utilisent `text-primary`, `bg-primary`, `text-afrimart-*` s'adaptent via les variables
- Les gradients hardcodés dans les composants doivent être changés manuellement
- Les emojis flottants sont remplacés par des éléments géométriques subtils pour un look pro

