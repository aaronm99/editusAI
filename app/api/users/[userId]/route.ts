import { z } from "zod"

import { db } from "@/lib/db"
import { userNameSchema } from "@/lib/validations/user"
import { withSSRContext } from "aws-amplify"

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route context.
    const { params } = routeContextSchema.parse(context)

    const { Auth } = withSSRContext({ req })
    const user = await Auth.currentAuthenticatedUser()

    // Ensure user is authentication and has access to this user.

    if (!user || params.userId !== user.username) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const body = await req.json()
    const payload = userNameSchema.parse(body)

    // Update the user.
    await db.user.update({
      where: {
        id: user.username,
      },
      data: {
        name: payload.name,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
