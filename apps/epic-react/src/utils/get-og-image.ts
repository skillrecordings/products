type OgImageUrlOptions = {
  title: string
  type?: 'root' | 'default' | 'article'
  image?: string | null
}

export const getOgImage = (options: OgImageUrlOptions) => {
  const {title, type = 'default', image} = options

  const query = new URLSearchParams({
    title: title,
    ...(image && {image: image}),
  })

  const path = getPathForType(type)
  const url =
    `${process.env.NEXT_PUBLIC_URL}/api/og/` + path + `?${query.toString()}`

  return {
    url,
    alt: title,
  }
}

const getPathForType = (type: string) => {
  switch (type) {
    case 'article':
      return 'article'
    case 'default':
      return 'og-default'
    case 'root':
      return 'og-root'
    default:
      return 'og-root'
  }
}
