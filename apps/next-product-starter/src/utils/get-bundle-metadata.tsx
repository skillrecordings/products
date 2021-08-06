import React from 'react'
import Image from 'next/image'

export function getBundleImage(slug: string): any {
  switch (slug) {
    case process.env.NEXT_PUBLIC_PRO_SLUG:
      return (
        <Image
          src="/placeholder-rect.svg"
          width={120}
          height={120}
          alt={slug}
          quality={100}
        />
      )

    case process.env.NEXT_PUBLIC_BOOK_SLUG:
      return (
        <Image
          src="/placeholder-rect.svg"
          width={120}
          height={120}
          alt={slug}
          quality={100}
        />
      )

    default:
      null
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
      ''
  }
}
