/**
 * Slike proizvoda skinute sa reference i smeštene u `src/assets/proizvodi/`.
 *
 * Imenovane su `<slug>--<redni broj>.webp`. Dvostruka crta je namerna:
 * sprečava da `918-2--0.webp` bude pokupljen i za slug `918-20`.
 *
 * SVE fotografije proizvoda su WebP. Originali su bili PNG (78,6 MB) i
 * prevedeni su u WebP sa `quality: 92, alphaQuality: 100` pre prvog
 * commita — repo bi inače zauvek nosio i jedne i druge, jer git pamti
 * istoriju. Izmereno: **14,5 MB (−82%)**, sve 198 slika istih dimenzija,
 * providnost očuvana na svakoj, razlika u ISPORUČENOJ slici 0,85/255
 * (oko 0,3% opsega — ispod praga vidljivosti).
 *
 * Obrazac hvata SAMO `.webp`, namerno. Da hvata i `.png`, a neko vrati
 * neki original, isti proizvod bi dobio dve slike i galerija bi se
 * udvostručila. Nova fotografija se prvo prevodi u WebP.
 *
 * `eager: true` učitava samo metapodatke (širina, visina, putanja), ne same
 * bajtove — Astro slike obrađuje tek kad ih neka strana zaista prikaže.
 */
const moduli = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/proizvodi/*.webp",
  { eager: true },
);

const poSlugu = new Map<string, ImageMetadata[]>();

for (const [put, modul] of Object.entries(moduli)) {
  const ime = put.split("/").pop() ?? "";
  const slug = ime.split("--")[0];
  if (!slug) continue;
  const lista = poSlugu.get(slug) ?? [];
  lista.push(modul.default);
  poSlugu.set(slug, lista);
}

// Redosled sa reference je smislen — prva slika je glavna.
for (const [slug, lista] of poSlugu) {
  const redni = (m: ImageMetadata) =>
    Number(m.src.match(/--(\d+)/)?.[1] ?? 0);
  poSlugu.set(
    slug,
    [...lista].sort((a, b) => redni(a) - redni(b)),
  );
}

export const slikeZa = (slug: string): ImageMetadata[] => poSlugu.get(slug) ?? [];

export const glavnaSlika = (slug: string): ImageMetadata | undefined => slikeZa(slug)[0];
