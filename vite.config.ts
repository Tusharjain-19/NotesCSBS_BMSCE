import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Notes CSBS",
        short_name: "Notes CSBS",
        description: "BMSCE CSBS Academic Resources Hub",
        theme_color: "#3b82f6",
        icons: [
          {
            src: "/src/assets/notes-csbs-logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/src/assets/notes-csbs-logo.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/src/assets/notes-csbs-logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-ui": ["lucide-react", "@tanstack/react-query"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
