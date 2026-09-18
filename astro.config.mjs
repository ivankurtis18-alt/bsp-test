// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  /* GitHub Pages servira projekat iz PODFOLDERA, pa `base` mora da se
     poklopi sa imenom repoa. Kad sajt pređe na pravi domen `bsp.rs`,
     vraća se `site: 'https://bsp.rs'` i `base` se briše — sve unutrašnje
     adrese idu kroz `put()` iz `lib/putanja.ts`, koji čita
     `import.meta.env.BASE_URL`, pa se ništa drugo ne menja. */
  site: 'https://ivankurtis18-alt.github.io',
  base: '/bsp-test',
  // Astro-va dev traka (Audit / Settings / Inspect) na dnu ekrana — nije deo
  // sajta, samo smeta pri pregledu dizajna.
  devToolbar: { enabled: false },
  vite: {
    // @tailwindcss/vite se tipizira protiv svoje kopije vite-a, a Astro protiv
    // svoje ugnježdene. Tipovi se ne poklapaju, runtime je ispravan — otud cast.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
