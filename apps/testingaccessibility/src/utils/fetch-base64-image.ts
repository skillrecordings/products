/**
 * Fetches an image from a URL and returns a base64 encoded string.
 * @param url url of image to fetch
 * @returns base64 encoded image
 */

export async function fetchBase64Image(url: string) {
  const response: any = await fetch(url)
  const buffer = await response.buffer()
  const imageType = response.headers.get('content-type')
  const base64 = buffer.toString('base64')
  const image = `data:${imageType};base64,` + base64

  return image
}
