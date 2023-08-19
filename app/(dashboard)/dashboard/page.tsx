import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { VideoCreateButton } from "@/components/video-create-button"
import { VideoItem } from "@/components/video-item"
import { DashboardShell } from "@/components/shell"
import { ProcessingVideo } from "@/components/process-video"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const video = await db.video.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  const draftVideos = video.filter((video) => video.status === "draft")
  const processingVideos = video.filter(
    (video) => video.status === "processing"
  )
  const reviewVideos = video.filter((video) => video.status === "review")

  const completeVideos = video.filter((video) => video.status === "complete")

  return (
    <DashboardShell>
      <DashboardHeader
        heading={draftVideos?.length ? "Draft" : "Videos"}
        divider={!!draftVideos?.length}
        text={
          draftVideos?.length
            ? "Incomplete videos."
            : "Create and manage videos."
        }
      >
        <VideoCreateButton />
      </DashboardHeader>
      <div>
        {draftVideos?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {draftVideos.map((video) => (
              <VideoItem key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="video" />
            <EmptyPlaceholder.Title>No videos created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any videos yet. Start creating content.
            </EmptyPlaceholder.Description>
            <VideoCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
      {processingVideos.length ? (
        <DashboardHeader
          heading="Processing"
          divider
          text="Videos that are currently being processed."
        />
      ) : null}
      {processingVideos?.length ? (
        <div className="divide-y divide-border rounded-md border">
          {processingVideos.map((video) => (
            <VideoItem key={video.id} video={video} />
          ))}
        </div>
      ) : null}
      {/* <ProcessingVideo /> */}
      {reviewVideos.length ? (
        <DashboardHeader
          heading="Review"
          divider
          text="These videos are ready for review."
        />
      ) : null}
      {reviewVideos?.length ? (
        <div className="divide-y divide-border rounded-md border">
          {reviewVideos.map((video) => (
            <VideoItem key={video.id} video={video} />
          ))}
        </div>
      ) : null}
      {completeVideos.length ? (
        <DashboardHeader
          heading="Complete"
          divider
          text="Ready for your use."
        />
      ) : null}
      {completeVideos?.length ? (
        <div className="divide-y divide-border rounded-md border">
          {completeVideos.map((video) => (
            <VideoItem key={video.id} video={video} />
          ))}
        </div>
      ) : null}
    </DashboardShell>
  )
}
