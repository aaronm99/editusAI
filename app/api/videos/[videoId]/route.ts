import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { FormSchema } from "@/types/schema"

const routeContextSchema = z.object({
  params: z.object({
    videoId: z.string(),
  }),
})

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
    await db.config.delete({
      where: {
        id: params.videoId as string,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(error, { status: 500 })
  }
}

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

    // Update the post.
    // TODO: Implement sanitization for content.

    const id = await db.video.update({
      where: {
        id: params.videoId,
      },
      data: {
        config: body,
        title: body.title,
        status: "PROGRESS",
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

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToPost(videoId: string) {
  const count = await db.config.count({
    where: {
      id: videoId,
    },
  })

  return count > 0
}
