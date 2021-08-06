const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withMDX = require('@next/mdx')()

const IMAGE_HOST_DOMAINS = [
  `res.cloudinary.com`,
  `d2eip9sf3oo6c2.cloudfront.net`,
]

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
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
    withImages(),
    withMDX({
      pageExtensions: ['ts', 'tsx', 'mdx'],
      remarkPlugins: [require('remark-slug')],
      rehypePlugins: [require('mdx-prism')],
    }),
  ],
  nextConfig,
)
