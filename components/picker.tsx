import { cn } from "@/lib/utils"
import { Preset } from "@prisma/client"
import { format } from "date-fns"
import React from "react"
import { useForm } from "react-hook-form"
import { EmptyPlaceholder } from "./empty-placeholder"
import { TemplateSection } from "./preset-templates"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem } from "./ui/form"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { VideoOperations } from "./video-operations"

interface PresetItemProps {
  preset: Preset
  outlined: boolean
  handleSelectPreset: (preset: Preset) => void
  selected?: string
}

export const Decision = ({
  handleCallback,
}: {
  handleCallback: (string) => void
}) => {
  const [presets, setPresets] = React.useState<Preset[]>([])
  const [selectedPreset, setSelectedPreset] = React.useState<Preset | null>()

  const form = useForm({
    defaultValues: {
      type: "manual",
      presetId: "",
    },
  })
  const type = form.watch("type")

  const disabled = type === "preset" && !selectedPreset

  function handleSelectPreset(preset: Preset) {
    setSelectedPreset(preset)
    form.setValue("presetId", preset.id)
  }

  React.useEffect(() => {
    async function fetchPresets() {
      const response = await fetch("/api/presets")
      const json = await response.json()
      setPresets(json)
    }
    fetchPresets()
  }, [])

  React.useEffect(() => {
    if (type === "manual") {
      form.setValue("presetId", "")
      setSelectedPreset(null)
    }
  }, [type, form])

  // @ts-ignore
  const presetLength = presets.filter((x) => x?.videoConfig?.length).length

  return (
    <>
      <Form {...form}>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="mx-auto mt-12 grid max-w-[600px] grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="manual"
                    className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          value="manual"
                          id="manual"
                          className="sr-only"
                        />
                      </FormControl>
                    </FormItem>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="mb-3 h-6 w-6"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                    Manual
                  </Label>
                  <Label
                    htmlFor="preset"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          value="preset"
                          id="preset"
                          className="sr-only"
                        />
                      </FormControl>
                    </FormItem>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="mb-3 h-6 w-6"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                    Select a preset
                  </Label>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex w-full justify-end">
          <Button
            className="self-end"
            onClick={() => handleCallback(form.getValues("presetId"))}
            disabled={disabled}
          >
            Next
          </Button>
        </div>
      </Form>

      {type === "preset" && presetLength ? (
        presets.map((preset) => (
          <PresetItem
            key={preset.id}
            preset={preset}
            outlined
            handleSelectPreset={handleSelectPreset}
            selected={selectedPreset?.id}
          />
        ))
      ) : type === "preset" ? (
        <EmptyPlaceholder className="mt-4">
          <EmptyPlaceholder.Icon name="video" />
          <EmptyPlaceholder.Title>No Presets</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any presets that have templates.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      ) : null}
    </>
  )
}

function PresetItem({
  preset,
  outlined,
  handleSelectPreset,
  selected,
}: PresetItemProps) {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-between p-4",
        outlined ? "my-2 rounded-lg border" : "",
        selected === preset.id ? "bg-green-700" : ""
      )}
      onClick={() => handleSelectPreset && handleSelectPreset(preset)}
    >
      <div className="grid gap-1">
        <div className="font-semibold hover:underline">{preset.name}</div>
        <div>
          {preset.createdAt ? (
            <p className="text-sm text-muted-foreground">
              {format(new Date(preset.createdAt), "do MMMM yyyy")}
            </p>
          ) : null}
        </div>
        <div className="text-base font-semibold underline">Templates</div>
        <TemplateSection preset={preset} />
      </div>
      <VideoOperations video={{ id: preset.id, title: preset.name }} />
    </div>
  )
}
