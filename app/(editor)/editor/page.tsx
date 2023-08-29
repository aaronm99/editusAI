import { User, Video } from "@prisma/client"
import { notFound, redirect } from "next/navigation"

import { Editor } from "@/components/editor"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

interface EditorPageProps {
  params: { videoId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <>
      <Editor />
    </>
  )
}
