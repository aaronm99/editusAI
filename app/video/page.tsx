import VideoEditor from "@/components/video/component"

export default async function VideoComponent() {
  const video = await fetch(
    "https://dz19g20pt3.execute-api.us-east-1.amazonaws.com/prod/video/b895d295-e507-4d1d-b465-93b14a006bea",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "clkdtoj290017qbzd93lb4llc",
      },
    }
  ).then((res) => res.json())

  return <VideoEditor video={video} />
}
