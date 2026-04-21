import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile"; // <--- Add this import
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [
    react(), 
    tailwindcss(), 
    viteSingleFile() // <--- Add this plugin
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
