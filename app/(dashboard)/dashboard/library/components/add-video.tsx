"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn, formatFileSize } from "@/lib/utils"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { VideoUploadButton } from "@/components/video-upload"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@radix-ui/react-dialog"
import { toast } from "@/components/ui/use-toast"

export const UploadVideo = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const form = useForm({})

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.files) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type !== "video/mp4") {
        return toast({
          title: "Wrong File Type.",
          description: "Please upload an MP4 File.",
          variant: "destructive",
        })
      }
      setFile(selectedFile)
    } else if ("dataTransfer" in e && e.dataTransfer && e.dataTransfer.files) {
      const selectedFile = e.dataTransfer.files[0]
      if (selectedFile.type !== "video/mp4") {
        return toast({
          title: "Wrong File Type.",
          description: "Please upload an MP4 File.",
          variant: "destructive",
        })
      }
      setFile(e.dataTransfer.files[0])
    }
  }
  function onClick() {
    inputRef.current?.click()
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    handleFileChange(e)
  }

  async function handleAdd(data) {
    try {
      //TODO: upload to s3
      closeRef.current && closeRef.current.click()
    } catch (error) {
      closeRef.current && closeRef.current.click()
    }
  }

  return (
    <>
      {file ? (
        <div className="ml-6 mt-2">
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
              </form>
            </Form>
          </div>
        </div>
      ) : (
        <EmptyPlaceholder
          className={cn(" mt-2", isDragging ? "border-blue-500" : undefined)}
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

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <DialogFooter>
        <DialogClose className="hidden" ref={closeRef}>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>

        <Button type="submit" onClick={form.handleSubmit(handleAdd)}>
          Add Video
        </Button>
      </DialogFooter>
    </>
  )
}
