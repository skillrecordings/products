/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    providerOmportSource: '@mdx-js/react',
  },
})
const {withSentryConfig} = require('@sentry/nextjs')
const {withAxiom} = require('next-axiom')

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
  `epicweb.dev`,
  `image.mux.com`,
  'localhost',
  process.env.NEXT_PUBLIC_HOST,
]

const nextConfig = {
  transpilePackages: ['@skillrecordings/skill-lesson', '@skillrecordings/ui'],
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
        source: '/stack',
        destination: '/epic-stack',
        permanent: false,
      },
    ]
  },
  sentry: {
    hideSourceMaps: false,
  },
  webpack: (config, {dev, isServer, webpack, nextRuntime}) => {
    config.module.rules.push({
      test: /\.node$/,
      use: [
        {
          loader: 'nextjs-node-loader',
          options: {
            outputPath: config.output.path,
          },
        },
      ],
    })
    return config
  },
}

const configWithPlugins = withAxiom(
  withMDX(nextConfig, {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  }),
)

if (sentryWebpackPluginOptions) {
  module.exports = withSentryConfig(
    configWithPlugins,
    sentryWebpackPluginOptions,
  )
} else {
  module.exports = configWithPlugins
}
