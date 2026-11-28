export const catalogCategories = ["Tous", "Mode & Vêtements", "Électronique", "Alimentation", "Beauté & Santé", "Maison & Jardin", "Sport & Loisirs", "Art & Artisanat", "Services"];

const aliases: Record<string, string> = {
  Mode: "Mode & Vêtements", Beauté: "Beauté & Santé", Restaurants: "Alimentation",
  Marché: "Alimentation", Boissons: "Alimentation", Pharmacie: "Beauté & Santé", Cadeaux: "Art & Artisanat",
};

export const homeDestinations = [
  { name: "Restaurants", category: "Alimentation", sub: "Restaurants", tone: "food" },
  { name: "Marché", category: "Alimentation", sub: "Marché", tone: "market" },
  { name: "Mode", category: "Mode & Vêtements", sub: "", tone: "fashion" },
  { name: "Beauté", category: "Beauté & Santé", sub: "", tone: "beauty" },
  { name: "Pharmacie", category: "Beauté & Santé", sub: "Pharmacie", tone: "health" },
  { name: "Boissons", category: "Alimentation", sub: "Boissons", tone: "drinks" },
  { name: "Cadeaux", category: "Art & Artisanat", sub: "Cadeaux", tone: "gifts" },
  { name: "Services", category: "Services", sub: "", tone: "services" },
];

export function normalizeCategory(value: string | null | undefined) {
  if (!value) return "Tous";
  return aliases[value] ?? (catalogCategories.includes(value) ? value : "Tous");
}

export function catalogHref(category: string, sub = "") {
  const params = new URLSearchParams({ category: normalizeCategory(category) });
  if (sub) params.set("sub", sub);
  return `/catalog?${params}`;
}

const normalized = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const sectionTerms: Record<string, string[]> = {
  Restaurants: ["restaurant", "repas", "plat", "pizza", "burger", "grill", "attieke", "alloco", "garba", "poulet", "traiteur"],
  Marché: ["marche", "epice", "cereale", "fruit", "legume", "huile", "riz", "farine", "poisson", "viande", "sucre"],
  Pharmacie: ["pharmacie", "medicament", "parapharmacie", "sante", "vitamine", "pansement"],
  Boissons: ["boisson", "jus", "eau", "cafe", "the", "vin", "biere", "soda"],
  Cadeaux: ["cadeau", "coffret", "bijou", "bouquet", "artisanat", "sculpture"],
};

export function matchesCatalogSection(category: string | null, text: string, selected: string, sub = "") {
  if (selected !== "Tous" && normalizeCategory(category) !== selected) return false;
  if (!sub) return true;
  const haystack = normalized(`${category ?? ""} ${text}`);
  return (sectionTerms[sub] ?? [sub]).some(term => {
    const needle = normalized(term === sub && term.endsWith("s") ? term.slice(0, -1) : term);
    return new RegExp(`(^|[^a-z])${needle}[a-z]*(?=$|[^a-z])`).test(haystack);
  });
}