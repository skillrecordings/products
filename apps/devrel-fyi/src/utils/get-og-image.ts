type OgImageUrlOptions = {
  title: string
  image?: string | null
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
    // CLOUDINARY_FETCH_BASE_URL + // TODO: figure out why it's not working with cloudinary fetch url
    `${process.env.NEXT_PUBLIC_URL}/api/og` + `?${query.toString()}`

  return {
    url,
    alt: title,
  }
}
