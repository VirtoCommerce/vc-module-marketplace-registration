import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getDynamicModuleConfiguration } from "@vc-shell/config-generator";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default getDynamicModuleConfiguration({
  build: {
    manifest: "manifest.json",
    copyPublicDir: false,
    sourcemap: true,
    minify: false,
    assetsInlineLimit: 4096, // Inline small assets as base64
    lib: {
      entry: resolve(__dirname, "./index.ts"),
    },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  compatibility: {
    framework: "^1.1.0",
  },
});
