// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  plugins: [react(), typescript()],
  define: {
    // This will replace `process.env` with `{}` during the build
    "process.env": {},
  },
  build: {
    lib: {
      // This is the entry point that Vite will use to build the library
      entry: "./src/index.ts",
      name: "TldrawWebComponent",
      fileName: "tldraw-web-component",
    },
    rollupOptions: {
      output: [
        {
          format: "es",
          entryFileNames: "[name].esm.js",
          dir: "dist",
        },
        {
          format: "umd",
          name: "TldrawWebComponent",
          entryFileNames: "[name].umd.js",
          dir: "dist",
        },
      ],
    },
  },
});
