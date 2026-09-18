/**
 * Prefiks osnovne putanje na sve UNUTRAŠNJE linkove.
 *
 * ZAŠTO POSTOJI: kad sajt ne stoji u korenu domena nego u podfolderu
 * (`https://ime.github.io/bsp-test/`), Astro sam dodaje prefiks SAMO na
 * ono što generiše — CSS, JS i slike iz `astro:assets`. Ručno pisane
 * adrese (`href="/proizvodi"`, `href="/favicon.svg"`) ostaju netaknute i
 * vode na koren domena, gde ničega nema.
 *
 * Izmereno pre uvođenja: **22 ručno pisana linka u 9 fajlova**, 6
 * dinamičkih i 5 putanja ka `public/` — bez ovoga bi na GitHub Pages
 * nestali navigacija, favicon i fontovi.
 *
 * `import.meta.env.BASE_URL` je `/` kad je sajt u korenu, a `/bsp-test/`
 * kad nije — pa isti kod radi na oba mesta i ne treba ga menjati pri
 * prelasku na pravi domen.
 *
 * NE DIRA: sidra (`#`), `tel:`, `mailto:` i pune adrese (`https://`).
 */
const BAZA = import.meta.env.BASE_URL.replace(/\/$/, "");

export const put = (adresa: string): string =>
  adresa.startsWith("/") ? `${BAZA}${adresa}` : adresa;
