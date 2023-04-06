import { defineApplicationConfig } from '@vben/vite-config';

export default defineApplicationConfig({
  overrides: {
    server: {
      proxy: {
        '/web-api': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          ws: true,
          // rewrite: (path) => path.replace(new RegExp(`^/web-api`), ''),
          // only https
          // secure: false
        },
        '/upload': {
          target: 'http://localhost:3300/upload',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/upload`), ''),
        },
      },
    },
  },
});
