"use client"
import { Icons } from "@/components/icons"
import { SrtEditor } from "@/components/srt-editor"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import SrtJson from "../../config/srt.json"
import { useState } from "react"

export default function Page() {
  const [srt, setSrt] = useState(SrtJson)

  function handleConfirm() {
    // rewrite the srt file with the new data
  }

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="flex w-full items-center space-x-10">
          <Link
            href={"/dashboard"}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back
          </Link>

          <h2 className="text-lg font-semibold">Video Name</h2>
        </div>

        <Button variant="default" onClick={handleConfirm}>
          Confirm
        </Button>
      </div>

      <SrtEditor srt={srt} setSrt={(e) => setSrt(e)} />
    </div>
  )
}
