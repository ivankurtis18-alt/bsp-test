# BSP — Sajt za proizvodnju medicinske opreme

## 0. Kako radim na ovom projektu (pravila za Claude)

**Pravila se dopunjuju u hodu. Ova sekcija je uvek merodavna.**

1. **Slike se NE otvaraju i NE proveravaju.** Nikad ne koristi Read/vision nad `.jpg/.png/.webp/.svg` fajlovima — samo ih referenciraj putanjom. Razlog: štednja tokena.
2. **Slike SU skinute sa reference** (korisnik odobrio 2026-09-10). 198 fotografija u `src/assets/proizvodi/`, imenovanih `<slug>--<n>.webp`. **Nova fotografija se PRVO prevodi u WebP** — obrazac u `slike.ts` hvata samo `.webp`, da isti proizvod ne bi dobio duplu sliku. Placeholder ostaje samo kao rezerva ako proizvod nema sliku. `hero-hala.jpg` i `pogon.jpg` se ne diraju.
3. **Jezik sajta je srpski (latinica).** Sav copy, alt tekstovi, meta i URL slugovi na srpskom. Dijakritika obavezna: č ć ž š đ.
4. **Svaki font MORA imati `latin-ext` subset.** Bez pune dijakritike — ne ulazi.
5. **Dizajn: maksimum.** Nema "safe" template rešenja. Svaka stranica ima svoj strukturni momenat.
6. **GSAP je motion sloj.** ScrollTrigger za sve reveal/pin/scrub sekvence. Bez Club plugina (SplitText/Flip) osim ako korisnik ne potvrdi licencu — inače ručni fallback.
7. **`prefers-reduced-motion` se poštuje uvek.** Svaka GSAP sekvenca ima "instant final state" granu.
8. **Bez emoji-ja kao ikonica.** Samo SVG.
9. **Ne izmišljaj podatke o firmi.** Cene, sertifikati, reference, brojevi — samo ono što je u sekciji 1 ili što korisnik potvrdi.
10. Pre većih izmena dizajn sistema — pitaj. Sitne implementacione odluke — odluči sam i navedi šta si odabrao.
11. **Na kraju svake sesije otvori sajt u pregledaču — odmah, bez pitanja.** Otvara se **samo početna strana**, ne i ostale; korisnik ostale otvara sam. Uvek sveže, nikad keširano. Vidi sekciju 6.
12. **Svaka nova `<script>` u .astro fajlu ide kroz `naSvakojStrani`.** Od uvođenja View Transitions telo strane se menja bez novog učitavanja, pa skripta koja računa da se modul izvrši jednom prestaje da radi posle prve navigacije. Vidi sekciju 4b.

## 0a. Kako se donose dizajnerske odluke

Svaka značajna odluka na frontu prolazi kroz tri pitanja, tim redom:

1. **Šta je ovde žiža?** Ako sekcija nema jednu stvar koja nosi, nije gotova.
2. **Zašto je ova kompozicija zanimljiva?** Ako je odgovor „tako se obično radi", potraži drugi.
3. **Šta se dešava dok se skroluje, i kako ova sekcija predaje sledeću?**

Uz njih četiri pravila koja se mogu proveriti:

- **Svaka animacija ima razlog. Svaki vizuelni element ima ulogu.** Element bez odgovora na pitanje „šta ovo radi ovde" se briše, ne dorađuje. Efekat se ne koristi zato što je tehnički moguć.
- **Malo izuzetnih interakcija, a ne mnogo osrednjih.** Najviše dva glasna trenutka po strani; ostalo miruje. Ovo je pravilo koje je sprečilo pedeset animacija i dalo pet.
- **Podrazumevani obrazac NIJE greška.** Od njega se odstupa kad postoji razlog koji se može izreći, ne iz principa. Parovi polja u formi su ostali `1fr 1fr` jer je asimetrija tamo lošiji UX — to je ispravna odluka, ne propust. „Izbegavaj podrazumevano" bez ovog protivtega proizvodi originalnost koja smeta.
- **Kad je zahtev neodređen:** razmotri dve-tri jače opcije, izaberi onu koja se uklapa u postojeći sistem, i **reci šta si izabrao i zašto** — ne kreći od najočiglednijeg čitanja.

**Namera bez merenja ne vredi ništa.** Ovo je dopuna sekcije 5b, ne zamena za nju. Na projektu gde se slike ne otvaraju, „deluje dobro" nije nalaz. Naslov preko fotografije je izgledao kao najjači potez na strani dok merenje nije pokazalo **1,35:1**.

## 1. Klijent — potvrđene činjenice

- **Naziv:** SZR BSP-MGM (raniji naziv SZR BSP-Marković), brend: **BSP**
- **Delatnost:** proizvodnja i prodaja medicinske opreme
- **Osnovana:** 1985. — prvo metalni nameštaj, od kraja '90-ih medicinska oprema
- **Iskustvo:** 39+ godina, porodična firma
- **Proizvodni prostor:** ~2.000 m²
- **Sertifikati:** ISO 13485, ISO 9001, ISO 14001
- **Materijali:** čelični profili, eko-koža, ABS, aluminijum
- **Ključna prodajna poenta:** sve po meri kupca — dimenzije, funkcije, boje, dizajn
- **Adresa:** Novoseljanski put 139A, Pančevo
- **Telefon:** 013 348844
- **Radno vreme:** pon–pet 07:00–15:00, vikendom ne radi

## 2. Obim (v1)

