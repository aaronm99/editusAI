import { getWithSSRContext } from "@/app/(auth)/ssr"
import { db } from "@/lib/db"
import z from "zod"

const schema = z.object({
  configId: z.string(),
  presetConfigId: z.string(),
})

export async function POST(req: Request) {
  try {
    const { Auth } = getWithSSRContext()

    const currentUser = await Auth.currentAuthenticatedUser()
    const session = await Auth.currentSession()

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = schema.parse(json)

    const result = await db.presetConfig.create({
      data: {
        userId: currentUser.username,
        configId: body.configId,
        presetId: body.presetConfigId,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(result))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(error, { status: 500 })
  }
}
