type OgImageUrlOptions = {
  title: string
  image?: string
  byline?: string
  type?: string
}

const CLOUDINARY_FETCH_BASE_URL = `https://res.cloudinary.com/total-typescript/image/fetch/dpr_auto,f_auto,q_auto:good/`

export const getOgImage = (options: OgImageUrlOptions) => {
  const {title, image, byline, type} = options

  const query = new URLSearchParams({
    ...(image && {image}),
    ...(byline && {byline}),
    ...(type && {type}),
    title: title,
  })
  const url =
    // (process.env.NODE_ENV === 'development' ? '' : CLOUDINARY_FETCH_BASE_URL) +
    process.env.NEXT_PUBLIC_OG_IMAGE_URI +
    '/og-default' +
    `?${query.toString()}`

  return {
    url,
    alt: title,
  }
}