| Stranica | Ruta | Sadržaj |
|---|---|---|
| Početna | `/` | Hero („Scena"), brojke, boje i materijali, „Izbliza", „Kako nastaje nalog" (vodoravna traka), CTA kontakt |
| Proizvodi | `/proizvodi` | Indeks kategorija levo, **jedna kategorija u prikazu**, ne sve odjednom |
| Proizvod | `/proizvodi/[slug]` | 54 strane: galerija, namena, tehničke karakteristike, dimenzije, srodno |
| Katalog | `/katalog` | Brojke i dve radnje: pregled u novoj kartici, preuzimanje |
| Katalog (izvor) | `/katalog/dokument` | HTML iz kojeg se pravi PDF, `noindex`, nije u navigaciji |
| O nama | `/o-nama` | Istorijat, lokacija i udaljenosti, Tim / Pouzdanost / BSP, citat |
| Kontakt | `/kontakt` | Forma, podaci, mapa, radno vreme |

Navigacija: Početna · Proizvodi · Katalog · O nama · Kontakt.

**Van obima za sada:** e-commerce/korpa, cene, blog, višejezičnost.

## 3. Referentni sajt

Referenca: `http://bsp.rs/` (WordPress, tema shop-kit).

**Uzima se:** samo asortiman proizvoda i plava iz palete.
**NE uzima se:** layout, tipografija, struktura, komponente. Njihovi fontovi (Roboto / Lato / Lora) su odbačeni.

## 4. Dizajn sistem — ZAKLJUČANO

### Tonalitet — svaka strana ima TAČNO JEDNO tamno poglavlje

Izmereno pre uvođenja: raspon svetline kroz ceo dokument bio je `/proizvodi` **0,23**, `/kontakt` 0,25, `/o-nama` 0,65 (i to samo zbog jedne fotografije). Početna je jedina imala tonalnu arhitekturu.

**Pravilo:** poglavlje stoji tamo gde argument te strane doseže vrhunac — nikad pred podnožjem kao tonski ukras.

| Strana | Poglavlje | Šta strana radi |
|---|---|---|
| `/` | „Izbliza" | **pokazuje** proizvod |
| `/o-nama` | citat | **govori** u prvom licu |
| `/proizvodi` | poziv na kraju | **traži** |
| `/katalog` | brojke | **dokazuje** |
| `/kontakt` | zeleni pojas | **radnja** (boja, ne čelik) |
| `/proizvodi/[slug]` | „Tehnički list" | **dokazuje** |

Izmereno posle: raspon `/` **0,91** · `/proizvodi` **0,91** · `/katalog` **0,91** · `/o-nama` **0,70** · `/kontakt` 0,30.

**Poglavlje mora da ZAUZME prostor** — `min-height: min(78svh, 620px)`. Prvi pokušaj je dao citatu 0,41 ekrana a traci na `/proizvodi` 0,23; pri uzorkovanju cele strane nisu se ni registrovali (0,55 i 0,59 naspram 0,02 na `/katalog`). **Promena mesta se ne vidi ako se kroz nju prođe za pola zamaha točka.**

> **`.poglavlje-tamno` je NAMERNO izvan `@layer` i sa udvojenom klasom.** Prvi pokušaj je stajao u `@layer components`, pa su ga neslojevita pravila strana gasila: `color: var(--color-siva)` na čeliku daje tačno **3,3:1** — izmereno na sve tri strane. Isti kvar kao kod rečnika polja.

> **`/kontakt` je izuzetak — pojas je ZELEN, ne čeliičan.** Zeleno je boja potvrde, a kontakt je mesto radnje. Merenje cele strane pokazuje samo 0,30 raspona jer usrednjava po širini, a bela ploča forme zauzima sredinu pojasa; vizuelno je pojas pun i jasan. **Merenje tonaliteta po pojasevima ne hvata obojeno polje sa svetlim sadržajem u sredini — tu treba pogledati.**

### Tonalitet — jedno tamno poglavlje

Sajt je bio tonalno ravan. Sekcija **„Izbliza" je jedino tamno mesto** i nije dekoracija: potpisni element pravca je *svetlosni sto*, a na beloj podlozi to je samo meka senka. Na čeliku (`--color-celik`) proizvod prestaje da bude slika na podlozi i **postaje izvor svetla**. Fotografija je providan PNG (provereno: alfa min 0, `isOpaque: false`), pa nema belog pravougaonika.

Zato baš ta sekcija: ona jedina pokazuje proizvod izbliza. Tamno poglavlje ide tamo gde je predmet, ne pred podnožje kao tonski ukras. Ivice se **ne prelivaju gradijentom** — sekcija počinje i završava rezom, kao promena kadra.

Izmerena svetlina po pojasevima početne: `0.85 0.84 0.65 **0.02 0.01 0.01 0.02** 0.85 0.91 0.92 0.87 0.90` — raspon **0,908**. Kontrasti u tamnom: naslovi 16,2:1, labele 8,3:1, telo 6,8:1, najniži 4,89:1.

**Bazen svetla je pretočiv.** `--svetlo-jezgro`, `--svetlo-rub` i `--svetlo-senka` su tokeni sa podrazumevanim vrednostima za belu podlogu; tamna sekcija ih menja. Bez toga bi bazen bio bela mrlja na čeliku.

**Zelena `#2F6F5E` na čeliku daje 2,1:1 i pada.** U tamnoj sekciji ista uloga ide u `#6FC2A8`.

### Pravac: „Sala"
Bela sala. Maksimalan whitespace, proizvod pluta u prostoru, plava je jedini hromatski događaj na stranici. Minimalan pravac znači da preciznost u razmaku, tipografiji i detalju nosi ceo dizajn — nema dekoracije iza koje se krije.

**Signature element: „svetlosni sto".** Iza svakog proizvoda stoji mek radijalni bazen svetla. Dok se skroluje, bazen se pomera i pojačava (GSAP scrub), proizvod ima blagi y-parallax. Tiho, izvedeno čistim CSS-om i GSAP-om, radi jednako sa placeholderima i sa finalnim transparentnim PNG-ovima.

### Paleta
Svi odnosi provereni po WCAG AA.

| Token | Hex | Uloga | Kontrast |
|---|---|---|---|
| `--sala` | `#F4F6F7` | podloga stranice, hladno belo | — |
| `--bela` | `#FFFFFF` | bazen svetla, kartice | — |
| `--celik` | `#0D1B22` | primarni tekst | 16.2:1 na sali |
| `--siva` | `#5C6E77` | sekundarni tekst | 4.9:1 na sali ✓ |
| `--ivica` | `#E3E8EA` | hairline linije | dekorativno |
| `--plava` | `#0E6FB4` | akcenat, linkovi, CTA | 4.9:1 na sali ✓ / belo na njoj 5.31:1 ✓ |
| `--plava-signal` | `#1890D7` | originalna BSP plava — **samo velike površine, nikad tekst** | 3.2:1 ✗ |
| `--zelena` | `#2F6F5E` | hirurška zelena — potvrda i mera | 5.45:1 na sali ✓ / belo na njoj 5.91:1 ✓ |

**Dve boje imaju ULOGE, ne mesta. Ovo je pravilo, ne stil:**
- **Plava = radnja.** Isključivo ono što se klikne: veze, dugmad, telefon, aktivna stavka navigacije, fokus, hover.
- **Zelena = potvrda i mera.** ISO bedževi, naslovi specifikacija, oznake podkategorija, brojevi koraka, brojke, godine, kote. **NIKAD ništa interaktivno.**

### Pritisnuto stanje — hover ponire, ne menja ton

**Zelena je bila hover boja na šest mesta i to je UKLONJENO** (2026-09-14, na primedbu korisnika da prelaz plava→zelena ne izgleda dobro). Merenje je objasnilo zašto:

| | vrednost |
|---|---|
| plava vs zelena — odnos svetlina | **1,11** |
| razlika svetline (L) | 7 procentnih poena |
| razlika tona (H) | **41°** |

Promena **tona pri istoj vrednosti** oko čita kao **zamenu predmeta**, ne kao promenu stanja — otud utisak da se dugme prevrnulo u nešto drugo. Promena **vrednosti** se čita kao stanje.

Uz to je zelena time lagala: pravilo kaže da znači potvrdu, a pojavljivala se u trenutku kad još ništa nije potvrđeno.

**Drugi nalaz iz istog merenja:** cela paleta je jedna hladna porodica na ~200° (sala 200, ivica 197, siva 200, čelik 200, plava 205). **Zelena na 164° je jedini ton koji ne pripada porodici** i zato uvek deluje kao gost. To je razlog više da stoji retko i samo tamo gde nosi podatak.

Sada postoje dva pravila, i oba pomeraju VREDNOST:

| Šta | Hover | Kontrast |
|---|---|---|
| **puna kontrola** (`.btn`, telefon u zaglavlju) | ponire u `--color-pritisnuto` (= čelik) — utisne se u materijal sajta | belo na čeliku **17,54:1** |
| **tekstualna veza** | otkriva `--color-plava` — boju radnje | plava na sali **4,90:1** |

`--color-pritisnuto` nije nova boja nego čelik, ista ona od koje je sagrađen ostatak sajta.

> **Ograničenje:** u tamnoj sekciji („Izbliza") čelik na čeliku bi bio nevidljiv. Danas tamo **nema nijednog interaktivnog elementa** (provereno). Ako neki uđe, mora dobiti svetlo pritisnuto stanje, ne čelično.

**Odbačene alternative** (da se ne vrte ponovo): zelena kao jedini akcenat umesto plave — izrazitije i u niši niko to ne radi, ali napušta njihovu brend boju; pomeranje zelene na ~180° (tirkiz) da uđe u porodicu — rešava simptom ali ne i to što boja potvrde služi kao hover; **topla boja (oker/jantar)** — najjači mogući kontrast na hladnoj paleti, ali na medicinskom sajtu povlači značenje upozorenja, a taj jantar (`#8A5A0B`) već označava greške u formi.

> **Usput izmereno, nije hitno:** `--siva` i `--plava` imaju **identičnu luminansu (0,1476)**. Plava veza usred sivog teksta razlikuje se samo tonom, nimalo vrednošću — čita se na dobrom ekranu, ali nema rezervu.

Hirurška zelena nije proizvoljna: to je boja tekstila u operacionoj sali, jer je komplement crvenoj i smanjuje zamor oka. Dolazi iz sveta proizvoda, kao i ostatak pravca. Skoro iste je svetline kao plava (odnos 1,15) pa se ne takmiče. **Ne dodavati četvrtu boju** i ne koristiti zelenu za bilo šta interaktivno.

### Tipografija
**Bricolage Grotesque** (display) + **Archivo** (telo) + **JetBrains Mono** (vrednosti). Sva tri imaju pun `latin-ext` i **hostuju se lokalno**.

**Zašto treće pismo.** Sajt je imao sređenu skalu ali nijedan glas — Archivo je kompetentan neogrotesk bez ijednog karakterističnog reza. Bricolage ima varijabilnu **`opsz` osu (12–96)**: naslov na 120px dobija stvarno dizajnirane display forme (uže apoene, tešnji razmak, ink trap), a ne uvećan tekstualni rez. Zato svaki display element mora imati i `font-optical-sizing: auto` — bez toga osa ne radi i sve je uzalud.

Ostaje u porodici groteska, pa ne ruši sistem kao što bi serif.

**Fontovi se hostuju lokalno.** `npm run fontovi` skida varijabilne isečke sa Google Fonts u `public/fonts/` i generiše `src/styles/fontovi.css` (ne menjati ručno). Uzimaju se samo `latin` i `latin-ext` — srpska latinica je njima pokrivena, ćirilica i grčki bi bili balast. Ukupno **213 KB za tri pisma**. Ranije je stajao `<link>` ka fonts.googleapis.com koji je blokirao iscrtavanje zahtevom ka tuđem domenu; sada se unapred učitavaju samo dva isečka koja drže prvi ekran.

**PET VELIČINA, sa stvarnim skokovima.** Izmereno pre izmene na početnoj: `108 · 68 · 52 · 24 · 21 · 17 · 16 · 15 · 12 · 11`. Vrh je bio dobar, ali je sredina bila **pet veličina u pojasu od devet piksela** — to nije hijerarhija nego kaša. Sada:

```
display 44–112   naslov 30–52   istaknuto 22–28   telo 17   labela 13/12
```

Odnosi su 2,2× / 1,9× / 1,6×. **Ako nekom elementu treba veličina između, greška je u hijerarhiji, ne u skali.**

**Mono je VREDNOST, ne tekstura.** Bio je brojniji od Archiva (57 : 51 elemenata na početnoj) i time prestao da bude akcenat. Kad je sve „tehničko", ništa nije tehničko. Podela je sada stroga:

| Klasa | Za šta |
|---|---|
| `.t-labela` / `.t-labela-sm` | **imena** — nadnaslovi, uloge, kategorije, nazivi boja, navigacija, dugmad |
| `.t-mono` / `.t-mono-sm` | **vrednosti koje se čitaju mašinski** — kataloške oznake, RAL brojevi, godine, ISO kodovi, redni brojevi, telefon |

Posle izmene: mono **23**, Archivo **85** na početnoj. Svaki preostali mono element je stvarno mašinski podatak.

| Uloga | Font | Postavka |
|---|---|---|
| Display | Archivo 600 | `clamp(3rem, 8vw, 7.5rem)`, tracking `-0.03em` |
| H2 | Archivo 600 | `clamp(2rem, 4vw, 3.5rem)`, tracking `-0.02em` |
| H3 | Archivo 500 | `1.5rem`, tracking `-0.01em` |
| Body | Archivo 400 | `17px / 1.65` |
| Utility | JetBrains Mono 500 | `12px`, uppercase, tracking `+0.12em` |

### Tri arhetipa zaglavlja — ZAKLJUČANO

Izmereno pre uvođenja: **jedanaest sekcija** se predstavljalo istim potezom — nadnaslov, veliki h2, lead pasus desno. Gore od toga, **jedno CSS pravilo** je davalo trima sekcijama početne (`boje`, `izbliza`, `po-meri`) identično zaglavlje `1fr 1fr`. Otud utisak da su zamenljive.

Sada postoje tri, i sekcija bira po **ulozi**, ne po ukusu:

| | Klasa | Za šta | Gde je |
|---|---|---|---|
| **A** | `.zaglavlje-brojka` | figura **jeste** naslov — za sekcije koje definiše količina ili oznaka | „961 · Serija", „40 · godina" |
| **B** | `.zaglavlje-recenica` | jedna duga rečenica u naslovnoj veličini, bez nadnaslova i bez zasebnog leada; drugi deo se povlači u sivo (`.tiho`) | „Četiri koraka do isporuke…", „Tri bedža ne govore ništa…" |
| **C** | `.zaglavlje-labela` | samo labela, bez h2 — za sekcije koje služe, a ne govore | „Boje i materijali", „Lokacija" |

**Najviše dva istog arhetipa po strani.** Kad ih je više, arhetip prestaje da bude razlika i vraćamo se na početak. Trenutno raspored: `/` A1 B1 C1, `/o-nama` A1 B1, `/katalog` B1.

Stari obrazac (nadnaslov + h2 + lead u istoj sekciji) izmeren posle izmene: **0 na svim stranama**.

### Mreže — kolone po težini sadržaja

`repeat(N, 1fr)` je bio podrazumevan svuda: trinaest savršeno jednakih mreža. Jednake kolone teraju duži tekst da se prelama dok kraći pluta u praznini.

- **Brojke** (početna): `0.92fr 1.32fr 1fr 0.76fr` — „2.000 m²" i „Proizvodnog prostora" traže više od „3" i „ISO standarda".
- **Poziv**: `1.18fr 0.82fr` — naslov nosi više od pratećeg teksta.
- **Podnožje**: `0.82fr 1.18fr 1.05fr 0.95fr` — po broju redova koje kolona nosi.
- **Forma na `/kontakt` ostaje `1fr 1fr`** — asimetrija u parovima polja je loš UX, ne dizajn.

### Vremenska linija — vreme se PROLAZI

Bila je red od četiri jednake ćelije, pa dijagonala (svaka tačka niže od prethodne). Dijagonala je bila napredak, ali su se sve četiri i dalje videle **odjednom** — četrdeset godina kao jedan pogled.

Sada se na desktopu **godine zalepe** sa strane, sve četiri istovremeno, dok sadržaj prolazi pored njih. Aktivnu bira isti posmatrač kao u „Izbliza" (pojas `-45% 0 -45%`), pa je aktivna uvek tačno jedna.

- **Godina se ne ponavlja u obe kolone** — na širokom je nosi šina, u stavci je sakrivena. Time šina postaje nužna, a ne ukras.
- **Tekst se NE prigušuje kao u „Izbliza".** Tamo je podloga tamna; ovde bi `--color-siva` na 0,32 pao daleko ispod AA. Aktivnost nosi šina, tekst ostaje pun.
- Ispod 1000px lepljenja nema (nema gde), pa godina i marker stoje u samoj stavci, uz progresivno uvlačenje — mobilni ima svoj potez, ne osiromašen desktop.

> **Ponovljena greška, zapisana da bude poslednja: `align-items: start` na mreži.** Sa njim se leva kolona ne rastegne na visinu reda, lepljivi blok nema kroz šta da putuje i sekcija se samo skroluje. Ovo je **isto pravilo koje već stoji uz „Izbliza"**, i svejedno sam ga ponovio. Izmereno pre ispravke: put **−366px**, zalepljen u **0 od 17** uzoraka. Posle: put **549px**, blok miruje na 144px kroz **7 od 17** uzoraka.

Cena je mala: sekcija 819px → **1103px** (0,91 → 1,23 ekrana), cela strana +285px. Redosled godina provereno 4/4, bez preskoka.

> **Bez JS-a je šema udaljenosti bila NEVIDLJIVA** — 8 elemenata na `opacity: 0` i `stroke-dashoffset: 1`, jer ih pali `data-vidljiv` koji upisuje skripta. Nađeno usput, pri proveri ove sekcije. Ispravka je `:global(.no-js)` grana koja crtež ostavlja gotov. `:global()` je obavezno jer `.no-js` stoji na `<html>`, izvan komponente — ista zamka koja je već jednom oborila hero (sekcija 5b).

### Mreža proizvoda — nosilac grupe

Pedeset četiri kartice iste veličine čitale su se kao tabela. Prva kartica u svakoj podkategoriji sada zauzima **dve kolone** (izmereno 631px prema 297px na 1440).

- Zaštita je `:has(> .kartica:nth-child(3))` — potez se pali samo kad grupa ima bar tri stavke. U grupi od jedne ili dve bi dupla kartica izgledala kao greška u rasporedu.
- Kadar nosioca je **širi (16:7), ne veći**. `object-fit: contain` ne seče, pa proizvod ostaje ceo i samo dobija više prostora, a red ostaje razumne visine.
- Mreža ima `align-items: start` — dno reda je namerno nazubljeno, kao u časopisu, ne poravnato kao u tabeli.

### `/proizvodi` — kategorija je MESTO, ne podnaslov

Prikazuje se tačno jedna kategorija, pa je njen naslov zapravo naslov strane u tom trenutku — a stajao je u istoj veličini kao bilo koji `h2` (izmereno 52px, glava 75px). Sada ime ide u sopstvenu razmeru (`clamp(2.25rem, 4.6vw, 4rem)`), a ispod crte stoji red sa brojem proizvoda i **imenima podkategorija** — pregled onoga što je u kategoriji, pre skrola.

> **Preko celog ekrana je PROBANO NA PAPIRU I ODBAČENO — merenjem.** Prva kartica je već na **0,73 ekrana** (mobilni 0,80), jer iznad stoji uvod strane. Pun ekran bi je odgurao na **~1,7 ekrana** — dva ekrana skrola pre ijednog proizvoda, na strani čiji je jedini posao da se proizvod nađe. To je originalnost koja smeta.
>
> Izvedena verzija košta **+41px** (0,73 → 0,78 ekrana), a naslov je porastao 52 → 64px.

Gornja granica veličine namerno staje **ispod** `h1` „Ponuda": dve pune display vrednosti na istoj strani bi se tukle. Ovo je svesno odstupanje od pravila „nema međukoraka u skali" — zapisano da se ne ispravlja kao greška.

### Kontakt — kolona podataka svedena brisanjem

Mereno na toj strani: **telefon se pojavljivao 4×, radno vreme 3×** (uvod strane, kolona podataka, podnožje). Otkad uvod nosi broj u display veličini (120px), ponavljanje istog broja 80px niže u sitnom slogu ga samo slabi.

Kolona je sa **četiri bloka svedena na dva**, i to brisanjem, ne dodavanjem: blokovi „Telefon" i „Radno vreme" su uklonjeni jer podatak stoji u uvodu i u podnožju. Ostaju **adresa kao nosilac** (jedini podatak koji strana nigde drugde ne daje u punom obliku, 27px) i **mapa ispod nje kao potvrda te adrese**, ne kao ravnopravna kolona.

Adresa namerno ostaje ispod naslovne veličine uvoda — dve display vrednosti na istoj strani bi se tukle.

### Kontakt forma — bela ploča: STAKLO UKLONJENO

**`backdrop-filter: blur(26px)` sa tri svetlosne kugle je PROBANO I UKLONJENO.** Bio je jedini element na sajtu koji pripada drugom trendu i drugoj godini — sve ostalo je oštro, bez zaobljenja i bez dekorativnih senki. Korisnik ga je prvobitno tražio i odobrio uklanjanje 2026-09-14.

Zamenjeno onim što u pravcu „Sala" zaista radi: **čista bela ploča uvučena u zeleni blok.** Kontrast bele na hirurškoj zelenoj je sam po sebi efekat; staklo ga je ublažavalo.

Tri posledice koje se lako previde, sve tri izmerene:

| | pre (na staklu) | posle (na beloj ploči) |
|---|---|---|
| tekst labela | belo, 4,93:1 | `--color-celik`, **17,54:1** |
| primarno dugme | izvrnuto u **belo** (plava na zelenoj = 1,11) | natrag u **plavu**, 5,31:1 — izuzetak više ne važi |
| upozorenje | svetli jantar `#F0B357` na tamnoj pločici | tamni jantar `#8A5A0B`, **5,92:1** — svetli bi na beloj dao 1,9:1 |

Crvena i dalje ne dolazi u obzir (korisnikova odluka); jantar ostaje, samo u nijansi koja radi na beloj.

### Polje — sadržaj ne počinje uvek u istoj koloni

Izmereno pre uvođenja: naslov **svake** sekcije na **svih šest** strana počinjao je na istoj vertikali (72px na 1440). Kroz 6.500px skrola oko nije imalo nijedan razlog da se pomeri levo ili desno.

Rečnik je namerno kratak — četiri poteza, a ulogu bira sekcija, ne ukus:

| Klasa | Za šta |
|---|---|
| (bez klase) | sekcija koja **nosi** — puna leva ivica |
| `.kol-2` / `.kol-3` / `.kol-4` | sekcija koja **prati** — uvučena za 1, 2 ili 3 kolone |
| `.istureno` | naslov ili labela koja se **otkida** — viri u marginu |
| `.preko-svega` | traka preko cele širine, bez `.shell`-a |

Ispod 900px sve pada na levu ivicu: na uskom ekranu uvlačenje jede meru reda i čita se kao greška.

**Dve zamke, obe izmerene:**

- **Rečnik polja stoji NAMERNO izvan `@layer`.** Sloj po definiciji gubi od svakog neslojevitog pravila, a stilovi u .astro fajlovima nisu u sloju. Dok je stajao u `@layer components`, `.odeljak-naslov { margin: 0 0 … }` ga je tiho gasio.
- **Klasa polja NE SME stajati na samom `.shell`-u.** Procenat se računa od roditelja, a `.shell` već ima `max-width` i `auto` marginu — rezultat je izlazak iz ekrana (izmereno 120px na `/katalog`). Uvek se ugnježdava: `<div class="shell"><div class="kol-2">…`.
- **Komponenta koja sme da dobije klasu polja MORA koristiti `margin-block`, ne skraćenicu `margin`.** Skraćenica postavlja i bočne margine na 0 i gasi `.kol-*` i `.istureno`. Pogođeni su bili `.odeljak-naslov`, `.citat` i `.brojke`.

### Razmak
`.section` i `.section-tight` u `global.css` su jedini vlasnici vertikalnog razmaka između sekcija. Vrednost je **po jednoj strani** — kad se dve sekcije nadovežu, vidljivi razmak je dvostruk.

| Širina | Padding sekcije | Vidljivi spoj |
|---|---|---|
| 375px | 56px | 112px |
| 1440px | 86px | 173px |
| 1920px | 88px | 176px |

**Razmak po težini — dva modifikatora.** Pre izmene je svaka `.section` imala 86,4px gore i dole, svaka `.section-tight` 64/64 — sekcija od 2.170px i sekcija od 282px dobijale su identično vazduha. To je otkucaj, ne ritam.

| Klasa | Ponašanje |
|---|---|
| `.section-glasna` | mnogo vazduha **pre**, skoro nimalo **posle** — sekcija se najavi tišinom, a sledeća stigne prebrzo. Napetost je namerna. |
| `.section-uz` | stisnuta uz prethodnu, pun razmak posle — čita se kao nastavak, ne kao nova tema. |

**Najviše jedna `.section-glasna` po strani.** Kad ih je dve, nijedna nije glasna. Trenutno: „Izbliza" na početnoj, vremenska linija na `/o-nama`. Izmereni ritam početne: `0/32 → 29/86 → 86/86 → 158/29 → 86/86 → 86/86`.

Ne dodavati `padding-top` unutar sekcije koji ponavlja isti posao — to je već jednom napravilo rupu od 372px. Ako sekcija ima hairline crtu na vrhu, razmak ispod nje je najviše ~2rem.

### Hijerarhija proizvoda
Odluke donete posle analize LINET-a, Stiegelmeyer-a i Getinge-a (vodeći proizvođači u niši):

- **Hero naslov je preuzet sa reference, doslovno:** „Naše iskustvo garantuje naš kvalitet." + „Sa vama više od 39 godina". Nadnaslov je njihov h1 („BSP · Proizvodnja medicinske opreme"), dugme njihov CTA („Pogledajte naše proizvode"). Jedina izmena je iz VERZALA u rečenični slog — Archivo na display veličini se u verzalu slabo čita. **Probano je da hero vodi imenovan proizvod (serija 961) i odbačeno je** — ne vraćati bez izričitog traženja.
- **Kartica proizvoda vodi kataloškom oznakom.** Oznaka krupno (`961-5`), tip proizvoda kao podnaslov. Iz naziva se skida kod da se ne ponavlja — 51 od 54 naziva se očisti automatski, ostala 3 ostaju cela.
- Zbog toga placeholder više **ne** ispisuje oznaku unutar kadra: nosi je kartica i ostaje i posle zamene fotografijom.

**Opis proizvoda u herou je strogo u granicama potvrđenih činjenica** (elektro izvedba, čelični profili, eko-koža, izrada po meri). Prava klinička korist — opseg visina, uglovi naslona, nosivost — traži podatke od klijenta i tek onda ide u copy.

### Pravac pokreta: „Merenje" — ZAKLJUČANO

Pokret nije ukras. Firma prodaje preciznost, pa se i motion ponaša kao instrument: nešto se **izmeri**, pokaže i skloni.

> **Kote su PROBANE I UKLONJENE.** Nad proizvodom su u herou i u „Izbliza" stajale
> iscrtane kote sa dimenzijama (`stroke-dasharray` animacija, `--color-zelena`).
> Korisniku se taj detalj nije dopao i **sve je obrisano** — markup, CSS, tajmlajn
> u `motion.ts` i vezivanje uz specifikacije. Ne vraćati bez izričitog traženja.
> Pravac „Merenje" i dalje važi, ali se izražava kroz skrol režiju (sekcija ispod),
> ne kroz crtane linije.

**Otkrivanje ima pravac.** Ranije je svih 88 elemenata ulazilo istim pokretom odozdo. Sada `data-smer` deli ulaz po osi:

| Atribut | Pokret | Za šta |
|---|---|---|
| (bez) / `data-smer="y"` | odozdo, 0.7s `power2.out` | naslovi, brojači, kartice |
| `data-smer="x"` | s leva, 0.75s `power3.out` | redovi tabela, dimenzije, specifikacije — kota se izvlači, ne pada |
| `data-smer="mir"` | samo opacity, 0.9s | uvodni pasusi; tekst koji se čita ne treba da se kreće |
| `data-maska` / `data-maska="x"` | `clip-path`, 0.95–1s | naslovi sekcija |

Izmereno posle izmene: `{y: 64, x: 16, mir: 8}` — udeo istog pokreta pao sa 100% na 73%.

**Jedna lampa, ne 54.** Nad mrežom proizvoda stoji **jedan** `radial-gradient` na `.mreza::before` koji prati pokazivač preko `--mx`/`--my` (rAF, `pointermove`). Ranije je svaka kartica imala svoj `data-svetlo` sa ScrollTrigger scrub-om — 54 okidača, a hover ni tada nije radio jer je scrub upisivao inline stil koji CSS hover ne može da nadjača. Ograničeno na `(hover: hover) and (pointer: fine)`.

**Zastavica `data-vidljiv`.** Kad `otkrij()` pusti element, upisuje mu `data-vidljiv`. Sam ulaz vozi GSAP; zastavica je signal potomcima da je red na njih (iscrtavanje mape, markeri vremenske linije) — bez još jednog posmatrača po efektu.

### Prelaz između strana — ZAKLJUČANO

`ClientRouter` je uključen u `Layout.astro`. Kartica proizvoda i njegova strana dele `view-transition-name` (`slika-<slug>` i `oznaka-<slug>`), pa fotografija i kataloška oznaka **putuju** iz mreže na stranu proizvoda. Ista imena nose i kartice „Iz iste kategorije", pa i prelaz sa proizvoda na proizvod klizi.

Izmerena trajanja pri kliku na karticu:

| Sloj | Trajanje | Zašto |
|---|---|---|
| `::view-transition-group(*)` | 550ms | putanja predmeta — predmet se premešta, ne menja |
| `::view-transition-old/new(*)` | 300ms | stapanje snimaka; kratko da se ne vidi duh |
| `::view-transition-old(root)` | 260ms | stara strana odlazi brže… |
| `::view-transition-new(root)` | 460ms + 40ms | …nego što nova dolazi, pa se ne vidi trenutak kad su obe na pola puta |

Imena su **jedinstvena po strani** — provereno nad svih 60 izgrađenih strana, 0 duplikata. (Duplikat imena browser kažnjava tako što prelaz **potpuno preskoči**.)

Ne davati `transition:name` naslovu koji već ima `data-maska`: maskirano otkrivanje i prelaz bi se preklopili i oznaka bi krenula dvaput. Zato `h1` na strani proizvoda nema `data-maska`.

### 4b. Životni ciklus skripti — OBAVEZNO

**Ovo je najskuplja posledica View Transitions i lako se previdi.** Telo strane se menja bez novog učitavanja, pa:

- modul skripta strane **ne pokreće se ponovo** — stara ostaje u memoriji sa referencama na elemente kojih više nema;
- osluškivači na `window`/`document`, posmatrači i tajmeri **nadživljavaju** zamenu i nakupljaju se;
- swap prepisuje atribute `<html>` iz novog dokumenta, pa se `class="no-js"` **vraća** — bez ispravke bi posle prve navigacije sve ostalo zaključano u no-js grani.

Rešenje je `src/scripts/zivot.ts`:

```ts
naSvakojStrani(() => {
  ...telo skripte...
  return () => { /* skini samo ono što nadživi telo strane */ };
});
```

Funkcija se poziva na svakom prikazu (i na prvom — `astro:page-load` puca i tada), a vraćeni čistač radi pred zamenu. **Čisti se samo ono što nadživi telo:** osluškivač okačen na dugme unutar tela odlazi zajedno sa dugmetom, i ne treba ga skidati.

Prevedeno: kroz ovo prolazi svih pet skripti strana (`index`, `proizvodi`, `[slug]`, `kontakt`, `Header`). `motion.ts` ima isti ciklus ručno — uz to **Lenis se pravi iznova za svaku stranu**, jer swap skida klase `lenis lenis-smooth` sa `<html>` pa bi glatki skrol ostao upisan u JS a ugašen u CSS-u. Osluškivač za sidra (`a[href^="#"]`) visi na `document` i postavlja se **tačno jednom**.

Provereno posle klijentske navigacije: lupa radi i drugi put na drugom proizvodu (`data-zum`, faktor 1.59), lampa se pali (`--mx: 40%`), konfigurator boja otvara panel (588px), brojači odbrojavaju (39 / 2.000 / 54 / 3), „Izbliza" drži stavku i kotu u paru (3/3), forma i dalje ne glumi uspeh nego upućuje na telefon. Sedam navigacija, 0 grešaka u konzoli.

### Sažimanje prikaza — ZAKLJUČANO
Obe liste su namerno sažete jer su strane bile predugačke:

- **Početna, „Šta proizvodimo":** akordeon. Dvanaest kategorija stoji sažeto, klik otvara ponudu te kategorije. Otvorena je **najviše jedna**. Raniji lepljivi pregled sa desne strane je uklonjen.
- **`/proizvodi`:** indeks kategorija ostaje levo, u sredini se prikazuje **samo jedna kategorija**. Efekat: desktop 12.521px → 3.052px, mobilni 21.767px → 5.025px.

**Progresivno, u oba slučaja:** server renderuje sve vidljivo, JS sakriva višak. Bez JS-a strane rade i imaju sav sadržaj. Sidra (`/proizvodi#hirurgija`) rade kao deep link i menjaju prikazanu kategoriju.

### Hero: fotografija preko celog ekrana — ZAKLJUČANO

**Slika:** `src/assets/hero-hala.jpg` (1376×768, 16:9) — bolnički krevet u proizvodnoj hali. Stigla kao `.jfif`; preimenovana jer Astro `.jfif` ne uvozi.

**Fotografija je POZADINA prvog ekrana, ne slika u koloni.** Prva verzija ju je stavila u okvir u donjem desnom uglu (petina ekrana) — korisnikova primedba je bila tačna: fotografija hale tako ne može da bude ono što jeste.

> **Sloj, ne ćelija.** `.hero-foto` je NAMERNO izuzet iz `.hero-scena > *  { grid-area: 1/1 }`. Dok je bio grid item, `inset: 0` se računao od ćelije, pa je slika stajala unutar razmaka scene — izmereno **72,117 / 1368×783** umesto pune scene. Uz to mora `left: calc(50% - 50vw); width: 100vw`, jer je scena centrirana i široka najviše 1560px: bez toga na 1920px ekranu ostaje po 180px bele sa strane.

#### Hero je LEPLJIV — bez toga kamere nema

`.hero` je visok **175svh**, a `.hero-lepljivo` stoji (`position: sticky; top: 0; height: 100svh`). Skrol kroz razliku od **75svh** vozi kameru dok kompozicija miruje.

> **Zašto:** bez lepljenja se kamera pomera DOK slika napušta ekran. Provereno snimkom: na 55% skrola je hero već bio prošao, a na 75% je od fotografije ostalo 347px. Sav taj pokret niko ne vidi.

> **Okidač ide do `bottom bottom`, ne `bottom top`.** `bottom top` bi razvukao kameru preko cele visine sekcije, pa bi se druga polovina odigrala u odlasku. Sa `bottom bottom` cela kamera stane u lepljivu fazu.

75svh, ne 100svh — jedan zamah točka je dovoljan da se potisak pročita, više bi bilo kočnica pred sadržajem.

#### Četiri pokreta, izmereno (1600×900, lepljiva faza 675px)

```
  0%  scale 1.000  y   0  veo -6%      tekst    0  opacity 1.00
 25%  scale 1.035  y  -6  veo -6%      tekst  -50  opacity 0.75
 50%  scale 1.070  y -11  veo -15.3%   tekst  -99  opacity 0.50
 75%  scale 1.105  y -16  veo -30.6%   tekst -148  opacity 0.25
100%  scale 1.140  y -22  veo -46%     tekst -198  opacity 0.00
```

1. **odlazak tipografije** — `y −198`, opacity do **NULE** (ne 0.06: na beloj podlozi je bilo nevidljivo, preko fotografije se čita kao mrlja od slova)
2. **potisak kamere** — `scale` 1.00 → 1.14 oko tačke NA KREVETU
3. **povlačenje vela** — izvor svetla odlazi levo van ekrana, mirna zona nestaje
4. **razrešenje** — crta „Brojki" se izvlači kad lepljenje popusti

#### Zašto to nije zum

`scale(1) → scale(1.2)` se čita kao uvećanje slike. Kamera koja prilazi radi dve stvari: predmet raste, a okolina beži OKO njega. Dobija se **skaliranjem oko tačke na krevetu** (`transform-origin: 73% 65%`, izmereno) uz mali uspravni pomeraj.

Pomeraj je `y`, **ne `object-position`** — `object-position` na slici preko celog ekrana pravi ponovno iscrtavanje svakog frejma, dok `transform` ostaje na kompozitoru. Isti optički rezultat, bez cene.

#### Udarac ide na UČITAVANJE, ne na skrol

Skrol režija je uklonjena namerno. Korisnikova formulacija: *„to što se pomera pri skrolu ne znači ništa jer kad neko skroluje dole, neće se više vraćati da bi video efekat."* Tačno — sav trud u skrol sekvenci je nevidljiv drugi put.

**BLENDA.** Fotografija je pri učitavanju vodoravna traka na sredini (`clip-path: inset(44% 0)`) i otvara se na pun ekran. Istovremeno se sama slika smiruje iz `scale 1.09` — ne zumira, nego **staje**. Naslov kreće DOK se blenda još otvara, pa deluje kao da ga je otkrila ona.

Izmereno (1440×900):

```
 150ms  blenda 43.8%  slika 1.058  veo 0.00  naslov 0.00
 400ms  blenda 35.2%  slika 1.024  veo 0.72  naslov 0.00
 700ms  blenda  2.9%  slika 1.006  veo 0.98  naslov 0.88
1000ms  blenda    0%  slika 1.001  veo 1.00  naslov 0.99  dugme 0.76
1300ms  MIR
```

Na skrol ostaje samo **tihi parallaks** (`scale 1.07`, `yPercent 4`, tačka na krevetu `58% 62%`) — sloj koji se kreće drugom brzinom od teksta čita se kao da je dalje. To je dubina, ne priča.

#### Veo je SVETLO, ne preliv

Prva verzija je bila linearni preliv pod 100° i videla se kao **dijagonalna ivica** — leva trećina se čitala kao izbledela fotografija, a ne kao ista fotografija.

Sada je **radijalni izvor svetla iza leve ivice ekrana**. Radijalni pad nema pravac, pa nema ni vidljive granice — čita se kao svetlo koje ulazi kroz prozor hale.

Jačina je podešena **merenjem, ne okom**. Prva verzija je bila 3–5× jača nego što treba (naslov 5,1–15,6:1 pri pragu od 3:1). Probane su tri jačine; uzeta je **najslabija koja prolazi** — cilj je najmanji veo koji drži čitljivost, jer svaki jači pojede fotografiju.

`--veo-x` pomera izvor svetla; režija ga na skrol odvodi sa −6% na −46%.

> **Telefon na `/kontakt` ide u DISPLAY pismo, ne u mono** (ispravljeno 2026-09-15). Mono je bio izbor jer je telefon mašinski podatak, ali na 120px JetBrains Mono pokazuje poreklo: **nula ima tačku u sredini** i izgleda kao slovna greška, a tabularne cifre prave rupu između „013" i „348844". Pravilo „mono = mašinska vrednost" važi za sitan slog; na display razmeri broj je izjava.

> **Mobilna lepljiva faza heroja je 35svh, ne 75svh.** Na desktopu je 633px jedan zamah točka; na telefonu je nekoliko poteza prstom u kojima se samo slika uvećava. Sada 295px — kamera stigne za jedan potez.

#### Beli veo — obavezan, i izmeren

Tekst stoji PREKO fotografije. Leva strana slike nosi udaljenu opremu i prozore na kojima crni tekst pada. Veo je **linearni preliv u boji same strane** (`--color-sala`), s leva udesno, providan od 62%. **Beo, ne crn** — sajt je beo, pa se čita kao svetlo koje pada, a ne kao ploča ispod teksta. Na uskom ekranu se okreće odozdo naviše, jer tekst tamo stoji ispod naslova preko cele širine.

Izmereni najgori kontrast ispod GLIFOVA: **1920 → 4,88:1 · 1440 → 7,48:1 · 1180 → 6,69:1 · 390 → 12,12:1.** Sve prolazi AA.

> **Zamka pri merenju:** `getBoundingClientRect()` na `[data-hero-red]` vraća punu širinu reda (1026px na 1440), a slova idu samo do 573px. Merenje tog okvira zahvata fotografiju DESNO od teksta i lažno prijavi pad na 1,00:1. Kontrast preko slike se meri **`Range.getBoundingClientRect()`**, ne okvirom elementa.

> **Pomeranje kadra za pokazivačem je PROBANO I UKLONJENO** (2026-09-15). Na fotografiji preko celog ekrana pomeraj prati miš i po tekstu, a tekst koji mrda dok se čita je smetnja, ne dubina. Hero nosi utisak blendom pri učitavanju i kamerom na skrol — treći pokret vezan za miš je bio višak. Ne vraćati.

#### Raster i nagib

**Raster (četiri hairline linije) je UKLONJEN** — pozadinska ravan je sada sama fotografija; preko nje bi se linije videle samo na belom velu i izgledale kao greška.

**3D nagib je zamenjen POMERANJEM.** Na fotografiji preko celog ekrana rotacija se vidi kao izobličenje po ivicama. Sada se kadar pomera najviše 8px suprotno od pokazivača (tipografija upola manje, u istu stranu) — pogled kroz prozor. Pomeraj ide na `.hero-blenda`, jer `.hero-slika` već nosi skrol parallaks. `.hero-blenda` ima `inset: -14px` kao rezervu, inače bi se pri pomeraju videla bela ivica.

#### REZOLUCIJA — izvor je premali za pun ekran

Izvor **1376×768**. Preko celog ekrana slika se renderuje mnogo veća nego u okviru:

| | slika (css) | @1x | @2x |
|---|---|---|---|
| 1180 | 1208 | **106%** ✓ | — |
| 1440 | 1468 | **88%** ~ | 44% ⚠ |
| 1512 | 1540 | — | 42% ⚠ |
| 1920 | 1948 | **66%** ⚠ | 33% ⚠ |
| 390 (mobilni) | 418 | — | **103%** ✓ (@3x) |

**Pun ekran je ispravna dizajnerska odluka, ali ovaj fajl je premali za nju iznad ~1200px.** Za oštrinu na 1920@1x treba **≥2100px**, a razumna gornja granica je **2560px** (123% na 1920@1x). Ne uvećavati postojeći fajl.

#### Mobilni

Fotografija ostaje preko celog ekrana; veo se okreće odozdo naviše. Hero staje u jedan ekran **na svim proverenim telefonima, uključujući iPhone SE** — slika više nije blok koji dodaje visinu nego sloj ispod sadržaja.

### Hero: „Scena" — ZAKLJUČANO

Hero nije raspored 50/50 nego **pozornica sa tri ravni dubine pod jednom kamerom**. Ravni se razlikuju po BRZINI, ne po boji:

| Ravan | Šta je | Ponašanje na skrol |
|---|---|---|
| pozadina | raster — četiri hairline linije, iscrtavaju se pri učitavanju | `y +47px`, opacity → 0,35 (najsporija) |
| sredina | proizvod, izlazi van desne ivice ekrana | `scale` 1 → 1,14, `y −27`, `blur` 0 → 5px |
| prednji | tipografija i kontrole | `y −198px` (najbrža) |
| donja ivica | traka činjenica | `y +56px` — **suprotno od svega ostalog** |

**Potpisni trenutak (učitavanje).** Kadar je u CSS-u letterbox traka `inset(38% 0)`. Otvara se na punu visinu za 1,5 s dok se proizvod smiruje iz `scale 1.12`, raster se crta odozgo naniže (stagger 0,07), redovi naslova izlaze iza svojih maski. Ukupno ~1,8 s — **pa potpun mir**. Mereno: `inset(38%) → 18,1% (900ms) → 0% (1800ms)`.

**Nagib na pokazivač.** Do **2,2° po Y i 1,3° po X**, tipografija se pomera suprotno za ±7px. Samo uz `(hover: hover) and (pointer: fine)` i od 1000px naviše. Vraća se na nulu pri izlasku pokazivača.

**Predaja u sledeću sekciju.** Hairline crta sekcije „Brojke" nosi `data-predaja` i **ne crta je `motion.ts` na ulazak u kadar** nego režija, vezano za IZLAZAK heroja (poslednjih 45%). Dve sekcije tako dele jedan potez umesto da se smenjuju. Mereno: `scaleX 0 → 0,33 → 1` kroz izlazak heroja.

#### Geometrija — izmereno, ne procenjeno

**Tekst i proizvod se NE smeju preklopiti.** Probano je da naslov stoji preko fotografije i **odbačeno na osnovu merenja**: treći red je padao na **1,35:1** na 1440px i 1,6:1 na 1180px — sleteo bi na tamni deo kreveta.

Profil tadašnje fotografije (`hero-961.jpg`, 1328×800 — fajl je od 2026-09-16 obrisan), izmeren po pikselima:

| | vrednost |
|---|---|
| predmet po visini | 12,1% – 96,4% |
| predmet po širini | 7,3% – 92,6% |
| gornjih 10% kadra | gustina **0** (prazno) |
| levih / desnih 10% | 0,079 / 0,078 (gotovo prazno) |

Otud dve odluke: proizvod sme da izađe **preko desne ivice** (rez ne odseca predmet), ali tekst nema gde da se preklopi s njim.

- **Leva granica proizvoda je 62% širine SADRŽAJA**, ne ekrana. `.hero-scena` zato nosi geometriju `.shell`-a (ista širina, isti razmak od ivice). Sa procentima ekrana ne bi radilo: preko 1560px se shell centrira, pa 62% ekrana i 62% sadržaja prestanu da budu isto mesto — izmereno kao razmak od **1px** na 1920.
- **Naslov se lomi u ČETIRI reda**, ne tri. Sa tri je najduži red 729px (1440) i ne može da se izmakne proizvodu; sa četiri je 605px. Copy je nepromenjen — menja se samo gde se lomi.
- **Izmereni razmak naslov ↔ proizvod:** 113px (1024) do 330px (1600). Najgori kontrast bilo kog teksta preko podloge: **14,2:1**.
- **Hero staje u TAČNO jedan ekran** na 1024×768, 1180×800, 1280×800, 1440×900, 1600×900 i 1920×1080. I veličina naslova i gornji razmak su ograničeni `svh`-om, ne samo `vw`-om — bez toga je scena ispadala 10–131px viša od ekrana.
- Ispod 1000px proizvod se vraća u tok ispod teksta, a raster se gasi.

### Hero — obojen: PROBANO I VRAĆENO
> **Nauk iz vraćanja:** brisanje celog CSS bloka po markerima je odnelo i
> `.hero-mreza { display: grid }`, pa su se kolone složile jedna ispod druge i
> slika je „pobegla" u sledeću sekciju. `npm run meri` to NE hvata — prijavljuje
> 0 nevidljivih i 0 grešaka. Posle svakog vraćanja proveriti da svaka klasa iz
> markupa i dalje ima svoje pravilo, pa izmeriti geometriju kolona.

Po referenci je hero bio obojen (leva `#DDEBF4`, desna `#B7D4E8` preko cele visine), sa providnim zaglavljem, providnom PNG slikom i lebdećim pločicama. **Sve je vraćeno na staro** na zahtev korisnika. Ne obnavljati bez izričitog traženja.

Ostaje zabeleženo za slučaj da se vrati:
- „Tamno plava" sa reference nije mornarska — obe strane su iz iste svetle porodice, razlika polja svega 1,27:1.
- Polje ide preko **cele visine heroja**, ne samo oko proizvoda.
- **Bela dugmad ne rade** na svetlo plavoj: 1,22:1.
- Slika mora biti providan PNG (`bezStapanja`); tadašnja `hero-961.jpg` je imala belu pozadinu i `multiply`.
- `.hero` traži `overflow-x: clip` ako polje ide do ivice ekrana.

### Sekcija „Boje i materijali"
- Paleta stoji **sklopljena**; otvara je dugme „Kliknite za boje" (smooth dropdown, GSAP visina). Sekcija je time mirna dok je niko ne traži.
- Prefarbavanje ide **čistim CSS-om preko `:has()`**, pa kombinacija radi i bez JS-a. JS ispisuje izbor, gradi vezu ka upitu i služi kao rezervni put ako `:has()` nema.
- Klasa `svetlo` ide **na sam crtež**, nikad na kolonu — kontaktna senka se računa od dna elementa, pa bi sa kolone pala preko teksta i dugmeta ispod.
- Kombinacija se prosleđuje na `/kontakt?ram=…&tapacirung=…` i tamo upisuje u poruku.
- **Uzorci su fiksnih 68px u `flex-wrap`, ne u auto-fill mreži.** Ranije su bili 99px pa je u red stajalo šest: osam nijansi rama davalo je red od 6 i drugi red od samo 2, sa velikom rupom desno. Dvokolonski raspored sekcije kreće tek od **1200px** — ispod toga leva kolona nije dovoljno široka za pun red uzoraka. Ako se menja broj boja, proveriti raspored redova kroz `npm run meri`.

### Mape
- **Kontakt:** mapa stoji uz samu adresu u koloni sa podacima, u odnosu 4:3, **u boji** (bez sivog filtera — putevi, zelenilo i voda se brže čitaju kad su odvojeni bojom). Zasebna sekcija preko cele širine je uklonjena.
- **Podnožje:** mapa u gornjem redu, desno od znaka, 16:9 sa `max-height: 260px`.
- Footer prima `aktivna` i **ne prikazuje mapu na `/kontakt`** — dva Google Maps iframe-a na istoj strani su suvišna i skupa. Oba su `loading="lazy"`.

### Zaglavlje
Telefon u navigaciji nosi **plavu podlogu sa belim tekstom i ikonicom**, ne sivu mono labelu — telefon je primarni kanal za upit i mora da se vidi.

### Tipografska preciznost
U minimalnom pravcu nema iza čega da se sakrije, pa je ovo u `global.css` kao baza:

- **Prelamanje reči:** `hyphens: auto` na `p, li, dd, address, figcaption, blockquote`, sa `hyphenate-limit-chars: 7 4 3` (reč min. 7 slova, 4 ostaju, 3 prelaze). Naslovi i mono labele imaju `hyphens: manual` — **naslov se nikad ne prelama crticom**.
  *Napomena:* da li se prelamanje stvarno dešava zavisi od rečnika u pregledaču. Provera u headless Chrome-u je bila neuverljiva — tamo nema rečnika ni za engleski, pa test ništa ne dokazuje. Svojstvo je bezopasno: gde rečnika nema, ne radi ništa.
- **`text-wrap: pretty`** na proznim blokovima (sprečava usamljenu reč u poslednjem redu), `text-wrap: balance` na naslovima.
- **`hanging-punctuation: first last`** na `html` — trenutno radi samo u Safariju, drugde bezopasno.
- **Tabularne cifre** na `.t-mono` i `.t-mono-sm`.
- **Optičko poravnanje:** `.t-mono` ima `margin-inline-end: -0.12em`, `.t-mono-sm` `-0.14em`. `letter-spacing` dodaje razmak i iza poslednjeg slova, pa labela poravnata udesno vizuelno visi ulevo. Isto i na `.btn`, kroz umanjen desni padding.
- **Broj i jedinica se ne razdvajaju:** `white-space: nowrap` na `.cifra` („2.000 m²") i na telefonu u zaglavlju.

### Tri krive pokreta — ZAKLJUČANO

Izmereno pre izmene: `--ease-sala` je bila korišćena **53 puta**, sve ostale krive zajedno ~19. Kad je sve meko i sporo, ništa nije meko i sporo — nestaje kontrast. Nijedan element nije delovao **teško**, nijedan **hitro**.

| Token | Kriva | Za šta |
|---|---|---|
| `--ease-dolazak` | `cubic-bezier(0.22, 1, 0.36, 1)` | ono što **stiže** — otkrivanje, ulazak, parallax. Brzo krene, dugo se smiruje. |
| `--ease-instrument` | `cubic-bezier(0.62, 0.01, 0.2, 1)` | ono što se **otvara i zatvara** — maske, `clip-path`, kadar, prelaz strane. Simetrična: pokret ima i početak i kraj, kao blenda. |
| `--ease-sprava` | `cubic-bezier(0.3, 0.75, 0.1, 1)` | ono što se **pritiska** — dugmad, strelice, podvlake, lupa. Kratko i tvrdo staje; sprava ne lebdi. |

`--ease-sala` ostaje kao alias za `--ease-dolazak` da se ne razbije 53 mesta odjednom. Nova imena se koriste tamo gde je uloga jasna. Trajanja za spravu su i **skraćena** (0,55s → 0,4s; 0,5s → 0,36s) — sporo dugme je sporo dugme, bez obzira na krivu.

### Mobilni ima SVOJE poteze, ne ostatke desktopa

Izmereno pre izmene na 390px: raster `none`, vodoravna traka `false`, nagib `none`, dijagonala `[0,0,0,0]`, nosilac grupe „ista veličina". **Pet od pet potpisnih poteza isključeno**, naslov 40px umesto 120px. Mobilni je bio definisan **oduzimanjem**.

Sada tri poteza koji su na dodiru **bolji nego na mišu**, ne siromašniji:

| Desktop | Dodir |
|---|---|
| koraci — vožnja skrolom (`sticky` + scrub) | **običan uspravan niz** — vidi „Vodoravna traka je UKLONJENA sa dodira“ ispod. Prevlačenje prstom je probano i odbačeno. |
| vremenska linija — dijagonala kroz kolone | **progresivno uvlačenje** (0 / 1,5 / 3 / 4,5rem) — isti podatak, sredstvo koje uspravan niz dozvoljava |
| nosilac grupe — dve kolone | **viši kadar** (4:3 umesto 5:3) — ista uloga, drugo sredstvo |

Naslov heroja: donja granica podignuta sa `2.5rem` na **`3.2rem`** (≈51px na 390px). Na niskim telefonima se steže RAZMAK, a tipografija ne — naslov je primarna izjava i poslednje što ustupa prostor.

**Mereno na pravim uređajima:** 13 mini, iPhone 14, 14 Pro Max, Galaxy S22 i Pixel 7 — hero staje u tačno jedan ekran. **iPhone SE (375×667) prelazi za 123px** i to je svesna odluka: alternativa je plašljiv hero na svim ostalim telefonima.

#### Tri ispravke sa pravog telefona (2026-09-18) — ZAKLJUČANO

Sve tri su stigle od korisnika posle gledanja sajta na telefonu, ne iz merenja. Merenje je služilo da se potvrdi ispravka, ne da je otkrije — to je granica onoga šta Puppeteer vidi.

**1. Zaglavlje je bilo previsoko i jelo je nadnaslov heroja.** `.traka` je imala `height: 76px` na svim širinama. Na 320 i 375px je nadnaslov („BSP · Proizvodnja medicinske opreme") padao ispod donje ivice trake. Sada **58px** ispod 720px.

| Širina | zaglavlje | nadnaslov y | razmak |
|---|---|---|---|
| 320 | 59px | 72 | **13px** |
| 375 | 59px | 73 | **14px** |
| 390 | 59px | 88 | **29px** |
| 430 | 59px | 88 | **29px** |

**2. Fotografija heroja je UKLONJENA ispod 1000px.** `.hero-foto { display: none }` — ne prigušena, ne zamenjena drugim kadrom, nego ugašena. Razlog je isti onaj zapisan u „REZOLUCIJA": izvor je 1376×768 i na telefonu se seče na uspravan kadar, pa se od hale vidi presek bez predmeta, a tekst preko njega gubi podlogu. Neutralna `--color-sala` daje ono što fotografija nije mogla:

| | preko fotografije | na neutralnoj podlozi |
|---|---|---|
| naslov | 12,12:1 | **16,18:1** |
| lead | — | 4,90:1 |
| nadnaslov | — | 4,90:1 |

Na 1000px i naviše fotografija ostaje netaknuta — provereno na 1440: `fotografija=DA`.

**3. Vodoravna traka koraka je UKLONJENA sa dodira.** Bila je dokumentovana kao namerni potez („prevlačenje prstom je bolje nego na mišu"). Korisnikova primedba je oborila obrazloženje: *„niko ne zna da treba da svajpuje levo/desno i onda sekcija izgleda kao da ispada."* **Afordansa koja se ne vidi nije potez nego kvar** — vodoravni skroler bez vidljive ivice se čita kao prelivanje rasporeda, i nijedno merenje to ne prijavljuje jer je tehnički sve ispravno.

Ceo `@media (max-width: 859px)` blok je obrisan, pa važi osnovni `.koraci { display: grid }`:

| Širina | display | kolone | redova | skriveni vodoravni skrol |
|---|---|---|---|---|
| 390 | grid | 1 | **4** | 0px |
| 768 | grid | 2 × 360px | 2 | 0px |
| 859 | grid | 2 × 405px | 2 | 0px |
| 860 | flex | traka | 1 | (vozi je transformacija) |

Dve kolone od 720px naviše ostaju — to je tablet, ne telefon: red je dovoljno širok, skrol je uspravan i ništa se ne svajpuje. Taj raspored je i dalje fallback za rad **bez JS-a** na desktopu.

Posledica koja se lako previdi: **`data-lenis-prevent` je time morao da ode iz markupa.** Dok je traka bila skroler na mobilnom, atribut je bio ispravan. Sada nije skroler ni na jednoj širini, a atribut bi blokirao **običan skrol strane** preko cele sekcije — tačno onaj kvar koji je već jednom koštao četiri kruga traženja.

**4. Koraci uzimaju geometriju `.shell`-a dok su mreža.** Korisnik: *„sekcija nije uvučena lepo u ravni sa ostatkom sajta, previše je zalepljena uz ivicu."* Tačno, i merenje je pokazalo koliko: `.pm-scena` je **namerno van `.shell`-a**, jer traka na desktopu mora da teče od ivice do ivice — ali dok je mreža, to znači 0px vazduha tamo gde sve ostalo ima pun razmak.

| Širina | zaglavlje sekcije | koraci (pre) | koraci (posle) |
|---|---|---|---|
| 320 / 375 / 390 | 20px | **0px** | 20px |
| 430 | 22px | **0px** | 22px |
| 768 | 38px | **0px** | 38px |
| 859 | 43px | **0px** | 43px |

Pravilo ide na `.pm-scena:not([data-traka-spremna]) .koraci` — ista geometrija kao `.shell` (`max-width: 1560px`, `margin-inline: auto`, isti `padding-inline`). Traku ne dira: ona i dalje počinje na `--pm-uvod`, koji skripta izmeri.

#### Dva kvara koja je ova ispravka otkrila usput

**A. Sekcija je skrolovala stranu vodoravno 796px — na VRHU strane.** Traka je `width: max-content` (2237px u okviru od 1440). Dok je skrol još ne odveze ulevo, viri udesno i cela strana se pomera. Raniji auditi su ovo propustili jer su merili **posle prolaska kroz stranu**, kad je traka već odvezena — „0 prelivanja na 70 kombinacija" je bilo tačno za stanje u kom je mereno, a ne za stanje u kom korisnik stranu zatiče. **Vodoravno prelivanje se meri i na `scrollY = 0`, pre ijednog skrola.** Ispravka: `overflow-x: clip` na `.po-meri`, isto kao na `.hero` i `.izbliza`.

**B. `position: sticky` sa okvira trake je BILO OBRISANO — mojom rukom, istog dana.** Pravilo `.pm-scena[data-traka-spremna] .pm-okvir { position: sticky; top: 24vh }` stajalo je odmah ispod bloka za prevlačenje prstom i otišlo je zajedno s njim. Desktop je time izgubio lepljenje: okvir je kroz celu sekciju klizio linearno (izmereno `top`: 500 → −1028, **0 od 21 uzorka zalepljeno**), pa se cela režija odigravala u prolazu.

> **Niko to nije prijavio, i to je poenta.** Primedba je stigla sa telefona, gde trake ionako više nema — pa je regresija na desktopu mogla da ostane neprimećena do objave. **Posle svakog brisanja CSS bloka proveriti da svaka klasa iz markupa i dalje ima svoje pravilo.** Isti nauk je već zapisan uz vraćanje obojenog heroja; ovo mu je drugi slučaj, pa više nije slučajnost.

Izmereno posle obe ispravke:

| Širina | `position` okvira | zalepljen | pomak trake | prelivanje (vrh / kroz sekciju) |
|---|---|---|---|---|
| 320 / 390 | static | — | 0px | 0 / 0 |
| 768 | static | — | 0px | 0 / 0 |
| 1024 | **sticky** | 10/21 | 594px | 0 / 0 |
| 1440 | **sticky** | 11/21 | 797px | 0 / 0 |
| 1920 | **sticky** | 9/21 | 532px | 0 / 0 |

### Motion sloj — ZAKLJUČANO

**Istraživanje branše:** provereno je šta lideri stvarno koriste (grep po njihovom HTML-u, ne po utisku):

| Sajt | Motion stack |
|---|---|
| **Malvestio** (IT, bolnički kreveti — najbliži BSP-u) | **Lenis** + Barba + Swiper |
| LINET | Barba (page transitions), Embla |
| Stiegelmeyer | Swiper |
| Getinge, Arjo, wissner-bosserhoff | ništa prepoznato |

**Glatki skrol: Lenis**, vezan za GSAP ticker u `src/scripts/motion.ts`.

> **`lerp`, NIKAD `duration` + `easing`. Ovo je bio pravi uzrok „skakutanja" i nije bio u sekciji u kojoj se video.**
>
> Lenis ima dva režima. Sa `duration` i `easing` svaki zamah točkića **pokreće krivu iznova od nule** ka novom cilju. Dok se točkić okreće neprekidno, to je niz naglih polazaka — a kriva je bila `expo.out` (nagli polazak, dug rep), pa se dobijalo trzaj → usporavanje → trzaj. Sa `lerp` se ništa ne restartuje: položaj se neprekidno prigušuje ka cilju koji se i sam pomera.
>
> Izmereno po frejmu, neprekidan točkić, **samo skrol strane** — bez ijedne zalepljene sekcije u kadru:
>
> ```
> duration 1.05:  13 7 8 8 6 6 | 17 13 13 12 10 9 | 19 17 14 14 12 | 22 18 17 50 6 …
> lerp 0.06:       8 7 8 6 6 5 | 13 12 11 10  9   | 17 15 14 13 12 …
> ```
>
> | | naglih polazaka / 200 frejmova | najveći korak |
> |---|---|---|
> | `duration: 1.05` + `easing` | **27** | 50px |
> | `lerp: 0.085` | 15 | 30px |
> | **`lerp: 0.06`** | **4** | 24px |
> | `lerp: 0.04` | 5 | 29px — bez dobitka, a skrol klizi |
>
> **Zašto se videlo SAMO u sekciji „4 koraka do isporuke".** Tamo je sekcija zalepljena, pa je vodoravna traka jedina stvar koja se kreće na ekranu — svaka neravnina Lenisa ide pravo u nju, bez ičega što bi je prikrilo. Drugde se pomera ceo kadar i oko neravninu ne registruje. Kvar je bio na celom sajtu; zalepljena sekcija ga je samo **otkrila**.
>
> **Dijagnostički trag koji vodi pravo ovamo: „na točkiću skakuće, na vučenju skrol trake radi."** Vučenje skrol trake je nativni skrol i Lenis u njemu uopšte ne učestvuje. Kad god se javi ta asimetrija, uzrok je u Lenisu, ne u onome što se animira.
>
> Zbog ovoga sidra i dugme za povratak na vrh **moraju sama da traže `duration`** u `scrollTo` — bez njega bi programski skok išao kroz `lerp` i vukao dug rep na kraju.

> **Nauk o postupku, skuplji od same ispravke.** Ovaj kvar sam tri puta „popravio" na pogrešnom mestu — menjajući `scrub`, pa način upisa transformacije — jer sam tražio uzrok u sekciji u kojoj se simptom VIDI. Obe izmene su same po sebi bile tačne (i ostaju), ali nijedna nije bila uzrok. Pravilo koje iz toga sledi: **kad se simptom javlja u jednoj sekciji, prvo izmeri da li je nosilac zajednički za ceo sajt.** Ovde je bilo dovoljno izmeriti `window.scrollY` po frejmu u praznom delu strane — deset minuta posla, umesto tri kruga.
- `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t*1000))` + `lagSmoothing(0)`. **Dva nezavisna rAF ciklusa daju podrhtavanje na scrub animacijama** — zato jedan ticker vozi oba.
- `scroll-behavior: smooth` je **uklonjen** iz `global.css`; nativni bi se borio sa Lenis-om na sidrima. Sidra na istoj strani idu kroz `lenis.scrollTo`.
- `syncTouch: false` — na dodiru ostaje nativni skrol, glatki se bori sa inercijom sistema i deluje sporo.
- **`data-lenis-prevent` na svakom unutrašnjem skroleru** (horizontalna traka kategorija na `/proizvodi`, mobilni meni). Bez toga Lenis otima njihov skrol. Ovaj detalj je preuzet od Malvestia.

> **ALI: atribut sme da stoji SAMO dok je element stvarno skroler. Ovo je bio uzrok trzanja u „4 koraka do isporuke", i koštalo je četiri kruga traženja.**
>
> Vodoravna traka koraka je skroler **samo na mobilnom** (`overflow-x: auto`, `scroll-snap-type: x mandatory`, prevlačenje prstom). Na desktopu je vozi transformacija — izmereno: `overflow-x: visible`, `scroll-snap-type: none`. Atribut je ipak stajao u markupu na obe širine.
>
> Lenis proverava **celu putanju** `wheel` događaja i ako bilo koji čvor nosi atribut, **izlazi bez `preventDefault`** (`node_modules/lenis/dist/lenis.mjs`, ~609). A dok je sekcija zalepljena, traka prekriva **ceo ekran**. Posledica: čim pokazivač uđe u tu sekciju, točkić prestaje da ide kroz Lenis i pregledač skroluje **nativno**, u skokovima od oko 100px po zubu — a preko toga stoji `scrub` glačanje od 0,5s. Čita se kao „skroluje u mestu, vrati malo unazad, pa naglo nastavi".
>
> Prva ispravka je bila da skripta sama upravlja atributom (`montiraj()` ga skida, `razmontiraj()` vraća), a u markupu ostaje zbog mobilnog. **Od 2026-09-18 atributa više nema nigde** — ni u markupu ni u `rezija.ts` — jer je vodoravna traka uklonjena sa dodira, pa traka nije skroler ni na jednoj širini. Izmereno posle: `lenis-prevent=false` na 390, 768 i 1440.
>
> | | `lenis-prevent` | traka je skroler | `overflow-x` | `scroll-snap` |
> |---|---|---|---|---|
> | desktop 1440 | `false` | ne | `visible` | `none` |
> | mobilni 390 | `false` | ne | `visible` | `none` |

> **Kako se ovakav kvar prepoznaje — dijagnostički obrazac, vredniji od same ispravke.**
>
> Korisnik je četiri puta prijavio istu stvar i dva puta dao podatak koji je vodio pravo na uzrok, a ja sam ga dva puta pogrešno pročitao:
>
> 1. *„Na točkiću loše, na vučenju skrol trake dobro."* — Vučenje skrol trake je nativni skrol **i pokazivač pritom nije nad trakom**. Ja sam iz toga zaključio „kriv je Lenis uopšte" i menjao njegovo glačanje.
> 2. *„Ostatak sajta radi, samo ta sekcija."* — Tek ovo isključuje globalni uzrok. Da sam ovo pitao odmah, prva tri kruga ne bi ni postojala.
>
> **Pravilo: kad se kvar drži JEDNE sekcije, uzrok je nešto što ta sekcija ima a ostatak nema — a ne podešavanje zajedničkog sistema.** Prvo se popisuje šta je u toj sekciji posebno (atributi, `position: sticky`, unutrašnji skroleri, `overflow`), pa se tek onda dira nosilac.
>
> **I zamka u merenju:** `page.mouse.wheel` u Puppeteeru šalje događaj sa **tekuće pozicije pokazivača**, koja je podrazumevano u uglu ekrana. Zato nijedna moja proba nije ni mogla da uhvati kvar vezan za element ispod pokazivača. U svaku probu skrola ide `page.mouse.move(x, y)` **nad element koji se ispituje**.
- `window.__lenis` je izložen da ga stranice koriste (`/proizvodi` prebacuje pogled kroz njega).
- **Pri `prefers-reduced-motion` Lenis se uopšte ne pravi.**

**Motion elementi:**
- Hero: orkestrirana sekvenca; slika se otkriva `clip-path` brisanjem odozdo, ne fejdom.
- `data-maska` na naslovima — otkrivanje odozdo naviše umesto fejda.
- `data-parallax` na okviru sa slikom — slika je uvećana 1.18 i putuje ±7% sporije od strane (traka „Iz pogona").
- `data-svetlo` / `data-plovak` — bazen svetla i blagi parallax proizvoda.
- `data-broj` brojači, `data-crta` hairline linije.
- `data-napredak` — traka napretka strane preko hairline linije zaglavlja.

### Stranice proizvoda
54 strane iz `data/opisi.json` + `src/assets/proizvodi/`.

**Tekst je preuzet sa reference i mehanički rastavljen.** Njihov izvorni tekst je oštećen — prelomi redova su izgubljeni pri unosu u WordPress, pa su stavke slepljene („tastaturePodizanje i spuštanje"). Rastavljanje je **namerno konzervativno**: deli se samo posle `.`/`!`/`?`/`)`, posle `°`, posle jedinice mere i na granici malo→veliko slovo. Ostatak ostaje spojen — bolje dve stavke zajedno nego pogrešno presečen tehnički podatak. Provera znak po znak potvrđuje da nijedna reč nije izgubljena ni dodata: **54/54 prošlo**, 631 stavka.

**Slike: samo iz galerije proizvoda.** Prvi pokušaj je čitao ceo HTML i pokupio i WooCommerce sekciju „related products" — rezultat je bio 374 fajla sa samo 198 jedinstvenih, i ormar je na prvoj poziciji dobio sliku višenamenskog stola. Sada se čita isključivo `woocommerce-product-gallery__wrapper`: **198 fajlova, 198 jedinstvenih, nula duplikata.**

Galerija na strani proizvoda drži sve slike u istom okviru 5:3 i menja samo vidljivost — prebacivanje ne pomera ništa ispod. `object-fit: contain` čuva i 32 uspravne fotografije od izobličenja.

**Bazen svetla ima `pointer-events: none`.** Širi se 18% van elementa i bez toga presreće klikove — u katalogu je doslovno krao klik susednoj kartici, a na strani proizvoda blokirao sličice galerije.

### Strana proizvoda — „Tehnički list" kao tamno poglavlje

`/proizvodi/[slug]` je bila **jedina ruta bez tamnog poglavlja** — 54 strane bez ijednog tonskog sidra. Specifikacije su pritom stajale kao spisak u desnoj koloni, ispod uvodnog teksta, i čitale su se kao dodatak.

Sada su izdvojene u **tamno poglavlje preko cele širine**, postavljeno tamo gde argument strane doseže vrh: strana proizvoda **dokazuje**, a dokaz su tehnički podaci.

> **Poglavlje NE SME da zavisi samo od specifikacija.** Izmereno pre izrade: **26 od 54 proizvoda nema nijednu specifikaciju**, medijana je **2 stavke**, najviše 18. Poglavlje vezano samo za njih bilo bi prazno na polovini kataloga.
>
> | Profil | Proizvoda |
> |---|---|
> | bogat (6+ specifikacija) | 17 |
> | srednji (1–5) | 11 |
> | samo tekst, bez specifikacija | 22 |
> | oskudan (ni teksta) | 4 |
>
> Zato poglavlje uvek nosi i blok **„Izrada po meri"** — jedina tvrdnja koja važi za svih 54 i ujedno ključna prodajna poenta firme (potvrđena činjenica, sekcija 1). Kad specifikacija nema, taj blok dobija naslovnu veličinu i sam drži poglavlje (`.tl-mera-sama`).

> **Fotografija preko cele širine je razmatrana i ODBAČENA.** Svaki proizvod ima bar jednu sliku (medijana 4, do 9), pa je bila najočigledniji kandidat da preuzme stranu — ali su izvori 614–1772px i preko cele širine bi bili meki. Isto ograničenje kao kod heroja. Ne pokušavati dok ne stignu veći originali.

Izmereno posle: tonalni raspon strane proizvoda **0,856–0,866** (ranije ravno), visina poglavlja 1231px kod bogatog i 620px kod praznog proizvoda (podnu vrednost drži `min-height` iz `.poglavlje-tamno`). Kontrasti na čeliku: naslov 8,32:1 · stavka 6,84:1 · „Izrada po meri" 16,18:1 · oznake 8,32:1 · materijali **5,65:1** (najniže) — sve prolazi AA.

### Lupa na stranici proizvoda
Uvećanje na prelaz mišem, kao na referenci (WooCommerce `zoom_enabled`). Bez biblioteke — `transform-origin` prati pokazivač.

- **Faktor se računa po slici**, ne fiksno: izvori idu od 614 do 1772 px. Ograničen na 1,4–2,6×.
- **`naturalWidth` se NE sme koristiti za taj račun.** Kad slika ima `srcset` sa `w` deskriptorima, pregledač po specifikaciji vraća veličinu korigovanu gustinom — za fajl od 1024 px prijavi 1324. Prave dimenzije šalje build kroz `data-izvor-w/h`.
- Računa se od **širine prikazanog sadržaja**, ne elementa: `object-fit: contain` uspravnu sliku u pejzažnom okviru jako smanji, pa ona ima više rezerve (2,6×) nego pejzažna (1,59–1,67×).
- **Odnos 5:3 drži omotač `.zum`, a slike su u njemu apsolutne.** Dok su bile u toku, uspravna fotografija je svojim odnosom razvlačila okvir na 643×1072 umesto 643×386.
- `overflow: hidden` ide na `.zum`, nikad na `.kadar` — tamo bi odsekao bazen svetla.
- Samo uz `(hover: hover) and (pointer: fine)`. Na dodir nema hovera, pa nema ni lupe.
- **Jače uvećanje traži fotografije veće rezolucije od klijenta** — isto ograničenje kao u katalogu.

### Katalog (PDF)
`npm run katalog` pravi `public/katalog/BSP-katalog.pdf` iz `/katalog/dokument`. **Traži da `npm run preview` već radi.** Posle generisanja uraditi još jedan `npm run build` — metapodaci se upisuju u `data/katalog.json`, koji strana `/katalog` uvozi.

| | Njihov PDF | Naš |
|---|---|---|
| Strana | 52 | 33 |
| Veličina | 20 MB | **2,9 MB** |
| Teksta | **0 znakova** (izvezen kao slike) | 24.128 znakova, pretraživ |

**Brojevi strana u sadržaju rade u dva prolaza:** renderuj PDF → `pdftotext` izvuče tekst po stranama → nađi na kojoj je koja kategorija → upiši u DOM → renderuj konačni PDF. Moguće je samo zato što naš PDF ima pravi tekst. Nađeno 12/12 kategorija.

**Dva pravila koja se ne smeju prekršiti:**
- **Slike u katalogu idu `loading="eager"`.** Astro podrazumeva `lazy`, a u headless renderu se lazy slike ispod prve strane nikad ne učitaju — generisanje visi do timeouta.
- **Slike idu kao JPEG na beloj podlozi, ne PNG sa alfom.** Providnost tera Chrome da ih ugrađuje bez gubitaka; PDF je zbog toga bio **24 MB umesto 2,9**.

**Rezolucija:** slika nikad ne prelazi 78 mm širine. Originali su 1072 px, što na 78 mm daje ~306 DPI. Preko cele strane bi palo na ~150 DPI i videlo bi se kao meko. Za velike fotografije treba tražiti originale u većoj rezoluciji.

**Boja:** Chrome izvozi RGB. Za ekran i digitalnu štampu je u redu; za ofset štamparija konvertuje u CMYK, uz blagi pomak plave `#0E6FB4`.

Sekcija „Prvih nekoliko strana" je napravljena pa **uklonjena** — klik na bilo koji list vodio je na isti PDF kao i dugme iznad, dakle duplikat radnje. Ne vraćati.

**Preuzimanje se nikad ne pokreće samo.** Dve odvojene radnje: „Pogledajte" otvara PDF u novoj kartici (`target="_blank"`, bez `download`), „Preuzmite" ima `download` atribut.

Ugrađen `<iframe>` čitač je **uklonjen** — dugme „Pogledajte" već otvara isti PDF u punom pregledaču, pa je sekcija bila duplikat. Ne vraćati bez traženja.

### Dugmad i hover
- **Podloga dugmeta se ne menja naglo nego se izvuče odozdo naviše** — `::before` sa `scaleY(0→1)`, `transform-origin: bottom`, 0,55 s. Radi i na `:focus-visible`, ne samo na hover.
- **Hover boja svih dugmadi je hirurška zelena** (`--color-zelena`), uključujući telefon u zaglavlju i dugme palete. Belo na njoj daje 5,91:1. Zelena je inače rezervisana za podatak, ali hover je **stanje, ne identitet** — akcenat se pojavljuje pri interakciji.
- Prelazi su namerno spori: 0,45–0,6 s umesto ranijih 0,25 s. Easing je `--ease-sala`.
- `.btn-ghost` na hover dobija beo tekst preko tamne podloge koja se izvlači.
- Kartica u katalogu: slika se podigne i blago uveća, a **bazen svetla se pojača** (`--svetlo-jacina` 0,5 → 1 na hover).

**Klasa `svetlo` ide na SLIKU, nikad na celu karticu.** Kontaktna senka se računa od dna elementa na kome stoji — sa kartice pada preko naziva ispod. Ovo je već drugi put da se javilo (prvi put u sekciji boja), zato je pravilo, ne pojedinačna popravka. Vizual ima i unutrašnji razmak da senka ima mesta; izmereno 33px do teksta.

**Kartice nemaju `data-svetlo`.** Scrub upisuje `--svetlo-jacina` kao inline stil pa ga hover nikad ne bi nadjačao. Uz to bi 54 ScrollTrigger-a na jednoj strani bio nepotreban trošak — scrub ostaje samo na herou.

### Gustina — pravac B (u toku)
Korisnik je ocenio da sajt deluje previše jednostavno i izabran je zaokret ka **slojevitoj kompoziciji i bogatijem pokretu**, uz zadržane tokene „Sale". Ovo NIJE samo dodavanje efekata — menja se raspored sekcija.

**`src/components/Reci.astro` je OBRISAN** (2026-09-14). Nikad nije ušao u upotrebu, a sajt je u međuvremenu dobio ustaljen potez za otkrivanje naslova — `data-maska`. Dva nezavisna mehanizma za istu stvar su tačno ono što pravilo „malo izuzetnih, a ne mnogo osrednjih" zabranjuje. Zamke koje je nosio ostaju zapisane ispod jer važe za svaki sličan pokušaj.

**Zamka koja je napravila kašnjenje od ~10 s:** početno stanje `.rec` je `translateY(110%)` iz CSS-a, pa tajmlajn MORA koristiti `gsap.to({ y: 0 })`. Sa `gsap.from()` reči se animiraju nazad u skriveno stanje i ostaju nevidljive dok ih ne pokupi sigurnosna mreža na 3,6 s. Posmatrač na skrol koristi ispravan `.to()` i radi.

Tri zamke iz `Reci.astro`, sve uhvaćene merenjem:
1. **Razmak mora biti pravi znak**, ne `margin`. Sa marginom se tekst čita i kopira kao „Našeiskustvo" — spojen.
2. **`<br>` je suvišan** kad je red već blok — daje prazan red između.
3. **Prostor za repove slova** (`padding-bottom`) mora biti poništen negativnom marginom, inače svaki red poraste za toliko.
4. **Ne deliti naslov nasilno na redove.** Reči su šire od kolone, pa je podela na tri reda davala pet vizuelnih. Jedan red + `text-wrap: balance`.

### Sekcija „Izbliza" — pinovane specifikacije
Slika serije 961 stoji zakačena dok šest specifikacija prolazi pored nje. Prva stvarna gustina iz pravca B.

- **Sve vrednosti su iz `data/opisi.json` za 961-5** — 4 aktuatora, leđni deo 0–65°, Trendelenburg ±17°, nosivost 240 kg / SWL 280, ograde EN 60601-2-52, visina 46–84 cm. Ništa nije dodato ni zaokruženo.
- **CSS `sticky`, ne GSAP pin.** Ne dira raspored, ne traži preračunavanje i ne ume da se razmine sa Lenis-om.
- **Mreža NE sme imati `align-items: start`** — kolona sa slikom se tada ne rastegne na visinu reda, `sticky` nema kroz šta da putuje i slika se nikad ne zakači. Izmereno: 0 od 14 uzoraka pre popravke, 8 od 14 posle.
- Kadar vozi **skrol režija** (`rezija.ts`, 3): otvara se iz proreza, diše dok specifikacije prolaze i zatvara se pri izlasku. Zato `clip-path` ide na unutrašnji `.izbliza-otvor`, a **ne na `.izbliza-kadar`** — `clip-path` seče i pseudo-elemente, pa bi na kadru odsekao bazen svetla koji viri 18% van njega.
- Stavke **nemaju `data-otkrij`**: prelaz iz prigušene (0,32) u istaknutu JESTE otkrivanje. Aktivnu bira IntersectionObserver sa pojasom `-45% 0 -45%` — uvek tačno jedna.
- Lepljenje radi tek od 1000px; u jednoj koloni bi slika zauzela pola ekrana.

Traka sa fotografijom pogona je **uklonjena sa početne** na zahtev korisnika; `src/assets/pogon.jpg` ostaje u projektu za `/o-nama`.

### Traka kataloških oznaka
Vrpca sa svim oznakama iz ponude klizi ispod sekcije „Izbliza". Niz je odštampan **dvaput**, a animacija pomera vrpcu za tačno `-50%` — kad prva kopija izađe, druga je na njenom mestu, pa se petlja ne vidi. Zaustavlja se na hover.

### Sečenje vodoravnog prelivanja — VAŽNO
`.svetlo::before` se širi **18% van svog elementa** i na uskim ekranima izlazi iz okvira. Pošto je pseudo-element, `querySelectorAll` ga NE vidi, pa provera „koji element viri" vraća prazno iako se strana pomera.

Redosled koji NE radi:
- `body { overflow-x: hidden }` — propagira se na viewport, telo zapravo ne seče.
- `html { overflow-x: clip }` — izmereno: strana se i dalje pomera za 32–43px.

Radi samo **`overflow-x: clip` na samoj sekciji** (`.hero`, `.izbliza`). `clip` ne pravi scroll kontejner, pa `position: sticky` nastavlja da radi. Svaka nova sekcija sa `.svetlo` elementom mora dobiti isto.

### Skrol efekti — osnovni sloj
Redom u `motion.ts`: otkrivanje (IntersectionObserver), bazen svetla + plovak, parallax u kadru, **udaljavanje** (`data-udalji`, predmet se smanji na 0,93 dok izlazi iz kadra), hero sekvenca učitavanja, brojači, hairline crte, traka napretka.

Udaljavanje je namerno na 7% — preko toga se čita kao trik, ne kao dubina.

### 4c. Skrol režija — `rezija.ts`

Ovo je sloj iznad otkrivanja i **nije isto što i `data-otkrij`**. Razlika je suštinska:

| | `data-otkrij` (motion.ts) | Režija (rezija.ts) |
|---|---|---|
| Šta pokreće | ulazak u kadar | **pozicija skrola** |
| Ponašanje | odigra se jednom i gotovo | stanje visi o skrolu, vraća se unazad |
| Luk | ULAZ → FEJD → KRAJ | **ULAZ → GRAĐENJE → PREOBRAŽAJ → IZLAZ** |

**Pet trenutaka, ne pedeset animacija.** Odluka je da malo mesta bude izuzetno, a ostatak miran:

1. **HERO — predaja.** Tri sloja odlaze različitim brzinama: proizvod raste (`scale` 1 → 1,12) i omekšava (`blur` 0 → 4px, tek u poslednjoj trećini), tekst izmiče naviše za 0,18 visine ekrana, a traka činjenica ide **suprotno**, naniže za 56px. Redovi naslova se pritom razmiču vodoravno, svaki za nijansu više (−8 / −19 / −30px).
2. **BROJKE — odbrojavanje vezano za skrol.** Vrednost visi o poziciji, pa se vrti u oba smera. Izmereno kroz prolaz: `0 → 13/692/19/1 → 37/1.891/51/3 → 39/2.000/54/3`.
3. **IZBLIZA — otvor.** ★ Glavni trenutak. Kadar se otvara iz proreza `inset(44% 6%)` → `inset(0%)`, zatim diše (`scale` 1,01 → 1,06, rotacija −1,1°) dok specifikacije prolaze, pa se zatvara odozdo na `inset(0% 0% 40%)`. Kolona sa specifikacijama putuje sporije (±64px) — razlika u brzini pravi dubinu.
4. **PO MERI — vodoravna traka.** Skrol naniže vozi korake ulevo. Vidi ispod.
5. **POZIV — sklapanje.** Dve kolone dolaze različitim brzinama i **smiruju se na nuli** pre nego što sekcija stigne do sredine ekrana. Poslednja sekcija je odredište i ne sme da nastavi da se kreće.

**Pravila izvedbe, obavezna:**
- Anima se samo ono što ne pravi raspored: `transform`, `opacity`, `clip-path`, `filter`. Nijedna sekvenca ne dira širinu, visinu ni margine.
- `scrub` je **broj**, ne `true` — vrednost zaostaje za skrolom i zaglađuje ga. Ovo je izmereno pravilo, ne stil: vidi vodoravnu traku ispod. Uz to, sve što se vozi skrolom ide kroz **tvin**, ne kroz `onUpdate` + `gsap.set` — samo tvin dobija `translate3d` i svoj sloj.
- `invalidateOnRefresh: true` na svemu što meri piksele.
- **Jedan element, jedno svojstvo, jedan vlasnik.** Zato su `data-otkrij` (brojke, poziv) i `data-plovak`/`data-udalji` (hero) **skinuti** sa svega što režija vozi — dva tvina nad istim `y` se otimaju. Elementi koje režija vodi nemaju skriveno početno stanje u CSS-u, pa su bez JS-a odmah vidljivi.

**Vodoravna traka (`po-meri`) — kako je izvedena.** Bez GSAP pina: okvir se lepi CSS-om (`position: sticky; top: 24vh`), a skripta upiše sceni **tačno onoliko visine koliko traka ima pomaka**, pa sticky i ScrollTrigger mere isti broj i ne mogu da se razmimoiđu.

```
scena.height = okvir.offsetHeight + pomak
pomak        = traka.scrollWidth - okvir.clientWidth
```

> **LEPLJIVI PUT JE `visina scene − visina okvira`. Ništa više.** Prvo je ovde stajalo `+ 0.24 * innerHeight`, uz obrazloženje da je to `top` lepljivog okvira. Pogrešno: `top` određuje KADA lepljenje počne, ne koliko traje.
>
> ```
> lepljenje počinje na  scrollY = scenaVrh − T
> lepljenje pušta na    scrollY = scenaVrh + H − O − T
> put                 = H − O
> ```
>
> Posledica je bila **216px mrtvog lepljivog skrola** posle završetka trake — dva-tri poteza točkića u kojima se ništa ne pomera, ni napred ni nazad. Korisnik je to prijavio kao „krene, pa je potrebno 2-3 skrola da se nastavi". Izmereno: traka je završavala na y=5748, a lepljenje puštalo tek na ~5874.
>
> Provereno posle ispravke na sedam širina: `H − O == pomak` svuda, a traka završava i lepljenje pušta u **istom potezu točkića**, i napred i nazad.

> **`scrub` je BROJ (0.5), a traku vozi PRAVI TVIN — ne `onUpdate` + `gsap.set`.**
>
> Ovde sam jednom pogrešio i vredi zapisati kako: pošto je korisnik prijavio „zaglavi se, pa brzo nastavi", promenio sam `scrub` na `true` **uz** ispravku računice visine. Ispravka visine je bila pravi lek (216px mrtvog skrola); promena `scrub`-a je bila suvišan dodatak koji je **uveo novi kvar**. Dve izmene odjednom za jedan simptom — tako se ne zna šta je pomoglo.
>
> Simptom novog kvara je bio precizan i sam je odao uzrok: **na točkiću skakuće, na vučenju skrol trake radi.**
>
> | | zašto |
> |---|---|
> | `scrub: true` | Lenis piše **razlomljene** pozicije, a `window.scrollY` se zaokružuje na cele piksele. Sa brojem, glava tvina stiže do cilja sopstvenim tvinom i to zaokruživanje filtrira; sa `true` ono ide pravo u `x`. Pri vučenju skrol trake pomaci su veliki i jednosmerni pa se treptaj ne vidi — na točkiću je pomak po frejmu mali, pa je zaokruživanje veliki deo njega. |
> | `gsap.set` | GSAP piše `translate3d` samo na **tvinovima** (`force3D: "auto"`), ne na `set()`. Bez 3D transformacije traka nema kompozitorski sloj, pa se sva četiri koraka **sa tekstom iznova rasterizuju u svakom frejmu** — korisnik je to opisao kao „prelama se malo tekst". |
>
> Izmereno po frejmu, pravim `wheel` događajima na 55ms (ista putanja, ista mera):
>
> | | staro (`true` + `set`) | sada (0.5 + tvin + `force3D`) |
> |---|---|---|
> | frejmova sa pokretom | 48 | **69** |
> | prosečan korak | 16,6px | **11,6px** |
> | najveći korak | 24,0px | **20,0px** |
> | traka na svom sloju | **0%** | **100%** |
>
> Isti put raspoređen na 44% više frejmova, uz manje korake — to je razlika između vožnje i skakutanja.
>
> **Traka je JEDINI element na sajtu koji sme trajno da drži sloj.** Njen posao je pomeranje velike površine i to je tačno ono za šta sloj postoji. Ne čitati ovo kao dozvolu da se `will-change` vrati drugde (vidi belešku ispod).

> **Merenje sa pauzama NE HVATA ovakav kvar.** Prva provera je slala zamah točkića pa čekala 420ms da se slegne, i prijavila savršen odnos `Δx = −Δy`. Tačno — i potpuno promašeno: pauza sakriva sve što se dešava *između* frejmova. Za podrhtavanje se uzorkuje **svaki frejm** (`requestAnimationFrame`) tokom **neprekidnog** skrola, i broje se frejmovi u kojima se strana pomerila a element nije. Uz to, `getComputedStyle().transform` u Chrome-u spljošti `translate3d(x,0,0)` u 2D matricu — promocija sloja se čita iz **inline** stila, ne iz izračunatog.

> **`will-change` je uklonjen sa svih TRAJNIH mesta.** Bilo je šest promovisanih slojeva, dva preko celog ekrana. `will-change` nije besplatan: drži sloj u memoriji GPU-a za ceo život strane i kad se nagomila postaje uzrok podrhtavanja koje je trebalo da spreči. Gde sloj stvarno treba, dobija se kroz `force3D: true` na tvinu koji taj element ionako vozi — jedan sloj, sa razlogom, a ne šest za svaki slučaj.

> ~~**`scrub` je 0.25, kraći nego drugde.**~~ ~~Dok je sekcija zalepljena, korisnik nema drugog znaka da se skrol registrovao osim pomeranja trake.~~ Obe ranije verzije ovog pasusa su bile pogrešne — vidi gore.

- Vodoravni raspored pali **skripta**, upisom `data-traka-spremna`. Bez JS-a ostaje obična mreža — `width: max-content` tako nikad ne može da napravi vodoravno prelivanje.
- Ispod **860px** traka je isključena: jedna kolona teksta nema šta da vozi vodoravno.
- Ako je `pomak < 40px`, traka se sama razmontira — vožnje nema, mreža je poštenija.
- **Korak je ploča, ne stubac:** `clamp(18rem, 34vw, 30rem)`. Na ranijih `26vw` pomak je bio svega **213px** i čitao se kao podrhtavanje, a ne kao putovanje. Sada je 797px na 1440.
- Uvod trake se **meri sa `.pm-zaglavlje`, ne sa `.shell`** — `.shell` je pun preko cele širine i razmak drži paddingom iznutra, pa mu `getBoundingClientRect().left` vraća 0. Izmereno: prvi korak počinje na 72px, poslednji se zaustavlja na 1368px — ista ivica sa obe strane.

**Provereno:** `prefers-reduced-motion` (brojke prikazuju prave vrednosti, traka isključena, `clip-path: none`, Lenis se ne pravi), bez JS-a (mreža, 0 prelivanja), i posle klijentske navigacije (traka se podigne iznova). 0 grešaka u konzoli na svim putanjama.

> **Brojka je sadržaj, ne efekat.** `<span data-broj>` na serveru ispisuje **konačnu vrednost**, ne nulu. Ranije je pisalo `0`, pa je bez JS-a i pri reduced motion brojka zauvek ostajala na nuli. Skripta sama vrati prikaz na 0 kad krene da odbrojava.

### Stack
Astro + Tailwind (v4, preko `@tailwindcss/vite`) + GSAP. Statički build, bez JS frameworka. 54 proizvoda se generišu iz `data/proizvodi.json`.

### Stranica `/o-nama` — redizajn

Strana je bila najslabija na sajtu: **3.568px čistog teksta i nijedna slika**. Sada nosi četiri stvari koje tekst nije mogao:

- **Fotografija pogona preko cele širine**, odmah posle uvoda, sa parallaxom. Ista slika je ranije uklonjena sa početne na traženje korisnika — ovde je na svom mestu, jer je strana o firmi, a ne o proizvodu. `data-parallax` ide na **kadar**, ne na `<img>`: skripta sama podiže sliku na `scale(1.18)` i pomera je ±7%, pa slika u CSS-u stoji tačno u kadru.
- **Šema udaljenosti** umesto spiska od tri stavke. Pančevo u centru, tri zraka sa kotama koje se iscrtavaju kad šema uđe u kadar (`stroke-dasharray`, vezano za `data-vidljiv`). Uglovi prate smer u kome mesto stvarno leži, ali crtež **nije u razmeri** (45 km i 6 km su slični zraci, jer bi tačna razmera pojela kadar) — zato na njemu nema ni severa ni razmernika.
- **Vremenska linija** 1985 → danas, četiri tačke. Godine su ograničene na potvrđeno: 1985. i „krajem devedesetih". **Godine dobijanja sertifikata nisu poznate**, pa ta tačka stoji bez datuma dok je klijent ne potvrdi.
- **Sertifikati objašnjeni.** Tri bedža ne govore ništa dok se ne zna šta pokrivaju, pa ISO 13485 / 9001 / 14001 sada imaju po pasus. Tekst je javno znanje o standardima, ne tvrdnja o firmi.

### Korice strana — svaka otvara i zatvara svojim potezom

Pre izmene je pet strana otvaralo istom sekcijom `uvod` (padding-top 176, naslov na 72, nadnaslov + h2 + lead) i zatvaralo istim blokom `poziv` visine **347px na četiri strane**. Copy se razlikovao, forma nije — čitalo se kao ista komponenta četiri puta.

| Strana | Otvara | Zatvara |
|---|---|---|
| `/` | hero „Scena" — tri ravni dubine | pun blok, uvučen `.kol-3` |
| `/o-nama` | **godina 1985** u 48vw, isečena desnom ivicom | **jedan red** sa strelicom, bez bloka |
| `/proizvodi` | sažeto zaglavlje, naslov i brojka u istom redu — **ulazi u mrežu** | **tanka traka**, ne sekcija |
| `/kontakt` | **telefonski broj** u display veličini | (forma je kraj strane) |
| `/katalog` | mirno zaglavlje, uvučeno `.kol-3` | kompaktan blok |

`/kontakt` je jedino mesto gde mono ide u display veličini — broj se bira, ne čita, i telefon je primarni kanal za upit.

### Strana 404 — ponovna pretraga, ne izvinjenje

Najveći deo pogrešnih adresa na ovom sajtu biće **prekucana kataloška oznaka** (`/proizvodi/961-5` je lako promašiti). Zato 404 nije izvinjenje nego ponovna pretraga: rečenica šta je pošlo po zlu (arhetip B) i odmah **ceo indeks od 12 kategorija** kao izlaz, sa brojem proizvoda uz svaku.

- Indeks je **lista, ne mreža kartica** — ovde se bira, a ne razgleda; mreža bi tražila slike i pretvorila grešku u još jednu stranicu za pregledanje.
- Broj „404" NAMERNO ne ide u display veličinu: nije podatak kojim se treba hvaliti, a velika cifra bi se tukla sa istim potezom na `/o-nama`.
- Jedini pokret je red koji se pomeri udesno na hover — pokazuje smer u kom se ide.

### Štampa — `@media print`

B2B kupci štampaju spiskove opreme za nabavku. Tri odluke, jer štampa **nije ekran u sivom**:

1. **Navigacija i pokret nestaju** — zaglavlje, podnožje, traka napretka, dugmad, mape, forma, bazen svetla, lampa.
2. **Sve skriveno zbog animacije se vraća.** Elementi sa `data-otkrij` kreću od `opacity: 0`, hero kadar je letterbox traka, `data-maska` su `clip-path`. **Bez ove grane bi se odštampala prazna strana.** Isto važi za lepljive elemente (`position: static`) i vodoravnu traku koraka (vraća se u uspravan niz — papir se ne skroluje, pa bi tri od četiri koraka ostala van strane).
3. **Adresa veze se ispisuje uz tekst** (`a[href^="/"]::after`) — na papiru „Pogledajte proizvode" ne vodi nigde, `/proizvodi` vodi. Izuzeti su `tel:`, `mailto:` i sidra.

4. **TAMNA POGLAVLJA SE OBRĆU.** Ovo je najskuplji kvar koji je štampa imala i nijedna ranija provera ga nije uhvatila, jer su se gledali `opacity` i vidljivost — a ne **boja**.

> `print-color-adjust` je podrazumevano `economy`: pregledač **ne štampa** tamnu pozadinu, ali boje teksta ostaju svetle. Izmereno na belom papiru:
>
> | | pre | posle |
> |---|---|---|
> | naslovi i vrednosti | **1,08:1** | 21:1 |
> | telo teksta | **1,05:1** | 21:1 |
> | labele i mono | **2,11:1** | 12,63:1 |
>
> Sadržaj je bio nevidljiv na **58 strana**: svih 54 proizvoda („Tehnički list" — baš ono zbog čega B2B kupac i štampa), plus `/` („Izbliza"), `/o-nama`, `/proizvodi` i `/katalog`.
>
> **Ne oslanjati se na `print-color-adjust: exact`.** I kad bi pozadina prošla, korisnik je gasi jednim klikom („Background graphics") u dijalogu za štampu. Zato se obrće SADRŽAJ, ne pozadina.
>
> **Dva mehanizma se moraju pokriti:** `.poglavlje-tamno` (zajednička klasa) i `.izbliza` (nosi tamnu podlogu direktno u svojoj strani). Prva provera je gledala samo prvu i zato prijavila da početna „nema tamnog poglavlja".

Provereno emulacijom `print` medija: zaglavlje, podnožje i dugmad nevidljivi, **0 elemenata zaglavljenih na `opacity: 0`**, prvi vidljivi naslov je naslov strane.

### Pristupačnost — izmereno stanje

Provereno na svih šest strana plus 404: **po jedan `h1`**, **0 preskočenih nivoa** naslova, 0 slika bez `alt`, 0 veza i dugmadi bez pristupačnog imena, 0 `iframe`-ova bez `title`, svi fokusi vidljivi pri kretanju tabom (26 zaustavljanja po strani).

**Jezik je `sr-Latn`, ne `sr`.** Sadržaj je latinica, a goli `sr` kod čitača ekrana povlači ćirilična pravila izgovora; puna BCP-47 oznaka je i uslov da `hyphens: auto` uzme pravi rečnik.

## 5. Podaci o proizvodima

Izvor istine: `data/proizvodi.json` — 54 proizvoda, 12 glavnih kategorija sa podkategorijama.

Kataloški brojevi (961, 935, 918, 906, 962, 972, 973, 952, 992) su stvarne oznake klijenta.

**Slike:** `src/components/SlikaProizvoda.astro` prima opcioni `slika` (import iz `src/assets/`) i `prioritet`. Sa slikom renderuje Astro `<Image>` (WebP, `srcset`, `object-fit: contain`), bez slike placeholder — **oba u istom okviru 5:3**, pa zamena ne pomera layout. Hero koristi `src/assets/hero-hala.jpg`. (`hero-961.jpg` je **obrisan** 2026-09-16 — nije se koristio nigde.)

Fotografije snimljene na beloj podlozi dobijaju `mix-blend-mode: multiply` — belina se stapa sa podlogom, nema pravougaonika oko proizvoda, a bazen svetla prolazi kroz nju. Ako neka slika stigne kao transparentni PNG, `multiply` joj ne smeta.

**Placeholderi:** ista komponenta renderuje placeholder u odnosu **5:3 (landscape)** — to je tačan odnos originalnih fotografija (~1072×643). Prave fotke su transparentni PNG, pa placeholder mora rezervisati identičan prostor da kasnija zamena ne izazove layout shift.

Placeholder je **providan**, označen samo uglovima kadra, sa kataloškim brojem u sredini. Dva razloga: (1) pun box sa borderom potpuno sakrije bazen svetla iza sebe i ubije potpisni element, (2) generička silueta proizvoda bila bi tačna samo za krevete, a laž na ormarima, stalcima i stolicama.

## 5a. Copy — poreklo teksta

Tekst stranice `/o-nama` je **preuzet sa reference** (`bsp.rs`), ne napisan iznova. Ispravljene su samo očigledne štamparske greške (mogučnosti → mogućnosti, oćuvanja → očuvanja, vodečim → vodećim, medinskih → medicinskih, transvuziju → transfuziju, menađžmenta → menadžmenta).

**Dve protivrečnosti u njihovom sopstvenom tekstu — izostavljene, čekaju odgovor klijenta:**
- Osnivanje: sekcija „O nama" kaže **1985**, sekcija „BSP" kaže **1981**.
- Iskustvo: sekcija „BSP" kaže **25 godina znanja**, dok se drugde ističe **39 godina**.

Citat „Vi znate šta Vam treba, mi znamo da proizvedemo." je takođe njihova rečenica, ali sa stranice KATALOG, ne iz „O nama".

Sadržaj „O nama" je namerno **skinut sa početne** i prebačen na zasebnu stranicu — na početnoj je bilo previše teksta.

## 5b. Šta merenje hvata, a oko ne

Pravilo 1 znači da je merenje jedini način da „vidim". Uz `npm run meri` idu i ciljane Puppeteer probe. Greške koje su ovako uhvaćene, a nijedna se ne bi videla u kodu:

- **Tekst u SVG `viewBox` jedinicama menja veličinu sa širinom crteža.** Isti `font-size: 2.6` merio je **33px na desktopu i 9px na mobilnom**. Ispravka: u SVG idu samo linije, natpisi su HTML sloj pozicioniran u procentima, pa tipografija ostaje u rem-u. Posle: 11px na svim širinama.
- **Provera sudara među natpisima ne hvata natpis koji sedi NA liniji.** Dva broja su imala zrak provučen kroz sebe. Hvata se tek uzorkovanjem same putanje (`getPointAtLength`) i poređenjem sa okvirima natpisa.
- **`meri.mjs` prijavljuje „0 nevidljivih" i za sadržaj koji je u pogrešnom mestu** — vidi raniji slučaj sa `hero-mreza`. Nevidljivo i pogrešno postavljeno su dva različita kvara.
- **Element u sakrivenoj sekciji ima `getBoundingClientRect().top === 0`**, pa upada u svaku proveru „iznad pregiba". Bez uslova `width > 0 && height > 0` proba je prijavila 11 nevidljivih elemenata kojih nema — lažna uzbuna.
- **`new PointerEvent("pointermove")` ima prazan `pointerType`.** Skripte lampe i lupe odbacuju sve što nije `"mouse"`, pa je proba prijavila da oba efekta ne rade. Kvar je bio u probi, ne u sajtu. U svaku sintetičku probu ide `pointerType: "mouse"`.
- **Bazen svetla (`.svetlo::before`) se vraća kao vodoravno prelivanje na SVAKOM novom mestu.** Širi se 18% van elementa, a `querySelectorAll` ga ne vidi jer je pseudo-element. Na jednokolonskoj mreži (390px) kartica od 350px daje kadar od −43 do 433 — tačno 43px prelivanja. Nađeno isključivanjem blokova redom i merenjem `scrollWidth`-a. `overflow-x: clip` ide na OMOTAČ (`.katalog`, `.proizvod`), nikad na `.kadar` — tamo bi odsekao sam bazen svetla.
- **Između `<!doctype html>` i `<html>` ne sme stajati NIŠTA — ni Astro komentar.** Kad je tu stajao, Astro je prestao da prepoznaje `<html>` kao koren i **izbacio ga iz builda**; pregledač je sam napravio prazan `<html>` bez klase `no-js`, pa je cela grana „bez JS-a" pala i sadržaj ostao na `opacity: 0`. Izmereno: 21 nevidljiv element na `/o-nama`. Simptom je podmukao jer sa uključenim JS-om sve izgleda ispravno.
- **Sigurnosna mreža otkrivanja mora imati prag `innerHeight`, ne `innerHeight * 0.9`.** Posmatrač ima `rootMargin: "0px 0px -10%"`, pa element koji na KRAJU strane ostane u donjih 10% ekrana nikad ne uđe u smanjeni koren — a sa pragom 0,9 ga ni mreža nije hvatala. Na kratkim stranama je poslednja sekcija mogla **zauvek** da ostane nevidljiva. Izmereno na `/katalog` (2.133px): tri zaglavljena elementa. Mreža sada radi i na kraj skrola, ne samo na tajmer.
- **Puppeteer `clip` meri od vrha DOKUMENTA, ne ekrana.** Uzastopni snimci posle `scrollTo` vraćaju isti vrh strane. Zbog toga sam jednom izmerio „raspon svetline 0,006" i na osnovu toga izveo pogrešan zaključak o tonalitetu. Za merenje po visini strane ide **jedan `fullPage` snimak pa uzorkovanje pojaseva**.
- **Astro skopira i selektore koji ciljaju `<html>`.** `.no-js .hero-kadar { … }` nikad ne upali, jer `.no-js` stoji izvan komponente pa mu Astro doda scope klasu koju taj element nema. Mora `:global(.no-js) .hero-kadar`. Izmereno: bez JS-a je hero ostajao zauvek u letterbox traci, a raster nevidljiv — oba su bila napisana bez `:global()`.
- **GSAP 3D rotacije zove `rotationX`/`rotationY`, ne `rotateX`/`rotateY`.** Nepoznato ime prosto ne uradi ništa i **ne prijavi grešku**. Izmereno: nagib je bio tačno 0° dok je sve ostalo u istoj funkciji radilo.
- **`perspective` važi samo za DIREKTNU decu.** Postavljena na `.hero-scena` ne stiže do unuka, a `filter` i `clip-path` na međuelementima ionako spljošte 3D kontekst. Rešenje je GSAP-ov `transformPerspective`, koji upiše `perspective()` u sam transform elementa. Simptom je podmukao: rotacija se primenjuje, ali izlazi kao 2D matrica.
- **Kontrast teksta preko fotografije se MERI, ne procenjuje.** Postupak: zabeleži okvire teksta, sakrij prednji plan, snimi podlogu, uzorkuj piksele ispod svakog okvira i izračunaj WCAG odnos. Time se ne krši pravilo 1 — slika se ne gleda, nego se računa. Isto važi i za profil fotografije (gde u kadru stoji predmet).
- **Headless Chrome ne prijavljuje `(hover: hover) and (pointer: fine)` sam od sebe.** Puppeteer `emulateMediaFeatures` ne podržava te dve — ide preko CDP-a: `Emulation.setEmulatedMedia` sa `features`.

## 5c. Povratak na vrh i ponašanje pri osvežavanju

**Dugme za povratak na vrh** stoji u donjem desnom uglu i pojavljuje se tek posle jedne visine ekrana — dok se hero vidi, dugme za povratak na hero nema šta da radi. Kvadrat, ne krug: sajt je svuda oštar. Penjanje ide kroz Lenis, inače bi nativni skok bio jedini trzaj na sajtu koji nije glačan.

> **Skriveno dugme NE SME da prima fokus.** `opacity: 0` skriva element oku, ali ga ostavlja u redosledu Taba. Izmereno pre ispravke: **drugi pritisak Taba** na vrhu strane odvodio je fokus na ovo dugme dok mu je `opacity` bio 0 — fokus nestane sa ekrana, korisnik ne zna gde je, a Enter ga odvede na vrh bez objašnjenja (WCAG 2.4.7). Rešenje je `visibility: hidden` uz `opacity`, jer ono **uklanja iz Taba** a za razliku od `display: none` može da se animira; u `transition` ide sa `0s linear 0.4s` pri nestajanju i `transition-delay: 0s` pri pojavljivanju.

> **Dugme stoji na KRAJU `<body>`, posle podnožja.** Ranije je bilo odmah posle veze „Preskoči na sadržaj" — dakle drugo zaustavljanje na strani, pre glavne navigacije. Uz to se, kad se pojavi, unapred nije ni moglo dohvatiti: do njega se stizalo samo Shift+Tabom. Sada je poslednje zaustavljanje, tačno kao što i izgleda na ekranu. Provereno: fokus na poslednjoj vezi podnožja → jedan Tab → dugme.

> **Dugme NESTAJE dok se čita naniže.** Ranije je bilo vidljivo čim se pređe jedna visina ekrana i ostajalo do kraja strane. Pošto je `position: fixed` u donjem desnom uglu, na telefonu je stajalo **preko sadržaja** i jelo dodire. Izmereno skeniranjem cele visine svake strane:
>
> | Širina | Strana | Šta je prekrivalo |
> |---|---|---|
> | 390 | `/proizvodi` | kartice 935-11, 935-12, 935-13 |
> | 390 | `/proizvodi/961-5` | karticu 935-10 |
> | 320 | `/o-nama` | „Dalje" i stavke podnožja |
> | 320 | `/katalog`, `/kontakt`, `/ne-postoji` | stavku „Kontakt" |
>
> Pogrešan pogodak je tu najgori mogući: umesto da otvori proizvod, korisnik **odleti na vrh strane** i izgubi mesto na kom je bio.
>
> Pravilo: dok se ide **naniže** korisnik čita napred i dugme mu ne treba — sklanja se. Pojavi se čim krene **naviše** (tada ga i traži) i **na dnu strane**. Prag od 2px sprečava da podrhtavanje pri zaustavljanju pali i gasi dugme. Uz to podnožje ispod 900px ima `padding-bottom: 5rem` kao rezervu, pa poslednji red veza nikad ne završi ispod njega.
>
> Izmereno posle: **0 prekrivenih veza** na svih 7 strana, na 320 i 390px.

> **Postavlja se PRE grananja za `prefers-reduced-motion`.** Nije efekat nego pomoć u navigaciji, pa mora da radi i tamo gde se režija uopšte ne pokreće — tada skače bez animacije. Bez JS-a ostaje skriveno (`hidden` u HTML-u), jer bez skripte ne bi ni radilo.

**Osvežavanje vraća na vrh.** Razlog nije čistoća nego to što hero ima otvaranje blendom koje bi se odigralo u pozadini dok gledaš sredinu strane, a lepljive sekcije bi se vratile u zatečeno stanje bez uvoda.

> **Poziciju ovde vraća ASTRO, ne pregledač — `scrollRestoration` nije rešenje.** Prva verzija je bila `history.scrollRestoration = "manual"` plus `scrollTo(0,0)` na `beforeunload`, i **radila je u 1 od 6 pokušaja**. Oba poteza promašuju metu:
>
> - `scrollRestoration = "manual"` gasi vraćanje koje radi **pregledač**. Ovde je krivac `ClientRouter`, koji čuva poziciju u **svom** `history.state` i pri učitavanju radi `scrollTo(history.state.scrollX, history.state.scrollY)` (`astro/dist/transitions/router.js`, oko linije 45).
> - `scrollTo(0,0)` na izlasku menja **živu poziciju**, a router je uopšte ne čita.
>
> Nestabilnost („nekad radi") dolazi odatle što router upisuje stanje na `scrollend`: ako taj događaj ne stigne pre napuštanja strane, zapis je zastareo i slučajno bude 0.
>
> Ispravno je **nulovati sam zapis**, uz obavezno očuvanje `index`-a (njime router prati smer kretanja):
>
> ```js
> history.replaceState(Object.assign({}, history.state, { scrollX: 0, scrollY: 0 }), "");
> ```
>
> Ide na `pagehide` **i** `beforeunload`: prvi je jedini pouzdan na mobilnom Safariju, drugi hvata slučajeve kad prvi ne stigne. Izmereno posle: **6/6 vraćanja na vrh**.

> **Dugme „Nazad" ovim nije pokvareno**, i to je provereno, ne pretpostavljeno: `pagehide` i `beforeunload` ne pucaju pri klijentskoj navigaciji (dokument se ne napušta), pa router i dalje vraća poziciju. Izmereno: skrol na 2600 → klik na `/proizvodi` → nazad → **2600**.

## 5d. Produkcijska higijena — uvedeno posle audita (2026-09-16)

### Podaci o firmi su na JEDNOM mestu

`src/lib/firma.ts` je izvor istine za naziv, adresu, telefon, radno vreme i **godinu osnivanja**.

> **Broj godina se RAČUNA, ne upisuje.** Zatečeno stanje: početna je tvrdila „više od **39** godina", `/o-nama` je nosila figuru „**40**", a firma je osnovana 1985 — što je danas **41**. Broj je bio prepisan sa reference pisane pre nekoliko godina i zastarevao je svake godine, na svakom mestu posebno. Sada `godineRada()` računa iz `OSNOVANA`. Ne vraćati upisan broj ni na jedno mesto.

### SEO — šta postoji i gde

| Šta | Gde | Napomena |
|---|---|---|
| `robots.txt` | `src/pages/robots.txt.ts` | ruta, ne statični fajl — adresa mape prati `site` iz konfiguracije |
| `sitemap.xml` | `src/pages/sitemap.xml.ts` | 59 URL-ova (5 stalnih + 54 proizvoda), bez zavisnosti |
| `og:image` | `Layout.astro`, kroz `getImage()` | 1200×630 JPEG iz postojeće fotografije; strana može da pošalje svoju kroz `ogSlika` |
| `LocalBusiness` JSON-LD | `Layout.astro` + `lib/firma.ts` | **samo potvrđeni podaci** — bez ocena, cena i broja zaposlenih |

`lastmod` se u mapi **ne ispisuje**: nemamo pouzdan datum po strani, a izmišljen je gori od nikakvog jer pretraživači po njemu raspoređuju obilaske.

### Zaglavlja i keš — `public/_headers`

Format razumeju Netlify i Cloudflare Pages; na drugom hostu isti sadržaj treba prepisati u njegovu konfiguraciju (`vercel.json`, `.htaccess`, nginx).

> **CSP namerno NIJE dodat.** Sajt ima inline skriptu u `<head>` (skidanje `.no-js` pre prvog iscrtavanja) i `ClientRouter` koji ubacuje svoje inline skripte. CSP koji bi ih pustio traži `'unsafe-inline'` — a takav CSP ne štiti ni od čega i samo daje lažan osećaj sigurnosti. Ispravno rešenje je heš po skripti, što traži da se poštuje pri svakoj izmeni; ne uvoditi dok za to nema volje da se održava.

> `Strict-Transport-Security` je **bez `includeSubDomains`**: ako klijent ima poddomen bez sertifikata (mail, webmail), to bi ga oborilo.

### Mapa stoji na DVE strane, i živa je

Podnožje stoji na svih 61 stranu, pa je ugrađena Google mapa značila da **svaka** strana učitava Google Maps — najskuplji resurs na sajtu, uz to i pitanje pristanka (GDPR), a na strani proizvoda ili u katalogu mapu niko nije tražio.

> **„Učitaj na klik" je PROBANO I VRAĆENO.** Prvo je napravljena fasada koja mapu ubacuje tek na klik. Korisnik je tražio da mapa bude **vidljiva odmah** i predložio da stoji samo na početnoj i na `/kontakt` (2026-09-16). To je i bolje rešenje: umesto da se mapa svuda krije, ona jednostavno **ne stoji tamo gde nema posla**.

Sada: `prikaziMapu = aktivna === "pocetna"` u `Footer.astro`, a `/kontakt` nosi svoju uz adresu. Izmereno posle: zahteva ka Google-u — **početna 34, `/kontakt` 46, ostalih pet strana 0**.

> **Pravni deo (pristanak za Google Maps) ostaje odluka klijenta.** Ako zatraži pun pristanak, fasada „učitaj na klik" se vraća — sačuvana je u istoriji ovog fajla i pravi se za pola sata.

### `npm run build` čisti za sobom

`tools/ocisti.mjs` uklanja iz `dist/` slike koje se nigde ne koriste.

> **Zašto je potrebno:** `src/lib/slike.ts` uvozi svih 198 fotografija kroz `import.meta.glob` sa `eager: true`, pa Vite emituje **svaki original** iako strane koriste isključivo generisane WebP varijante. Izmereno: **198 PNG = 81 MB, referenci u HTML-u i CSS-u NULA.** Build je bio **122 MB**; posle čišćenja je **44 MB**.
>
> Alternativa je bila prebaciti izvore u WebP (ušteda 81%, izmereno na uzorku), ali to **briše originale**, a projekat još nije pod verzionom kontrolom. Kad bude — vredi razmotriti, jer bi skratilo i vreme builda.

### Tailwind OSTAJE — koristi se kao reset, ne za utility klase

Provereno: u celom projektu **nema nijedne Tailwind utility klase**. Prva pomisao je bila ukloniti ga (2 zavisnosti, ~9 KB / 2,7 KB gz = 30% glavnog CSS-a).

> **Odbačeno merenjem.** Sopstveni `@layer base` postavlja samo `html` i `body` — **nema `box-sizing: border-box`, nema reseta margina, nema `img { display:block; max-width:100% }`**. Sve to dolazi iz Tailwind preflight-a. Uklanjanje bi promenilo box model na svih 61 strani zarad 2,7 KB. Ako se ikad bude uklanjao, prvo napisati sopstveni reset i izmeriti svaku stranu pre i posle.

### Optička margina se poništava na blok-labelama

`.t-labela` nosi `margin-inline-end: -0.12em` da labela poravnata UDESNO ne bi vizuelno visila ulevo (razmak koji `letter-spacing` doda iza poslednjeg slova). Kad je ista klasa na **blok-naslovu poravnatom ulevo**, optičkog posla nema, a negativna margina čini element širim od njegove ćelije.

U poslednjoj koloni podnožja to je guralo celu stranu **1,1px preko desne ivice** — `scrollWidth` 1441 pri `clientWidth` 1440, na **svakoj** strani.

> **ZAŠTO JE PROMAKLO I AUDITU: margina je u `em`.** Dok font nije učitan, računa se po rezervnom pismu i prelivanja nema; pojavi se tek posle zamene fonta. Moja proba je merila pre toga i prijavila 0 — pa je audit tvrdio „0 vodoravnog prelivanja na svih devet širina", što nije bilo tačno.
>
> **Svaka provera skrola i geometrije mora da sačeka `document.fonts.ready`.** Bez toga se meri raspored koji korisnik nikad ne vidi. Posle ispravke i sa čekanjem: **63 kombinacije (9 širina × 7 strana), prelivanja 0, grešaka 0.**

### Sitna pravila koja su iz ovoga ispala

- **Komentari u šablonu idu kao `{/* */}`, nikad `<!-- -->`.** HTML komentari završe u izvoru strane koji posetilac vidi. Zamenjeno 37 komentara u 7 fajlova.
- **Nivo naslova kartice zavisi od toga ima li grupa ime** (`/proizvodi`). Ranije je kartica uvek bila `h4`, a `h3` podkategorije se renderovao samo kad grupa ima ime — kod grupa bez imena red je bio `h2 → h4`. Izmereno **8 preskoka**; sada 0 na svih sedam strana.
- **Cilj dodira je najmanje 24px** (WCAG 2.2, 2.5.8). Telefonski linkovi su merili 86×17 na pet strana. Pravilo je `a[href^="tel:"]:not(.telefon)` u `global.css`, **izvan `@layer`** — sloj bi izgubio od pravila u `.astro` fajlovima. Izuzetak su veze u putanji na strani proizvoda: one su unutar reda teksta, gde kriterijum ne važi.
- **`/katalog/dokument` koristi LOKALNE fontove.** Bilo je jedino mesto koje je još vuklo Archivo i JetBrains sa `fonts.googleapis.com` — a strana je javno dostupna.
- **Favicon ima PNG rezerve:** `favicon-32.png` i `apple-touch-icon.png` (180×180, bez zaobljenja — iOS sam seče uglove).

## 5e. Otpornost na pogrešan unos — nalazi iz QA prolaza (2026-09-16)

### Ništa što dolazi iz adrese nije pouzdano

> **`decodeURIComponent` BACA na nevalidnom procentu.** Adresa `/proizvodi#%` (pokvaren link, greška pri kopiranju, loš skraćivač) rušila je **celu skriptu strane** pre nego što bilo šta uradi. Posledica: svih 12 kategorija ostane otvoreno odjednom — strana namerno sažeta na 3.052px vraća se na ~12.500px — a prebacivanje kategorija, aktivna stavka u indeksu i lampa prestanu da rade.
>
> Ispravka je `try/catch` sa povratkom na prvu kategoriju. Provereno posle: `#%`, `#%E0%A4%A`, `#nepostojeca` i prazan hash — svi daju **1 vidljivu kategoriju, 0 grešaka**.

### Mobilni meni — tri kvara koja se vide tek pod pritiskom

| Kvar | Kako se pokazao | Ispravka |
|---|---|---|
| **Nema zamke fokusa** | Od 16 pritisaka Taba, **4 su izašla** iz otvorenog menija (prvo na „Preskoči na sadržaj") — korisnik tastature pomera fokus po strani koju ne vidi | krug fokusa dok je `aria-expanded="true"` |
| **Pozadina se skroluje** | `body { overflow: hidden }` ne zaustavlja Lenis, koji stranu pomera **programski** | `lenis.stop()` / `lenis.start()` uz otvaranje i zatvaranje |
| **Stanje preživi promenu veličine** | Otvoren na 390px pa prozor proširen na 1440px → `aria-expanded` ostaje `true`, `overflow: hidden` ostaje na telu; povratak na usku širinu prikaže meni otvoren bez ijedne radnje korisnika | `matchMedia("(min-width: 900px)")` zatvara meni; prag prati isti breakpoint na kom se prekidač krije |

> **Zaključavanje skrola se NE testira sa `window.scrollBy`.** Programski skrol zaobilazi i Lenis i `overflow`, pa test uvek „padne". Meri se **pravim točkićem** (`page.mouse.wheel`) sa pokazivačem nad preklopom. Izmereno posle ispravke: 0 → 0 dok je otvoren, 0 → 746 posle zatvaranja.

### „Preskoči na sadržaj" mora i da POMERI fokus

Veza je menjala hash i pomerala pogled, ali je `document.activeElement` ostajao `<body>` — sledeći Tab vraćao je korisnika u zaglavlje, pa preskakanje nije imalo efekta.

Dva uslova, oba obavezna:
1. `<main id="sadrzaj" tabindex="-1">` — bez toga pregledač `<main>` uopšte ne može da fokusira;
2. rukovalac sidara u `motion.ts` sam poziva `cilj.focus({ preventScroll: true })`, jer iznad stoji `preventDefault()` koji je ubio nativno ponašanje.

### Kosa crta na kraju mora da se poklopi sa `canonical`

`Layout.astro` gradi kanonsku adresu iz `Astro.url.pathname`, a on u buildu vraća `/proizvodi/` — **sa** kosom crtom. Prva verzija mape sajta ispisivala je `/proizvodi` bez nje, pa je pretraživač za istu stranu dobijao dva signala. Provereno: canonical i `<loc>` se sada poklapaju na svim proverenim rutama.

### Šta je izdržalo pritisak

Provereno, ne pretpostavljeno: 25 uzastopnih klikova na kategorije → 1 vidljiva; 40 klikova na sličice galerije → tačno 1 aktivna; 5 klijentskih prelaza na 120ms → ispravna strana, 0 grešaka; 4 ciklusa nazad/napred kroz View Transitions → bez nagomilavanja; zum **200% i 400%** → 0 prelivanja; sve slike blokirane → 0 pomeranja rasporeda; `#<script>`, `?ram=`, `?proizvod=` → bez injekcije (poruka ide kroz `.value`, hash se proverava prema poznatim sekcijama); duboki link proizvod → kontakt pogađa **54/54**.

## 5f. Responzivnost — izmereno stanje i zamke u merenju

Mereno na **10 širina × 7 strana = 70 kombinacija**, svaka posle `document.fonts.ready` i posle prolaska kroz celu stranu.

| Provera | Nalaz |
|---|---|
| Vodoravno skrolovanje | **0** na svih 70 |
| Elementi koji vire iz ekrana | **0** |
| Odsečen tekst | **0** |
| Slike izvan okvira | **0** |
| Polomljene mreže | **0** |
| Prelomne tačke (719/720, 859/860, 899/900, 999/1000, 1199/1200) | sve čiste |
| Razmak između sekcija | 0px — padding je unutar njih |
| Ciljevi dodira < 24px | **0** |
| Hero staje u jedan ekran | **10/10 širina**, uključujući iPhone SE |

### Dužina reda na uskim ekranima — PROVERENO, ne dira se

Prva procena (širina ÷ `0.5em`) rekla je 27–33 znaka na 320px i „mnogo crtica". **Stvarno merenje po vizuelnim redovima daje medijanu 34 na 320px, 42 na 375px, 44 na 390px — i NIJEDAN red prelomljen crticom.**

Smanjenje bočnog razmaka sa 20 na 16px donosi **jedan znak po redu**, a oduzima vazduh uz ivicu ekrana. Manji font bi pogoršao čitljivost. **Nema popravke koja ne šteti više nego što pomaže** — ostavljeno kako jeste.

> Nauk: broj znakova po redu se meri **stvarnim prelomima** (`Range` po znakovima, praćenje promene `top`), ne deljenjem širine sa procenjenom širinom znaka. Gruba procena je ovde promašila za trećinu i skoro proizvela štetnu izmenu.

### Tri lažne uzbune koje će se ponoviti svakom automatskom proverom

1. **„Sekcija Poziv se preklapa sa podnožjem" (375–768px) — ne postoji.** Detektor je merio na `scrollY = 0`, kad je sekcija još u dolaznom stanju scrub animacije, pomerena ~150px transformacijom **na roditelju** (zato je `transform` na samom dugmetu bio `none`). `offsetTop` lanac, koji ne zavisi ni od skrola ni od transformacija, daje **113px razmaka, isto pre i posle**. Geometrija se meri `offsetTop`-om ili posle sleganja, nikad usred scrub-a.
2. **„Znak BSP je širi od ekrana" — nije.** `.znak` je `display: block`, pa mu okvir zauzima celu širinu kolone (280–691px), dok slova zauzimaju **77–104px**. Sva „preklapanja" s njim su preseci praznog dela okvira. Merodavan je `Range.getBoundingClientRect()`.
3. **`p.vizuelno-skriveno` i `img.pogon-slika`** — prvo je pomoćni tekst za čitače (sečenje je svrha), drugo je parallax uvećan na 1,18 unutar kadra koji ga seče. Oboje po projektu.

### Usamljena kartica u poslednjem redu na 768px — namerno

Devet kartica u dve kolone daje četiri puna reda i jednu samu. To je posledica `align-items: start` i pravila da je „dno reda namerno nazubljeno, kao u časopisu". Ne ispravljati.

## 5g. Pristupačnost — izmereno stanje (2026-09-17)

Mereno na svih 7 strana. Rezultat posle ispravki:

| Provera | Nalaz |
|---|---|
| Tačno jedan `h1` po strani | **7/7** |
| Preskočeni nivoi naslova | **0** |
| Slike bez `alt` | **0** od 69 |
| Bezimene veze i dugmad | **0** |
| Fokusabilni elementi unutar `aria-hidden` | **0** |
| Duplirani `id` | **0** |
| Tekst ispod AA praga kontrasta | **0** |
| Ciljevi dodira < 24×24px | **0** |

### Šta je ispravljeno

1. **Dugme „na vrh"** — vidi sekciju 5c: `visibility` umesto samo `opacity`, i premešteno na kraj `<body>`.
2. **Fokus na poljima forme** je pojačan sa 1px unutrašnjeg prstena na `outline: 2px` + `offset: 2px`, isto kao veze i dugmad. Ide kroz `:focus-visible`, pa klik mišem ne crta prsten. Pravilo se mora ponoviti i pod `.forma-ploca`, inače ga pravilo za ploču nadjača.
3. **`aria-current="page"` u mobilnom meniju.** Desktop navigacija ga je imala, mobilni meni nije — ista navigacija je govorila različito u zavisnosti od širine ekrana.

### Odluke koje se NE menjaju

- **Mobilni meni nije `role="dialog"`.** To je razotkrivanje navigacije, ne modal; `dialog` bi tražio `aria-modal` i `inert` na pozadini bez ikakve koristi. `aria-expanded`, `aria-controls`, Escape i zamka fokusa su dovoljni i provereni.
- **Ukrasna godina „1985"** na `/o-nama` ima kontrast 1,14:1, ali stoji unutar `aria-hidden="true"` — nefunkcionalni tekst, na koji se WCAG izuzetak odnosi. Podatak je na strani ispisan još šest puta.
- **Bez `fieldset`/`legend`** u formi — jedna namena, grupisanje bi dodalo buku.

### Tri zamke u merenju pristupačnosti

1. **Parser boja mora da razume `oklab()`.** Prva provera je prijavila da ISO bedževi padaju na **3,55:1**; bedž ima podlogu u `oklab(0.9697 …)`, a regex je uzeo prva tri broja kao RGB. Stvarna vrednost je **5,45:1**. Boje se razrešavaju **preko canvasa** (`fillStyle` + `getImageData`), nikad regexom — inače parser i propušta stvarne padove.
2. **`aria-hidden` se proverava na PRECIMA, ne na elementu.** Dva „nalaza" (ukrasni šеvron i godina 1985) bila su lažna jer atribut nosi roditelj. Uvek `e.closest('[aria-hidden="true"]')`.
3. **Redosled Taba se ne meri petljom od 40 brzih pritisaka.** Tab sam skroluje stranu, a skrol menja vidljivost dugmeta „na vrh" — pa je merenje prijavilo da dugme nije poslednje. Provereno pravim scenarijem (fokus na poslednjoj vezi podnožja, pa jedan Tab): **dugme je poslednje zaustavljanje.**

## 5h. Performanse — izmereno i optimizovano (2026-09-17)

### Ime prelaza ide kroz `style`, NIKAD kroz `transition:name`

Astro za **svaku** direktivu `transition:name` emituje sopstveni ugrađeni `<style>` blok od ~2,3 KB sa punim skupom pravila za prelaz. Kartica proizvoda ima dva imena, pa je `/proizvodi` sa 54 kartice imala **108 blokova = 255 KB CSS-a u HTML-u**, dok je spoljni CSS svega 38 KB.

**A ta pravila nisu radila ništa.** `global.css` već definiše `::view-transition-group(*)`, `old(*)` i `new(*)` sa trajanjima sajta (550ms / 300ms), neslojevito — a neslojevito uvek pobeđuje `@layer astro` u koji Astro smešta svoja. Dakle 255 KB se parsiralo pa odbacivalo.

```astro
<!-- NE -->  transition:name={`slika-${p.slug}`}
<!-- DA -->  style={`view-transition-name: slika-${p.slug}`}
```

| | pre | posle |
|---|---|---|
| `/proizvodi` ugrađeni `<style>` | 110 blokova, **255,1 KB** | 1 blok, **0,9 KB** |
| `/proizvodi` HTML | 333 KB sirovo, 18,3 KB gz | **78 KB** sirovo, **10,1 KB** gz |
| `/proizvodi` pokrivenost CSS-a | **12%** | **65%** |
| `/proizvodi/961-5` ugrađeni `<style>` | 14 blokova, 30,4 KB | **0** |

Provereno da prelaz i dalje radi: 108 imenovanih elemenata u mreži, `startViewTransition` se poziva, `h1` i slika na strani proizvoda nose ista imena kao kartica, tri uzastopna prelaza bez greške.

### Crta ispod znaka „BSP" ide `clip-path`-om, ne `width`-om

`width` traži RASPORED u svakom frejmu. Izmereno na deset hover ciklusa: **+422 prolaza rasporeda, +84ms**. Posle prelaska na `clip-path`: **+0 prolaza, +0,0ms.**

> **`scaleX` ovde NE radi.** Crta ide od fiksnih 14px do 100%, a odnos zavisi od širine znaka „BSP" koja se menja sa prelomnom tačkom — faktor razmere se ne može zapisati u CSS-u. `clip-path: inset(0 calc(100% - 14px) 0 0)` to rešava tačno. Provereno na šest širina: element je svuda 43px, a vidi se tačno 14px.

### Podskup za JetBrains Mono — IZMERENO I ODBAČENO

Audit je procenio uštedu od ~35 KB. Stvarno merenje kroz Google Fonts `text=`:

| Skup znakova | Veličina |
|---|---|
| samo izmereno u upotrebi (59 znakova) | 23,9 KB |
| + sva velika slova i ĆŠĐ (76) | 31,1 KB |
| + i sva mala slova (97) | **44,7 KB — gore nego sada** |
| **sada** (dva fajla, ceo `latin` + `latin-ext`) | **42,0 KB** |

Google-ovo podskupljanje varijabilnog fonta je neefikasno: podaci o osama koštaju ~20 KB bez obzira na broj glifova, pa **dodavanje 37 znakova košta 20 KB**. Obe težine (400 i 500) se stvarno koriste, pa ni svođenje na jednu nije opcija bez vizuelne promene.

Ostaje samo izbor između uštede od 11 KB (76 znakova) ili 18 KB (59 znakova) — uz **tihu krhkost**: svaki novi znak u mono tekstu koji nije na spisku iscrtava se rezervnim pismom, bez ikakvog upozorenja. Kataloške oznake dolaze iz klijentovih podataka.

**Odbačeno**: 11–18 KB je 2–3,5% prvog ekrana, a cena je greška koja se ne primeti dok je neko ne vidi na sajtu. Pravo podskupljanje (`fonttools`/`pyftsubset`) bi dalo bolji odnos, ali traži novu zavisnost u alatu. Ako se ikad uvede, ovde su brojevi.

### Mapa je i dalje najteža stvar na sajtu

Izmereno: podnožje početne povuče **59 zahteva i 1.997 KB** čim se doskroluje; `/kontakt` **46 zahteva trećih strana, 1.887 KB skripti**. Sve ostale strane imaju **0 trećih strana**. To je svesna odluka korisnika (mapa mora biti vidljiva odmah) i nije dirana — vidi sekciju 5d.

## 5i. SEO — izmereno stanje (2026-09-17)

Analizirano svih **61 izgrađena strana** direktno iz `dist/`.

| Provera | Stanje |
|---|---|
| `<title>` | 0 nedostaje, **0 duplikata**, max 53 znaka |
| Meta description | **0 duplikata, 0 preko 160, 0 ispod 70** (medijana 149) |
| `canonical` | prisutan svuda, **0 slučajeva gde ne pokazuje na sebe** |
| `noindex` | tačno jedna strana — `/katalog/dokument` |
| `sitemap.xml` | 59 URL-ova, **0 nepostojećih, 0 nedostajućih**, poklapa se sa `canonical` |
| `h1` | po jedan po strani, **0 duplikata**, 0 preskočenih nivoa |
| JSON-LD | **114 blokova, 0 nevalidnih** — `LocalBusiness` 60, `BreadcrumbList` 54, `Product` 54 |
| `og:image` | **55 jedinstvenih** — svaka strana proizvoda šalje svoju fotografiju |
| `alt` | 488 slika, 0 bez `alt` |
| URL | 0 velikih slova, 0 dijakritike, 0 donjih crta, dubina najviše 2 |
| 404 | vraća HTTP **404**, ne 200 |

### Šta je ispravljeno i zašto

**`og:image` po proizvodu.** `Layout` je oduvek primao `ogSlika`, ali ga nijedna strana nije prosleđivala — pa je **60 od 61 strane** delilo istu fotografiju hale. Deljen link na konkretan krevet prikazivao je halu.

**`h1` nosi oznaku I tip.** Više proizvoda deli istu katalošku oznaku, pa je bilo **devet strana sa nejedinstvenim `h1`** — pet različitih proizvoda imalo je `h1` koji glasi samo „48". Izgled je netaknut (oznaka u display veličini, tip ispod); ime prelaza je pomereno na unutrašnji `span` da bi se morfovala samo oznaka.

> **Meta opis se GRADI, ne lepi.** Ranije `${naziv}. ${uvod[0]}` skraćeno na 300: **19 opisa preko 160** i **18 ispod 70**.
>
> Tri zamke, sve izmerene:
> 1. Prvi pasus često **ponavlja naziv** — „Krevet za transport pacijenta manuelni 906(16). Krevet za transport pacijenta MD 906…"
> 2. Izuzetak koji je preskakao naziv kad ga uvod sadrži **napravio je duplikate**: braća iz iste serije dele isti uvodni pasus, pa su `906(16)` i `906(17)` dobila identičan opis. Naziv sada ide **uvek**, jer jedini nosi varijantu u zagradi.
> 3. Dopuna bez tačke pre nje spaja rečenice — „…Porođajni krevet Izrada po meri…", izmereno na **25 strana**.
>
> Seče se na granici REČI oko 155 znakova, a prekratak se dopunjava potvrđenom rečenicom o izradi po meri.

**`BreadcrumbList` i `Product` na 54 strane.** Strana je imala vidljivu putanju koju pretraživač nije mogao pročitati. `Product` nosi naziv, oznaku, fotografiju, kategoriju i proizvođača (`@id` pokazuje na `LocalBusiness`).

> **NAMERNO bez `offers`, `price`, `availability` i `aggregateRating`.** Te podatke nemamo, a izmišljeni strukturirani podaci su razlog za ručnu kaznu, ne za bolji rang. Ne dodavati ih dok klijent ne da cene.

> **`Disallow` i `noindex` se PONIŠTAVAJU.** `robots.txt` je zabranjivao `/katalog/dokument`, a strana je imala i `noindex`. Zabrana obilaska znači da robot **ne može da pročita `noindex`**, pa se strana i dalje može pojaviti kao gola adresa. `Disallow` je uklonjen; `noindex` radi posao. PDF katalog se takođe ne zabranjuje — ima pretraživ tekst i njegovo indeksiranje je prednost.

**Naslovi četiri glavne strane produženi** sa 12–23 na 31–52 znaka, isključivo potvrđenim činjenicama (godina osnivanja, adresa, broj modela). Jedanaest strana proizvoda ostaje kratko jer im je naziv stvarno kratak — dopuna bi bila punjenje ključnim rečima.

### Ostaje otvoreno (traži klijenta)

- **`geo`, `image`, `logo`, `email`, `sameAs`** u `LocalBusiness` — koordinate se ne izmišljaju, logo i e-mail još nisu stigli.
- **Google Business Profile** — za firmu sa jednom lokacijom nosi više od svega na sajtu; ne može se uraditi u kodu.

## 5j. Bezbednost — pregled i ispravke (2026-09-17)

Sajt je **statički build bez servera**: nema baze, sesija ni serverskog koda koji obrađuje unos. To uklanja celu klasu rizika, pa su nalazi malobrojni i uglavnom preventivni.

**Nijedna tajna nije nađena** — ni u `src/`, `tools/`, `data/`, `public/`, ni u izgrađenom sajtu. Nema `.env`, `.pem`, `.key`. Build ne nosi **nijednu source mapu**, nijedan test/debug/backup fajl, ni `tools/` ni `data/`.

### `JSON.stringify` u `<script>` NIJE bezbedan sam po sebi

`JSON.stringify` **ne ekranira `<`**. Ako bi neka vrednost sadržala `</script>`, blok bi se prekinuo i ostatak bi pregledač tumačio kao HTML. Podaci dolaze iz `data/*.json`, koji su **skinuti sa reference**, ne pisani rukom.

Zato sve što ide u `<script>` prolazi kroz `uSkriptu()` iz `lib/firma.ts`:

```ts
JSON.stringify(podaci).replace(/</g, "\u003c")
```

Provereno: `</script><img src=x onerror=...>` postaje `</script>...`, a `JSON.parse` vraća **identičnu vrednost**. Danas nijedan podatak to ne sadrži (851 polje, 0 sa `<`), ali podaci se menjaju kad stigne klijentov asortiman.

> **Zamka pri pisanju ove ispravke:** u izvoru mora stajati `"\u003c"` — **dve** obrnute kose crte. Sa jednom JS to čita kao sam znak `<`, pa je zamena prazan hod. Prvi pokušaj je tako i ispao, i test je pokazao izlaz identičan ulazu. Ovakva ispravka se **mora testirati kroz stvarni modul**, ne pogledom u kod.

### Ostaci sa starog WordPress sajta u podacima

Mehaničko preuzimanje sadržaja povuklo je i delove korisničkog interfejsa reference:

| Ostatak | Strana |
|---|---|
| `PREUZMI KATALOG` (natpis dugmeta) | **20** |
| `http://bsp.rs/wp-content/uploads/2024/04/strana-47.pdf` | 1 |

Prikazivali su se kao **opis proizvoda**. Uklonjeno 21 stavka i 21 prazna sekcija; 631 → 610 stavki, svih 54 proizvoda netaknuto.

> Raniji sadržajni pregled ovo nije uhvatio jer je tražio „lorem", „placeholder" i „TODO" — a ovo je izgledalo kao legitiman srpski tekst. **Kod preuzetog sadržaja se traži i UI tekst reference**: „preuzmi", „download", „klikni", „opširnije", sirove adrese.

### Paleta boja se proverava pre nego što uđe u CSS

`cssBoje` se upisuje kroz `set:html` u `<style>`. Danas su `id` i `hex` tvrdo upisani, ali sekcija 7 kaže da se lista **zamenjuje klijentovim RAL asortimanom**. Čim vrednosti dođu iz podataka, `hex` poput `red}#x{background:url(...)` izlazi iz pravila i ubacuje proizvoljan CSS.

Provera (`id` = `^[a-z0-9-]+$`, `hex` = `^#[0-9a-f]{3,6}$`) postavljena je **pre** zamene, a ne posle. Puca namerno sa jasnom porukom — tiho preskakanje boje dalo bi paletu kojoj nedostaje nijansa, a niko ne bi znao zašto.

### Svesno NIJE urađeno

- **CSP** — sajt ima inline skripte (skidanje `.no-js`, JSON-LD) i `ClientRouter`. CSP koji bi ih pustio traži `'unsafe-inline'`, što ne štiti ni od čega. Ispravno je heš po skripti, uz obavezu osvežavanja pri svakoj izmeni — odloženo dok klijent ne potvrdi projekat.
- **Astro 7** — jedina zakrpa za tri prijavljene ranjivosti, ali prelomna. `sharp` i `esbuild` se **ne izvršavaju u pregledaču** (provereno: 0 fajlova u isporučenom JS-u); njihov rizik je ograničen na mašinu koja gradi sajt.

### Dugme „na vrh" — histereza umesto praga od 2px

Prva verzija je upoređivala svaki događaj skrola sa prethodnim uz prag od 2px. Lenis pri zaustavljanju šalje niz sve sitnijih pomaka, pa je smer naizmenično ispadao tačan i netačan — **dugme je nekoliko puta zatreperilo** pre nego što se skloni.

Sada stanje smera menja tek pomeraj od **24px** u istom pravcu, uz sidro koje prati krajnju tačku tekućeg smera. Mirovanje sklanja dugme jednom, 700ms posle poslednjeg pomeraja; na dnu strane ostaje vidljivo (tamo je očekivano, i jedino je tada dohvatljivo tastaturom).

Izmereno posle: skrol nagore pa zaustavljanje → **1 pojava, 1 sklanjanje, 0 treperenja**. Dvanaest pomeraja od ±8px → **0 promena vidljivosti**.

## 5k. Fotografije proizvoda su WebP (2026-09-17)

Originali su bili PNG: **198 fajlova, 78,6 MB — 94% celog repozitorijuma.** Prevedeni su u WebP **pre prvog commita**, i taj trenutak je bio jedini ispravan.

> **Zašto baš pre prvog commita.** Git pamti istoriju: da su PNG-ovi jednom ušli, repo bi ih nosio zauvek i posle brisanja, pa bi svako kloniranje vuklo i stare i nove. Ranije sam istu izmenu **odbio** jer verzione kontrole nije bilo, pa je brisanje originala bilo nepovratno — sada je obrnuto.

**Postavke:** `quality: 92, alphaQuality: 100, effort: 6`. Izabrane merenjem, ne osećajem:

| Izvor | Repo | Razlika u ISPORUČENOJ slici |
|---|---|---|
| PNG (bilo) | 78,6 MB | — |
| WebP bez gubitka | 51 MB | 0,55/255 |
| **WebP q92** | **14,5 MB** | **0,85/255** |
| WebP q85 | 12,9 MB | 0,91/255 |

Merodavna je poslednja kolona: Astro ionako ponovo kodira izvor u WebP za isporuku, pa se poredi **ono što posetilac vidi**, ne izvor. Razlika od 0,85/255 je oko **0,3% opsega** — ispod praga vidljivosti. `q92`, a ne `q85`, zbog lupe: ona koristi najveću varijantu, gde rezerva vredi.

> **Zamka u merenju kvaliteta slika sa providnošću.** Prvo poređenje je pokazalo da i konverzija **bez gubitka** ima razliku od 26/255 — što je nemoguće. Uzrok: u potpuno providnim oblastima RGB vrednosti su proizvoljne i ulaze u prosek. Meri se tek pošto se **obe slike spoje na istu podlogu** (`flatten`). Posle ispravke: bez gubitka = 0,00, tačno kako i treba.

**Provereno posle konverzije:** 198/198 konvertovano, 0 grešaka, **0 pogrešnih dimenzija, 0 izgubljene providnosti**; svih 54 proizvoda ima sliku; 0 puklih slika na četiri provere; lupa i dalje radi na 1,59× sa varijantom od 1324px.

> **Direktan uvoz slike je pukao build.** `index.astro` je uvozio `961-5--0.png` po imenu (za sekciju „Izbliza"). Obrazac u `slike.ts` je prebačen na `.webp`, ali taj jedan uvoz nije — build je pao sa „Could not resolve". Kad se menja format izvora, traže se **i** obrazac **i** svaki direktan uvoz: `grep -rn "assets/proizvodi/" src/`.

## 5l. Objavljivanje na GitHub Pages (2026-09-18)

Probno izdanje stoji na `https://ivankurtis18-alt.github.io/bsp-test/`. Radi automatski: svaki `push` na `main` pokreće `.github/workflows/deploy.yml`, koji gradi sajt i objavljuje ga.

> **GitHub Pages NE UME da pokrene build.** Servira ono što nađe u repou, a u repou je izvor (`dist/` je namerno van njega). Bez workflow-a Pages prikazuje **404** — ne zato što nešto ne valja, nego zato što `index.html` nastaje tek gradnjom.

### Sajt stoji u PODFOLDERU — i to menja sve unutrašnje adrese

`base: '/bsp-test'` u konfiguraciji. Astro prefiks dodaje **samo** na ono što sam generiše — CSS, JS i slike iz `astro:assets`. **Ručno pisane adrese ostaju netaknute** i vode na koren domena, gde ničega nema.

Izmereno pre ispravke: **22 ručno pisana linka u 9 fajlova**, 6 dinamičkih, 5 putanja ka `public/` i 6 u `fontovi.css`. Bez toga bi na Pages-u nestali navigacija, favicon i fontovi.

Rešenje je `put()` iz `src/lib/putanja.ts` — čita `import.meta.env.BASE_URL`, pa **isti kod radi i u korenu i u podfolderu**. Prelazak na pravi domen je zato samo izmena `astro.config.mjs`: vratiti `site: 'https://bsp.rs'` i obrisati `base`. Ništa drugo.

> **Tri mesta koja regex ne hvata**, a lako se previde:
> - **navigacija iz niza** (`const veze = [{ href: "/proizvodi" }]`) — nije `href="..."` u markupu;
> - **adrese građene u frontmatteru** (`const upit = \`/kontakt?...\``);
> - **klijentske skripte** (`cta.href = ...`) — tamo `import.meta.env.BASE_URL` takođe radi, Vite ga zameni pri gradnji.

> **Fontovi idu RELATIVNOM putanjom.** CSS ne može da čita `BASE_URL`. Pošto se pakuje u `_astro/`, `url("../fonts/x.woff2")` pokazuje na `public/fonts/` i u korenu i u podfolderu. Generator `tools/fontovi.mjs` sada ispisuje relativne putanje — ne vraćati na `/fonts/`.

### Probno izdanje se NE INDEKSIRA

`robots.txt` vraća `Disallow: /` dok domen nije `bsp.rs`. Razlog: probno izdanje je javno dostupan **duplikat** pravog sajta; da ga pretraživač indeksira, `bsp.rs` bi se kasnije takmičio sam sa sobom. Prepoznaje se po domenu, ne po zastavici — da prelazak na pravi domen ne traži izmenu ovog fajla.

### Provereno posle izmene

Sajt posluživan iz `/bsp-test/`: svih 6 strana — **0 grešaka, 0 neuspelih zahteva, 0 puklih slika**, font `Archivo` aktivan, svih 6 fontova sa statusom 200. Navigacija: sve veze nose prefiks, klik na „Proizvodi" vodi na `/bsp-test/proizvodi`. PDF katalog 200. Mapa sajta i kanonske adrese nose `/bsp-test/` i poklapaju se.

> **`public/_headers` na Pages-u ne radi ništa** — to je format Netlify-ja i Cloudflare-a. Bezbednosna zaglavlja i keš politika važe tek kad sajt pređe na takvog domaćina. Fajl ostaje, ne smeta.

## 6. Pokretanje

```
npm run dev      # http://localhost:4321
npm run build    # dist/
npm run check    # tipovi
```

### Otvaranje na kraju sesije — OBAVEZNO

Kad se završi rad, sajt se otvara u pregledaču **bez pitanja**. Uvek sveže, nikad iz keša, i uvek **produkcioni build** — ne dev server.

```powershell
# 1. UGASI stari preview — vidi upozorenje ispod
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -match 'BSP\node_modules.*astro\.js.*preview' -or $_.CommandLine -match 'npm-cli\.js.*run preview' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }

npm run build
npm run preview            # sluša na http://localhost:4322 (u pozadini)
Start-Process "http://localhost:4322/?v=$([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())"
```

> **Preview se MORA ugasiti pre novog.** `npm run preview` u pozadini nadživi sesiju. Pošto se otvaranje radi na kraju svake sesije, serveri se nakupljaju — zatečeno ih je **176 procesa (88 parova, od 10. septembra)**, zajedno oko 3 GB RAM-a. Posledice su bile dve i obe su izgledale kao nešto drugo:
> - `npm run build` je počeo da puca sa `memory allocation ... failed` — izgledalo je kao da je projekat prerastao Node-ov heap, a bilo je 1,4 GB slobodno od 7,9 GB.
> - Mašina pod tim pritiskom **muca u skrolu**. Pre nego što se optuži animacija, proveriti koliko je slobodno: `Get-CimInstance Win32_OperatingSystem`.
>
> Samo prvi server drži port 4322; ostali ostanu živi a ne služe ništa. Ne pomaže `--max-old-space-size` — problem nije heap nego fizička memorija.

**Samo početna.** Ne otvarati više kartica odjednom.

**Zašto preview, a ne dev server:** dev server ubacuje HMR klijent i (ranije) Astro dev traku sa dugmadima Audit / Settings / Inspect na dnu ekrana. To nije deo sajta i zbunjuje pri oceni dizajna. `preview` servira tačno ono što ide na produkciju. Dev traka je i trajno ugašena u `astro.config.mjs`.

**Zašto cache-busting `?v=`:** pregledač ume da servira staru verziju iz bfcache i posle izmena, pa se gleda nešto što više ne postoji. Jedinstven parametar pri svakom otvaranju to isključuje. Dodatno, `Layout.astro` u dev režimu šalje `no-store` meta oznake.

**Zašto se ne otvara `dist/index.html` duplim klikom:** provereno — ne radi. Astro build koristi apsolutne putanje (`/_astro/...`), koje preko `file://` beže na koren diska, pa se CSS uopšte ne učita (font ispadne Times New Roman). Uz to, pregledači blokiraju ES module preko `file://` (*„from origin 'null'"*), pa GSAP nikad ne krene. Ovo je posledica izbora Astro stacka; statički sajt bez build koraka bi se otvarao duplim klikom.

## 6a. Ideje za kasnije — ne raditi bez traženja

- Traka materijala i boja (uzorci plastifikacije i tapacirunga, čist CSS, bez fotografija).
- Tamna sekcija pred podnožjem kao tonsko sidro.
- Traka napretka i lepljivo dugme za ponudu na `/proizvodi`.
- OG slika za deljenje (traži grafički materijal).
- Navigacija po odeljenju (intenzivna nega, dijaliza…) i sekcija „Servis i rezervni delovi" — obe traže potvrdu klijenta.

## 7. Otvoreno — čeka odluku ili materijal

- [ ] **Forma se ne šalje.** `ENDPOINT` u `src/pages/kontakt.astro` je prazan. Sajt je statičan pa traži spoljni servis (Formspree / Web3Forms / Netlify Forms). Dok je prazno, forma ne glumi uspeh nego upućuje na telefon.
- [ ] **Nemamo e-mail adresu firme.** Nigde je nema na referentnom sajtu. Treba je tražiti od klijenta.
- [ ] **PALETA BOJA JE PRIVREMENA.** Sekcija „Boje i materijali" na početnoj radi sa okvirnim RAL vrednostima i generičkim nazivima tapacirunga, jer ne znamo njihov stvarni asortiman. **Tražiti od klijenta:** listu RAL oznaka plastifikacije koje rade i uzorke/nazive eko-kože i mikrofibera. Zameniti nizove `plastifikacija` i `tapacirung` u `src/pages/index.astro`. Na stranici već stoji napomena da je prikaz orijentacioni.
- [x] ~~**Fotografije proizvoda.**~~ Rešeno: 198 fotografija sa reference, **svih 54 proizvoda ima sliku** (provereno 2026-09-15). Placeholder ostaje samo kao rezerva. Otvoreno ostaje jedino da su rezolucije niske (614–1772px), što ograničava lupu i katalog.
- [ ] **Hero fotografija je premala za pun ekran.** `hero-hala.jpg` je **1376×768**, a preko celog ekrana na 1920px pokriva samo **66%**. Treba ≥2100px, idealno 2560px. Ne uvećavati postojeći fajl — traži se original od klijenta.
- [ ] **Copy sekcije „Kako nastaje nalog"** (početna) — napisan strogo u okviru poznatih činjenica, ali traži potvrdu klijenta.
- [ ] **Logo.** Trenutno je wordmark „BSP" u Archivo 700 sa plavom crtom. Ako postoji pravi logo — zameniti.
- [ ] **PIB / matični broj** za podnožje, ako klijent želi.
