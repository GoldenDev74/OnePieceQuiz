import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path'; // Ajoutez cette ligne pour importer resolve
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
      input: {
        main: resolve(__dirname, 'index.html'),
        // Supprimez ou commentez la ligne suivante si vous n'avez pas besoin de nested/index.html
        // nested: resolve(__dirname, 'nested/index.html'),
      },
    },
  },
});
