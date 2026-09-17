import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { postaviReziju } from "./rezija";

gsap.registerPlugin(ScrollTrigger);

const tiho = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Reduced motion: postavi sve na finalno stanje, bez glatkog skrola, i izađi.
 * Nijedna sekvenca ne sme da bude jedini put do vidljivog sadržaja.
 */
const mirnoStanje = () => {
  gsap.set("[data-otkrij]", { opacity: 1, y: 0, clearProps: "all" });
  gsap.set("[data-maska]", { clipPath: "none", clearProps: "clipPath" });
  gsap.set(".rec", { y: 0, clearProps: "transform" });
};

/* Sve što treba ugasiti pre nego što View Transitions zameni telo strane.
   Bez ovoga se pri svakoj navigaciji nakupi novi sloj ScrollTrigger-a nad
   elementima kojih više nema. */
const cistaci: Array<() => void> = [];

const ocisti = () => {
  cistaci.splice(0).forEach((f) => f());
  ScrollTrigger.getAll().forEach((okidac) => okidac.kill());
  gsap.globalTimeline.clear();
};

const pokreni = () => {
  /* Dugme za povratak na vrh ide PRE grananja: ono nije efekat nego pomoć u
     navigaciji, pa mora da radi i pri `prefers-reduced-motion`, gde se
     režija uopšte ne pokreće. */
  povratakNaVrh();

  if (tiho) {
    mirnoStanje();
    return;
  }

  glatkiSkrol();
  inicijalizuj();
};

/**
 * Povratak na vrh.
 *
 * Pojavljuje se tek posle jedne visine ekrana — dok se hero vidi, dugme za
 * povratak na hero nema šta da radi. Penjanje ide kroz Lenis kad ga ima,
 * inače nativno; pri reduced motion skače bez animacije.
 */
function povratakNaVrh() {
  const dugme = document.querySelector<HTMLButtonElement>("[data-na-vrh]");
  if (!dugme) return;

  dugme.hidden = false;

  /* DUGME NESTAJE DOK SE ČITA NANIŽE.

     Ranije je bilo vidljivo čim se pređe jedna visina ekrana i ostajalo do
     kraja strane. Pošto je `position: fixed` u donjem desnom uglu, na
     telefonu je stajalo **preko sadržaja** i jelo dodire. Izmereno
     skeniranjem cele visine svake strane:

       390px  /proizvodi        prekriva kartice 935-11, 935-12, 935-13
       390px  /proizvodi/961-5  prekriva karticu 935-10
       320px  /o-nama           prekriva „Dalje" i stavke podnožja
       320px  /katalog, /kontakt, /ne-postoji  prekriva stavku „Kontakt"

     Pogrešan pogodak je tu najgori mogući: umesto da otvori proizvod,
     korisnik odleti na vrh strane i izgubi mesto na kom je bio.

     Rešenje ne dira izgled: dok se ide NANIŽE korisnik čita napred i
     dugme mu ne treba, pa se sklanja. Pojavi se čim krene NAVIŠE — tada
     ga i traži — i na samom dnu strane, gde je i očekivano. Uz to
     podnožje ima rezervu u visini dugmeta (vidi `Footer.astro`), pa
     poslednji red veza nikad ne završi ispod njega. */
  /* HISTEREZA, ne prag od dva piksela.

     Prva verzija je upoređivala svaki događaj sa prethodnim uz prag od 2px.
     Lenis pri zaustavljanju šalje niz sve sitnijih pomaka, pa je `naViše`
     naizmenično ispadalo tačno i netačno — dugme je nekoliko puta zatreperilo
     pre nego što se skloni.

     Sada stanje smera menja tek pomeraj od 24px u istom pravcu. Sidro prati
     krajnju tačku u tekućem smeru: dok je dugme skriveno pamti se najniža
     tačka (da se hvata kretanje NAGORE), dok je vidljivo najviša (da se
     hvata povratak NADOLE). Sitno podrhtavanje pri zaustavljanju je time
     ispod praga i ne menja ništa. */
  const PRAG = 24;
  let sidro = window.scrollY;
  let naViše = false;
  let tajmerMirovanja: ReturnType<typeof setTimeout> | undefined;

  const priDnuStrane = () =>
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 120;

  const prikazi = (vidljivo: boolean) =>
    dugme.toggleAttribute("data-vidljivo", vidljivo && window.scrollY > window.innerHeight);

  const oceni = () => {
    const y = window.scrollY;

    if (y < sidro - PRAG) {
      naViše = true;
      sidro = y;
    } else if (y > sidro + PRAG) {
      naViše = false;
      sidro = y;
    } else {
      sidro = naViše ? Math.min(sidro, y) : Math.max(sidro, y);
    }

    prikazi(naViše || priDnuStrane());

    /* MIROVANJE SKLANJA DUGME — jednom, čisto.

       Dok se skroluje nagore dugme treba; kad se korisnik zaustavi, više
       nema šta da radi na ekranu. Tajmer se poništava na svaki događaj, pa
       se okine tačno jednom, 700ms posle poslednjeg pomeraja — bez
       treperenja.

       Na DNU strane ostaje vidljivo: tamo je i očekivano, i jedino je tada
       dohvatljivo tastaturom (skriveno dugme je `visibility: hidden`, dakle
       van redosleda Taba). */
    clearTimeout(tajmerMirovanja);
    tajmerMirovanja = setTimeout(() => {
      if (priDnuStrane()) return;
      naViše = false;
      sidro = window.scrollY;
      prikazi(false);
    }, 700);
  };

  oceni();
  window.addEventListener("scroll", oceni, { passive: true });

  const penji = () => {
    if (tiho) {
      window.scrollTo(0, 0);
      return;
    }
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };
  dugme.addEventListener("click", penji);

  cistaci.push(() => {
    clearTimeout(tajmerMirovanja);
    window.removeEventListener("scroll", oceni);
    dugme.removeEventListener("click", penji);
    dugme.removeAttribute("data-vidljivo");
  });
}

