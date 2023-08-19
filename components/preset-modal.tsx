"use client"

import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
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
import * as z from "zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRef, useState } from "react"

import { DialogClose } from "@radix-ui/react-dialog"
import { useToast } from "./ui/use-toast"
import { PresetSchema } from "@/types/schema"
import { useRouter } from "next/navigation"

export const PresetModal = () => {
  const { toast } = useToast()
  const router = useRouter()

  const closeRef = useRef<HTMLButtonElement>(null)

  const form = useForm<z.infer<typeof PresetSchema>>({})

  async function onSubmit(data) {
    try {
      const res = fetch("/api/presets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await res
      if (!result.ok) {
        throw new Error("Error creating Preset")
      }

      form.reset({})
      toast({
        title: "Success!",
        description: `Preset '${data.name}' created successfully`,
      })
      closeRef.current && closeRef.current.click()
      router.refresh()
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Error creating Preset. Please try again later.",
      })
      closeRef.current && closeRef.current.click()
    }
  }

  return (
    <div className="">
      <Dialog modal={true}>
        <DialogTrigger asChild>
          <Button variant="default">Add Preset</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Create Preset</DialogTitle>
            <DialogDescription>
              Create a preset for future use.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" ref={closeRef}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="default" onClick={form.handleSubmit(onSubmit)}>
              Create Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
