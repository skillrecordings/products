const withSvgr = require('next-svgr')

const IMAGE_HOST_DOMAINS = ['res.cloudinary.com', 'github.com']

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: IMAGE_HOST_DOMAINS,
  },
  webpack: (config, {isServer}) => {
    config.experiments = {topLevelAwait: true, layers: true}

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      }
    }

    return config
  },
}

module.exports = withSvgr(nextConfig)
