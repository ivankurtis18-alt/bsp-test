import type { APIRoute } from "astro";

/**
 * `robots.txt` kao ruta, ne kao statični fajl u `public/`.
 *
 * Razlog: adresa mape sajta mora da prati `site` iz `astro.config.mjs`. Da
 * stoji zakucana u `public/robots.txt`, prva promena domena bi je tiho
 * ostavila da pokazuje na staro mesto.
 *
 * `/katalog/dokument` je izvor iz kog se pravi PDF — nije za ljude ni za
 * pretraživače. Već nosi `noindex, nofollow`; ovde se dodatno ne obilazi.
 */
export const GET: APIRoute = ({ site }) => {
  const mapa = site ? new URL("sitemap.xml", site).href : "/sitemap.xml";
  const telo = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${mapa}`,
    "",
  ].join("\n");

  return new Response(telo, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
