import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { PresetSchema } from "@/types/schema"
import { getServerSession } from "next-auth"

import * as z from "zod"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = PresetSchema.parse(json)

    const video = await db.preset.create({
      data: {
        title: body.name,
        userId: session.user.id,
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
