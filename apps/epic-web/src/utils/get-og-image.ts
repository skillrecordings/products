import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'

type OgImageUrlOptions = {
  title: string
  image?: string | null
  byline?: string
  type?: string
}

export const getOgImage = (options: OgImageUrlOptions) => {
  const {title, image, byline, type} = options

  const query = new URLSearchParams({
    ...(image && {image}),
    ...(byline && {byline}),
    ...(type && {type}),
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
