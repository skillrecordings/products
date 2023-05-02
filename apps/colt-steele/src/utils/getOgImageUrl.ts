/**
 * Used to generate the og:image url for a given title
 */
export const getOgImageUrl = (title: string) => {
  return `/og?title=${encodeURIComponent(title)})}`
}
