import * as React from "react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

import SrtJson from "../config/srt.json"

type ItemType = (typeof SrtJson.results.items)[0]

export function EditCard({
  word,
  handleCancel,
  handleConfirm,
}: {
  word: ItemType
  handleCancel: () => void
  handleConfirm: (word: string) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = word.alternatives[0].content
      inputRef.current.focus()
    }
  }, [word])

  return (
    <Card className="w-[350px]">
      <CardContent>
        <form>
          <div className="grid w-full items-center">
            <div className="flex flex-col space-y-2 pt-4">
              <Label htmlFor="name">Edit Word</Label>
              <Input ref={inputRef} id="name" placeholder="Word" autoFocus />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between px-6 pb-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            inputRef.current && handleConfirm(inputRef.current.value)
          }}
        >
          Confirm
        </Button>
      </CardFooter>
    </Card>
  )
}
