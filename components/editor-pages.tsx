import { cn, formatFileSize } from "@/lib/utils"
import {
  FontType,
  PageFourProps,
  PageOneProps,
  PageThreeProps,
  PageTwoProps,
  SelectedFontProps,
} from "@/types/editor"
import React from "react"
import { EmptyPlaceholder } from "./empty-placeholder"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { BlockPicker } from "react-color"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { VideoUploadButton } from "./video-upload"

import blueGradient from "../public/images/bluegradient.png"
import yellowGradient from "../public/images/yellowgradient.png"
import ReactCompareImage from "react-compare-image"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { Casing, Position } from "@prisma/client"
import { fonts } from "./fonts"
import { X } from "lucide-react"

export const PageOne = ({
  file,
  form,
  isDragging,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
  onClick,
  nextStep,
  clearFile,
}: PageOneProps) => {
  React.useEffect(() => {
    form.setValue("title", file?.name)
  }, [file, form])

  return (
    <>
      {file ? (
        <div className="ml-6 mt-8">
          <div className="flex flex-row space-x-12">
            <div className="relative w-1/2">
              <div
                className="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-red-500 p-0.5"
                onClick={clearFile}
              >
                <X size={20} />
              </div>
              <video
                className="rounded-lg"
                src={file ? URL.createObjectURL(file) : ""}
              />

              <div className="mt-2 flex flex-row justify-between">
                <p>
                  <span className="text-gray-500">type: </span>
                  {file.type}
                </p>
                <p>
                  <span className="text-gray-500">size: </span>
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <Form {...form}>
              <form className="w-2/3 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title goes here..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Name your video for internal usage.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button onClick={() => nextStep()}>Next</Button>
              </form>
            </Form>
          </div>
        </div>
      ) : (
        <EmptyPlaceholder
          className={cn("mt-8", isDragging ? "border-blue-500" : undefined)}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <EmptyPlaceholder.Icon name="video" />
          <EmptyPlaceholder.Title>
            {isDragging ? "Drop your video here!" : "No video uploaded"}
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You have not uploaded a video yet.
          </EmptyPlaceholder.Description>
          <VideoUploadButton variant="outline" onClick={() => onClick()} />
        </EmptyPlaceholder>
      )}
    </>
  )
}

export const PageTwo = ({
  file,
  form,
  isDragging,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
  onClick,
  nextStep,
  clearFile,
}: PageTwoProps) => {
  React.useEffect(() => {
    form.setValue("secondaryTitle", file?.name)
  }, [file, form])

  return (
    <>
      {file ? (
        <div className="ml-6 mt-8">
          <div className="flex flex-row space-x-12">
            <div className="w-1/2">
              <div
                className="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-red-500 p-0.5"
                onClick={clearFile}
              >
                <X size={20} />
              </div>
              <video
                className="rounded-lg"
                src={file ? URL.createObjectURL(file) : ""}
              />

              <div className="mt-2 flex flex-row justify-between">
                <p>
                  <span className="text-gray-500">type: </span>
                  {file.type}
                </p>
                <p>
                  <span className="text-gray-500">size: </span>
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <Form {...form}>
              <form className="w-2/3 space-y-6">
                <FormField
                  control={form.control}
                  name="secondaryTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        Name your video for internal usage.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox id="add" />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Add to Library
                  </label>
                </div>
                <Button onClick={() => nextStep()}>Next</Button>
              </form>
            </Form>
          </div>
        </div>
      ) : (
        <EmptyPlaceholder
          className={cn("mt-8", isDragging ? "border-blue-500" : undefined)}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <EmptyPlaceholder.Icon name="video" />
          <EmptyPlaceholder.Title>
            {isDragging
              ? "Drop your video here!"
              : "No secondary video uploaded"}
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You have not uploaded a secondary video yet.
          </EmptyPlaceholder.Description>
          <div className="flex items-center space-x-4">
            <VideoUploadButton variant="outline" onClick={() => onClick()} />
            <Button className="">Select from Library</Button>
          </div>
        </EmptyPlaceholder>
      )}
    </>
  )
}

