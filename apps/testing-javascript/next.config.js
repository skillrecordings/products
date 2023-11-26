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

const IMAGE_HOST_DOMAINS = [
  `res.cloudinary.com`,
  `d2eip9sf3oo6c2.cloudfront.net`,
  `cdn.sanity.io`,
  'image.mux.com',
  'testingjavascript.com',
  process.env.NEXT_PUBLIC_HOST,
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
    domains: IMAGE_HOST_DOMAINS,
  },
  async redirects() {
    return [
      {
        source: '/interviews/egghead-testing-levels-with-mattias-johansson',
        destination: '/interviews/testing-levels-with-mattias-johansson',
        permanent: true,
      },
      {
        source: '/interviews/egghead-craftmanship-with-kent-beck',
        destination: '/interviews/craftmanship-with-kent-beck',
        permanent: true,
      },
      {
        source: '/interviews/egghead-ministry-of-testing-with-rosie-sherry',
        destination: '/interviews/ministry-of-testing-with-rosie-sherry',
        permanent: true,
      },
      {
        source: '/interviews/egghead-testing-culture-with-justin-searls',
        destination: '/interviews/testing-culture-with-justin-searls',
        permanent: true,
      },
      {
        source: '/interviews/egghead-snapshots-and-reason-with-jared-forsyth',
        destination: '/interviews/snapshots-and-reason-with-jared-forsyth',
        permanent: true,
      },
      {
        source:
          '/interviews/egghead-visual-regression-testing-with-angie-jones',
        destination: '/interviews/visual-regression-testing-with-angie-jones',
        permanent: true,
      },
      {
        source: '/interviews/egghead-testing-practices-with-j-b-rainsberger',
        destination: '/interviews/testing-practices-with-j-b-rainsberger',
        permanent: true,
      },
      {
        source: '/interviews/egghead-static-types-with-jessica-kerr',
        destination: '/interviews/static-types-with-jessica-kerr',
        permanent: true,
      },
      {
        source: '/interviews/egghead-a11y-with-marcy-sutton',
        destination: '/interviews/a11y-with-marcy-sutton',
        permanent: true,
      },
      {
        source:
          '/interviews/egghead-practical-testing-with-wes-bos-and-scott-tolinski',
        destination:
          '/interviews/practical-testing-with-wes-bos-and-scott-tolinski',
        permanent: true,
      },
    ]
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
