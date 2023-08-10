import { z } from "zod"

export async function GET(req: Request) {
  try {
    const result = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.GOOGLE_FONTS_API_KEY}&sort=POPULARITY`
    )

    if (result) {
      const data = await result.json()
      return new Response(JSON.stringify(data), { status: 200 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
