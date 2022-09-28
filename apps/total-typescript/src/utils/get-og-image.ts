type OgImageUrlOptions = {
  title: string
  image?: string
  byline?: string
}

const CLOUDINARY_FETCH_BASE_URL = `https://res.cloudinary.com/total-typescript/image/fetch/dpr_auto,f_auto,q_auto:good/`

export const getOgImage = (options: OgImageUrlOptions) => {
  const {title, image, byline} = options

  const query = new URLSearchParams({
    ...(image && {image}),
    ...(byline && {byline}),
    title: title,
  })
  const url =
    CLOUDINARY_FETCH_BASE_URL +
    process.env.NEXT_PUBLIC_OG_IMAGE_URI +
    `/${encodeURI(title)}?${query.toString()}`

  return {
    url,
    alt: title,
  }
}
