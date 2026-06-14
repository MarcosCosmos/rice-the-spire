import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { externalsRegex } from "./src/scripts/externals";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({})],
  base: "./",
  resolve: {
    alias: [
      {
        find: "@rice-the-spire",
        replacement: resolve(__dirname, "./src/index.ts"),
      },
      {
        find: "@rice-the-spire/widgets/",
        replacement: resolve(__dirname, "./src/zebar/widgets/"),
      },
    ],
  },
  build: {
    sourcemap: "inline",
    lib: {
      entry: ["src/index.ts"],
      name: "rice-the-spire",
      formats: ["es"],
    },
    rolldownOptions: {
      external: externalsRegex,
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/rice-the-spire.js", // note: the .html files still go in the root using this method.
      },
    },
  },
});
