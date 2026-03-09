export const PLANS = {
  free: {
    name: "Gratuit",
    description: "Pour démarrer sur AfriMart",
    features: [
      "3 produits max",
      "Profil entreprise basique",
      "Messagerie client",
      "Statistiques de base",
    ],
    limits: { products: 3 },
    monthly: { price: 0, priceId: null },
    annual: { price: 0, priceId: null },
  },
  pro: {
    name: "Pro",
    description: "Pour les entreprises en croissance",
    features: [
      "50 produits max",
      "Profil entreprise avancé",
      "Messagerie illimitée",
      "Statistiques avancées",
      "Badge Pro vérifié",
      "Support prioritaire",
    ],
    limits: { products: 50 },
    monthly: {
      price: 10000,
      priceId: "price_1T7ZHR3o1EuEkDxxEzF2bwgJ",
    },
    annual: {
      price: 100000,
      priceId: "price_1T7ZHk3o1EuEkDxx0plmDqSL",
    },
    productId: "prod_U5knDcIT6wBUZz",
  },
  enterprise: {
    name: "Enterprise",
    description: "Pour les grandes entreprises",
    features: [
      "Produits illimités",
      "Profil entreprise premium",
      "Messagerie illimitée",
      "Statistiques premium & exports",
      "Badge Enterprise vérifié",
      "Support dédié 24/7",
      "API personnalisée",
      "Multi-utilisateurs",
    ],
    limits: { products: Infinity },
    monthly: {
      price: 25000,
      priceId: "price_1T7ZHw3o1EuEkDxxO6WHtfEo",
    },
    annual: {
      price: 250000,
      priceId: "price_1T7ZI93o1EuEkDxxRGSXmxGX",
    },
    productId: "prod_U5knnRUb3pXo3X",
  },
} as const;

export const PRODUCT_SUPPLEMENT = {
  price: 500,
  priceId: "price_1T92do3o1EuEkDxx9jLIMfsV",
  productId: "prod_U7HCuwRRC7oztw",
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlanByProductId(productId: string | null): PlanKey {
  if (!productId) return "free";
  if (productId === PLANS.pro.productId) return "pro";
  if (productId === PLANS.enterprise.productId) return "enterprise";
  return "free";
}
