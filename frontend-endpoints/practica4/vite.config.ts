import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177,
    strictPort: true,
    // Proxy opcional: si en .env se pone VITE_API_URL=/api, los pedidos a /api/...
    // se reenvían al backend (http://localhost:8000/...) y se evita el problema de CORS.
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
