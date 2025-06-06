import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',              // <-- très important
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
