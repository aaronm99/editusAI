import { getServerSession } from "next-auth/next"
import z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { FormSchema, VideoSchema } from "@/types/schema"
import { Position } from "@prisma/client"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const posts = await db.video.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
      where: {
        userId: user.id,
      },
    })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = VideoSchema.parse(json)

    const data = body.content

    const config = await db.config.create({
      data: {
        title: data.title,
        videoSplitRatio: Number(data.splitPosition).toFixed(2),
        fontName: data.caption.font.family,
        fontSize: data.caption.font.size,
        fontWeight: data.caption.font.weight,
        nouns: data.caption.sentence.highlight.nouns,
        sentenceLength: Number(data.caption.sentence.length),
        sentenceCasing: data.caption.sentence.casing,
        textPosition: Position.CENTER,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(config))
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
