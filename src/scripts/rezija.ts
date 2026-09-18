import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * SKROL REŽIJA
 *
 * Razlika u odnosu na obično otkrivanje (`data-otkrij` u `motion.ts`): tamo
 * element uđe u kadar i animacija se odigra do kraja, bez obzira na to šta
 * korisnik radi dalje. Ovde POZICIJA SKROLA DRŽI STANJE — svaka sekcija ima
 * ULAZ → GRAĐENJE → PREOBRAŽAJ → IZLAZ i vraća se unazad ako se skroluje
 * nagore.
 *
 * Pet trenutaka, ne pedeset animacija:
 *
 *  1. HERO — predaja. Slojevi odlaze različitim brzinama; proizvod raste i
 *     omekšava dok tekst izmiče.
 *  2. BROJKE — odbrojavanje vezano za skrol, ne za ulazak u kadar.
 *  3. IZBLIZA — otvor. Kadar se otvara iz proreza, diše dok specifikacije
 *     prolaze, pa se zatvara. Glavni trenutak strane.
 *  4. PO MERI — vodoravna traka. Naniže se skroluje, koraci putuju ulevo.
 *  5. POZIV — sklapanje. Dve kolone dolaze različitim brzinama i smiruju se.
 *
 * Pravila izvedbe:
 *  - anima se samo ono što ne pravi raspored: `transform`, `opacity`,
 *    `clip-path`, `filter`. Nijedna sekvenca ne dira širinu, visinu ni margine.
 *  - `scrub` je broj, ne `true`: vrednost zaostaje za skrolom i zaglađuje ga.
 *  - `invalidateOnRefresh` na svemu što meri piksele — pri promeni širine se
 *    sve vrednosti menjaju.
 */
export function postaviReziju(): () => void {
  const cistaci: Array<() => void> = [];

  hero();
  brojke();
  izbliza();
  poMeri(cistaci);
  poziv();

  return () => cistaci.splice(0).forEach((f) => f());
}

/* ══════════════════════════════════════════════════════════════════════
   1. HERO — predaja

   Hero ne bledi u celini. Rastavlja se: proizvod ide napred (raste, tone u
   dubinu i omekšava), tekst izmiče naviše brže od strane, a traka činjenica
   se kreće SUPROTNO. Tri brzine daju dubinu koju zajednički fade nema.
   ══════════════════════════════════════════════════════════════════════ */
