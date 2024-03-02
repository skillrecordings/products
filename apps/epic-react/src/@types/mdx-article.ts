export interface ArticleFrontMatter {
  title: string
  slug: string
  date: string
  image: string
  socialImage: string
  imageAlt: string
  excerpt: string
  keywords?: string[] | null
}

export interface Article {
  title: string
  slug: string
  date: string
  excerpt: string
  image: string
  imageAlt: string
}
