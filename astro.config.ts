import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://news.hackclub.com",

  image: {
    remotePatterns: [
      // Notion's image CDN!
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      NOTION_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      NOTION_DATABASE_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      LOOPS_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      LOOPS_COOKIE: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      LOOPS_LIST_ID: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },

  adapter: vercel(),
  integrations: [sitemap(), mdx()],
});