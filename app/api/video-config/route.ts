import { getWithSSRContext } from "@/app/(auth)/ssr"
import { db } from "@/lib/db"
import { z } from "zod"

const schema = z.object({
  id: z.string(),
  presetId: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const { Auth } = getWithSSRContext()

    const session = await Auth.currentAuthenticatedUser()

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = schema.parse(json)

    const videoConfig = await db.videoConfig.create({
      data: {
        configId: body.id,
        presetId: body.presetId,
      },
    })

    return new Response(JSON.stringify({ videoConfig }))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(error, { status: 500 })
  }
}
