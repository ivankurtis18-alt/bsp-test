import puppeteer from "puppeteer-core";

const URL = process.argv[2] ?? "http://localhost:4321/";
const W = Number(process.argv[3] ?? 1440);
const H = Number(process.argv[4] ?? 900);
const REDUCED = process.argv.includes("--reduced");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
const greske = [];
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") greske.push(`[${m.type()}] ${m.text()}`); });
page.on("pageerror", (e) => greske.push(`[pageerror] ${e.message}`));
page.on("requestfailed", (r) => greske.push(`[404/fail] ${r.url()}`));
await page.setViewport({ width: W, height: H });
if (REDUCED) {
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
}
await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
// Prođi kroz celu stranu da se okinu svi scroll-trigeri.
await page.evaluate(async () => {
  // Skroluj kao čovek: mali korak, dovoljna pauza da IntersectionObserver
  // stigne da uzorkuje. Namerno se NE vraćamo na vrh — merimo stanje posle
  // normalnog čitanja strane.
  const korak = 300;
  for (let y = 0; y < document.body.scrollHeight; y += korak) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 220));
  }
  await new Promise((r) => setTimeout(r, 1800));
});

const izvestaj = await page.evaluate(() => {
  const round = (n) => Math.round(n);

  const sekcije = [...document.querySelectorAll("main > section, main > div")].map((el) => {
    const r = el.getBoundingClientRect();
    const y = r.top + window.scrollY;
    const naslov =
      el.querySelector("h1, h2")?.textContent?.trim().replace(/\s+/g, " ").slice(0, 44) ?? "(bez naslova)";
    return {
      tag: el.tagName.toLowerCase(),
      klasa: el.className.toString().slice(0, 40),
      naslov,
      vrh: round(y),
      dno: round(y + r.height),
      visina: round(r.height),
    };
  });

  // Najveći vertikalni prazan pojas: skeniraj kolonu piksela po sredini
  // i traži uzastopne redove bez ijednog vidljivog elementa sa sadržajem.
  const sadrzajni = [...document.querySelectorAll("main *")].filter((el) => {
    const st = getComputedStyle(el);
    if (st.visibility === "hidden" || st.display === "none") return false;
    if (parseFloat(st.opacity) < 0.05) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const imaTekst = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const jeVizual = ["IMG", "SVG", "IFRAME", "CANVAS"].includes(el.tagName);
    const imaIvicu = ["Top", "Right", "Bottom", "Left"].some(
      (s) => parseFloat(st[`border${s}Width`]) > 0,
    );
    return imaTekst || jeVizual || imaIvicu;
  });

  const opsezi = sadrzajni
    .map((el) => {
      const r = el.getBoundingClientRect();
      return [round(r.top + window.scrollY), round(r.bottom + window.scrollY)];
    })
    .sort((a, b) => a[0] - b[0]);

  const praznine = [];
  let dosad = 0;
  for (const [a, b] of opsezi) {
    if (a - dosad > 90) praznine.push({ od: dosad, do: a, visina: a - dosad });
    dosad = Math.max(dosad, b);
  }

  // Elementi koji su i dalje nevidljivi posle skrolovanja kroz stranu
  const nevidljivi = [...document.querySelectorAll("[data-otkrij]")]
    .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.5)
    .map((el) => el.className.toString().slice(0, 40));

  const brojke = [...document.querySelectorAll("[data-broj]")].map(
    (el) => `${el.dataset.broj}->${el.textContent.trim()}`,
  );

  const prelivanje =
    document.documentElement.scrollWidth > document.documentElement.clientWidth
      ? [...document.querySelectorAll("body *")]
          .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
          .slice(0, 5)
          .map((el) => `${el.tagName.toLowerCase()}.${el.className.toString().slice(0, 30)}`)
      : [];

  return {
    prelivanje,
    brojke,
    visinaStrane: round(document.body.scrollHeight),
    sekcije,
    praznine: praznine.sort((a, b) => b.visina - a.visina).slice(0, 6),
    nevidljivi,
    imaONama: !!document.querySelector("#o-nama"),
    devToolbar: !!document.querySelector("astro-dev-toolbar"),
  };
});

console.log(`\n=== ${URL}  @ ${W}x${H} ===`);
console.log(`Visina strane: ${izvestaj.visinaStrane}px`);
console.log(`Sekcija "O nama" u DOM-u: ${izvestaj.imaONama ? "DA" : "NE"}`);
console.log(`Astro dev toolbar prisutan: ${izvestaj.devToolbar ? "DA" : "NE"}`);

console.log("\n--- Sekcije ---");
for (const s of izvestaj.sekcije) {
  console.log(
    `${String(s.vrh).padStart(6)} → ${String(s.dno).padStart(6)}  h=${String(s.visina).padStart(5)}  ${s.klasa.padEnd(24)} ${s.naslov}`,
  );
}

console.log("\n--- Najveći prazni pojasevi (>90px bez sadržaja) ---");
if (!izvestaj.praznine.length) console.log("  nema");
for (const p of izvestaj.praznine) {
  console.log(`  ${String(p.visina).padStart(5)}px   od y=${p.od} do y=${p.do}`);
}

console.log(`\n--- Nevidljivi posle skrola: ${izvestaj.nevidljivi.length} ---`);
izvestaj.nevidljivi.slice(0, 8).forEach((c) => console.log("  ", c));

console.log(`
--- Konzola: ${greske.length} ---`);
greske.slice(0, 12).forEach((g) => console.log("  ", g.slice(0, 180)));

await browser.close();
