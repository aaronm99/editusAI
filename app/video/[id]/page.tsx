import VideoEditor from "@/components/video/component"
import React from "react"

type Props = { params: { id: string } }

async function VideoPage({ params: { id } }: Props) {
  const video = await fetch(
    `https://dz19g20pt3.execute-api.us-east-1.amazonaws.com/prod/video/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "clkdtoj290017qbzd93lb4llc",
      },
    }
  ).then((res) => res.json())

  return (
    <div>
      VideoPage
      <VideoEditor video={video.video} />
    </div>
  )
}

export default VideoPage
