import { VideoConfig } from "@prisma/client"

import { Skeleton } from "@/components/ui/skeleton"
import { VideoOperations } from "@/components/video-operations"
import { formatDate } from "@/lib/utils"
import { DownloadVideo } from "./download-video"

interface VideoItemProps {
  video: VideoConfig
  s3key?: string
}

export async function VideoItem({ video, s3key }: VideoItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        {/* @ts-ignore */}

        <p className="font-semibold hover:underline">{video?.config?.title}</p>
        <div>
          {/* @ts-ignore */}

          {video?.config?.createdAt ? (
            <p className="text-sm text-muted-foreground">
              {/* @ts-ignore */}

              {formatDate(video?.config?.createdAt?.toDateString())}
            </p>
          ) : null}
        </div>
      </div>
      {s3key ? <DownloadVideo s3key={s3key} /> : null}
      <VideoOperations
        // @ts-ignore

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
