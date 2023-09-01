// pages/api/s3-presigned-url.ts
import { NextApiRequest, NextApiResponse } from "next"
import AWS from "aws-sdk"
import z from "zod"
import { getWithSSRContext } from "@/app/(auth)/ssr"
import { VIDEO_TYPE } from "@prisma/client"

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const s3 = new AWS.S3()

export async function POST(req: Request) {
  try {
    const { fileName, fileType, id, type } = await req.json()

    const { Auth } = getWithSSRContext()

    const currentUser = await Auth.currentAuthenticatedUser()
    const session = await Auth.currentSession()
    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const bucketName =
      type === VIDEO_TYPE.PRIMARY
        ? process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME
        : process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_SECONDARY

    const key = id ? `${currentUser.username}/${id}.mp4` : fileName

    const s3Params = {
      Bucket: bucketName,
      Key: key,
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
    return new Response(JSON.stringify({ signedRequest, url, key }), {
      status: 200,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(JSON.stringify(error), { status: 500 })
  }
}
