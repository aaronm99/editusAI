"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import Link, { LinkProps } from "next/link"

interface VideoCreateButtonProps extends LinkProps {}

export function VideoCreateButton({
  className,
  variant,
  ...props
}: VideoCreateButtonProps) {
  return (
    <Link
      {...props}
      href={"/editor"}
      className={cn(buttonVariants({ variant }), className)}
    >
      <Icons.add className="mr-2 h-4 w-4" />
      New Video
    </Link>
  )
}
