import { getWithSSRContext } from "@/app/(auth)/ssr"
import { db } from "@/lib/db"
import { PresetSchema } from "@/types/schema"

import * as z from "zod"

export async function POST(req: Request) {
  try {
    const { Auth } = getWithSSRContext()

    const currentUser = await Auth.currentAuthenticatedUser()
    const session = await Auth.currentSession()

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = PresetSchema.parse(json)

    const video = await db.preset.create({
      data: {
        name: body.name,
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

    return new Response(null, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { Auth } = getWithSSRContext()

    const currentUser = await Auth.currentAuthenticatedUser()
    const session = await Auth.currentSession()

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const presets = await db.preset.findMany({
      where: {
        userId: currentUser.username,
      },
      select: {
        id: true,
        name: true,
        videoConfig: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return new Response(JSON.stringify(presets))
  } catch (error) {
    return new Response(error, { status: 500 })
  }
}
