const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withMDX = require('@next/mdx')()
const {withSentryConfig} = require('@sentry/nextjs')

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

const sentryWebpackPluginOptions = process.env.SENTRY_AUTH_TOKEN && {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
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

if (sentryWebpackPluginOptions) {
  module.exports = withSentryConfig(
    configWithPlugins,
    sentryWebpackPluginOptions,
  )
} else {
  module.exports = configWithPlugins
}
