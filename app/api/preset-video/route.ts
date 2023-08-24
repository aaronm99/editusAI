import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { PresetVideoSchema } from "@/types/schema"
import { getServerSession } from "next-auth"
import z from "zod"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = PresetVideoSchema.parse(json)

    const video = await db.video.create({
      data: {
        title: body.content.title,
        userId: session.user.id,
        presetId: body.content.presetId,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(video))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(error, { status: 500 })
  }
}
