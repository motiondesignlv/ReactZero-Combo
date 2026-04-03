import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

function stripTailwindImport(): Plugin {
  return {
    name: 'strip-tailwind-import',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('.css')) {
        return code.replace(/@import\s+["']tailwindcss["'];?\s*\n?/g, '');
      }
    },
  };
}

export default defineConfig({
  root: resolve(__dirname),
  base: './',
  plugins: [react(), stripTailwindImport()],
  resolve: {
    alias: {
      '@reactzero/combo/slots': resolve(__dirname, '../src/entries/slots.ts'),
      '@reactzero/combo/tabs': resolve(__dirname, '../src/entries/tabs.ts'),
      '@reactzero/combo': resolve(__dirname, '../src/entries/index.ts'),
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  css: {
    postcss: { plugins: [] },
  },
});
