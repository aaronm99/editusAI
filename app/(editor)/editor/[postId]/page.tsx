import { notFound, redirect } from "next/navigation"
import { Video, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { Editor } from "@/components/editor"

async function getPostForUser(videoId: Video["id"], userId: User["id"]) {
  return await db.video.findFirst({
    where: {
      id: videoId,
      authorId: userId,
    },
  })
}

interface EditorPageProps {
  params: { videoId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const video = await getPostForUser(params.videoId, user.id)

  if (!video) {
    notFound()
  }

  return (
    <Editor
      video={{
        id: video.id,
        title: video.title,
        published: video.published,
        config: video.config,
      }}
    />
  )
}
