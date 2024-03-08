/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: '@mdx-js/react',
  },
})

const {withSentryConfig} = require('@sentry/nextjs')

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

const IMAGES_REMOTE_PATTERNS = [
  {
    protocol: 'https',
    hostname: 'res.cloudinary.com',
    pathname: '**',
  },
  {
    protocol: 'https',
    hostname: 'd2eip9sf3oo6c2.cloudfront.net',
    pathname: '**',
  },
  {
    protocol: 'https',
    hostname: 'cdn.sanity.io',
    pathname: '**',
  },
  {
    protocol: 'https',
    hostname: 'image.mux.com',
    pathname: '**',
  },
  {
    protocol: 'http',
    hostname: process.env.NEXT_PUBLIC_HOST,
    pathname: '**',
  },
]

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  transpilePackages: ['@skillrecordings/skill-lesson', '@skillrecordings/ui'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  eslint: {ignoreDuringBuilds: true},
  experimental: {scrollRestoration: true},
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  images: {
    remotePatterns: IMAGES_REMOTE_PATTERNS,
  },
  async redirects() {
    return []
  },
}

const configWithPlugins = withMDX(nextConfig)

if (sentryWebpackPluginOptions) {
  module.exports = withSentryConfig(
    configWithPlugins,
    sentryWebpackPluginOptions,
  )
} else {
  module.exports = configWithPlugins
}
