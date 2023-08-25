import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { TemplateSchema } from "@/types/schema"
import { Position } from "@prisma/client"
import { getServerSession } from "next-auth"
import z from "zod"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = TemplateSchema.parse(json)

    const template = await db.config.create({
      data: {
        fontName: body.content.caption.font.family,
        fontSize: body.content.caption.font.size,
        fontWeight: body.content.caption.font.weight,
        nouns: body.content.caption.sentence.highlight.nouns,
        sentenceLength: Number(body.content.caption.sentence.length),
        sentenceCasing: body.content.caption.sentence.casing,
        textPosition: body.content.captionPosition,
        videoSplitRatio: Number(body.content.splitPosition).toFixed(2),
        title: body.content.title,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(template))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(error, { status: 500 })
  }
}
