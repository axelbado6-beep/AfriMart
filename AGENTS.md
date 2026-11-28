# Architecture rules
- Keep catalog category aliases, homepage destinations and matching in `src/lib/catalog-categories.ts`; one shared definition prevents homepage links and Explorer filters from diverging.
- Use the bundled official logo in connected navigation and derive public browser icons from that same image so local and hosted deployments share their identity.
- Keep catalog category and subcategory selection in URL parameters; browser history and direct links must restore the same selection.