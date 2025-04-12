import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for GitHub Pages deployment
  base: "/gift-gully-orders-online/",
  server: {
    host: "::", // Bind to all IPv6 and IPv4 addresses (can be changed to "0.0.0.0" if needed)
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
  },
}));
