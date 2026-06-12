import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({})],
  base: "./",
  server: {},
  build: {
    rolldownOptions: { input: { main: "src/index.html", dev: "src/dev.html" } },
  },
});
