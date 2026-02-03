

# Plan d'Amelioration Complete d'AfriMart

## Vue d'Ensemble

Ce plan couvre une mise a jour majeure du site AfriMart pour le transformer en une plateforme sociale dynamique avec des fonctionnalites TikTok/Instagram-style, un systeme de notifications avance, et des animations premium inspirees de Glovo/Yango.

---

## Section 1 : Editeur Media Avance (TikTok/Instagram-Style)

### Etat Actuel
L'editeur media existe deja dans `src/components/media-editor/` avec des fonctionnalites de base (filtres, stickers, effets, dessin, musique).

### Ameliorations Prevues

**1.1 Bouton Story dans la Photo de Profil (Style WhatsApp)**
- Deplacer le bouton "+" d'ajout de story directement dans le cercle de la photo de profil
- Ajouter un anneau anime autour de la photo quand il y a des stories actives
- Visible uniquement par le proprietaire de l'entreprise

**1.2 Amelioration de l'Interface d'Edition**
- Ajouter plus de stickers africains thematiques
- Integrer une bibliotheque musicale etendue (Afrobeat, Coupe-Decale, Amapiano)
- Ameliorer les controles de decoupage video avec timeline visuelle
- Ajouter des effets de transition entre clips

---

## Section 2 : Systeme de Notifications Avance

### Etat Actuel
Un systeme de notifications basique existe avec la table `notifications` et le hook `useNotifications.ts`.

### Nouvelles Fonctionnalites

**2.1 Types de Notifications Client (Abonne)**
- Promotion lancee par l'entreprise
- Nouvelle publication de l'entreprise suivie
- Debut/Fin de live
- Validation de commande
- Reponse dans un chat

**2.2 Types de Notifications Client (Non-Abonne)**
- Article recherche maintenant disponible
- Validation de commande
- Reponse dans un chat

**2.3 Types de Notifications Entreprise**
- Nouveau abonne
- Reception de commande
- Nouveau message
- Reception du colis

**2.4 Systeme de Lives avec Timer**
- Notification push pour les lives en cours/a venir
- Affichage du timer de debut prevu
- Badge "LIVE" anime sur les profils d'entreprises en direct

### Implementation Technique

```text
Table: notifications (existante)
Nouveaux types a ajouter:
- promotion_alert
- new_publication
- live_start
- live_end
- live_scheduled
- product_match
- order_received
- new_follower
- package_delivered
```

**2.5 Edge Function pour Declenchement Automatique**
Creer des triggers Supabase pour generer automatiquement les notifications lors des evenements:
- INSERT sur orders -> notifier l'entreprise + client
- INSERT sur business_media -> notifier les abonnes
- UPDATE sur orders.status -> notifier le client
- INSERT sur messages -> notifier le destinataire

---

## Section 3 : Recherche Pinterest-Style

### Etat Actuel
Le composant `SearchSuggestions.tsx` existe deja avec des suggestions contextuelles.

### Ameliorations

**3.1 Placeholder Anime Style Machine a Ecrire**
- Effet de frappe progressive pour les exemples de recherche
- Rotation automatique entre plusieurs exemples
- Animation de curseur clignotant

**3.2 Suggestions Intelligentes Etendues**
Enrichir le `suggestionMap` avec plus de contextes:
```text
"cadeau" -> femme, homme, enfant, couple, anniversaire, mariage
"mode" -> robes, chaussures, accessoires, traditionnelle, moderne
"cuisine" -> epices, ustensiles, recettes, ingredients
"beaute" -> soins, maquillage, naturel, cheveux
```

**3.3 Section Tendances**
- Afficher les recherches populaires du moment
- Icones animees pour les tendances
- Badge "Hot" pour les recherches en vogue

---

## Section 4 : Animations et Interactions Globales

### 4.1 Ecran de Chargement (LoadingScreen)

**Etat Actuel**: Logo AfriMart avec animations de base.

**Ameliorations**:
- Animation de "dessin" du logo (path drawing)
- Effet de pulsation plus fluide
- Duree optimisee (1-1.5s)
- Transition de sortie elegante (fade + scale)
- Application sur TOUTES les pages (Accueil, Explorer, Messages, Parametres, Profil)

