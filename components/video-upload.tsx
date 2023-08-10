"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface VideoUploadButtonProps extends ButtonProps {}

export function VideoUploadButton({
  className,
  variant,
  ...props
}: VideoUploadButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      <Icons.add className="mr-2 h-4 w-4" />
      Upload Video
    </button>
  )
}
