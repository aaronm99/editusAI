import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { VideoCreateButton } from "@/components/video-create-button"
import { VideoItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"

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
      authorId: user?.id,
    },
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Video" text="Create and manage video.">
        <VideoCreateButton />
      </DashboardHeader>
      <div>
        {video?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {video.map((video) => (
              <VideoItem key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="video" />
            <EmptyPlaceholder.Title>No video created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any video yet. Start creating content.
            </EmptyPlaceholder.Description>
            <VideoCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
