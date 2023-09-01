// pages/api/s3-presigned-url.ts
import { NextApiRequest, NextApiResponse } from "next"
import AWS from "aws-sdk"
import z from "zod"

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const s3 = new AWS.S3()

const Schema = z.object({
  s3key: z.string(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = Schema.parse(json)

    const url = s3.getSignedUrl("getObject", {
      Bucket: process.env.NEXT_PUBLISH_AWS_S3_BUCKET_NAME_OUTPUT!,
      Key: body.s3key,
      Expires: 3600,
    })
    return new Response(JSON.stringify({ url }), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(JSON.stringify(error), { status: 500 })
  }
}
