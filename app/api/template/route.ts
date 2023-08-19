import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import z from "zod"

const postCreateSchema = z.object({
  title: z.string(),
  presetId: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = postCreateSchema.parse(json)

    const template = await db.template.create({
      data: {
        title: body.title,
        bucket: "",
        key: "",
        preset: {
          connect: {
            id: body.presetId,
          },
        },
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

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const templates = await db.template.findMany({
      where: {
        preset: {
          userId: session.user.id,
        },
      },
      select: {
        id: true,
        title: true,
        config: true,
        bucket: true,
        key: true,
      },
    })

    return new Response(JSON.stringify(templates))
  } catch (error) {
    return new Response(error, { status: 500 })
  }
}