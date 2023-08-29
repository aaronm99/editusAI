import { getWithSSRContext } from "@/app/(auth)/ssr"
import { db } from "@/lib/db"
import { PresetVideoConfigSchema } from "@/types/schema"
import z from "zod"

export async function POST(req: Request) {
  try {
    const { Auth } = getWithSSRContext()

    const currentUser = await Auth.currentAuthenticatedUser()
    const session = await Auth.currentSession()

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = PresetVideoConfigSchema.parse(json).content

    const video = await db.video.create({
      data: {
        bucket: body.bucket,
        key: body.key,
        type: body.type,
        configId: body.configId,
        presetId: body.presetId,
        status: body.status,
        userId: currentUser.username,
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
