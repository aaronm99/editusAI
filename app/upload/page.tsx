"use client"
import React, { useState } from "react"
import axios from "axios"
type Props = {}

function Upload({}: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadUrl, setUploadUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const uploadToS3 = async () => {
    setUploadProgress(0)
    if (!file) return

    console.log("Getting S3 presigned URL...")
    const response = await axios.post("/api/s3-presigned-url", {
      fileName: file.name,
      fileType: file.type,
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
        setUploadProgress(percentCompleted)
      },
    }

    console.log("Uploading to S3...")
    console.log("signedRequest: ", signedRequest)

    await axios.put(signedRequest, file, options)

    setUploadUrl(response.data.url)
    setUploadProgress(100)
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadToS3}>Upload</button>
      {uploadProgress > 0 && <div>Progress: {uploadProgress}%</div>}
      {uploadUrl && <a href={uploadUrl}>View Uploaded Video</a>}
    </div>
  )
}

export default Upload
