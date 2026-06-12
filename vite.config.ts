import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({})],
  base: "./",
  server: {},
  build: {
    lib: {
      formats: ['es'],
      entry: 'src/index.ts',
      name: 'rice-the-spire-core',
      fileName: 'index',
    },
    rolldownOptions: {
      input: { main: "index.html" }
    }
  }
});
