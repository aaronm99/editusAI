import { getWithSSRContext } from "@/app/(auth)/ssr"
import { db } from "@/lib/db"
import { TemplateSchema } from "@/types/schema"
import { Position } from "@prisma/client"
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
    const body = TemplateSchema.parse(json)

    const template = await db.config.create({
      data: {
        fontName: body.content.caption.font.family,
        fontSize: body.content.caption.font.size,
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
