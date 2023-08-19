import { Preset } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { VideoOperations } from "@/components/video-operations"
import { TemplateSection } from "./preset-templates"

interface PresetItemProps {
  preset: Pick<Preset, "id" | "updatedAt" | "createdAt" | "createdAt" | "title">
}

export function PresetItem({ preset }: PresetItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <div className="font-semibold hover:underline">{preset.title}</div>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(preset.createdAt?.toDateString())}
          </p>
        </div>
        <TemplateSection presetId={preset.id} />
      </div>
      <VideoOperations video={{ id: preset.id, title: preset.title }} />
    </div>
  )
}

PresetItem.Skeleton = function PresetItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}