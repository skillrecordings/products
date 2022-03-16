const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withMDX = require('@next/mdx')()

const IMAGE_HOST_DOMAINS = [
  `res.cloudinary.com`,
  `d2eip9sf3oo6c2.cloudfront.net`,
  `cdn.sanity.io`,
]

const withTM = require('next-transpile-modules')(['unist-util-visit'], {
  debug: true,
})

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 😭
  },
  webpack: (config, {isServer}) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty',
      }
    }
    return config
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
    withTM,
    withMDX({
      pageExtensions: ['ts', 'tsx', 'mdx'],
      rehypePlugins: [require('mdx-prism')],
    }),
  ],
  nextConfig,
)
