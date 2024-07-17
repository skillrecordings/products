type OgImageUrlOptions = {
  title: string
  image?: string | null
  byline?: string
  type?: string
  path?: string
  authorName?: string
  authorImage?: string
  muxPlaybackId?: string
  bgImage?: string
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
    muxPlaybackId,
    bgImage,
  } = options

  const query = new URLSearchParams({
    ...(image && {image}),
    ...(muxPlaybackId && {muxPlaybackId}),
    ...(byline && {byline}),
    ...(type && {type}),
    ...(authorImage && {authorImage}),
    ...(authorName && {authorName}),
    ...(bgImage && {bgImage}),
    title: title,
  })
  const url =
    `${process.env.NEXT_PUBLIC_URL}/api/og` + path + `?${query.toString()}`

  return {
    url,
    alt: title,
  }
}
