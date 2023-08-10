"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import EditorJS from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { Video } from "@prisma/client"
import ReactCompareImage from "react-compare-image"
import { useForm } from "react-hook-form"
import * as z from "zod"

import "@/styles/editor.css"
import { cn } from "@/lib/utils"
import { postPatchSchema } from "@/lib/validations/post"
import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { EmptyPlaceholder } from "./empty-placeholder"
import { VideoUploadButton } from "./video-upload"
import { Input } from "./ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Progress } from "./ui/progress"
import { Checkbox } from "./ui/checkbox"
import { AspectRatio } from "./ui/aspect-ratio"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface EditorProps {
  video: Pick<Video, "id" | "title" | "content" | "published">
}

type FormData = z.infer<typeof postPatchSchema>

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

export function Editor({ video }: EditorProps) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
  })
  const ref = React.useRef<EditorJS>()
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [file, setFile] = React.useState<File | undefined>(undefined)
  const [fileTwo, setFileTwo] = React.useState<File | undefined>(undefined)
  const [uploadProgress, setUploadProgress] = React.useState<number>(0)
  const [isDragging, setIsDragging] = React.useState<boolean>(false)
  const [currentStep, setCurrentStep] = React.useState<number>(1)

  const totalSteps = 4

  const inputRef = React.useRef<HTMLInputElement>(null)
  const secondaryInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type?: "secondary"
  ) => {
    const secondary = type === "secondary"

    if (e.target.files) {
      secondary ? setFileTwo(e.target.files[0]) : setFile(e.target.files[0])
    } else if (e.dataTransfer.files) {
      secondary
        ? setFileTwo(e.dataTransfer.files[0])
        : setFile(e.dataTransfer.files[0])
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSaving(true)

    const response = await fetch(`/api/videos/${video.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: data,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your video was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    return toast({
      description: "Your video has been saved.",
    })
  }

  function onClick() {
    inputRef.current?.click()
  }
  function secondaryVideoClick() {
    secondaryInputRef.current?.click()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type?: "secondary"
  ) => {
    e.preventDefault()
    setIsDragging(false)

    handleFileChange(e, type)
  }

  function nextStep() {
    setCurrentStep((prev) => prev + 1)
  }

  function prevStep() {
    if (currentStep === 1) return
    setCurrentStep((prev) => prev - 1)
  }

  // const backProps =
  //   currentStep === 1 ? { href: "/dashboard" } : { onClick: () => prevStep() }

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center space-x-10">
          {currentStep === 1 ? (
            <Link
              href={"/dashboard"}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <>
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Link>
          ) : (
            <Button
              onClick={() => prevStep()}
              className={cn(buttonVariants({ variant: "link" }))}
            >
              <>
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Button>
          )}
          <p className="text-sm">
            Step {currentStep} of {totalSteps}
          </p>
          <Progress
            value={(currentStep / totalSteps) * 100}
            className="w-[10%]"
          />
        </div>
      </div>

      {currentStep === 1 ? (
        <PageOne
          file={file}
          form={form}
          isDragging={isDragging}
          handleDragEnter={handleDragEnter}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          onClick={onClick}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      ) : null}
      {currentStep === 2 ? (
        <PageTwo
          file={fileTwo}
          form={form}
          isDragging={isDragging}
          handleDragEnter={handleDragEnter}
          handleDragLeave={handleDragLeave}
          handleDrop={(e) => handleDrop(e, "secondary")}
          onClick={secondaryVideoClick}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      ) : null}
      {currentStep === 3 ? (
        <PageThree nextStep={nextStep} prevStep={prevStep} form={form} />
      ) : null}
      {currentStep === 4 ? (
        <PageFour
          nextStep={nextStep}
          prevStep={prevStep}
          form={form}
          handleCallback={form.handleSubmit(onSubmit)}
        />
      ) : null}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        ref={secondaryInputRef}
        onChange={(e) => handleFileChange(e, "secondary")}
        className="hidden"
      />
    </div>
  )
}

type PageProps = {
  nextStep: () => void
  prevStep: () => void
}

interface PageOneProps extends PageProps {
  file: File | undefined
  form: any
  isDragging: boolean
  formSubmit: any
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onClick: () => void
}

interface PageTwoProps extends PageProps {
  file: File | undefined
  form: any
  isDragging: boolean
  formSubmit: any
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onClick: () => void
}

const PageOne = ({
  file,
  form,
  isDragging,
  formSubmit,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
  onClick,
  nextStep,
}: PageOneProps) => {
  React.useEffect(() => {
    form.setValue("title", file?.name)
  }, [file, form])

  return (
    <>
      {file ? (
        <div className="ml-6 mt-8">
          <div className="flex flex-row space-x-12">
            <div className="w-1/2">
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

const PageTwo = ({
  file,
  form,
  isDragging,
  formSubmit,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
  onClick,
  nextStep,
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

interface PageThreeProps extends PageProps {
  form: any
  handleCallback: () => void
}

const PageThree = ({ nextStep, form }: PageThreeProps) => {
  const [position, setPosition] = React.useState(0.5)
  return (
    <div className="mt-8 flex space-x-4">
      <div className="w-1/3">
        <AspectRatio ratio={9 / 16} className="bg-muted">
          <ReactCompareImage
            leftImage="https://w0.peakpx.com/wallpaper/245/596/HD-wallpaper-gray-color-background-monochrome-minimalism.jpg"
            rightImage="https://w0.peakpx.com/wallpaper/304/593/HD-wallpaper-plain-black-dark-phone-pure-screen-solid.jpg"
            vertical
            onSliderPositionChange={(position) =>
              setPosition(position.toFixed(2))
            }
          />
        </AspectRatio>
      </div>
      <div>
        <p>Position: {Math.round(position * 100)}%</p>
        <Button
          onClick={() => {
            form.setValue("splitPosition", position)
            nextStep()
          }}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

type FontType = {
  family: string
  variants: string[]
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext", "vietnamese"]
  version: string
  lastModified: string
  files: {
    "100": string
    "200": string
    "300": string
    "500": string
    "600": string
    "700": string
    "800": string
    "900": string
    regular: string
    "100italic": string
  }
  category: string
  kind: string
  menu: string
}

type SelectedFontProps = {
  family: string | null
  variants: string[]
}

const PageFour = ({ nextStep, form, handleCallback }: PageThreeProps) => {
  const [position, setPosition] = React.useState(0.5)
  const [fonts, setFonts] = React.useState<FontType[]>([])
  const [selectedFont, setSelectedFont] = React.useState<SelectedFontProps>({
    family: null,
    variants: [],
  })

  React.useEffect(() => {
    async function fetchFonts() {
      const res = await fetch("/api/fonts")
      const data = await res.json()
      setFonts(data.items)
    }
    fetchFonts()
  }, [])

  return (
    <div className="mt-8 flex space-x-4">
      <div className="w-1/3">
        <AspectRatio ratio={9 / 16} className="bg-muted">
          <ReactCompareImage
            leftImage="https://w0.peakpx.com/wallpaper/304/593/HD-wallpaper-plain-black-dark-phone-pure-screen-solid.jpg"
            rightImage="https://w0.peakpx.com/wallpaper/304/593/HD-wallpaper-plain-black-dark-phone-pure-screen-solid.jpg"
            vertical
            onSliderPositionChange={(position) =>
              setPosition(position.toFixed(2))
            }
          />
        </AspectRatio>
      </div>
      <div>
        <p>Caption Position: {Math.round(position * 100)}%</p>

        <div className="my-4 flex space-x-2">
          {/* <Form {...form}>
            <form className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="font"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Family</FormLabel>
                    <Select
                      onValueChange={(e: FontType) => {
                        setSelectedFont((s) => ({
                          ...s,
                          family: e.family,
                          variants: e.variants,
                        }))
                        field.onChange(e)
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
                  </FormItem>
                )}
              />
            </form>
          </Form> */}
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

        <div className="my-4 flex space-x-2">
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

        <Button
          onClick={() => {
            form.setValue("captionPosition", position)
            handleCallback()
          }}
        >
          Complete
        </Button>
      </div>
    </div>
  )
}

function formatFileSize(sizeInBytes) {
  if (sizeInBytes >= Math.pow(1024, 3)) {
    return `${(sizeInBytes / Math.pow(1024, 3)).toFixed(2)} GB`
  } else {
    return `${(sizeInBytes / Math.pow(1024, 2)).toFixed(2)} MB`
  }
}

const fontSizes = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 36, 48, 60, 72, 96,
]

const sentenceLengths = ["1", "2", "3", "4", "5", "6", "7", "8"]

const sentenceCasing = ["Sentences", "Words", "Uppercase", "Lowercase"]

const json = {
  id: "ckqk1qj5h0000g1l6q6q1q1q1",
  primaryVideo: {
    title: "shadcn",
    objectId: "/path/to/object",
  },
  secondaryVideo: {
    title: "shadcn",
    objectId: "/path/to/object",
  },
  splitPosition: 0.5,
  caption: {
    position: 0.5,
    font: {
      family: "Roboto",
      size: 16,
      color: "#000000",
      weight: "700",
    },
    sentence: {
      length: 4,
      casing: "sentences",
      highlight: {
        keywords: ["shadcn", "shadcn", "shadcn", "shadcn"],
        nouns: true,
        color: "#000000",
      },
    },
  },
}
