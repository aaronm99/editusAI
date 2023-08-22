"use client"

import EditorJS from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Icons } from "@/components/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { postPatchSchema } from "@/lib/validations/post"
import "@/styles/editor.css"
import { FormSchema } from "@/types/schema"
import { PageFour, PageOne, PageThree, PageTwo } from "./editor-pages"
import { Decision } from "./picker"
import { Progress } from "./ui/progress"

interface EditorProps {}

type FormData = z.infer<typeof postPatchSchema>

export function Editor({}: EditorProps) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
  })
  const ref = React.useRef<EditorJS>()
  const router = useRouter()
  const params = useSearchParams()
  const template = params?.get("template")
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
        nouns: false,
      },
    },
  })

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
    type?: "secondary"
  ) => {
    const secondary = type === "secondary"

    if (e.target instanceof HTMLInputElement && e.target.files) {
      secondary ? setFileTwo(e.target.files[0]) : setFile(e.target.files[0])
    } else if ("dataTransfer" in e && e.dataTransfer && e.dataTransfer.files) {
      secondary
        ? setFileTwo(e.dataTransfer.files[0])
        : setFile(e.dataTransfer.files[0])
    }
  }
  console.log(form.formState.errors, "form errors")
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsSaving(true)

      const url = template ? "/api/template/" : "/api/videos/"

      const response = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: data,
          presetId: template ? params?.get("id") : undefined,
        }),
      })

      const json = await response.json()

      // const upload = file && uploadToS3(file, json.id.id)

      setIsSaving(false)

      if (!response?.ok) {
        return toast({
          title: "Something went wrong.",
          description: "Your video was not saved. Please try again.",
          variant: "destructive",
        })
      }

      router.refresh()

      toast({
        description: "Your video has been saved.",
      })
      router.push("/dashboard")
    } catch (error) {
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
      form.setValue("presetId", presetId)
      form.handleSubmit(onSubmit)()
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
