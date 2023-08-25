import * as z from "zod"

import { db } from "@/lib/db"

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

async function verifyCurrentUserHasAccessToPost(videoId: string) {
  const count = await db.preset.count({
    where: {
      id: videoId,
    },
  })

  return count > 0
}
