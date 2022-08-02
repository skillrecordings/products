export const getOgImage = (title: string, image?: string) => {
  const url =
    process.env.NEXT_PUBLIC_OG_IMAGE_URI +
    `?title=${encodeURI(title)}${image ? `&image=${image}` : ''}`

  return {
    url,
    alt: title,
  }
}
