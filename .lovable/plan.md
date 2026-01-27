
# Page d'Accueil Publique Style Alibaba

## Objectif
Transformer la page d'accueil (Index) en une vitrine publique complète où tout visiteur (inscrit ou non) peut explorer les produits, les entreprises et découvrir ce qu'AfriMart propose.

## Architecture Proposee

```text
+----------------------------------------------------------+
|  HEADER STICKY                                            |
|  [Logo] [Recherche]           [Explorer] [Connexion/Menu] |
+----------------------------------------------------------+
|                                                           |
|  HERO BANNER (Carrousel promotionnel)                    |
|  - Texte accrocheur + CTA "Explorer maintenant"          |
|                                                           |
+----------------------------------------------------------+
|  CATEGORIES (Navigation horizontale scrollable)          |
|  [Mode] [Electronique] [Alimentation] [Beaute] [...]     |
+----------------------------------------------------------+
|                                                           |
|  SECTION: PRODUITS EN VEDETTE                            |
|  +-------+  +-------+  +-------+  +-------+               |
|  |  Img  |  |  Img  |  |  Img  |  |  Img  |               |
|  | Prix  |  | Prix  |  | Prix  |  | Prix  |               |
|  +-------+  +-------+  +-------+  +-------+               |
|                                 [Voir tous les produits]  |
+----------------------------------------------------------+
|                                                           |
|  SECTION: ENTREPRISES POPULAIRES                         |
|  +----------+  +----------+  +----------+                 |
|  |  Logo    |  |  Logo    |  |  Logo    |                 |
|  |  Nom     |  |  Nom     |  |  Nom     |                 |
|  +----------+  +----------+  +----------+                 |
|                             [Voir toutes les entreprises] |
+----------------------------------------------------------+
|                                                           |
|  SECTION: PAR CATEGORIE (Onglets cliquables)             |
|  [Mode] [Tech] [Food] [Beaute]                           |
|  Affiche 4-8 produits de la categorie selectionnee       |
|                                                           |
+----------------------------------------------------------+
|  FOOTER avec liens et infos                              |
+----------------------------------------------------------+
```

## Fonctionnalites Cles

### 1. Acces Public Total
- Aucune authentification requise pour naviguer
- Visiteurs peuvent voir tous les produits disponibles
- Acces aux profils publics des entreprises
- Boutons "Ajouter au panier" et "Contacter" redirigent vers la connexion si non connecte

### 2. Header Unifie
- Logo AfriMart avec barre de recherche integree
- Bouton "Explorer" pour acceder au catalogue complet
- Icone panier (avec compteur si connecte)
- Bouton "Connexion" ou "Mon Dashboard" selon l'etat de connexion

### 3. Hero Section Dynamique
- Carrousel avec messages promotionnels
- Bouton CTA principal "Decouvrir les produits"
- Design africain moderne avec les couleurs du theme

### 4. Sections de Contenu

**Produits en vedette:**
- Grille de 8 produits les plus recents
- Chaque carte affiche: image, nom, prix, entreprise
- Bouton "Voir plus" vers /catalog

**Entreprises populaires:**
- Carrousel de 6 entreprises avec le plus de followers
- Affiche logo, nom, categorie, localisation
- Lien vers le profil public de l'entreprise

**Par categorie:**
- Onglets pour naviguer par categorie
- Affiche 4 produits de la categorie selectionnee
- Lien vers le catalogue filtre par cette categorie

### 5. Interactivite
- Cliquer sur un produit ouvre /product/:id
- Cliquer sur une entreprise ouvre /business/:id
- Bouton Favoris redirige vers connexion si non authentifie
- Panier accessible avec redirection vers connexion si necessaire

## Details Techniques

### Fichiers a Creer/Modifier

1. **src/pages/Index.tsx** - Refonte complete
   - Nouveau layout avec sections
   - Fetch des produits et entreprises depuis Supabase
   - Composants pour chaque section

2. **src/components/home/HeroCarousel.tsx** - Nouveau
   - Carrousel avec embla-carousel-react (deja installe)
   - 3-4 slides promotionnels

3. **src/components/home/FeaturedProducts.tsx** - Nouveau
   - Grille de produits en vedette
   - Reutilise ProductCard existant

4. **src/components/home/PopularBusinesses.tsx** - Nouveau
   - Carrousel d'entreprises populaires
   - Cards entreprises adaptees

5. **src/components/home/CategoryTabs.tsx** - Nouveau
   - Navigation par categories
   - Produits filtres par categorie

6. **src/components/home/PublicHeader.tsx** - Nouveau
   - Header pour les pages publiques
   - Barre de recherche, navigation, auth

### Requetes Supabase

```text
Produits en vedette:
SELECT id, name, price, currency, images, category, business_id,
       business_profiles(id, business_name)
FROM products
WHERE is_available = true
ORDER BY created_at DESC
LIMIT 8

Entreprises populaires:
SELECT id, business_name, logo_url, category, location, followers_count
FROM business_profiles
ORDER BY followers_count DESC
LIMIT 6

Produits par categorie:
SELECT ...
FROM products
WHERE is_available = true AND category = $category
LIMIT 4
```

### Gestion de l'Authentification

- Verification de session au chargement
- Actions protegees (panier, favoris, chat) redirigent vers /auth si non connecte
- Header affiche "Connexion" ou "Mon Dashboard" dynamiquement

## Avantages de cette Approche

1. **Experience Alibaba:** Navigation libre pour decouvrir les produits
2. **Conversion:** Les visiteurs voient la valeur avant de s'inscrire
3. **SEO:** Page indexable avec contenu reel
4. **Performance:** Composants reutilisables (ProductCard, etc.)
5. **Coherence:** Meme design africain moderne partout
