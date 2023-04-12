const findByCommentMarker = (code: string, marker: string) => {
  const lines = code.split('\n')

  const descriptionLine = lines.find((line) => line.includes(marker))
  return (
    descriptionLine
      ?.slice(descriptionLine.indexOf(marker) + marker.length)
      .trim() || ''
  )
}

export default findByCommentMarker
