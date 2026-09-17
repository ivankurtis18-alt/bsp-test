/**
 * Životni ciklus skripti strane uz View Transitions.
 *
 * Bez klijentskog rutiranja modul skripte u .astro fajlu rade jednom, na
 * učitavanju, i to je dovoljno. Čim se uključi `ClientRouter`, telo strane
 * se menja bez novog učitavanja — stara skripta ostaje u memoriji sa
 * referencama na elemente kojih više nema, a nova se ne pokreće.
 *
 * Zato svaka skripta strane ide kroz `naSvakojStrani`. Funkcija se poziva
 * na svakom prikazu (uključujući prvi — `astro:page-load` puca i tada), a
 * ono što vrati čisti se pred zamenu.
 *
 * Čisti se SAMO ono što nadživi telo strane: osluškivači na `window` i
 * `document`, posmatrači, tajmeri. Osluškivač okačen na dugme unutar tela
 * odlazi zajedno sa dugmetom.
 */
export type Cistac = () => void;

export function naSvakojStrani(pokreni: () => Cistac | void) {
  let cistac: Cistac | void;

  document.addEventListener("astro:page-load", () => {
    cistac = pokreni();
  });

  document.addEventListener("astro:before-swap", () => {
    if (typeof cistac === "function") cistac();
    cistac = undefined;
  });
}
