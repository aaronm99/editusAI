"use client"

import React from "react"
import SrtJson from "../config/srt.json"
import ReactPlayer from "react-player"
import { EditCard } from "./edit-card"

type ItemType = (typeof SrtJson.results.items)[0]

export const SrtEditor = () => {
  const [srt, setSrt] = React.useState(SrtJson)
  const videoRef = React.useRef(null)
  const [selectedWord, setSelectedWord] = React.useState<ItemType | null>(null)
  const [wordIndex, setWordIndex] = React.useState<number>(0)

  function seek(time: string | undefined) {
    videoRef.current && time && videoRef.current.seekTo(time, "seconds")
  }

  function handleClick(index) {
    setSelectedWord(srt.results.items[index])
    setWordIndex(index)
  }

  function handleCancel() {
    setSelectedWord(null)
  }

  function updateWord(word) {
    const updatedSrt = { ...srt }
    updatedSrt.results.items[wordIndex].alternatives[0].content = word
    updatedSrt.results.items[wordIndex].isUpdated = true // Mark as updated
    setSrt(updatedSrt)
    setSelectedWord(null)
  }

  return (
    <div className="mt-10 flex flex-row space-x-4">
      <div className="w-1/2 ">
        <h2 className="text-xl font-semibold">Transcript</h2>
        <p className="mb-1 mt-2 text-sm text-muted-foreground">
          Click on words to edit.
        </p>
        <div className="rounded-lg border-2 bg-gray-100 p-1 dark:bg-gray-900">
          {srt.results.items.map((x, i) => {
            return (
              <EditorWord
                item={x}
                key={i}
                index={i}
                seek={seek}
                handleClick={handleClick}
              />
            )
          })}
        </div>
        {selectedWord && (
          <div className="mt-2">
            <EditCard
              word={selectedWord}
              handleCancel={handleCancel}
              handleConfirm={updateWord}
            />
          </div>
        )}
      </div>
      <ReactPlayer
        ref={videoRef}
        url="https://streamable.com/e5e5sh"
        controls
      />
    </div>
  )
}

const EditorWord = ({
  item,
  index,
  seek,
  handleClick,
}: {
  item: ItemType
  index: number
  handleClick: (index: number) => void
  seek: (time: string | undefined) => void
}) => {
  const word = item.alternatives[0].content
  const time = item.start_time
  const isUpdated = item.isUpdated || false

  return (
    <span className="inline-block">
      <span
        className={`cursor-pointer rounded-md p-1 hover:bg-gray-700 ${
          isUpdated ? "text-green-500" : ""
        }`}
        onClick={() => {
          seek(time)
          handleClick(index)
        }}
      >
        {word}
      </span>
    </span>
  )
}
