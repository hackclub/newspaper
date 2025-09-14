import { z } from "astro:content";
import { defineCollection } from "astro:content";
import { notionLoader } from "@chlorinec-pkgs/notion-astro-loader";
import {
  notionPageSchema,
  propertySchema,
  transformedPropertySchema,
} from "@chlorinec-pkgs/notion-astro-loader/schemas";
import { NOTION_TOKEN, NOTION_DATABASE_ID } from "astro:env/server";

const defaultImageUrl = "https://placehold.co/600x500.png"; // when image missing somehow

const posts = defineCollection({
  loader: notionLoader({
    auth: NOTION_TOKEN,
    database_id: NOTION_DATABASE_ID,
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
    sorts: [{ property: "Date", direction: "descending" }],
  }),
  schema: notionPageSchema({
    properties: z.object({
      Name: transformedPropertySchema.title,
      Description: transformedPropertySchema.rich_text,
      Image: propertySchema.files.transform((files) => {
        const firstFile = files.files[0];
        if (!firstFile) return defaultImageUrl;
        if (firstFile.type === "file") {
          return firstFile.file.url;
        } else if (firstFile.type === "external") {
          return firstFile.external.url;
        }
        return defaultImageUrl;
      }),
      ImageAlt: transformedPropertySchema.rich_text,
      Date: transformedPropertySchema.date.transform((property) => {
        return property?.start;
      }),
      Published: transformedPropertySchema.checkbox,
      Slug: transformedPropertySchema.rich_text.refine(
        (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug),
        {
          message: "Slug must be lowercase, alphanumeric, and kebab-case",
        }
      ),
      Authors: transformedPropertySchema.multi_select,
      Tags: transformedPropertySchema.multi_select
    }),
  }),
});

export const collections = { posts };
