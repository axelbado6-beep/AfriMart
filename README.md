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

Prérequis : **Node.js 18 ou plus** (20 ou 22 recommandés) et npm. Vérifier avec `node -v`.

```sh
# 1. Récupérer le code (ou dézipper l'archive téléchargée)
git clone <URL_DU_DEPOT>

# 2. Entrer dans le dossier
cd <NOM_DU_PROJET>

# 3. Installer les dépendances (longue la première fois)
npm install

# 4. Lancer le serveur de développement
npm run dev
```

L'application est ensuite accessible sur `http://localhost:8080` (ouvrir ce lien dans le navigateur,
ne pas double-cliquer `index.html` : rien ne s'afficherait).

Aucune configuration n'est nécessaire : le projet Supabase est déjà câblé dans
`src/integrations/supabase/client.ts`, donc la base, l'authentification et le stockage
fonctionnent dès le premier lancement.

## Variables d'environnement

Rien à créer pour lancer l'application : les identifiants Supabase (URL et clé publique) sont
écrits dans `src/integrations/supabase/client.ts` et le fichier `.env` fourni n'est pas lu par
l'application.

Pour brancher un autre projet Supabase, remplacer `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY`
dans `src/integrations/supabase/client.ts`.

Les clés Stripe et les secrets des edge functions se configurent côté serveur (secrets Lovable /
Supabase), jamais dans le code front-end.

## Déploiement

Le projet se déploie depuis l'éditeur : bouton **Publish** en haut à droite.

## Domaine personnalisé

Un domaine personnalisé se connecte dans **Project Settings → Domains**.
