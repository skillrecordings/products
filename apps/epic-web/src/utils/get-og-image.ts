type OgImageUrlOptions = {
  title: string
  image?: string
}

const CLOUDINARY_FETCH_BASE_URL = `https://res.cloudinary.com/total-typescript/image/fetch/dpr_auto,f_auto,q_auto:good/`

export const getOgImage = (options: OgImageUrlOptions) => {
  const {title, image} = options

  const query = new URLSearchParams({
    ...(image && {image}),
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
