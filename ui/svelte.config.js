import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "404.html",
    }),
    alias: {
      $components: "./src/lib/components",
      $charts: "./src/lib/charts",
      $data: "./src/lib/data",
    },
    paths: {
      base: process.env.BASE_PATH ?? "",
    },
  },
};

export default config;
