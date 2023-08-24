import { Icons } from "@/components/icons"
import { ConfirmButton } from "@/components/srt-confirm"
import { SrtEditor } from "@/components/srt-editor"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function Page() {
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

        <ConfirmButton />
      </div>

      <SrtEditor />
    </div>
  )
}
