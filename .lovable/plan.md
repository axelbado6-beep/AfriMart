# Plan : Afrimart × Glovo/Yango — 3 phases

Inspiration : grosses tuiles catégories colorées (Glovo) + recherche d'adresse en haut + carte temps réel (Yango). On garde le bleu Afrimart en accent et on intègre Mapbox pour la géoloc.

---

## Phase 1 — Refonte Home "style Glovo" + adresse de livraison

**Objectif :** transformer `/` en hub de découverte par localisation et catégories visuelles, comme Glovo.

### Nouvelle Home (`src/pages/Index.tsx`)
Remplace la home actuelle (Hero carousel + Stories + Featured) par :

1. **Barre d'adresse sticky en haut** (composant `DeliveryAddressBar`)
   - Pin icône + "Livrer à : [adresse actuelle]" + chevron
   - Au clic → drawer avec : autocomplete Mapbox + bouton "Utiliser ma position" (geolocation API)
   - Adresse stockée en `localStorage` (`afrimart_delivery_address` : `{label, lat, lng}`)
   - Contexte global `LocationContext` pour partager l'adresse partout

2. **Grille catégories Glovo-style** (composant `CategoryGlovoGrid`)
   - 8 grosses tuiles 2×4 (mobile) / 4×2 (desktop) : Restaurants, Marché, Mode, Beauté, Pharmacie, Boissons, Cadeaux, Services
   - Chaque tuile : fond couleur vif + illustration ronde + label
   - Réutilise les couleurs de `CategoryColors.tsx` mais en mode "tuile pleine" plus grande
   - Clic → `/catalog?category=X` (déjà supporté)

3. **Bandeaux horizontaux scrollables** (sections façon Glovo)
   - "Près de chez vous" — business triés par distance
   - "Nouveau sur Afrimart" — derniers business inscrits
   - "Populaires cette semaine" — business avec le plus de vues/followers
   - Stories conservées en bandeau compact

4. **Footer conservé**

### Recherche améliorée
- La barre d'adresse + recherche produit sont séparées (comme Glovo)
- Recherche reste sur la SearchSuggestions actuelle

### Mapbox setup
- Ajout du secret `MAPBOX_PUBLIC_TOKEN` (token publique, OK en frontend)
- Utilitaire `src/lib/mapbox.ts` : geocoding, distance Haversine

### Base de données
Ajout colonnes `latitude` / `longitude` (numeric, nullable) sur `business_profiles` pour pouvoir trier par distance. Trigger optionnel pour géocoder `location` si lat/lng manquants (côté edge function).

---

## Phase 2 — Carte interactive + suivi de commande temps réel

**Objectif :** Yango-style — voir les business sur une carte, suivre la livraison en direct.

### Nouvelle page `/map` (vue carte)
- Carte Mapbox plein écran avec markers business filtrés par catégorie
- Bottom sheet rétractable avec liste des business visibles dans la fenêtre
- Bouton flottant "Recentrer sur ma position"
- Filtres flottants en haut (catégorie, ouvert maintenant, vérifié)

### Setup livraison côté business
Nouveau toggle dans `BusinessSettings.tsx` :
- "Mode de livraison" : `self` (je livre moi-même), `network` (réseau Afrimart), `both`
- Zone de livraison : rayon en km autour de l'adresse business
- Frais de livraison : forfait + par km

### Suivi commande temps réel
Nouvelle table `deliveries` :
- `order_id`, `courier_id` (nullable), `status` (pending/assigned/picked_up/in_transit/delivered)
- `pickup_lat/lng`, `dropoff_lat/lng`, `current_lat/lng` (mis à jour par le coursier)
- RLS : visible par client de l'order, business owner, et coursier assigné

Page `/orders/:id/track` :
- Carte avec pin business → pin livraison (en mouvement) → pin client
- Timeline statuts (Yango-style)
- ETA estimée
- Realtime via Supabase channels sur la row `deliveries`

### Modifs `Checkout.tsx`
- Sélection adresse de livraison (réutilise `LocationContext`)
- Choix mode si business propose `both` : "Livré par le marchand" vs "Coursier Afrimart"
- Calcul des frais affiché avant paiement

