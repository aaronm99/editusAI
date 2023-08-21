"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import Link, { LinkProps } from "next/link"

interface TemplateCreateButtonProps extends LinkProps {
  id?: string
}

export function TemplateCreateButton({
  className,
  variant,
  id,
  ...props
}: TemplateCreateButtonProps) {
  return (
    <Link
      {...props}
      href={`/editor?template=true&id=${id}`}
      className={cn(
        buttonVariants({ variant }),

        className
      )}
    >
      <Icons.add className="mr-2 h-4 w-4" />
      New Template
    </Link>
  )
}
