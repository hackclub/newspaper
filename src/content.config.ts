import { z } from "astro:content";
import { defineCollection } from "astro:content";
import { glob } from 'astro/loaders';
import tags from "./data/tags.json";

const tagKeys = Object.keys(tags) as [string, ...string[]];

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/articles/" }),
  schema: ({ image }) => 
    z.object({
      title: z.string(),
      description: z.string(),
      image: image(),
      authors: z.array(z.string()),
      helpers: z.array(z.string()).optional(),
      tags: z.array(z.enum(tagKeys)).optional(),
      date: z.date(),
      published: z.boolean().default(true),
      slug: z.string(),
    }),
});

export const collections = { posts };
