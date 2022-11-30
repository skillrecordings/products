import * as React from 'react'

import {getBundleDescription, getBundleImage} from './get-bundle-metadata'

describe('getBundleImage', () => {
  test('returns an image', () => {
    const slug = process.env.NEXT_PUBLIC_PRO_SLUG as string

    expect(getBundleImage(slug)).toBeDefined()
  })
})

describe('getBundleDescription', () => {
  test('description has length', () => {
    const slug = process.env.NEXT_PUBLIC_PRO_SLUG as string

    const bundleDescription = getBundleDescription(slug)
    expect(bundleDescription.length).toBeGreaterThan(0)
  })
})
