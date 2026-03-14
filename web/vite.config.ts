import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  envDir: "..",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }
          if (id.includes("framer-motion")) {
            return "motion";
          }
          if (id.includes("@auth0")) {
            return "auth";
          }
          if (id.includes("react") || id.includes("scheduler")) {
            return "react-vendor";
          }
        }
      }
    }
  },
  server: {
    port: 5173
  },
  preview: {
    port: 5173
  }
});
