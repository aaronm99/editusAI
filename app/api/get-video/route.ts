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

export async function GET(req: Request) {
  try {
    const command = await s3
      .getObject({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
        Key: "cllguzx7w0002ufbw3lswbnot",
      })
      .promise()
    return new Response(JSON.stringify({ command }), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(JSON.stringify(error), { status: 500 })
  }
}
