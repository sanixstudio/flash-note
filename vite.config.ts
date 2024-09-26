import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
      },
    },
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  publicDir: "public",
});
