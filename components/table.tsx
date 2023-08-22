"use client"

import { MoreHorizontal } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Template } from "@prisma/client"
import { DialogClose } from "@radix-ui/react-dialog"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Settings } from "./preset-templates"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { toast } from "./ui/use-toast"

export function DataTableDemo({ templates }: { templates: Template[] }) {
  const viewRef = React.useRef<HTMLButtonElement>(null)
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<Template | null>(null)

  function handleClick() {
    viewRef.current?.click()
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/template/${id}`, {
        method: "DELETE",
      })
      router.refresh()
      if (res.ok) {
        return toast({
          title: "Template deleted",
          description: "Your template has been deleted.",
        })
      }
    } catch (error) {
      router.refresh()

      return toast({
        title: "Something went wrong.",
        description: "Your template was not saved. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full">
      {templates.length ? (
        <div className="mt-2 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Title</TableHead>
                <TableHead className="">Created</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">
                    {template.title}
                  </TableCell>
                  <TableCell className="text-right">
                    {format(new Date(template.createdAt), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedTemplate(template)
                            handleClick()
                          }}
                        >
                          Edit Template
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleDelete(template.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="hidden" ref={viewRef}>
                Edit Preset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
              <DialogHeader>
                <DialogTitle>Customise Preset</DialogTitle>
                <DialogDescription>
                  Customise your preset to use.
                </DialogDescription>
              </DialogHeader>
              {selectedTemplate ? (
                <Settings
                  config={selectedTemplate?.config}
                  id={selectedTemplate?.id}
                  //   close={handleClose}
                />
              ) : null}
            </DialogContent>

            <DialogClose className="hidden" ref={closeRef}>
              <Button variant="default">Close</Button>
            </DialogClose>
          </Dialog>
        </div>
      ) : null}
    </div>
  )
}
