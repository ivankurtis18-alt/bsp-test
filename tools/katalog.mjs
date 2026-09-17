/**
 * Pravi PDF katalog iz /katalog/dokument.
 *
 * Dva prolaza, zbog brojeva strana u sadržaju:
 *   1. renderuj PDF bez brojeva
 *   2. pdftotext izvuče tekst po stranama i kaže na kojoj je koja kategorija
 *   3. upiši brojeve u DOM i renderuj konačni PDF
 *
 * Drugi prolaz je moguć samo zato što PDF sadrži pravi tekst. Njihov postojeći
 * katalog je izvezen kao slike i iz njega se ne može izvući ni reč.
 *
 * Pokretanje:  npm run katalog     (traži da `npm run preview` već radi)
 */
import puppeteer from "puppeteer-core";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KOREN = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PDFTOTEXT = "C:/Program Files/Git/mingw64/bin/pdftotext.exe";
const IZVOR = process.argv[2] ?? "http://localhost:4322/katalog/dokument";

const IZLAZ_DIR = join(KOREN, "public", "katalog");
const IZLAZ = join(IZLAZ_DIR, "BSP-katalog.pdf");
const PRIVREMENI = join(KOREN, "node_modules", ".astro", "katalog-prvi.pdf");

const katalog = JSON.parse(readFileSync(join(KOREN, "data", "proizvodi.json"), "utf8"));

mkdirSync(IZLAZ_DIR, { recursive: true });
mkdirSync(dirname(PRIVREMENI), { recursive: true });

const zaglavlje = `<div style="width:100%"></div>`;
const podnozje = `
  <div style="width:100%;font-family:Archivo,system-ui,sans-serif;font-size:7pt;color:#5C6E77;
              padding:0 15mm;display:flex;justify-content:space-between;align-items:center;">
    <span>BSP · Katalog proizvoda</span>
    <span>Novoseljanski put 139A, Pančevo · 013 348844</span>
    <span class="pageNumber" style="font-variant-numeric:tabular-nums"></span>
  </div>`;

const opcijePdf = {
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: zaglavlje,
  footerTemplate: podnozje,
  margin: { top: "17mm", right: "15mm", bottom: "18mm", left: "15mm" },
  preferCSSPageSize: false,
};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
  protocolTimeout: 300000,
});

try {
  const page = await browser.newPage();
  const greske = [];
  page.on("requestfailed", (r) => greske.push(r.url()));

  console.log(`izvor: ${IZVOR}`);
  await page.goto(IZVOR, { waitUntil: "networkidle0", timeout: 120000 });
  // Ne vraćati document.fonts.ready — to je FontFaceSet, koji Puppeteer ne
  // ume da serijalizuje, pa se poziv zaglavi do timeouta.
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  // Sve slike moraju biti gotove pre štampe, inače ostanu prazna mesta.
  const slike = await page.evaluate(async () => {
    const sve = [...document.images];
    // Vremenski ograničeno: slika koja nikad ne javi ni load ni error (npr. da
    // je ostala lazy) ne sme da zaustavi ceo posao.
    const cekaj = (i) =>
      i.complete
        ? Promise.resolve()
        : new Promise((r) => {
            const gotovo = () => r();
            i.addEventListener("load", gotovo, { once: true });
            i.addEventListener("error", gotovo, { once: true });
            setTimeout(gotovo, 15000);
          });
    await Promise.all(sve.map(cekaj));
    return {
      ukupno: sve.length,
      neuspele: sve.filter((i) => !i.naturalWidth).length,
      lazy: sve.filter((i) => i.loading === "lazy").length,
    };
  });
  console.log(`slika: ${slike.ukupno}, neuspelih: ${slike.neuspele}, lazy: ${slike.lazy}`);

  // ── prolaz 1 ────────────────────────────────────────────
  await page.pdf({ ...opcijePdf, path: PRIVREMENI });
  const strana1 = statSync(PRIVREMENI).size;

  const tekst = execFileSync(PDFTOTEXT, ["-enc", "UTF-8", PRIVREMENI, "-"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const strane = tekst.split("\f");
  console.log(`prolaz 1: ${Math.round(strana1 / 1024)} KB, ${strane.length - 1} strana`);

  // Na kojoj strani se prvi put javlja naslov kategorije
  const mapa = {};
  for (const k of katalog.kategorije) {
    const trazeni = k.naziv.toLocaleLowerCase("sr");
    const i = strane.findIndex((s, idx) => idx > 2 && s.toLocaleLowerCase("sr").includes(trazeni));
    if (i !== -1) mapa[k.slug] = i + 1;
  }
  const nadjeno = Object.keys(mapa).length;
  console.log(`brojevi strana pronađeni za ${nadjeno}/${katalog.kategorije.length} kategorija`);

  // ── prolaz 2 ────────────────────────────────────────────
  await page.evaluate((m) => {
    for (const [slug, broj] of Object.entries(m)) {
      const el = document.querySelector(`[data-strana="${slug}"]`);
      if (el) el.textContent = String(broj);
    }
  }, mapa);

  await page.pdf({ ...opcijePdf, path: IZLAZ });

  const konacni = statSync(IZLAZ).size;
  const provera = execFileSync(PDFTOTEXT, ["-enc", "UTF-8", IZLAZ, "-"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

  // Metapodaci idu u data/ da ih Astro može uvesti pri sledećem build-u.
  writeFileSync(
    join(KOREN, "data", "katalog.json"),
    JSON.stringify(
      {
        fajl: "/katalog/BSP-katalog.pdf",
        strana: provera.split("\f").length - 1,
        velicinaKB: Math.round(konacni / 1024),
        napravljen: new Date().toISOString().slice(0, 10),
        proizvoda: katalog.proizvodi.length,
        kategorija: katalog.kategorije.length,
      },
      null,
      2,
    ),
    "utf8",
  );

  rmSync(PRIVREMENI, { force: true });

  console.log(`\ngotovo: public/katalog/BSP-katalog.pdf`);
  console.log(`  strana: ${provera.split("\f").length - 1}`);
  console.log(`  veličina: ${Math.round(konacni / 1024)} KB`);
  console.log(`  znakova teksta: ${provera.replace(/\s/g, "").length} (njihov PDF ima 0)`);
  if (greske.length) console.log(`  neuspeli zahtevi: ${greske.length}`);
} finally {
  await browser.close();
}
