import * as z from "zod"

import { db } from "@/lib/db"
import { FormSchema } from "@/types/schema"
import { Position } from "@prisma/client"
import { getWithSSRContext } from "@/app/(auth)/ssr"

const routeContextSchema = z.object({
  params: z.object({
    videoId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.

    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.videoId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = FormSchema.parse(json.content)

    const preset = await db.preset.findFirst({
      where: {
        id: params.videoId,
      },
      select: {
        videoConfig: true,
      },
    })
    const id = preset?.videoConfig[0].configId

    const updateConfig = await db.config.update({
      where: {
        id: id as string,
      },
      data: {
        nouns: body.caption.sentence.highlight.nouns,
        fontName: body.caption.font.family,
        fontSize: body.caption.font.size,
        sentenceLength: Number(body.caption.sentence.length),
        sentenceCasing: body.caption.sentence.casing,
        textPosition: body.captionPosition,
        videoSplitRatio: Number(body.splitPosition).toFixed(2),
        title: body.title,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify({ id }), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(error, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToPost(videoId: string) {
  const count = await db.preset.count({
    where: {
      id: videoId,
    },
  })

  return count > 0
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    if (!(await verifyCurrentUserHasAccessToPost(params.videoId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the post.
    await db.preset.delete({
      where: {
        id: params.videoId as string,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { Auth } = getWithSSRContext()

    const currentUser = await Auth.currentAuthenticatedUser()
    const session = await Auth.currentSession()

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { params } = routeContextSchema.parse(context)

    const templates = await db.preset.findMany({
      where: {
        userId: currentUser.username,
        id: params.videoId,
      },
      select: {
        id: true,
        videoConfig: true,
      },
    })

    return new Response(JSON.stringify(templates))
  } catch (error) {
    return new Response(error, { status: 500 })
  }
}
