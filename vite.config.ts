import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ExternalisePlugin, { externalsRegex } from "./src/plugins/Externalise";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({}), ExternalisePlugin()],
  base: "./",
  resolve: {
    alias: [
      {
        find: "@rice-the-spire",
        replacement: resolve(__dirname, "./src/index.ts"),
      },
      {
        find: "@rice-the-spire/widgets",
        replacement: resolve(__dirname, "./src/widgets/index.ts"),
      },
    ],
  },
  build: {
    sourcemap: "inline",
    lib: {
      entry: ["src/index.ts", "src/widgets/index.ts"],
      name: "rice-the-spire",
      fileName: (_, entryName) => `${entryName}.js`,
      formats: ["es"],
    },
    rolldownOptions: {
      external: externalsRegex,
      input: {
        main: "prod.html",
        dev: "dev.html",
        index: "src/index.ts",
        widgets: "src/widgets/index.ts",
      },
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: (chunkInfo) => `assets/${chunkInfo.name}.js`, // note: the .html files still go in the root using this method.
      },
    },
  },
});
