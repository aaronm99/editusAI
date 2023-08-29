import z from "zod"

import { db } from "@/lib/db"
import { RequiresProPlanError } from "@/lib/exceptions"

import { VideoSchema } from "@/types/schema"
import { getWithSSRContext } from "@/app/(auth)/ssr"

export async function GET(req: Request) {
  try {
    const { Auth } = getWithSSRContext()

    const session = await Auth.currentAuthenticatedUser()

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
        userId: user.username,
      },
    })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { Auth } = getWithSSRContext()

    const session = await Auth.currentAuthenticatedUser()

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
        nouns: data.caption.sentence.highlight.nouns,
        sentenceLength: Number(data.caption.sentence.length),
        sentenceCasing: data.caption.sentence.casing,
        textPosition: data.captionPosition,
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
