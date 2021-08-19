import * as React from 'react'
import {render, screen} from '@testing-library/react'

import {getBundleDescription, getBundleImage} from './get-bundle-metadata'

describe('getBundleImage', () => {
  test('returns an image', () => {
    const slug = process.env.NEXT_PUBLIC_PRO_SLUG as string

    render(getBundleImage(slug))

    const image = screen.getByAltText(slug)

    expect(image).toBeInstanceOf(Image)
  })
})

describe('getBundleDescription', () => {
  test('description has length', () => {
    const slug = process.env.NEXT_PUBLIC_PRO_SLUG as string

    const bundleDescription = getBundleDescription(slug)
    expect(bundleDescription.length).toBeGreaterThan(0)
  })
})
