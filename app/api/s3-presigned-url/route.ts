// pages/api/s3-presigned-url.ts
import { NextApiRequest, NextApiResponse } from "next"
import AWS from "aws-sdk"
import z from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const s3 = new AWS.S3()

export async function POST(req: Request) {
  try {
    const { fileName, fileType, id } = await req.json()
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const key = id ? `${user.id}/${id}` : fileName

    const updatedKey = `${Date.now()}-${key}`

    const s3Params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      Key: updatedKey,
      Expires: 60, // Number of seconds before signed URL expires
      ContentType: fileType,
      Metadata: {
        id: id || "",
      },
      //   ACL: "public-read", // Depending on your requirements
    }

    const signedRequest = await s3.getSignedUrlPromise("putObject", s3Params)

    const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    console.log({ url })
    return new Response(
      JSON.stringify({ signedRequest, url, key: updatedKey }),
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(JSON.stringify(error), { status: 500 })
  }
}
