/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins')
const withMDX = require('@next/mdx')()
const IMAGE_HOST_DOMAINS = [
  `res.cloudinary.com`,
  `d2eip9sf3oo6c2.cloudfront.net`,
  `cdn.sanity.io`,
  process.env.NEXT_PUBLIC_HOST,
]

const nextConfig = {
  eslint: {ignoreDuringBuilds: true},
  experimental: {scrollRestoration: true},
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  images: {
    domains: IMAGE_HOST_DOMAINS,
  },
  async redirects() {
    return []
  },
}

module.exports = withPlugins(
  [
    withMDX({
      options: {
        providerImportSource: '@mdx-js/react',
      },
      pageExtensions: ['ts', 'tsx', 'mdx'],
      rehypePlugins: [require('mdx-prism')],
    }),
  ],
  nextConfig,
)
