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
  presetConfigId?: string,
  presetId?: string
) {
  if (!file) return
  let createVideoConfig
  console.log("Getting S3 presigned URL...")

  if (type === VIDEO_TYPE.PRIMARY) {
    createVideoConfig = await axios.post("/api/video-config", {
      id,
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

  if (presetId) {
    const res = await axios.post("/api/s3-video", {
      id: "undefined",
      type,
      key: response.data.key,
      presetId,
    })

    const data = res.data

    return data
  }

  if (presetConfigId) {
    const res = await axios.post("/api/s3-video", {
      id: "undefined",
      type,
      key: response.data.key,
      presetConfigId,
    })

    const data = res.data

    return data
  }

  if (type === VIDEO_TYPE.PRIMARY) {
    const res = await axios.post("/api/s3-video", {
      id: createVideoConfig.data.videoConfig.id || id,
      type,
      key: response.data.key,
    })

    return { id: createVideoConfig.data.videoConfig.id }
  } else if (type === VIDEO_TYPE.SECONDARY) {
    const res = await axios.patch("/api/s3-video", {
      id,
      type,
      key: response.data.key,
    })

    const data = res.data

    return data
  }
  return { id: createVideoConfig.data.videoConfig.id || id }
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
