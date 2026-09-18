import type { APIRoute } from "astro";
import { put } from "../lib/putanja";

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
  const mapa = site ? new URL(put("/sitemap.xml"), site).href : put("/sitemap.xml");

  /* PROBNO IZDANJE SE NE INDEKSIRA.

     Dok sajt stoji na `github.io`, on je javno dostupan DUPLIKAT onoga sto
     ce biti na `bsp.rs`. Ako ga pretrazivac indeksira, pravi sajt kasnije
     takmici se sam sa sobom. Zato probno izdanje zabranjuje sve.

     Prepoznaje se po domenu, ne po zastavici — da se na pravi domen prelazi
     samo promenom `site` u `astro.config.mjs`. */
  const probno = !!site && !site.host.endsWith("bsp.rs");

  if (probno) {
    return new Response(["User-agent: *", "Disallow: /", ""].join("\n"), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
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
