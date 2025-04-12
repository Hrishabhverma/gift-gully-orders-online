import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for GitHub Pages deployment
  base: "/gift-gully-orders-online/",
  server: {
    host: "0.0.0.0", // Bind to all IPv4 and IPv6 addresses (for better compatibility)
    port: 8080, // Development server port
  },
  plugins: [
    react(),
    // Only include this plugin in development mode
    mode === "development" && componentTagger(),
  ].filter(Boolean), // Filter out false values
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias "@" to the "src" directory
    },
  },
  build: {
    outDir: "dist", // Ensure outputs go to the "dist" directory
    emptyOutDir: true, // Clear the output directory before building
    rollupOptions: {
      // Ensure proper handling of hashed assets
      output: {
        assetFileNames: "assets/[name].[hash][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      },
    },
  },
}));
