import path from "path";
import { fileURLToPath } from "url";

import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";
import robotsTxt from 'astro-robots-txt';
import remarkToc from 'remark-toc';
import { SITE } from "./src/config.mjs";

// https://astro.build/config
export default /** @type {import('astro').AstroUserConfig} */ defineConfig({
    site: SITE.domain,
  base: "/",
  markdown: {
    remarkPlugins: [remarkToc],
    // Preserve Astro's default plugins: GitHub-flavored Markdown and Smartypants
    // default: false
    extendDefaultPlugins: true,
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'dracula',
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    }
  },
  output: "static",

  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    sitemap(),
    image(),
    robotsTxt()
  ]
});
