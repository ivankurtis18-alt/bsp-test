/**
 * Podaci o firmi — JEDAN izvor istine.
 *
 * Napravljeno zato što je isti podatak stajao na tri mesta sa tri različite
 * vrednosti: početna je tvrdila „više od 39 godina", `/o-nama` je nosila
 * figuru „40", a firma je osnovana 1985 — što je danas 41. Broj je bio
 * prepisan sa reference pisane pre nekoliko godina i zastarevao je svake
 * godine, na svakom mestu posebno.
 *
 * Sve ovde je POTVRĐENO (CLAUDE.md, sekcija 1). Ne dodavati ništa što
 * klijent nije potvrdio — ovo ide i u strukturirane podatke, gde je netačan
 * podatak skuplji nego na strani.
 */

/** Godina osnivanja. Klijent i dalje treba da potvrdi (njihov tekst na
 *  jednom mestu kaže 1981) — dok ne potvrdi, važi ono što piše u „O nama". */
export const OSNOVANA = 1985;

export const FIRMA = {
  naziv: "SZR BSP-MGM",
  brend: "BSP",
  opis: "Proizvodnja medicinske opreme po meri ustanove — bolnički kreveti, stolice za dijalizu i davanje krvi, ormari i oprema za ordinacije.",
  ulica: "Novoseljanski put 139A",
  mesto: "Pančevo",
  ptt: "26000",
  drzava: "RS",
  telefon: "013 348844",
  telefonE164: "+38113348844",
  radnoOd: "07:00",
  radnoDo: "15:00",
  radniDani: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  prostorM2: 2000,
  sertifikati: ["ISO 13485", "ISO 9001", "ISO 14001"],
} as const;

/**
 * Koliko firma postoji — RAČUNA SE, ne upisuje.
 *
 * Zaokružuje se naniže: u martu 2026. firma ima 40 punih godina, ne 41.
 */
export const godineRada = (danas: Date = new Date()): number =>
  danas.getFullYear() - OSNOVANA;

/**
 * JSON za upis u `<script>` preko `set:html`.
 *
 * `JSON.stringify` NE ekranira `<`, `>` ni `/`. Ako bi neka vrednost ikad
 * sadržala `</script>`, blok bi se prekinuo tu i ostatak bi pregledač
 * tumačio kao HTML — klasičan put za ubacivanje koda.
 *
 * Danas nijedan podatak to ne sadrži (provereno: 851 tekstualno polje u
 * `data/*.json`, nijedno sa `<` ili `>`), ali podaci se menjaju kad stigne
 * klijentov asortiman, a greška bi bila tiha. `<` je validan JSON
 * escape i JSON-LD ostaje ispravan.
 */
export const uSkriptu = (podaci: unknown): string =>
  JSON.stringify(podaci).replace(/</g, "\\u003c");

/** Strukturirani podaci. Vraća string jer ide kroz `set:html`. */
export const jsonLdFirme = (sajt: string): string =>
  uSkriptu({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": new URL("/#firma", sajt).href,
    name: FIRMA.naziv,
    alternateName: FIRMA.brend,
    description: FIRMA.opis,
    url: sajt,
    telephone: FIRMA.telefonE164,
    foundingDate: String(OSNOVANA),
    address: {
      "@type": "PostalAddress",
      streetAddress: FIRMA.ulica,
      addressLocality: FIRMA.mesto,
      postalCode: FIRMA.ptt,
      addressCountry: FIRMA.drzava,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: FIRMA.radniDani,
        opens: FIRMA.radnoOd,
        closes: FIRMA.radnoDo,
      },
    ],
    hasCredential: FIRMA.sertifikati,
  });
