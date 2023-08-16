import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { VideoCreateButton } from "@/components/video-create-button"
import { VideoItem } from "@/components/post-item"

import { PresetModal } from "@/components/preset-modal"

export const metadata = {
  title: "Dashboard",
}

export default async function PresetPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const video = await db.preset.findMany({
    where: {
      authorId: user?.id,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      templates: {
        select: {
          id: true,
          updatedAt: true,
          config: true,
          objectId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <>
      <DashboardHeader heading="Presets" text="Create and manage your presets.">
        <PresetModal />
      </DashboardHeader>
      <div className="mt-8">
        {video?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {video.map((video) => (
              <VideoItem key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="video" />
            <EmptyPlaceholder.Title>No presets created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any presets yet. Start creating content.
            </EmptyPlaceholder.Description>
            <VideoCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </>
  )
}
