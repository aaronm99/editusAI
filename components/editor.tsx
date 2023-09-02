"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Icons } from "@/components/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { cn, uploadToS3 } from "@/lib/utils"
import { postPatchSchema } from "@/lib/validations/post"
import "@/styles/editor.css"
import { FormPresetSchema, FormSchema } from "@/types/schema"
import { VIDEO_TYPE } from "@prisma/client"
import { PageFour, PageOne, PageThree, PageTwo } from "./editor-pages"
import { Decision } from "./picker"
import { Progress } from "./ui/progress"

interface EditorProps {}

type FormData = z.infer<typeof postPatchSchema>

export function Editor({}: EditorProps) {
  const router = useRouter()
  const params = useSearchParams()
  const template = params?.get("template")
  const presetId = params?.get("id")
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [file, setFile] = React.useState<File | undefined>(undefined)
  const [fileTwo, setFileTwo] = React.useState<File | undefined>(undefined)
  const [isDragging, setIsDragging] = React.useState<boolean>(false)
  const [currentStep, setCurrentStep] = React.useState<number>(1)
  const [position, setPosition] = React.useState(0.5)

  const totalSteps = template ? 3 : 5

  const inputRef = React.useRef<HTMLInputElement>(null)
  const secondaryInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "Untitled Video",
      caption: {
        sentence: {
          highlight: {
            nouns: false,
          },
        },
      },
    },
  })

  const presetForm = useForm<z.infer<typeof FormPresetSchema>>({
    resolver: zodResolver(FormPresetSchema),
  })

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
    type?: "secondary"
  ) => {
    const secondary = type === "secondary"

    if (e.target instanceof HTMLInputElement && e.target.files) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type !== "video/mp4") {
        return toast({
          title: "Wrong File Type.",
          description: "Please upload an MP4 File.",
          variant: "destructive",
        })
      }

      secondary ? setFileTwo(selectedFile) : setFile(selectedFile)
    } else if ("dataTransfer" in e && e.dataTransfer && e.dataTransfer.files) {
      const selectedFile = e.dataTransfer.files[0]
      if (selectedFile.type !== "video/mp4") {
        return toast({
          title: "Wrong File Type.",
          description: "Please upload an MP4 File.",
          variant: "destructive",
        })
      }

      secondary
        ? setFileTwo(e.dataTransfer.files[0])
        : setFile(e.dataTransfer.files[0])
    }
  }

  const changeFileName = (file: File | undefined, newName: string) => {
    if (file) {
      const newFile = new File([file], newName, { type: file.type })
      setFile(newFile)
    }
  }
  console.log(form.formState.errors, "form errors")

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsSaving(true)

      changeFileName(file, data.title)
      if (data.secondaryTitle) {
        changeFileName(fileTwo, data.secondaryTitle)
      }

      const response = await fetch("/api/videos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: data,
        }),
      })

      const json = await response.json()

      const configId = json.id

      const upload =
        fileTwo && (await uploadToS3(fileTwo, configId, VIDEO_TYPE.SECONDARY))

      const videoId = upload?.id

      const secondaryId = template ? configId : videoId

      const secondaryUpload = file
        ? await uploadToS3(
            file,
            secondaryId,
            VIDEO_TYPE.PRIMARY,
            presetId || undefined
          )
        : undefined

      setIsSaving(false)

      if (!response?.ok) {
        return toast({
          title: "Something went wrong.",
          description: "Your video was not saved. Please try again.",
          variant: "destructive",
        })
      }

      toast({
        description: "Your video has been saved.",
      })
      router.push("/dashboard")
      return
    } catch (error) {
      console.log(error, "error something")
      toast({
        title: "Something went wrong.",
        description: "Your video was not saved. Please try again.",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }

  async function presetSubmit(data: z.infer<typeof FormPresetSchema>) {
    try {
      setIsSaving(true)

      //TODO FIX  THIS
      // const upload =
      //   file && uploadToS3(file, "", VIDEO_TYPE.PRIMARY, data.presetId, true)

      // upload the primary video and g

      setIsSaving(false)
      toast({
        description: "Your video has been saved.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.log(error, "error something")
      toast({
        title: "Something went wrong.",
        description: "Your video was not saved. Please try again.",
        variant: "destructive",
      })

      router.push("/dashboard")
    }
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

  function handleCallback(presetId: string) {
    try {
      if (!presetId) return nextStep()
      presetForm.setValue("presetId", presetId)
      presetForm.setValue("title", form.getValues("title"))
      presetForm.handleSubmit(presetSubmit)()
    } catch (error) {
      console.log(error, "error")
    }
  }

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
              className={cn(buttonVariants({ variant: "default" }))}
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

      {currentStep === 1 && !template ? (
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
          clearFile={() => setFile(undefined)}
        />
      ) : null}
      {currentStep === 2 && !template ? (
        <Decision handleCallback={handleCallback} />
      ) : null}
      {currentStep === (template ? 1 : 3) ? (
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
          clearFile={() => setFileTwo(undefined)}
        />
      ) : null}
      {currentStep === (template ? 2 : 4) ? (
        <PageThree
          nextStep={nextStep}
          prevStep={prevStep}
          form={form}
          setScreenPosition={(e) => setPosition(e)}
          screenPosition={position}
        />
      ) : null}
      {currentStep === (template ? 3 : 5) ? (
        <PageFour
          screenPosition={position}
          nextStep={nextStep}
          prevStep={prevStep}
          form={form}
          loading={isSaving}
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
