import { getWithSSRContext } from "@/app/(auth)/ssr"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"

import { DashboardShell } from "@/components/shell"
import { VideoCreateButton } from "@/components/video-create-button"
import { VideoItem } from "@/components/video-item"
import { db } from "@/lib/db"
import { VideoStatus, VIDEO_TYPE } from "@prisma/client"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage(props) {
  console.log("props", props)
  const { Auth } = getWithSSRContext()

  const currentUser = await Auth.currentAuthenticatedUser()

  const videoConfig = await db.videoConfig.findMany({
    where: {
      video: {
        every: {
          userId: currentUser?.id,
        },
      },
    },
    select: {
      video: true,
      config: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  const draftVideos = videoConfig.filter(
    (x) =>
      x?.video?.find((y) => y.type === "PRIMARY")?.status === VideoStatus.DRAFT
  )
  const processingVideos = videoConfig.filter(
    (x) =>
      x?.video?.find((y) => y.type === "PRIMARY")?.status ===
      VideoStatus.PROGRESS
  )
  const reviewVideos = videoConfig.filter(
    (x) =>
      x?.video?.find((y) => y.type === "PRIMARY")?.status ===
      VideoStatus.PROGRESS
  )

  const completeVideos = videoConfig.filter(
    (x) =>
      x?.video?.find((y) => y.type === "PRIMARY")?.status ===
      VideoStatus.PUBLISHED
  )

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
          {completeVideos.map((video) => {
            const s3Key = video.video.find(
              (x) => x.type === VIDEO_TYPE.PRIMARY
            )?.key

            return <VideoItem key={video.id} video={video} s3key={s3Key} />
          })}
        </div>
      ) : null}
    </DashboardShell>
  )
}
