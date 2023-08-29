export function convertToSRT(jsonData) {
  let srtContent = ""

  jsonData.items.forEach((item, index) => {
    const { start_time, end_time, alternatives } = item
    const text = alternatives[0].content // Assuming only one alternative is present
    const srtEntry = `${index + 1}\n${formatTime(start_time)} --> ${formatTime(
      end_time
    )}\n${text}\n\n`
    srtContent += srtEntry
  })

  return srtContent
}

function formatTime(time) {
  const seconds = parseFloat(time)
  const milliseconds = (seconds - Math.floor(seconds)) * 1000
  const formattedTime = new Date(0, 0, 0, 0, 0, 0, milliseconds)
    .toISOString()
    .substr(11, 12)
  return `${formattedTime},${milliseconds.toFixed(0)}`
}
