import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'

type OgImageUrlOptions = {
  title: string
  image?: string | null
  byline?: string
  type?: string
  path?: string
  authorName?: string
  authorImage?: string
}

export const getOgImage = (options: OgImageUrlOptions) => {
  const {
    title,
    image,
    byline,
    type,
    path = '',
    authorImage,
    authorName,
  } = options

  const query = new URLSearchParams({
    ...(image && {image}),
    ...(byline && {byline}),
    ...(type && {type}),
    ...(authorImage && {authorImage}),
    ...(authorName && {authorName}),
    title: title,
  })
  const url =
    // CLOUDINARY_FETCH_BASE_URL + // TODO: figure out why it's not working with cloudinary fetch url
    `${process.env.NEXT_PUBLIC_URL}/api/og` + path + `?${query.toString()}`

  return {
    url,
    alt: title,
  }
}
