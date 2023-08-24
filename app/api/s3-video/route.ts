import { getServerSession } from "next-auth/next"
import z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { S3VideoSchema } from "@/types/schema"
import { Position } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = S3VideoSchema.parse(json)

    if (!body.id || !body.type || !body.key) {
      return new Response("Missing id or type or key", { status: 422 })
    }

    const video = await db.video.create({
      data: {
        userId: session.user.id,
        bucket: session.user.id,
        key: body.key,
        type: body.type,
        configId: body.id,
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

    if (error instanceof RequiresProPlanError) {
      return new Response("Requires Pro Plan", { status: 402 })
    }

    return new Response(error, { status: 500 })
  }
}
