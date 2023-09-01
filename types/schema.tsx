import { Casing, Position, VideoStatus, VIDEO_TYPE } from "@prisma/client"
import * as z from "zod"

export const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  secondaryTitle: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .optional(),
  splitPosition: z.string(),
  captionPosition: z.nativeEnum(Position),
  caption: z.object({
    font: z.object({
      family: z.string(),
      size: z.number(),
    }),
    sentence: z.object({
      length: z.string(),
      casing: z.nativeEnum(Casing),
      highlight: z.object({
        nouns: z.boolean(),
        colour: z.string().optional(),
      }),
    }),
  }),
})

export const PresetSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

export const VideoSchema = z.object({
  content: FormSchema,
})

export const FormPresetSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  presetId: z.string(),
})

export const PresetVideoSchema = z.object({
  content: FormPresetSchema,
})

export const S3VideoSchema = z.object({
  id: z.string().optional(),
  type: z.nativeEnum(VIDEO_TYPE).optional(),
  key: z.string().optional(),
  presetId: z.string().optional(),
})

export const VideoConfigSchema = z.object({
  videoId: z.string(),
  configId: z.string(),
})

export const PresetVideoConfigSchema = z.object({
  content: z.object({
    bucket: z.string(),
    key: z.string(),
    type: z.nativeEnum(VIDEO_TYPE),
    configId: z.string(),
    presetId: z.string(),
    status: z.nativeEnum(VideoStatus),
  }),
})
