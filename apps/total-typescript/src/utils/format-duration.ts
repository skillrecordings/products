import pluralize from 'pluralize'

export function formatDuration(durationInSeconds: number) {
  const minutes = Math.floor(durationInSeconds / 60)
  const seconds = Math.floor(durationInSeconds % 60)
  return minutes > 0
    ? `${minutes} ${pluralize('min', minutes)}`
    : `${seconds} sec`
}
