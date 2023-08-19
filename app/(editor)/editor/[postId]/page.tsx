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
      userId: userId,
    },
  })
}

async function getTemplateForUser(templateId: Video["id"], userId: User["id"]) {
  return await db.template.findFirst({
    where: {
      id: templateId,
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
  let template
  if (!video) {
    template = await getTemplateForUser(params.videoId, user.id)
  }

  if (!video && !template) {
    notFound()
  }

  return (
    <Editor
      template={!!template}
      video={{
        id: (video && video.id) || template.id,
        title: (video && video.title) || template.title,
        status: (video && video.status) || "draft",
        config: (video && video.config) || template.config,
      }}
    />
  )
}
