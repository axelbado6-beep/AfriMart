# AfriMart

Marketplace et plateforme de livraison pour l'Afrique de l'Ouest : boutiques, restaurants et
services à proximité, commande en quelques gestes et suivi de livraison en temps réel.

## Fonctionnalités

- **Accueil type Glovo** : adresse de livraison, catégories colorées, business triés par distance
- **Catalogue et fiches business** : produits, avis, profil public partageable
- **Commande et panier** : panier persistant, commande depuis la messagerie
- **Paiement** : abonnements Stripe (Free / Pro / Enterprise) et supplément produit à 500 XOF
- **Comptes** : connexion Google / Apple ou email, rôles Client et Entreprise
- **Messagerie** : discussion client-vendeur avec partage de photos et vidéos
- **Éditeur média** : stickers, effets et musique pour les publications
- **Notifications** : centre de notifications avec sons et badge

## Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Auth, Database, Storage, Edge Functions)
- Stripe (abonnements et paiements uniques)

## Démarrer en local

Prérequis : Node.js et npm installés.

```sh
# 1. Cloner le dépôt
git clone <URL_DU_DEPOT>

# 2. Entrer dans le dossier
cd <NOM_DU_PROJET>

# 3. Installer les dépendances
npm i

# 4. Lancer le serveur de développement
npm run dev
```

L'application est ensuite accessible sur `http://localhost:8080`.

## Variables d'environnement

Créer un fichier `.env` à la racine avec les valeurs de votre projet Supabase :

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Les clés Stripe et les secrets des edge functions se configurent côté serveur, jamais dans le
code front-end.

## Déploiement

Le projet se déploie depuis l'éditeur : bouton **Publish** en haut à droite.

## Domaine personnalisé

Un domaine personnalisé se connecte dans **Project Settings → Domains**.
