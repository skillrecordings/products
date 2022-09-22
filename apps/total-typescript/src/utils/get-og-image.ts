type OgImageUrlOptions = {
  title: string
  image?: string
  byline?: string
}
export const getOgImage = (options: OgImageUrlOptions) => {
  const {title, image, byline} = options

  const query = new URLSearchParams({
    ...(image && {image}),
    ...(byline && {byline}),
    title: title,
  })
  const url =
    process.env.NEXT_PUBLIC_OG_IMAGE_URI +
    `/${encodeURI(title)}?${query.toString()}`

  return {
    url,
    alt: title,
  }
}
