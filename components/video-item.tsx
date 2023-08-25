import Link from "next/link"
import { Video, VideoConfig } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { VideoOperations } from "@/components/video-operations"

interface VideoItemProps {
  video: VideoConfig
}

export function VideoItem({ video }: VideoItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${video.id}`}
          className="font-semibold hover:underline"
        >
          {video?.config?.title}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(video?.config?.createdAt?.toDateString())}
          </p>
        </div>
      </div>
      <VideoOperations
        video={{ id: video.config.id, title: video.title }}
        noEdit
      />
    </div>
  )
}

VideoItem.Skeleton = function VideoItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