document.addEventListener("astro:page-load", pokreni);

document.addEventListener("astro:before-swap", () => {
  ocisti();
  ugasiSkrol();
});


/* ============================================================
   Glatki skrol (Lenis), vezan za GSAP ticker.

   Isti pristup koriste i proizvođači u branši — Malvestio vozi Lenis.
   Bitno: ScrollTrigger mora da se ažurira iz Lenis-a, a Lenis iz GSAP
   ticker-a. Dva nezavisna rAF ciklusa daju podrhtavanje na pin/scrub
   animacijama.
   ============================================================ */
let lenis: Lenis | null = null;
let tik: ((vreme: number) => void) | null = null;
let sidraPostavljena = false;

/** Lenis se pravi iznova za svaku stranu: podrazumevani swap prepisuje
 *  atribute `<html>`, pa bi klase `lenis lenis-smooth` nestale i glatki
 *  skrol bi ostao upisan u JS a ugašen u CSS-u. */
function ugasiSkrol() {
  if (tik) {
    gsap.ticker.remove(tik);
    tik = null;
  }
  lenis?.destroy();
  lenis = null;
  window.__lenis = undefined;
}

function glatkiSkrol() {
  ugasiSkrol();

  lenis = new Lenis({
    /* `lerp`, NE `duration` + `easing`. Ovo je izmerena odluka.

       Lenis ima dva režima. Sa `duration` i `easing` svaki zamah točkića
       POKREĆE KRIVU IZNOVA od nule ka novom cilju. Dok se točkić okreće
       neprekidno, to je niz naglih polazaka: kriva `expo.out` kreće naglo i
       ima dug rep, pa se dobija trzaj → usporavanje → trzaj.

       Izmereno po frejmu, neprekidan točkić, SAMO skrol strane (bez ijedne
       zalepljene sekcije u kadru):

         13 7 8 8 6 6 | 17 13 13 12 10 9 | 19 17 14 14 12 | 22 18 17 50 6 …

       Testera: 27 naglih polazaka na 200 frejmova, uz frejm od 50px odmah
       posle koga ide 6px. Sa `lerp` se ništa ne restartuje — položaj se
       neprekidno prigušuje ka cilju koji se sam pomera, pa je izlaz
       monoton.

       ZAŠTO SE VIDELO SAMO U „4 koraka do isporuke": tamo je sekcija
       zalepljena, pa je vodoravna traka JEDINA stvar koja se kreće na
       ekranu — svaka neravnina Lenisa ide pravo u nju. Drugde se pomera
       ceo kadar i oko to ne registruje. Otud i simptom „na točkiću
       skakuće, na vučenju skrol trake radi": vučenje skrol trake je
       nativni skrol, Lenis u njemu uopšte ne učestvuje.

       Vrednost je birana merenjem, ne osećajem. Broj naglih polazaka na
       200 frejmova: `duration 1.05` → **27**, `lerp 0.085` → 15,
       **`lerp 0.06` → 4**. Ispod toga (0.04) nema više dobitka, a skrol
       počinje da klizi. Veće je hitrije, manje je klizavije. */
    lerp: 0.06,
    smoothWheel: true,
    // Na dodir ostaje nativni skrol: glatki skrol na telefonu se bori sa
    // inercijom sistema i deluje sporo.
    syncTouch: false,
  });

  window.__lenis = lenis;

  lenis.on("scroll", ScrollTrigger.update);

  tik = (vreme: number) => lenis?.raf(vreme * 1000);
  gsap.ticker.add(tik);
  gsap.ticker.lagSmoothing(0);

  // Sidra na istoj strani idu kroz Lenis, inače pregledač skoči trenutno.
  // Osluškivač visi na `document` i nadživljava zamenu tela — postavlja se
  // tačno jednom, a do tekućeg Lenis-a stiže kroz promenljivu.
  if (sidraPostavljena) return;
  sidraPostavljena = true;

  document.addEventListener("click", (e) => {
    // Ako je neki raniji rukovalac već preuzeo klik (npr. indeks kategorija
    // na /proizvodi), ovde se ne mešamo.
    if (e.defaultPrevented) return;

    const veza = (e.target as HTMLElement | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
    if (!veza) return;

    const id = veza.getAttribute("href")?.slice(1);
    if (!id) return;
    const cilj = document.getElementById(id);
    if (!cilj) return;

    e.preventDefault();
    /* Sidro dobija VREMENSKU krivu izričito. Otkad Lenis stoji na `lerp`,
       `scrollTo` bez `duration` bi se prigušivao eksponencijalno i vukao
       dug rep na kraju — kod skoka preko pola strane to se čita kao da
       sajt ne može da se zaustavi. Ovde je kriva ispravna jer se cilj ne
       pomera: skok je jedan, poznat unapred. */
    lenis?.scrollTo(cilj, { offset: -104, duration: 1.1 });

    /* FOKUS SE MORA POMERITI RUČNO.

       Iznad stoji `preventDefault()`, pa nativno ponašanje sidra — koje
       inače pomera fokus na odredište — više ne radi. Bez ovoga veza
       „Preskoči na sadržaj" pomeri pogled, ali čitač ekrana i tastatura
       ostanu na vrhu strane.

       `preventScroll: true` jer skrol već vozi Lenis; bez toga bi
       pregledač skočio odmah i poništio glatko kretanje. Odredište koje
       nije prirodno fokusabilno dobija privremeni `tabindex`. */
    const vracen = cilj.getAttribute("tabindex");
    if (vracen === null) cilj.setAttribute("tabindex", "-1");
    cilj.focus({ preventScroll: true });
    if (vracen === null) {
      cilj.addEventListener("blur", () => cilj.removeAttribute("tabindex"), { once: true });
    }

    history.replaceState(null, "", `#${id}`);
  });
}

function inicijalizuj() {
  /* ----------------------------------------------------------
     1. Otkrivanje na skrol.

     Vozi ga IntersectionObserver, ne ScrollTrigger. Razlog: sadržaj koji
     počinje na opacity:0 ne sme da zavisi od scroll matematike koja se
     razilazi kad se promeni visina strane (fontovi, sticky, slike).

     Elementi sa `data-maska` se ne pojavljuju fejdom nego se otkrivaju
     odozdo naviše, kao da izlaze iza ivice — naslovi tako deluju
     postavljeno, a ne ubačeno.
     ---------------------------------------------------------- */
  const otkrij = (elementi: HTMLElement[]) => {
    if (!elementi.length) return;

    /* Zastavica za pratece CSS efekte (iscrtavanje kota, markeri na
       vremenskoj liniji). Sam element svoj ulaz vozi kroz GSAP; ovo je
       samo signal potomcima da je red na njih. */
    elementi.forEach((el) => el.setAttribute("data-vidljiv", ""));

    const reci = elementi.filter((el) => el.hasAttribute("data-reci"));
    const maske = elementi.filter(
      (el) => el.hasAttribute("data-maska") && !el.hasAttribute("data-reci"),
    );
    const obicni = elementi.filter(
      (el) => !el.hasAttribute("data-maska") && !el.hasAttribute("data-reci"),
    );

    // Reč po reč: svaka izlazi iz svog prozora, uz mali pomak u vremenu.
    for (const blok of reci) {
      gsap.to(blok.querySelectorAll(".rec"), {
        y: 0,
        duration: 0.85,
        ease: "expo.out",
        stagger: 0.045,
        overwrite: "auto",
      });
    }

    // Vodoravni ulaz ide brže i sa manjim pomakom — kota se izvlači, ne pada.
    const poOsi = (lista: HTMLElement[], os: string) =>
      lista.filter((el) => (el.dataset.smer ?? "y") === os);

    const uspravni = poOsi(obicni, "y");
    const vodoravni = poOsi(obicni, "x");
    const mirni = poOsi(obicni, "mir");

    if (uspravni.length) {
      gsap.to(uspravni, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.07,
        overwrite: "auto",
      });
    }

    if (vodoravni.length) {
      gsap.to(vodoravni, {
        opacity: 1,
        x: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.055,
        overwrite: "auto",
      });
    }

    if (mirni.length) {
      gsap.to(mirni, { opacity: 1, duration: 0.9, ease: "power1.out", stagger: 0.06, overwrite: "auto" });
    }

    for (const el of maske) {
      const vodoravna = el.getAttribute("data-maska") === "x";
      gsap.to(el, {
        opacity: 1,
        y: 0,
        clipPath: vodoravna ? "inset(0% -6% 0% 0%)" : "inset(0% 0% -14% 0%)",
        duration: vodoravna ? 1 : 0.95,
        ease: vodoravna ? "power3.inOut" : "power3.out",
        overwrite: "auto",
      });
    }
  };

  const svi = [...document.querySelectorAll<HTMLElement>("[data-otkrij]")];

  const posmatrac = new IntersectionObserver(
    (unosi) => {
      const usli = unosi
        .filter((u) => u.isIntersecting)
        .map((u) => u.target as HTMLElement)
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

      usli.forEach((el) => posmatrac.unobserve(el));
      otkrij(usli);
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0 },
  );

  svi.forEach((el) => posmatrac.observe(el));
  cistaci.push(() => posmatrac.disconnect());

  /* Sigurnosna mreža: sadržaj nikad ne sme trajno da ostane nevidljiv.
     Posmatrač se NAMERNO ne gasi — disconnect() bi ubio sva buduća
     otkrivanja i sve ispod te tačke ostalo bi zauvek nevidljivo.

     PRAG JE `innerHeight`, NE `innerHeight * 0.9`. Posmatrač ima
     `rootMargin: "0px 0px -10%"`, pa element koji na KRAJU strane ostane u
     donjih 10% ekrana nikad ne uđe u smanjeni koren — a sa pragom od 0.9
     ga ni mreža nije hvatala. Rezultat: na kratkim stranama je poslednja
     sekcija mogla zauvek da ostane na `opacity: 0`.

     Izmereno na `/katalog` (2.133px, dakle kraća od dva ekrana): tri
     elementa zaglavljena — `izdanje`, naslov poziva i `poziv-desno`.
     Zato mreža sada radi i na kraj skrola, ne samo na tajmer. */
  const pokupiZaostale = () => {
    const zaostali = svi.filter(
      (el) =>
        parseFloat(getComputedStyle(el).opacity) < 0.99 &&
        el.getBoundingClientRect().top < window.innerHeight,
    );
    if (!zaostali.length) return;
    zaostali.forEach((el) => {
      posmatrac.unobserve(el);
      el.setAttribute("data-vidljiv", "");
    });
    gsap.set(zaostali, { opacity: 1, x: 0, y: 0, clipPath: "none", overwrite: "auto" });
  };

  /* Reči imaju svoju mrežu: blok je opacity 1 pa ga gornja provera ne vidi,
     a same reči mogu ostati ispod ivice prozora. */
  const pokupiReci = () => {
    document.querySelectorAll<HTMLElement>("[data-reci]").forEach((blok) => {
      if (blok.getBoundingClientRect().top > window.innerHeight * 0.9) return;
      const reci = [...blok.querySelectorAll<HTMLElement>(".rec")];
      const skrivene = reci.filter((r) => r.getBoundingClientRect().height > 0 && r.offsetTop >= 0 && getComputedStyle(r).transform !== "none");
      if (skrivene.length) gsap.set(skrivene, { y: 0 });
    });
  };

  const tajmeri = [window.setTimeout(pokupiZaostale, 3500), window.setTimeout(pokupiReci, 3600)];
  const naUcitavanju = () => window.setTimeout(pokupiZaostale, 1200);
  window.addEventListener("load", naUcitavanju);

  /* Kad se skrol smiri, proveri da nije nešto ostalo zaglavljeno pri dnu.
     Prigušeno na 200ms — ovo je mreža, ne mehanizam otkrivanja. */
  let smirenje = 0;
  const naSkrolu = () => {
    window.clearTimeout(smirenje);
    smirenje = window.setTimeout(pokupiZaostale, 200);
  };
  window.addEventListener("scroll", naSkrolu, { passive: true });

  cistaci.push(() => {
    tajmeri.forEach((t) => window.clearTimeout(t));
    window.clearTimeout(smirenje);
    window.removeEventListener("load", naUcitavanju);
    window.removeEventListener("scroll", naSkrolu);
  });

  /* ----------------------------------------------------------
     2. Svetlosni sto. Bazen svetla se pomera i diše dok se skroluje.
        Parallax ide samo na dekorativni sloj, nikad na tekst.
     ---------------------------------------------------------- */
  document.querySelectorAll<HTMLElement>("[data-svetlo]").forEach((el) => {
    gsap.fromTo(
      el,
      { "--svetlo-y": "62%", "--svetlo-jacina": 0.7 } as gsap.TweenVars,
      {
        "--svetlo-y": "34%",
        "--svetlo-jacina": 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
      } as gsap.TweenVars,
    );

    const plovak = el.querySelector<HTMLElement>("[data-plovak]");
    if (plovak) {
      gsap.fromTo(
        plovak,
        { yPercent: 5 },
        {
          yPercent: -5,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
        },
      );
    }
  });

  /* ----------------------------------------------------------
     3. Parallax u kadru. Slika je viša od okvira i putuje sporije od
        strane, pa traka dobija dubinu umesto da bude nalepnica.
     ---------------------------------------------------------- */
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((okvir) => {
    const slika = okvir.querySelector<HTMLElement>("img");
    if (!slika) return;

    gsap.set(slika, { scale: 1.18 });
    gsap.fromTo(
      slika,
      { yPercent: -7 },
      {
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: okvir, start: "top bottom", end: "bottom top", scrub: 0.7 },
      },
    );
  });

  /* ----------------------------------------------------------
     3b. Udaljavanje. Predmet se blago smanjuje dok izlazi iz kadra, kao da
         ostaje na stolu a pogled se diže. Suptilno namerno — preko ~7% se
         čita kao trik, ne kao dubina.
     ---------------------------------------------------------- */
  document.querySelectorAll<HTMLElement>("[data-udalji]").forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 1 },
      {
        scale: 0.93,
        ease: "none",
        scrollTrigger: { trigger: el, start: "center center", end: "bottom top", scrub: 0.9 },
      },
    );
  });

  /* ----------------------------------------------------------
     4. Hero — jedna orkestrirana sekvenca na učitavanju.
     ---------------------------------------------------------- */
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  if (hero) {
    /* POTPISNI TRENUTAK — BLENDA.
     *
     * Fotografija zauzima ceo prvi ekran. Pri učitavanju je vodoravna traka
     * na sredini i otvara se na pun ekran: jedan potez, i to onaj koji
     * kamera zaista pravi. Istovremeno se sama slika smiruje iz `scale 1.09`
     * — ne „zumira", nego staje.
     *
     * Udarac mora da bude ODMAH. Skrol režija je ranije nosila najveći deo
     * posla, a to je trud koji niko ne vidi drugi put: ko skroluje naniže,
     * ne vraća se gore da pogleda efekat. Zato je težište prebačeno na
     * učitavanje, a skrol je sveden na tihi parallaks.
     *
     * Redosled je hijerarhija, ne ukras: blenda → naslov kroz maske →
     * uvod → dugmad → traka činjenica. Naslov kreće DOK se blenda još
     * otvara, pa deluje kao da ga je otkrila ona, a ne zasebna animacija.
     *
     * PAŽNJA: početna stanja su u CSS-u (`clip-path` na blendi), pa otvaranje
     * ide kroz `.to()`. Sa `.from()` bi se animiralo NAZAD u skriveno stanje.
     */
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.to(
      "[data-hero-blenda]",
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: "power3.inOut" },
      0,
    )
      /* ULAZ NEMA SKALIRANJE — namerno.

         Prvo je ovde stajalo smirivanje slike iz `scale 1.09`. Dva kvara
         odatle:

         1. `scale` je bio i na ulazu i na skrol parallaksu, nad ISTOM
            slikom — dva tvina nad istim svojstvom se otimaju svaki frejm.
         2. Dublje: slika je ŠIRA od ekrana, pa smanjivanje razmere pomera
            njenu levu ivicu UDESNO. Izmereno ~21px. To je bio „skok udesno
            pri prvom skrolu" — nije loše fiksiranje nego smirivanje razmere
            koje se preklopilo sa skrolom.

         Premotavanje ulaza na prvi skrol je probano i POGORŠALO stvar: isti
         pomeraj, samo brži.

         Blenda sama nosi ulaz. Letterbox traka koja se otvara na pun ekran
         jeste kinematografski potez; razmera mu nije dodavala ništa osim
         ovog kvara. Slika je pri ulasku potpuno mirna, pa rani skrol ne
         može da se sudari ni sa čim. */
      .from("[data-hero-veo]", { opacity: 0, duration: 0.9 }, 0.25)
      .from("[data-hero-eyebrow]", { opacity: 0, y: 12, duration: 0.6 }, 0.34)
      .from(
        "[data-hero-red]",
        { opacity: 0, yPercent: 108, duration: 1.05, stagger: 0.075 },
        0.42,
      )
      .from("[data-hero-lead]", { opacity: 0, y: 16, duration: 0.8 }, 0.78)
      .from("[data-hero-akcije] > *", { opacity: 0, y: 12, duration: 0.65, stagger: 0.07 }, 0.9)
      .from("[data-hero-meta] > *", { opacity: 0, y: 10, duration: 0.7, stagger: 0.06 }, 1.02);


  }

  /* ----------------------------------------------------------
     5. Brojači. Broj je sadržaj, ne dekoracija — pa se odbrojava.
     ---------------------------------------------------------- */
  /* Brojke na početnoj vozi režija, vezano za poziciju skrola — ovde bi
     dobile drugi tvin nad istim tekstom. */
  document.querySelectorAll<HTMLElement>("[data-broj]").forEach((el) => {
    if (el.closest(".brojke")) return;
    const cilj = Number(el.dataset.broj);
    if (!Number.isFinite(cilj)) return;
    const stanje = { v: 0 };

    gsap.to(stanje, {
      v: cilj,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => {
        el.textContent = Math.round(stanje.v).toLocaleString("sr-RS");
      },
    });
  });

  /* ----------------------------------------------------------
     6. Hairline linije koje se izvlače.
     ---------------------------------------------------------- */
  document.querySelectorAll<HTMLElement>("[data-crta]").forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0, transformOrigin: "left center" },
      {
        scaleX: 1,
        duration: 1.1,
        ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      },
    );
  });

  /* ----------------------------------------------------------
     7. Traka napretka u zaglavlju.
     ---------------------------------------------------------- */
  const napredak = document.querySelector<HTMLElement>("[data-napredak]");
  if (napredak) {
    gsap.fromTo(
      napredak,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        transformOrigin: "left center",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
      },
    );
  }

  /* ----------------------------------------------------------
     8. Skrol režija — pet trenutaka vezanih za poziciju skrola.
     Ide POSLE svega ostalog: meri piksele, pa mora da zatekne konačan
     raspored. Vidi `rezija.ts`.
     ---------------------------------------------------------- */
  cistaci.push(postaviReziju());

  // Fontovi i slike menjaju visine — presloži okidače kad se učitaju.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  const osveziNaUcitavanju = () => ScrollTrigger.refresh();
  window.addEventListener("load", osveziNaUcitavanju);
  cistaci.push(() => window.removeEventListener("load", osveziNaUcitavanju));
}
