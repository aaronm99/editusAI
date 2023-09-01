import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"
import { VIDEO_TYPE } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function formatFileSize(sizeInBytes) {
  if (sizeInBytes >= Math.pow(1024, 3)) {
    return `${(sizeInBytes / Math.pow(1024, 3)).toFixed(2)} GB`
  } else {
    return `${(sizeInBytes / Math.pow(1024, 2)).toFixed(2)} MB`
  }
}

export async function uploadToS3(
  file: File,
  id?: string,
  type?: VIDEO_TYPE,
  presetId?: string,
  preset?: boolean
) {
  if (!file) return
  let createVideoConfig
  console.log("Getting S3 presigned URL...")

  // if (preset) {
  //     const res = await axios.post("/api/s3-video", {
  //       id: createVideoConfig?.data?.videoConfig?.id || id,
  //       type,
  //       key: response.data.key,
  //     })

  //   return
  // }

  if (type === VIDEO_TYPE.PRIMARY || presetId) {
    createVideoConfig = await axios.post("/api/video-config", {
      id,
      presetId,
    })
  }

  const response = await axios.post("/api/s3-presigned-url", {
    fileName: file.name,
    fileType: file.type,
    id: createVideoConfig?.data?.videoConfig?.id || id,
    type,
  })

  console.log("response: ", response)

  const { signedRequest } = response.data

  const options = {
    headers: {
      "Content-Type": file.type,
    },
    onUploadProgress: (progressEvent: ProgressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
    },
  }

  console.log("Uploading to S3...")
  console.log("signedRequest: ", signedRequest)

  await axios.put(signedRequest, file, options)

  const res = await axios.post("/api/s3-video", {
    id: createVideoConfig?.data?.videoConfig?.id || id,
    type,
    key: response.data.key,
  })

  return { id: createVideoConfig?.data?.videoConfig?.id || id }
}

export const getTemplates = async (presetId: string) => {
  const response = await fetch(`/api/template/${presetId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await response.json()
  return data
}

export async function testRetry(bucket: string, key: string) {
  try {
    const res = await axios.post(
      "https://dev.functions.gomoved.com/transcribe/retry",
      {
        bucket,
        key,
      }
    )
    console.log(res, "res")
  } catch (error) {
    console.log("error: ", error)
  }
}
