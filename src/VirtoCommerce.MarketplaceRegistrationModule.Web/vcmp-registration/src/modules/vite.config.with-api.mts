import { defineConfig } from "vite";
import { resolve, join, dirname } from "node:path";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import { getDynamicModuleConfiguration } from "@vc-shell/config-generator";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default getDynamicModuleConfiguration({
  build: {
    manifest: "manifest.json",
    copyPublicDir: false,
    sourcemap: true,
    minify: false,
    lib: {
      entry: resolve(__dirname, "./index.ts"),
    },
  },
  compatibility: {
    framework: "^1.1.0",
  },
});