### 4.2 Transitions Entre Pages

**Implementation via PageTransition.tsx**:
- Accueil -> Explorer : slide gauche
- Explorer -> Entreprise : zoom leger
- Retour : slide inverse
- Messages -> Chat : slide droite
- Parametres : fade + scale

### 4.3 Animations de Survol et Clic

**Composants a animer**:
```text
Boutons:
- Effet "pression" au clic (scale 0.95)
- Glow au survol (shadow + border)
- Ripple effect au clic

Cartes:
- Soulevation au survol (translateY -4px)
- Ombre progressive
- Brillance (shimmer effect)

Categories:
- Wiggle/Jelly au survol
- Emoji flottant qui apparait
- Sous-categories en dropdown anime
```

### 4.4 Elements Flottants apres 10 Secondes d'Inactivite

**Etat Actuel**: `IdleFloatingElements.tsx` existe mais peut etre ameliore.

**Ameliorations**:
- Plus de variete d'elements par categorie
- Animations plus douces et discretes
- Apparition aleatoire et progressive
- Disparition au mouvement de souris

---

## Section 5 : Selection Client/Entreprise

### Etat Actuel
`UserTypeSelector.tsx` avec deux cartes animees.

### Ameliorations Majeures

**5.1 Cartes Ultra-Animees**:
- Effet de soulevation 3D au survol
- Glow intense avec couleur AfriMart (orange/vert)
- Icones qui bougent (bounce, rotate, pulse)
- Particules/confettis au survol
- Effet "jelly" au clic
- Transition fluide vers la page suivante

**5.2 Arriere-plan Anime**:
- Formes flottantes (cercles, triangles)
- Gradient qui se deplace
- Emojis africains qui apparaissent

---

## Section 6 : Catalogue et Explorer

### 6.1 Categories Colorees

**Etat Actuel**: `CategoryColors.tsx` definit les couleurs par categorie.

**Ameliorations**:
- Gradients plus vibrants
- Transition de couleur d'arriere-plan selon la categorie selectionnee
- Effet de brillance (shimmer) sur les categories actives

### 6.2 Survol des Categories

**Comportement au survol**:
- Logo et nom de la categorie s'agrandissent
- Sous-categories apparaissent en dropdown
- Animation scale + fade (simultanée, pas en cascade)
- Emoji flottant specifique a la categorie

### 6.3 Navigation Claire

**Structure**:
```text
Categorie Principale
  └── Sous-categories (visibles au survol)
       └── Mode -> Robes, Chaussures, Accessoires, Sacs
       └── Electronique -> Telephones, Ordinateurs, Audio
       └── Alimentation -> Epices, Cereales, Boissons
```

---

## Section 7 : Dashboard Entreprise

### Etat Actuel
`BusinessDashboard.tsx` avec stats animees et badges.

### Ameliorations

**7.1 Chiffres Animés (Counter Animation)**
- Animation de comptage plus fluide
- Effet "pop" a la fin du comptage
- Particules lors d'atteinte de paliers

**7.2 Nouvelles Statistiques**
- Notes moyennes avec etoiles animees
- Nombre de commandes gerees
- Temps moyen de conception/livraison

**7.3 Badges Dynamiques Ameliores**
- "Top Vendeur" avec couronne animee
- "Livraison Rapide" avec camion qui bouge
- "Verifie" avec checkmark brillant
- Effet de deblocage lors de l'obtention

**7.4 Timeline Animee**
- Conception -> Production -> Vente -> Livraison -> Succes
- Progression visuelle avec particules
- Celebration au passage d'etape

---

## Section 8 : Stories dans Photo de Profil

### Implementation

**8.1 Cercle Story (Style WhatsApp/Instagram)**
- Anneau gradient autour de la photo de profil
- Animation de pulsation lente
- Couleurs: orange -> gold -> green (AfriMart)
- Bouton "+" centre pour les proprietaires

