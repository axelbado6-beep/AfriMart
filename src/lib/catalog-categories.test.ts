import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { catalogHref, homeDestinations, matchesCatalogSection, normalizeCategory } from "./catalog-categories";

describe("Accueil vers le rayon choisi", () => {
  for (const tile of homeDestinations) {
    test(`${tile.name} conserve sa catégorie et son rayon`, () => {
      const params = new URL(catalogHref(tile.category, tile.sub), "https://afrimart.test").searchParams;
      assert.equal(params.get("category"), tile.category);
      assert.equal(params.get("sub") ?? "", tile.sub);
      assert.notEqual(params.get("category"), "Tous");
    });
  }
  test("Mode et Beauté utilisent les catégories du catalogue", () => {
    assert.equal(normalizeCategory("Mode"), "Mode & Vêtements");
    assert.equal(normalizeCategory("Beauté"), "Beauté & Santé");
  });
  test("Restaurants n'affiche pas tout le marché", () => {
    assert.equal(matchesCatalogSection("Alimentation", "Pizza du restaurant", "Alimentation", "Restaurants"), true);
    assert.equal(matchesCatalogSection("Alimentation", "Farine de maïs", "Alimentation", "Restaurants"), false);
  });
  test("Marché n'affiche pas les autres rayons", () => {
    assert.equal(matchesCatalogSection("Alimentation", "Riz et légumes", "Alimentation", "Marché"), true);
    assert.equal(matchesCatalogSection("Mode & Vêtements", "Chemise", "Alimentation", "Marché"), false);
  });
  test("Robes reste dans Mode, Tous reste général", () => {
    assert.equal(matchesCatalogSection("Mode & Vêtements", "Robe longue", "Mode & Vêtements", "Robes"), true);
    assert.equal(matchesCatalogSection("Mode & Vêtements", "Chemise", "Mode & Vêtements", "Robes"), false);
    assert.equal(matchesCatalogSection("Alimentation", "Riz", "Tous"), true);
  });
});