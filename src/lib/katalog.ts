/**
 * Zajedničko za prikaz kataloga.
 */

/**
 * Iz naziva skida kataloški kod, da se ne ponavlja pored krupne oznake.
 * "Bolnički krevet elektro 961-(5)" → "Bolnički krevet elektro"
 * Nazivi sa kodom u sredini ("Pedijatrijski MD 962(35) elektro") ostaju celi —
 * bolje tri duža naziva nego jedan pogrešno isečen.
 */
export const tipProizvoda = (naziv: string): string =>
  naziv.replace(/\s*(\d+\s*[-–]?\s*)?\(\d+\)\s*$/, "").trim() || naziv;
