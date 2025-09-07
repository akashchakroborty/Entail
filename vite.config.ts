import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "src/": "/src/",
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-mui": [
            "@mui/material",
            "@mui/icons-material",
            "@mui/x-charts",
          ],
          "vendor-react": ["react", "react-dom"],
          "vendor-utils": ["date-fns"],
        },
      },
    },
  },
});