**8.2 Viewer Plein Ecran**
- Transition slide-up depuis la photo
- Barre de progression par story
- Controles swipe gauche/droite
- Auto-avance avec timer visuel

---

## Section 9 : Logos par Defaut Ameliores

### Design Moderne

**9.1 Avatar Client**
- Silhouette moderne avec design africain
- Animation de rotation douce au survol
- Glow subtle au hover
- Variantes de couleurs selon le genre

**9.2 Avatar Entreprise**
- Icone de boutique stylisee
- Elements decoratifs africains
- Animation de pulsation
- Badge de categorie integre

---

## Section 10 : Integration du Logo AfriMart

### Emplacements

**10.1 Header (toutes les pages)**
- Logo avec animation au survol
- Effet de brillance periodique
- Lien vers l'accueil

**10.2 Ecran de Chargement**
- Logo central anime
- Effet de dessin progressif
- Pulsation douce

**10.3 Footer**
- Logo avec tagline
- Animation au scroll

**10.4 Favoris et Splash**
- Favicon anime (si supporte)
- Splash screen sur mobile

---

## Section 11 : Couleurs Plus Vibrantes

### Palette Amelioree

**Variables CSS a mettre a jour dans index.css**:
```text
--afrimart-orange: 25 95% 55%  (plus sature)
--afrimart-gold: 45 100% 50%   (plus brillant)
--afrimart-green: 145 80% 42%  (plus vif)
--afrimart-blue: 220 85% 50%   (plus profond)

Arriere-plans:
- Plus de gradients subtils
- Effets de glassmorphism
- Ombres colorees (shadow-orange, shadow-green)
```

---

## Section Technique

### Fichiers a Creer

1. `src/components/profile/StoryProfileRing.tsx` - Cercle story dans photo de profil
2. `src/hooks/useLiveNotifications.ts` - Hook pour les notifications de live
3. `supabase/functions/send-notifications/index.ts` - Edge function pour notifications automatiques
4. `src/components/animations/ConfettiEffect.tsx` - Effet confettis pour celebrations

### Fichiers a Modifier

1. `src/components/media-editor/MediaEditor.tsx` - Ameliorations editeur
2. `src/components/auth/UserTypeSelector.tsx` - Animations cartes
3. `src/pages/BusinessPublicProfile.tsx` - Story dans photo de profil
4. `src/components/notifications/NotificationBell.tsx` - Nouveaux types
5. `src/hooks/useNotifications.ts` - Support des nouveaux types
6. `src/components/home/SearchSuggestions.tsx` - Recherche amelioree
7. `src/components/catalog/CategoryColors.tsx` - Couleurs vibrantes
8. `src/components/dashboard/BusinessDashboard.tsx` - Stats et badges
9. `src/components/layout/LoadingScreen.tsx` - Animation logo
10. `tailwind.config.ts` - Nouvelles animations
11. `src/index.css` - Palette de couleurs

### Migrations Database

1. Ajouter nouveaux types de notifications
2. Table `live_sessions` pour les lives programmes
3. Table `user_searches` pour suggerer des produits pertinents
4. Triggers pour notifications automatiques

---

## Ordre d'Implementation

1. **Phase 1**: Couleurs et animations de base (tailwind, CSS)
2. **Phase 2**: Ecran de chargement et transitions
3. **Phase 3**: Selection Client/Entreprise amelioree
4. **Phase 4**: Catalogue et categories colorees
5. **Phase 5**: Dashboard entreprise avec stats
6. **Phase 6**: Story dans photo de profil
7. **Phase 7**: Systeme de notifications avance
8. **Phase 8**: Editeur media ameliore
9. **Phase 9**: Recherche Pinterest-style
10. **Phase 10**: Logo AfriMart partout

---

## Resume

Ce plan transformera AfriMart en une plateforme moderne, vibrante et engageante avec:
- Des animations fluides et professionnelles style Glovo/Yango
- Un systeme de stories et notifications digne d'Instagram/TikTok
- Une experience utilisateur premium qui incite a l'inscription et l'exploration
- Une identite visuelle africaine moderne et coherente

