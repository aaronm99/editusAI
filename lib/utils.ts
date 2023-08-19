import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"

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

export async function uploadToS3(file: File, id?: string) {
  if (!file) return

  console.log("Getting S3 presigned URL...")
  const response = await axios.post("/api/s3-presigned-url", {
    fileName: file.name,
    fileType: file.type,
    id,
  })

  console.log(file.name, "file.name")

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
}

export const getTemplates = async () => {
  const response = await axios.get("/api/template", {
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.data
}
