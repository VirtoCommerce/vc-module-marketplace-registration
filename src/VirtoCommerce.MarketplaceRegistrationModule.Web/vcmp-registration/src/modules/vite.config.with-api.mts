import { defineConfig } from "vite";
import { resolve, join, dirname } from "node:path";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "",
  build: {
    manifest: "manifest.json",
    copyPublicDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      fileName: (format, name) => `${name}.js?v=${Date.now()}`,
      formats: ["umd"],
      name: "VcShellDynamicModules",
    },

    outDir: join(__dirname, "../../dist/packages/modules"),
    rollupOptions: {
      output: {
        chunkFileNames: "[name]-[hash].js",
        entryFileNames: "[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        globals: {
          vue: "Vue",
          "vue-router": "VueRouter",
          "vue-i18n": "VueI18n",
          "vee-validate": "VeeValidate",
          moment: "moment",
          "lodash-es": "_",
          "@vueuse/core": "VueUse",
          "@vc-shell/framework": "VcShellFramework",
        },
      },
      external: [
        /node_modules/,
        "@vc-shell/framework",
        "vue",
        "vue-router",
        "vee-validate",
        "vue-i18n",
        "moment",
        "lodash-es",
        "@vueuse/core",
      ],
    },
  },
  plugins: [vue()],
});
