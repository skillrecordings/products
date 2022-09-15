export const getOgImage = (title: string, image?: string, url?: string) => {
  url = url
    ? url
    : process.env.NEXT_PUBLIC_OG_IMAGE_URI
    ? process.env.NEXT_PUBLIC_OG_IMAGE_URI +
      `?title=${encodeURI(title)}${image ? `&image=${image}` : ''}`
    : process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE_URL

  return {
    url,
    alt: title,
  }
}
