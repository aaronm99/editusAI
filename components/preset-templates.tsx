"use client"

import { getTemplates } from "@/lib/utils"
import { FontType } from "@/types/editor"
import { FormSchema } from "@/types/schema"
import { Casing, Config, Position, Template } from "@prisma/client"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { DataTable } from "./table"
import { TemplateCreateButton } from "./template-create-button"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Form, FormControl, FormField, FormItem } from "./ui/form"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { toast } from "./ui/use-toast"

type Props = {
  presetId?: string
}

export const TemplateSection = ({ presetId }: Props) => {
  const viewRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [templates, setTemplates] = useState<Template[] | []>([])

  useEffect(() => {
    const templates = async () => {
      const res = await getTemplates(presetId || "")
      setTemplates(res)
    }
    templates()
  }, [])
  function handleClick() {
    viewRef.current?.click()
  }

  const handleClose = () => {
    closeRef.current?.click()
  }

  return (
    <>
      <DataTable templates={templates} />
      <div className="mt-2 w-full">
        <TemplateCreateButton id={presetId} />
      </div>
    </>
  )
}

export const Settings = ({
  config,
  id,
  close,
}: {
  config: Config
  id: string
  close: () => void
}) => {
  // video on left
  const [fonts, setFonts] = useState<FontType[]>([])
  const [selectedFont, setSelectedFont] = useState({})

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      title: config.title,
      splitPosition: config.videoSplitRatio.toString(),
      captionPosition: config.textPosition,
      caption: {
        font: {
          family: config.fontName,
          weight: config.fontWeight,
          size: config.fontSize,
        },
        sentence: {
          length: config.sentenceLength.toString(),
          casing: config.sentenceCasing,
          highlight: {
            nouns: config.nouns,
          },
        },
      },
    },
  })

  useEffect(() => {
    async function fetchFonts() {
      const res = await fetch("/api/fonts")
      const data = await res.json()
      setFonts(data.items)
      setSelectedFont(
        data.items.find((font) => font.family === config.fontName) || {}
      )
    }
    fetchFonts()
  }, [config.fontName])

  console.log(form.formState.errors, "errors")
  const submit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const res = await fetch(`/api/template/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: data,
        }),
      })

      if (!res.ok) {
        throw new Error("Something went wrong.")
      }

      const json = await res.json()

      close()
      return toast({
        title: "Template updated successfully.",
        description: "Your template has been updated.",
        variant: "default",
      })
    } catch (error) {
      close()

      return toast({
        title: "Something went wrong.",
        description: "Your template was not saved. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold">Font</h2>

        <Form {...form}>
          <div className="my-2 flex space-x-2">
            <FormField
              control={form.control}
              name="caption.font.family"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e)
                      setSelectedFont(
                        fonts.find((font) => font.family === field.value) || {}
                      )
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fonts</SelectLabel>
                        {fonts.slice(0, 10).map((font, idx) => {
                          return (
                            <SelectItem key={idx} value={font.family}>
                              {font.family}
                            </SelectItem>
                          )
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caption.font.weight"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Font Variant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Font Variants</SelectLabel>
                        {selectedFont &&
                          selectedFont.variants &&
                          selectedFont.variants.map((variant, variantIdx) => {
                            return (
                              <SelectItem key={variantIdx} value={variant}>
                                {variant}
                              </SelectItem>
                            )
                          })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caption.font.size"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Font Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Font Sizes</SelectLabel>
                        {fontSizes.slice(0, 10).map((size) => {
                          return (
                            <SelectItem key={size} value={size}>
                              {size}px
                            </SelectItem>
                          )
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <h2 className="text-xl font-semibold">Sentence</h2>

          <div className="my-2 mb-4 flex space-x-2">
            <FormField
              control={form.control}
              name="caption.sentence.length"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Sentence Length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Length</SelectLabel>
                        {sentenceLengths.map((length) => {
                          return (
                            <SelectItem key={length} value={length}>
                              {length} {length === "1" ? "word" : "words"}
                            </SelectItem>
                          )
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caption.sentence.casing"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Sentence Casing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Casing</SelectLabel>
                        {Object.values(Casing).map((casing) => {
                          return (
                            <SelectItem key={casing} value={casing}>
                              {casing}
                            </SelectItem>
                          )
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caption.sentence.highlight.nouns"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border px-[22px] py-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <label
                      htmlFor="nouns"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Highlight Nouns
                    </label>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </Form>

        {/* TODO: Fix this */}

        <h2 className="text-xl font-semibold">Positioning</h2>

        <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
          <Label
            htmlFor="card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="card" id="card" className="sr-only" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="mb-3 h-6 w-6"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
            Top
          </Label>
          <Label
            htmlFor="paypal"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="mb-3 h-6 w-6"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
            Middle
          </Label>
          <Label
            htmlFor="apple"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
          >
            <RadioGroupItem value="apple" id="apple" className="sr-only" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="mb-3 h-6 w-6"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
            Bottom
          </Label>
        </RadioGroup>
        <Button
          className="mt-4"
          onClick={() => {
            //   handleCallback()
            form.handleSubmit(submit)()
          }}
        >
          Complete
        </Button>
      </div>
    </div>
  )
}

const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]

const sentenceLengths = ["1", "2", "3", "4", "5", "6", "7", "8"]
