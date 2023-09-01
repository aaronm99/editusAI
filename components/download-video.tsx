"use client"
import { useEffect, useState } from "react"

interface Props {
  s3key?: string
}

export function DownloadVideo({ s3key }: Props) {
  const [state, setState] = useState({
    url: "",
  })

  useEffect(() => {
    const getUrl = async () => {
      const videoUrl = await fetch("/api/get-video", {
        method: "POST",
        body: JSON.stringify({ s3key }),
      })
      const url = await videoUrl.json()
      setState({ url: url.url })
    }

    getUrl()
  }, [s3key])
  return (
    <div>
      <a href={state.url} rel="noreferrer">
        Download
      </a>
    </div>
  )
}
