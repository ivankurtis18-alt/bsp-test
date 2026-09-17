import type { APIRoute } from "astro";
import katalog from "../../data/proizvodi.json";

/**
 * Mapa sajta.
 *
 * Pravi se ručno umesto integracijom (`@astrojs/sitemap`) jer je posao
 * trivijalan — pet stalnih ruta plus 54 proizvoda iz istog JSON-a iz kog se
 * te strane i generišu — a svaka nova zavisnost je zavisnost više.
 *
 * Bez ovoga su 54 strane proizvoda dostupne samo kroz filtriranu mrežu, pa
 * ih pretraživači pronalaze sporo ili nikako. Svaka od njih je mogući ulaz
 * iz pretrage („bolnički krevet 961-5").
 *
 * NE ULAZE: `/404` (nije sadržaj) i `/katalog/dokument` (izvor za PDF,
 * `noindex`).
 *
 * `lastmod` se NE ispisuje. Nemamo pouzdan datum izmene po strani, a
 * izmišljen datum je gori od nikakvog — pretraživači ga koriste za
 * raspoređivanje obilazaka.
 */
export const GET: APIRoute = ({ site }) => {
  const koren = site ?? new URL("https://bsp.rs");

  /* KOSA CRTA NA KRAJU MORA DA SE POKLOPI SA `canonical`.

     `Layout.astro` gradi kanonsku adresu iz `Astro.url.pathname`, a on u
     buildu vraća `/proizvodi/` — SA kosom crtom. Prva verzija ove mape je
     ispisivala `/proizvodi` bez nje, pa je pretraživač za istu stranu
     dobijao dva različita signala. */
  const rute = [
    "/",
    "/proizvodi/",
    "/katalog/",
    "/o-nama/",
    "/kontakt/",
    ...katalog.proizvodi.map((p) => `/proizvodi/${p.slug}/`),
  ];

  const telo = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rute.map((r) => `  <url><loc>${new URL(r, koren).href}</loc></url>`).join("\n")}
</urlset>
`;

  return new Response(telo, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