function hero() {
  const sekcija = document.querySelector<HTMLElement>("[data-hero]");
  if (!sekcija) return;

  /* `end: "bottom bottom"`, NE `"bottom top"`.

     Hero je viši od ekrana i njegova scena je lepljiva; lepljenje popušta
     kad dno sekcije stigne do dna ekrana. Ako okidač traje do `bottom top`,
     druga polovina kamere se odvija DOK slika odlazi — izmereno: na 75%
     skrola je od fotografije ostalo 347px, na 100% nula. Sav taj pokret
     niko ne vidi.

     Sa `bottom bottom` cela kamera stane u lepljivu fazu: kompozicija
     miruje, skrol vozi pogled, pa se tek onda hero povuče. */
  const zajednicki = {
    trigger: sekcija,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.6,
    invalidateOnRefresh: true,
  } as const;

  /* Ravni se RAZMIČU. Raster jedva da se pomeri, proizvod uzmiče u dubinu,
     tipografija odlazi najbrže. Razlika u brzini je jedino što pravi
     prostor — nijedna od tri nema efekat koji bi se video sam za sebe. */

  // POZADINA — najsporija. Raster ostaje skoro na mestu i time drži scenu.
  const raster = sekcija.querySelector<HTMLElement>(".hero-raster");
  if (raster) {
    gsap.to(raster, { yPercent: 6, opacity: 0.35, ease: "none", scrollTrigger: zajednicki });
  }

  /* ── KAMERA ULAZI U HALU ─────────────────────────────────────────────
     Četiri pokreta na celom heroju, ni jedan više: odlazak tipografije,
     potisak kamere, povlačenje vela, razrešenje u sledeću sekciju.

     ZAŠTO NIJE ZUM. `scale(1) → scale(1.2)` se čita kao uvećanje slike.
     Kamera koja prilazi radi dve stvari istovremeno: predmet raste, a
     okolina beži OKO njega. To se dobija skaliranjem oko tačke NA KREVETU
     (`transform-origin: 73% 65%`, izmereno) uz mali uspravni pomeraj —
     kamera koja ide napred i blago se podiže.

     Pomeraj je `y`, ne `object-position`: `object-position` na slici preko
     celog ekrana pravi ponovno iscrtavanje svakog frejma, a `transform`
     ostaje na kompozitoru. Isti optički rezultat, bez cene.

     BEZ EASING-a na scrub tvinovima (`ease: "none"`): vrednost mora da prati
     poziciju skrola linearno, inače pokret „vuče" i deluje kao da zaostaje. */
  const slika = sekcija.querySelector<HTMLElement>(".hero-slika");
  const veo = sekcija.querySelector<HTMLElement>("[data-hero-veo]");
  const usko = !window.matchMedia("(min-width: 1000px)").matches;

  if (slika) {
    gsap.to(slika, {
      scale: usko ? 1.06 : 1.14,
      y: usko ? 0 : -22,
      ease: "none",
      scrollTrigger: zajednicki,
    });
  }

  /* Veo se POVLAČI — izvor svetla odlazi levo van ekrana, pa mirna zona
     nestaje i fotografija preuzima ceo kadar. Ovo je „prozor postaje
     prostorija" bez okvira: okvira nema, pa se prostor otvara svetlom.
     Kreće tek na 15% — dok se naslov čita, mirna zona mora da ostane. */
  if (veo && !usko) {
    gsap.fromTo(
      veo,
      { "--veo-x": "-6%" },
      {
        "--veo-x": "-46%",
        ease: "none",
        scrollTrigger: { ...zajednicki, start: "top+=15% top" },
      },
    );
  }

  /* RAZREŠENJE. Donja ivica fotografije jeste hairline trake činjenica —
     scena se završava tačno tamo gde ta crta počinje. Crta STOJI (ne crta se
     na skrol): probano je da se izvlači, ali je tokom cele lepljive faze
     ostajala nevidljiva, pa je traka činjenica gubila svoju ivicu.

     Predaju nosi crta sekcije „Brojke" (`data-predaja`), koja se izvlači
     tačno kad lepljenje popusti i fotografija krene iz kadra: linija preuzima
     liniju. */

  // PREDNJI PLAN — najbrži.
  const sadrzaj = sekcija.querySelector<HTMLElement>(".hero-sadrzaj");
  if (sadrzaj) {
    gsap.to(sadrzaj, {
      y: () => -window.innerHeight * 0.22,
      /* Do nule, ne do 0.06. Na beloj podlozi je 0.06 bilo nevidljivo; preko
         fotografije se čita kao mrlja od slova. */
      opacity: 0,
      ease: "none",
      scrollTrigger: zajednicki,
    });
  }

  /* Redovi naslova se pritom razmiču i vodoravno, svaki za nijansu više.
     `x` je slobodan — tajmlajn učitavanja koristi `yPercent`. */
  [...sekcija.querySelectorAll<HTMLElement>("[data-hero-red]")].forEach((red, i) => {
    gsap.to(red, { x: -(10 + i * 14), ease: "none", scrollTrigger: zajednicki });
  });

  // Traka činjenica ide SUPROTNO — slojevi se razmiču, strana ne klizi u komadu.
  const meta = sekcija.querySelector<HTMLElement>("[data-hero-meta]");
  if (meta) {
    gsap.to(meta, { y: 56, ease: "none", scrollTrigger: zajednicki });
  }

  /* PREDAJA — hero na odlasku povlači prvi potez sledeće sekcije.
     Crta se iscrtava kroz poslednjih 45% izlaska heroja, pa dve sekcije
     dele jedan potez umesto da se smenjuju. */
  const predaja = document.querySelector<HTMLElement>("[data-predaja]");
  if (predaja) {
    gsap.fromTo(
      predaja,
      { scaleX: 0, transformOrigin: "left center" },
      {
        scaleX: 1,
        ease: "none",
        /* Kreće kad lepljenje popusti i hero počne da odlazi: crta „Brojki"
           se izvlači tačno u trenutku kad fotografija napušta kadar. */
        scrollTrigger: { ...zajednicki, start: "bottom bottom", end: "bottom top" },
      },
    );
  }

}

/* POMERANJE KADRA ZA POKAZIVAČEM je UKLONJENO (2026-09-15, na traženje
   korisnika: „prelaskom miša preko slike i teksta oni se blago pomeraju,
   izbaci taj efekat").

   Ne vraćati. Na fotografiji preko celog ekrana svaki pomeraj kadra prati
   miš i po tekstu — a tekst koji mrda dok se čita je smetnja, ne dubina.
   Hero svoj utisak nosi blendom pri učitavanju i kamerom na skrol; treći
   pokret vezan za miš je bio višak. */

