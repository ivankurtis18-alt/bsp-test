/**
 * Skida varijabilne fontove sa Google Fonts i hostuje ih lokalno.
 * Uzima SAMO `latin` i `latin-ext` — srpska latinica (č ć ž š đ) je pokrivena
 * njima; ćirilica, grčki i vijetnamski bi bili čist balast.
 */
import fs from "node:fs";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const LATIN = "U+0000-00FF";
const LATIN_EXT = "U+0100-02BA";

const porodice = [
  { ime: "Bricolage Grotesque", upit: "Bricolage+Grotesque:opsz,wght@12..96,400..700", fajl: "bricolage" },
  { ime: "Archivo", upit: "Archivo:wght@400..700", fajl: "archivo" },
  { ime: "JetBrains Mono", upit: "JetBrains+Mono:wght@400..500", fajl: "jetbrains" },
];

let css = "";
for (const p of porodice) {
  const r = await fetch(`https://fonts.googleapis.com/css2?family=${p.upit}&display=swap`, { headers: { "User-Agent": UA } });
  const t = await r.text();
  const blokovi = t.split("@font-face").slice(1);
  for (const b of blokovi) {
    const url = b.match(/url\((https:[^)]+)\)/)?.[1];
    const ur = b.match(/unicode-range:\s*([^;]+);/)?.[1]?.trim();
    if (!url || !ur) continue;
    const podskup = ur.startsWith(LATIN) ? "latin" : ur.startsWith(LATIN_EXT) ? "latin-ext" : null;
    if (!podskup) continue;
    const ime = `${p.fajl}-${podskup}.woff2`;
    const buf = Buffer.from(await (await fetch(url, { headers: { "User-Agent": UA } })).arrayBuffer());
    fs.writeFileSync(`public/fonts/${ime}`, buf);
    const osa = b.match(/font-variation-settings:[^;]+;/)?.[0] ?? "";
    const opsz = b.match(/font-optical-sizing:[^;]+;/)?.[0] ?? "";
    const wght = b.match(/font-weight:\s*([^;]+);/)?.[1]?.trim() ?? "400";
    css += `@font-face {\n  font-family: "${p.ime}";\n  font-style: normal;\n  font-weight: ${wght};\n  font-display: swap;\n  src: url("../fonts/${ime}") format("woff2");\n  unicode-range: ${ur};\n  ${osa}${opsz}\n}\n\n`;
    console.log(`${ime.padEnd(26)} ${(buf.length/1024).toFixed(1)} KB   ${wght}`);
  }
}
fs.writeFileSync("src/styles/fontovi.css", `/* GENERISANO: npm run fontovi — ne menjati ručno. */\n\n${css}`);
console.log("\nupisano: src/styles/fontovi.css");
