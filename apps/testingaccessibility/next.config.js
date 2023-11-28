const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withMDX = require('@next/mdx')()

const IMAGE_HOST_DOMAINS = [
  `res.cloudinary.com`,
  `d2eip9sf3oo6c2.cloudfront.net`,
  `cdn.sanity.io`,
  `testingaccessibility.com`,
]

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  transpilePackages: ['@skillrecordings/skill-lesson'],
  eslint: {
    ignoreDuringBuilds: true, // 😭
  },
  experimental: {
    scrollRestoration: true,
  },
  productionBrowserSourceMaps: true,
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

const configWithPlugins = withPlugins(
  [
    withImages(),
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

module.exports = configWithPlugins
