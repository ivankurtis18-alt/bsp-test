// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://bsp.rs',
  // Astro-va dev traka (Audit / Settings / Inspect) na dnu ekrana — nije deo
  // sajta, samo smeta pri pregledu dizajna.
  devToolbar: { enabled: false },
  vite: {
    // @tailwindcss/vite se tipizira protiv svoje kopije vite-a, a Astro protiv
    // svoje ugnježdene. Tipovi se ne poklapaju, runtime je ispravan — otud cast.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
