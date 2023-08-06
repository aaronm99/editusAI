import { DashboardHeader } from "@/components/header"
import { VideoCreateButton } from "@/components/video-create-button"
import { VideoItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <VideoCreateButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <VideoItem.Skeleton />
        <VideoItem.Skeleton />
        <VideoItem.Skeleton />
        <VideoItem.Skeleton />
        <VideoItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
