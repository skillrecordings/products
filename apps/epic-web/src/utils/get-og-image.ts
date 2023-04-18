import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'

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
    // CLOUDINARY_FETCH_BASE_URL + // TODO: figure out why it's not working with cloudinary fetch url
    `${getBaseUrl()}/api/og` + `?${query.toString()}`

  return {
    url,
    alt: title,
  }
}
