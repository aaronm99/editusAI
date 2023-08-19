"use client"

import { useEffect } from "react"

async function GetVideo() {
  const res = await fetch("/api/get-video")
  return await res.json()
}

export const ProcessingVideo = () => {
  useEffect(() => {
    const res = GetVideo()

    console.log(res, "res")
  }, [])
  return <div>Hello World</div>
}