/* ══════════════════════════════════════════════════════════════════════
   2. BROJKE — odbrojavanje vezano za skrol

   Brojač koji krene na ulazak u kadar odigra se jednom i gotov je. Ovde
   vrednost visi o poziciji skrola: nazad-napred je vrti u oba smera, pa broj
   deluje kao očitavanje instrumenta, a ne kao efekat.
   ══════════════════════════════════════════════════════════════════════ */
function brojke() {
  const red = document.querySelector<HTMLElement>(".brojke");
  if (!red) return;

  const polja = [...red.querySelectorAll<HTMLElement>("[data-broj]")];
  if (!polja.length) return;

  polja.forEach((el) => {
    const cilj = Number(el.dataset.broj);
    if (!Number.isFinite(cilj)) return;

    const stanje = { v: 0 };
    gsap.to(stanje, {
      v: cilj,
      ease: "none",
      scrollTrigger: {
        trigger: red,
        start: "top 92%",
        end: "top 45%",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
      onUpdate: () => {
        el.textContent = Math.round(stanje.v).toLocaleString("sr-RS");
      },
    });
  });

  /* Stupci ulaze različitim brzinama — prvi skoro odmah, poslednji zaostaje.
     Red se time ne pojavljuje kao blok nego kao niz očitavanja. */
  const stavke = [...red.children] as HTMLElement[];
  stavke.forEach((st, i) => {
    gsap.fromTo(
      st,
      { y: 26 + i * 14, opacity: 0.25 },
      {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: red,
          start: "top bottom",
          end: "top 55%",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}

/* ══════════════════════════════════════════════════════════════════════
   3. IZBLIZA — otvor  ★ glavni trenutak strane

   Kadar se ne pojavljuje — OTVARA se. Prorez u sredini se širi naviše i
   naniže dok sekcija ulazi (ULAZ), predmet zatim polako raste i jedva
   primetno se okreće dok specifikacije prolaze pored njega (GRAĐENJE →
   PREOBRAŽAJ), pa se prorez zatvara odozdo dok sekcija odlazi (IZLAZ).

   Rotacija je 1.1° — ispod praga na kom se čita kao trik, taman dovoljno da
   kadar ne deluje zalepljeno dok stoji.
   ══════════════════════════════════════════════════════════════════════ */
function izbliza() {
  const sekcija = document.querySelector<HTMLElement>("[data-izbliza]");
  if (!sekcija) return;

  const kadar = sekcija.querySelector<HTMLElement>("[data-izbliza-otvor]");
  const stavke = sekcija.querySelector<HTMLElement>(".izbliza-stavke");

  if (kadar) {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: sekcija,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    /* Otvor je BLENDA, ne dolazak: koristi simetričnu krivu (`power2.inOut`),
       pa pokret ima i početak i kraj. Sa `power3.out` je kadar naglo
       kretao i dugo se smirivao — to je ponašanje predmeta koji stiže, a
       ovde se ništa ne doseljava, nego se otvara. */
    tl
      // ULAZ — prorez se otvara, predmet dolazi izdaleka
      .fromTo(
        kadar,
        { clipPath: "inset(44% 6% 44% 6%)", scale: 1.16, yPercent: 4 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1.01, yPercent: 0, duration: 0.26 },
      )
      // GRAĐENJE → PREOBRAŽAJ — kadar diše dok specifikacije prolaze
      .to(kadar, { scale: 1.06, rotate: -1.1, duration: 0.5 })
      // IZLAZ — zatvara se odozdo, istim putem kojim je i došao
      .to(kadar, { clipPath: "inset(0% 0% 40% 0%)", scale: 0.97, rotate: 0, duration: 0.24 });
  }

  /* Kolona sa specifikacijama putuje sporije od kadra. Razlika u brzini pravi
     dubinu; sama vrednost je namerno mala da se ne čita kao pokret, samo kao
     prostor. */
  if (stavke) {
    gsap.fromTo(
      stavke,
      { y: 64 },
      {
        y: -64,
        ease: "none",
        scrollTrigger: {
          trigger: sekcija,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      },
    );
  }
}

/* ══════════════════════════════════════════════════════════════════════
   4. PO MERI — vodoravna traka

   Skrol naniže vozi korake ulevo. Nema GSAP pina: okvir se lepi CSS-om
   (`position: sticky`), a scena dobija tačno onoliko visine koliko traka ima
   pomaka — sticky i ScrollTrigger tako mere isti broj i ne mogu da se
   razmimoiđu.

   Bez skripte scena nema `data-traka-spremna` i sve ostaje obična mreža.
   ══════════════════════════════════════════════════════════════════════ */
function poMeri(cistaci: Array<() => void>) {
  const scena = document.querySelector<HTMLElement>("[data-pm-scena]");
  const okvir = document.querySelector<HTMLElement>("[data-pm-okvir]");
  const traka = document.querySelector<HTMLElement>("[data-pm-traka]");
  const napredak = document.querySelector<HTMLElement>("[data-pm-napredak]");
  /* Meri se ZAGLAVLJE, ne `.shell`. `.shell` je pun preko cele širine i
     razmak drži iznutra paddingom, pa mu `getBoundingClientRect().left`
     vraća 0 — izmereno. Zaglavlje je sam sadržaj i njegova leva ivica je
     tačno ona sa kojom traka treba da se poklopi. */
  const merilo = document.querySelector<HTMLElement>(".po-meri .pm-zaglavlje");
  if (!scena || !okvir || !traka || !merilo) return;

  // Uska širina: jedna kolona teksta nema šta da vozi vodoravno.
  const dovoljnoSiroko = window.matchMedia("(min-width: 860px)");

  // Tvin, ne ScrollTrigger: okidač visi o njemu i gasi se zajedno s njim.
  let okidac: gsap.core.Tween | null = null;
  let montiranje = false;

  const razmontiraj = () => {
    okidac?.scrollTrigger?.kill();
    okidac?.kill();
    okidac = null;
    scena.removeAttribute("data-traka-spremna");
    scena.style.height = "";
    traka.style.removeProperty("--pm-uvod");
    gsap.set(traka, { clearProps: "transform" });
    napredak?.style.removeProperty("--pm-progres");
  };

  const montiraj = () => {
    // `refreshInit` puca i zbog okidača koji ova funkcija sama pravi.
    if (montiranje) return;
    montiranje = true;

    razmontiraj();
    if (!dovoljnoSiroko.matches) {
      montiranje = false;
      return;
    }

    // Leva ivica sadržaja: `.shell` ima i max-width i auto marginu, pa se ta
    // vrednost ne može napisati u CSS-u.
    traka.style.setProperty("--pm-uvod", `${merilo.getBoundingClientRect().left}px`);

    /* `data-lenis-prevent` SE SKIDA — ovo je bio pravi uzrok trzanja.

       Atribut pripada mobilnom, gde je traka stvaran vodoravni skroler sa
       `scroll-snap` i prevlačenjem prstom: tamo Lenis ne sme da otme gest.
       Na desktopu traka NIJE skroler nego je vozi transformacija — a dok je
       sekcija zalepljena, ona prekriva **ceo ekran**.

       Lenis proverava celu putanju `wheel` događaja i ako bilo koji čvor
       nosi ovaj atribut, izlazi BEZ `preventDefault` (`lenis.mjs`, ~609).
       Posledica: čim pokazivač uđe u tu sekciju, točkić prestaje da ide
       kroz Lenis i pregledač skroluje nativno, u skokovima od oko 100px po
       zubu. Preko toga stoji `scrub` glačanje od 0,5s, pa se čita kao
       „skroluje u mestu, vrati malo unazad, pa naglo nastavi" — i to
       ISKLJUČIVO u toj sekciji, dok ostatak sajta radi glatko.

       Taj razlikovni znak je i bio ključ: greška koja pogađa jednu sekciju,
       a nestaje čim se vuče skrol traka (nativni skrol, bez pokazivača nad
       trakom). */
    traka.removeAttribute("data-lenis-prevent");

    scena.setAttribute("data-traka-spremna", "");

    // Meri se TEK pošto je vodoravni raspored upaljen.
    const pomak = Math.max(0, traka.scrollWidth - okvir.clientWidth);
    if (pomak < 40) {
      // Traka staje u ekran — vodoravne vožnje nema, mreža je poštenija.
      razmontiraj();
      montiranje = false;
      return;
    }

    /* LEPLJIVI PUT JE `visina scene − visina okvira`. Ništa više.

       Ranije je ovde stajalo `+ innerHeight * 0.24` uz obrazloženje da je
       to `top` lepljivog okvira. Pogrešno: `top` određuje KADA lepljenje
       počne, ne koliko traje. Izvođenje:

         lepljenje počinje na  scrollY = scenaVrh − T
         lepljenje pušta na    scrollY = scenaVrh + H − O − T
         put                 = H − O

       Sa dodatih 24vh put je bio `pomak + 216px`, pa je posle završetka
       trake ostajalo 216px MRTVOG lepljivog skrola — dva-tri poteza točkića
       u kojima se ništa ne pomera, ni napred ni nazad. Izmereno: traka je
       završavala na y=5748, a lepljenje puštalo tek na ~5874. */
    scena.style.height = `${okvir.offsetHeight + pomak}px`;

    /* PRAVI TVIN, ne `onUpdate` + `gsap.set`.

       Sa `gsap.set` se upisuje običan `translateX`: GSAP primenjuje
       `translate3d` samo na TVINOVE (`force3D: "auto"`), ne na `set()`.
       Bez 3D transformacije traka nema svoj kompozitorski sloj, pa
       pregledač iznova rasterizuje sva četiri koraka sa tekstom u svakom
       frejmu — vidi se kao da se tekst prelama dok se vozi. Zato tvin i
       `force3D: true`.

       Ovo je ujedno JEDINI element na sajtu koji sme trajno da drži sloj:
       njegov posao je pomeranje velike površine, i to je tačno ono za šta
       sloj postoji. Ne vraćati `will-change` nigde drugde. */
    okidac = gsap.to(traka, {
      x: -pomak,
      ease: "none",
      force3D: true,
      /* BROJ, ne `true`. Probano je `true` i BILO JE GORE.

         Lenis piše razlomljene pozicije skrola, a `window.scrollY` se
         zaokružuje na cele piksele. Sa `scrub` kao brojem glava tvina
         stiže do cilja sopstvenim tvinom i to zaokruživanje se filtrira;
         sa `true` ono ide pravo u `x`.

         Otud simptom koji se lako pogrešno pročita: dok se VUČE skrol
         traka pomaci su veliki i jednosmerni pa se treptaj ne vidi, a na
         TOČKIĆU je pomak po frejmu mali, pa je zaokruživanje veliki deo
         njega — skakuće samo na mišu. Ako se prijavi „miš loše, traka
         dobro", krivac je ovde, ne u geometriji scene. */
      scrub: 0.5,
      onUpdate() {
        // Progres se čita SA TVINA, ne sa okidača: okidač nosi sirovu
        // poziciju skrola, pa bi traka napretka vodila ispred koraka.
        napredak?.style.setProperty("--pm-progres", String(this.progress()));
      },
      scrollTrigger: {
        trigger: scena,
        start: "top 24%",
        end: `+=${pomak}`,
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    montiranje = false;
  };

  montiraj();

  const naPromenu = () => {
    montiraj();
    ScrollTrigger.refresh();
  };

  dovoljnoSiroko.addEventListener("change", naPromenu);
  ScrollTrigger.addEventListener("refreshInit", montiraj);

  cistaci.push(() => {
    dovoljnoSiroko.removeEventListener("change", naPromenu);
    ScrollTrigger.removeEventListener("refreshInit", montiraj);
    razmontiraj();
  });
}

/* ══════════════════════════════════════════════════════════════════════
   5. POZIV — sklapanje

   Poslednja sekcija ne sme da nastavi da se kreće — ona je odredište. Dve
   kolone dolaze različitim brzinama i SMIRUJU SE NA NULI pre nego što
   sekcija stigne do sredine ekrana. Kretanje prestaje tačno tamo gde treba da
   se pročita poziv.
   ══════════════════════════════════════════════════════════════════════ */
function poziv() {
  const sekcija = document.querySelector<HTMLElement>(".poziv");
  if (!sekcija) return;

  const naslov = sekcija.querySelector<HTMLElement>(".poziv-naslov");
  const desno = sekcija.querySelector<HTMLElement>(".poziv-desno");

  const okidac = {
    trigger: sekcija,
    start: "top bottom",
    end: "top 42%",
    scrub: 0.7,
    invalidateOnRefresh: true,
  } as const;

  if (naslov) {
    gsap.fromTo(naslov, { y: 90, x: -18 }, { y: 0, x: 0, ease: "none", scrollTrigger: okidac });
  }
  if (desno) {
    gsap.fromTo(desno, { y: 150 }, { y: 0, ease: "none", scrollTrigger: okidac });
  }
}
