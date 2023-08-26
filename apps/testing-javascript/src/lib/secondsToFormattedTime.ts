type Options = {resolveToSeconds: boolean}

export function secondsToFormattedTime(
  seconds: number,
  options?: Options,
): string {
  const {resolveToSeconds = false} = options || {}

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const secondsDisplay = resolveToSeconds ? ` ${remainingSeconds}s` : ''

  if (hours > 0) {
    return `${hours}h ${minutes}m${secondsDisplay}`
  } else {
    return `${minutes}m${secondsDisplay}`
  }
}
