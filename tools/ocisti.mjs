/**
 * Uklanja iz `dist/` slike koje se nigde ne koriste.
 *
 * ZAŠTO POSTOJI
 * `src/lib/slike.ts` uvozi svih 198 fotografija kroz `import.meta.glob` sa
 * `eager: true`. Zbog toga Vite emituje SVAKI original u `dist/_astro/`,
 * iako strane koriste isključivo WebP varijante koje Astro generiše.
 *
 * Izmereno pre uvođenja ove skripte:
 *   dist ukupno            122 MB
 *   198 originalnih PNG     81 MB   <- referenci u HTML-u i CSS-u: NULA
 *   963 WebP varijante      11 MB   <- ovo se zaista servira
 *
 * Alternativa je bila prebaciti izvore u WebP, što bi izvore smanjilo za
 * 81% — ali to briše originale, a projekat još nije pod verzionom
 * kontrolom. Ovo rešenje ne dira izvore uopšte.
 *
 * SIGURNOSNE OGRADE
 * - briše se samo unutar `dist/_astro/`;
 * - samo rasterske slike (png/jpg/jpeg/webp/avif/gif);
 * - samo ako se ime fajla NE pojavljuje ni u jednom .html, .css ili .js
 *   fajlu u `dist/`.
 * Sve ostalo se ne dira.
 */
import { readdir, readFile, stat, unlink } from "node:fs/promises";
import { join, extname, basename } from "node:path";

const DIST = "dist";
const SLIKE = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"]);
const TEKST = new Set([".html", ".css", ".js", ".json", ".xml", ".txt"]);

async function svi(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const put = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await svi(put)));
    else out.push(put);
  }
  return out;
}

const fajlovi = await svi(DIST);

// Sav tekstualni sadržaj u jedan string — imena su heširana i dovoljno
// jedinstvena da prosta pretraga podstringa bude pouzdana.
let sadrzaj = "";
for (const f of fajlovi) {
  if (TEKST.has(extname(f).toLowerCase())) sadrzaj += await readFile(f, "utf8");
}

const kandidati = fajlovi.filter(
  (f) => f.includes("_astro") && SLIKE.has(extname(f).toLowerCase()),
);

let obrisano = 0;
let bajtova = 0;
for (const f of kandidati) {
  if (sadrzaj.includes(basename(f))) continue;
  bajtova += (await stat(f)).size;
  await unlink(f);
  obrisano++;
}

const mb = (n) => (n / 1048576).toFixed(1);
if (obrisano) {
  console.log(
    `[ocisti] uklonjeno ${obrisano} nekorišćenih slika iz dist/_astro — ${mb(bajtova)} MB`,
  );
} else {
  console.log("[ocisti] nema nekorišćenih slika");
}
