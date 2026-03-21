import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const rootEnv = loadEnv(mode, "..", "");
  const devPort = Number(rootEnv.VITE_DEV_SERVER_PORT || "5173");

  return {
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
      port: devPort
    },
    preview: {
      port: devPort
    }
  };
});
