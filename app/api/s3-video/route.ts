import z from "zod"

import { db } from "@/lib/db"
import { RequiresProPlanError } from "@/lib/exceptions"
import { S3VideoSchema } from "@/types/schema"
import { getWithSSRContext } from "@/app/(auth)/ssr"

export async function POST(req: Request) {
  try {
    const { Auth } = getWithSSRContext()

    const currentUser = await Auth.currentAuthenticatedUser()
    console.log(currentUser, "xx23 current user")
    const session = await Auth.currentSession()

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = S3VideoSchema.parse(json)

    if (!body.id || !body.type || !body.key) {
      return new Response("Missing id or type or key", { status: 422 })
    }

    const presetConfigId = body.presetConfigId

    const video = await db.video.create({
      data: {
        userId: currentUser.username,
        bucket: currentUser.username,
        key: body.key,
        type: body.type,
        configId: body.id,
      },
      select: {
        id: true,
      },
    })

    if (body.presetId) {
      const updatedVideo = await db.video.update({
        where: {
          id: video.id,
        },
        data: {
          presetId: body.presetId,
        },
        select: {
          presetId: true,
        },
      })

      return new Response(JSON.stringify(updatedVideo))
    }

    if (body.presetConfigId) {
      const updatedVideo = await db.video.update({
        where: {
          id: video.id,
        },
        data: {
          presetConfigId,
        },
        select: {
          configId: true,
        },
      })

      return new Response(JSON.stringify(updatedVideo))
    }

    return new Response(JSON.stringify({ video }))
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

export async function PATCH(req: Request) {
  try {
    const { Auth } = getWithSSRContext()

    const currentUser = await Auth.currentAuthenticatedUser()
    const session = await Auth.currentSession()

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
        userId: currentUser.username,
        bucket: currentUser.username,
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
