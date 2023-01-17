import React from 'react'
import Image from 'next/legacy/image'

export function getBundleStyles(slug: string) {
  switch (slug) {
    case process.env.NEXT_PUBLIC_PRO_SLUG:
      return ''
    case process.env.NEXT_PUBLIC_BOOK_SLUG:
      return ''
    default:
      return ''
  }
}

export function getBundleImage(
  slug: string,
  imagePath: string = '/placeholder-react.svg',
): any {
  switch (slug) {
    case process.env.NEXT_PUBLIC_PRO_SLUG:
      return (
        <Image
          src={imagePath}
          width={120}
          height={120}
          alt={slug}
          quality={100}
        />
      )

    case process.env.NEXT_PUBLIC_BOOK_SLUG:
      return (
        <Image
          src={imagePath}
          width={120}
          height={120}
          alt={slug}
          quality={100}
        />
      )

    default:
      return null
  }
}

export function getBundleDescription(slug: string) {
  // TODO replace with titles of bundles and the features they come with
  switch (slug) {
    case process.env.NEXT_PUBLIC_PRO_SLUG:
      return [
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
      ]
    case process.env.NEXT_PUBLIC_BOOK_SLUG:
      return [
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
        'Lorem ipsum dolor sit amet',
      ]
    default:
      return []
  }
}
