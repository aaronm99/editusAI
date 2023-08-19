"use client"

import { getTemplates } from "@/lib/utils"
import { FontType } from "@/types/editor"
import { Template } from "@prisma/client"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { TemplateCreateButton } from "./template-create-button"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
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
import { VideoOperations } from "./video-operations"

type Props = {
  presetId?: string
}

export const TemplateSection = ({ presetId }: Props) => {
  const viewRef = useRef<HTMLButtonElement>(null)
  const [templates, setTemplates] = useState<Template[] | []>([])

  console.log(templates, "templates")

  useEffect(() => {
    const templates = async () => {
      const res = await getTemplates()
      setTemplates(res)
    }
    templates()
  }, [])
  function handleClick() {
    viewRef.current?.click()
  }

  return (
    <>
      {templates.map((template) => {
        return (
          <div
            key={template.id}
            className="flex w-full cursor-pointer items-center justify-between hover:underline"
          >
            <div onClick={() => handleClick()}>{template.title}</div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="hidden" ref={viewRef}>
                  Edit Preset
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Customise Preset</DialogTitle>
                  <DialogDescription>
                    Customise your preset to use.
                  </DialogDescription>
                </DialogHeader>
                {/* <UploadVideo /> */}
                <Settings />
              </DialogContent>
            </Dialog>
          </div>
        )
      })}
      <TemplateCreateButton id={presetId} />
    </>
  )
}

const Settings = () => {
  // get id, use id to get config and then set as default values
  // video on left
  const form = useForm({})
  const [selectedFont, setSelectedFont] = useState({})
  const [fonts, setFonts] = useState([])

  useEffect(() => {
    async function fetchFonts() {
      const res = await fetch("/api/fonts")
      const data = await res.json()
      setFonts(data.items)
    }
    fetchFonts()
  }, [])

  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold">Font</h2>

        <div className="my-2 flex space-x-2">
          <Select
            onValueChange={(e: FontType) => {
              setSelectedFont((s) => ({
                ...s,
                family: e.family,
                variants: e.variants,
              }))
              form.setValue("caption.font.family", e.family)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fonts</SelectLabel>
                {fonts.slice(0, 10).map((font, idx) => {
                  return (
                    <SelectItem key={idx} value={font}>
                      {font.family}
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(e) => form.setValue("caption.font.weight", e)}
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

          <Select onValueChange={(e) => form.setValue("caption.font.size", e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Font Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Font Sizes</SelectLabel>
                {fontSizes.map((size) => {
                  return (
                    <SelectItem key={size} value={size}>
                      {size}px
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <h2 className="text-xl font-semibold">Sentence</h2>

        <div className="my-2 mb-4 flex space-x-2">
          <Select
            onValueChange={(e) => form.setValue("caption.sentence.length", e)}
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

          <Select
            onValueChange={(e) => form.setValue("caption.sentence.casing", e)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Sentence Casing" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Casing</SelectLabel>
                {sentenceCasing.map((casing) => {
                  return (
                    <SelectItem key={casing} value={casing}>
                      {casing}
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="caption.nouns"
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
            </form>
          </Form>
        </div>
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
            form.setValue("captionPosition", "0.4")
            //   handleCallback()
          }}
        >
          Complete
        </Button>
        {/* <ImageCrop cropPercentage={0.5} imageSrc={blueGradient.src} /> */}
      </div>
    </div>
  )
}

const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 36, 48]

const sentenceLengths = ["1", "2", "3", "4", "5", "6", "7", "8"]

const sentenceCasing = ["Sentences", "Words", "Uppercase", "Lowercase"]
