import * as z from "zod"

export const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  secondaryTitle: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  splitPosition: z.string(),
  captionPosition: z.string(),
  caption: z.object({
    font: z.object({
      family: z.string(),
      weight: z.string(),
      size: z.number(),
    }),
    sentence: z.object({
      length: z.string(),
      casing: z.string(),
    }),
    nouns: z.boolean(),
  }),
})

export const PresetSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})