---

## Phase 3 — Réseau de coursiers Afrimart

**Objectif :** rôle coursier complet façon Yango Pro.

### Inscription coursier
- Nouveau `user_type` : `courier` (enum `user_type` étendu)
- Nouvelle table `courier_profiles` : `user_id`, `full_name`, `phone`, `vehicle_type` (moto/vélo/voiture/à pied), `id_document_url`, `selfie_url`, `is_verified`, `is_online`, `current_lat/lng`, `rating`
- Page `/become-courier` : formulaire onboarding 3 étapes (infos perso, véhicule, documents)
- Validation manuelle par admin (table `courier_applications`)

### App coursier (dashboard dédié)
Route `/courier` (protégée par `CourierRoute`) avec onglets bas façon app mobile :

1. **Accueil** : toggle "En ligne / Hors ligne" + carte + courses disponibles autour
2. **Course active** : navigation GPS étapes (récupérer chez X → livrer chez Y), bouton "J'ai récupéré" / "J'ai livré"
3. **Historique** : courses passées + gains
4. **Gains** : solde, retraits via aggregator (CinetPay/FedaPay déjà en place)
5. **Profil** : note moyenne, statistiques

### Algorithme d'attribution
Edge function `assign-courier` :
- Quand une commande passe en `paid` avec mode `network`
- Trouve les coursiers en ligne dans un rayon de 5 km du business
- Notification push (notification system existant) avec acceptation 30s
- Si refus/timeout → coursier suivant
- Commission : 10% reste pour Afrimart, 80% coursier, 10% business (à confirmer)

### Tracking position
- Le coursier envoie sa position toutes les 10s pendant une course active (via realtime channel ou update sur `deliveries.current_lat/lng`)
- Optimisation batterie : seulement quand course active

---

## Détails techniques

### Stack ajouté
- `mapbox-gl` (~200kb) pour cartes interactives
- `@mapbox/mapbox-sdk` pour geocoding/directions côté serveur (edge function)
- Aucune autre dépendance lourde

### Secret à ajouter
- `MAPBOX_PUBLIC_TOKEN` (publishable, peut être en code mais on le met en secret pour rotation facile)

### Migrations DB Phase 1
- `business_profiles` : `+ latitude numeric, + longitude numeric, + delivery_radius_km integer default 5, + delivery_fee_base integer default 500, + delivery_fee_per_km integer default 100, + delivery_mode text default 'self'`

### Migrations DB Phase 2
- Nouvelle table `deliveries` avec RLS triple (client/business/courier)
- Realtime activé sur `deliveries`

### Migrations DB Phase 3
- Enum `user_type` += `'courier'`
- Tables `courier_profiles`, `courier_applications`, `courier_earnings`
- RLS strictes : un coursier ne voit que ses propres courses + courses disponibles dans son rayon
- Trigger pour calculer les gains après `delivered`

### Mémoires à créer
- `mem://features/glovo-style-home` (nouvelle home + adresse globale)
- `mem://features/delivery-tracking` (carte + temps réel)
- `mem://features/courier-network` (rôle coursier, attribution, gains)

---

## Ordre d'exécution

```text
Phase 1 (1ère implémentation)
├─ Setup Mapbox token
├─ Migration DB lat/lng business
├─ LocationContext + DeliveryAddressBar
├─ CategoryGlovoGrid (8 tuiles)
├─ Sections "Près de chez vous" / "Populaires"
└─ Refonte Index.tsx

Phase 2 (après validation phase 1)
├─ Migration deliveries
├─ Page /map
├─ Settings business : mode livraison + zone
├─ Page /orders/:id/track + realtime
└─ Update Checkout

Phase 3 (après validation phase 2)
├─ Migration courier_profiles + role
├─ Onboarding /become-courier
├─ Dashboard /courier complet
├─ Edge function assign-courier
└─ Système de gains
```

À la fin de la Phase 1 on s'arrête pour que tu valides l'UX avant d'attaquer la Phase 2.