export const PageThree = ({
  nextStep,
  form,
  setScreenPosition: setPosition,
  screenPosition: position,
}: PageThreeProps) => {
  return (
    <div className="mt-8 flex space-x-4">
      <div className="w-1/3">
        <ReactCompareImage
          leftImage={blueGradient.src}
          rightImage={yellowGradient.src}
          vertical
          sliderPositionPercentage={position}
          onSliderPositionChange={(position) =>
            setPosition(position.toFixed(2))
          }
        />
      </div>
      <div>
        <p className="mb-2 font-semibold">
          Video Split Position: {Math.round(position * 100)}%
        </p>
        <Button
          onClick={() => {
            form.setValue("splitPosition", position.toString())
            nextStep()
          }}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export const PageFour = ({
  form,
  handleCallback,
  screenPosition,
  loading,
}: PageFourProps) => {
  const [selectedFont, setSelectedFont] = React.useState<SelectedFontProps>({
    family: null,
  })

  const [selectedColour, setSelectedColour] = React.useState<string>("#000")

  const sampleText = () => {
    let text = "this is sample text. this is sample text."
    if (form.watch("caption.sentence.length")) {
      const sentenceLength = form.watch("caption.sentence.length")
      const words = text.split(" ")
      text = words.slice(0, sentenceLength).join(" ")
    }
    if (form.watch("caption.sentence.casing")) {
      const casing = form.watch("caption.sentence.casing")
      if (casing === Casing.LOWER) {
        text = text.toLowerCase()
      } else if (casing === Casing.UPPER) {
        text = text.toUpperCase()
      } else if (casing === Casing.WORDS) {
        text = text
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      } else if (casing === Casing.SENTENCES) {
        text = text
          .split(". ")
          .map(
            (sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1)
          )
          .join(". ")
      }
    }
    return text
  }

  const screenSplit = screenPosition * 100

  return (
    <div className="mt-8 flex space-x-4">
      <div className="relative w-1/3">
        <div
          style={{
            height: `${screenSplit}%`,
          }}
          className={`overflow-hidden`}
        >
          <img
            src={blueGradient.src} // Replace with the actual image URL
            alt="Image"
          />
        </div>
        {screenSplit ? (
          <>
            <div
              className={cn(
                "absolute left-0 right-0 z-[200] h-1 bg-red-500",
                `top-[${screenSplit}%]`
              )}
            />
            <p className={`absolute right-0.5 z-[40] font-bold text-red-500`}>
              Screen Position Split
            </p>
          </>
        ) : null}
        <div
          style={{
            height: `${100 - screenSplit}%`,
          }}
          className="relative overflow-hidden"
        >
          <img
            src={yellowGradient.src} // Replace with the actual image URL
            alt="Image"
            className="absolute bottom-0"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Font</h2>

        <div className="my-2 flex space-x-2">
          <Select
            onValueChange={(e: FontType) => {
              setSelectedFont((s) => ({
                ...s,
                family: e.value.style.fontFamily,
              }))
              form.setValue("caption.font.family", e.name)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fonts</SelectLabel>
                {fonts.map((font, idx) => {
                  return (
                    <SelectItem key={idx} value={font}>
                      {font.name}
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

          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="caption.sentence.highlight.nouns"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-center space-x-2 space-y-0 rounded-md border px-[26px] py-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <div className="flex items-center justify-center leading-none">
                      <label
                        htmlFor="nouns"
                        className="mb-0.5 flex text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
        <p
          style={{
            fontFamily: selectedFont.family || undefined,
            fontSize: form.watch("caption.font.size") || 14,
          }}
        >
          {sampleText()}
        </p>

        <h2 className="text-xl font-semibold">Positioning</h2>

        <Form {...form}>
          <FormField
            control={form.control}
            name="captionPosition"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="mx-auto mt-2 grid grid-cols-4 gap-4"
                  >
                    <Label
                      htmlFor="top"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value={Position.TOP}
                            id="top"
                            className="sr-only"
                            defaultChecked
                          />
                        </FormControl>
                      </FormItem>
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
                      htmlFor="middle"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value={Position.CENTER}
                            id="middle"
                            className="sr-only"
                          />
                        </FormControl>
                      </FormItem>
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
                      htmlFor="bottom"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value={Position.BOTTOM}
                            id="bottom"
                            className="sr-only"
                          />
                        </FormControl>
                      </FormItem>
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
                    <Label
                      htmlFor="split"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem
                            value={Position.SPLIT}
                            id="split"
                            className="sr-only"
                          />
                        </FormControl>
                      </FormItem>
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
                      Split
                    </Label>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </Form>

        {form.watch("caption.sentence.highlight.nouns") ? (
          <>
            <h2 className="mb-4 mt-2 text-xl font-semibold">Keyword Colour</h2>

            <BlockPicker
              styles={{
                default: {
                  card: {
                    backgroundColor: "transparent",
                  },
                  input: {
                    backgroundColor: "#fff",
                    color: "#000",
                  },
                  triangle: {
                    position: "absolute",
                    left: 27,
                  },
                },
              }}
              color={selectedColour}
              onChange={(color) => {
                setSelectedColour(color.hex)
                form.setValue("caption.sentence.highlight.colour", color.hex)
              }}
            />
          </>
        ) : null}
        <Button
          className="mt-4"
          disabled={loading}
          onClick={() => {
            if (!form.getValues("caption.sentence.highlight.nouns")) {
              form.setValue("caption.sentence.highlight.colour", null)
            }

            handleCallback()
          }}
        >
          {loading ? "Loading..." : "Confirm"}
        </Button>
      </div>
    </div>
  )
}

const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 36, 48]

const sentenceLengths = ["1", "2", "3", "4", "5", "6", "7", "8"]
