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
  'sessionize.com',
  process.env.NEXT_PUBLIC_HOST,
]

const nextConfig = {
  transpilePackages: ['@skillrecordings/skill-lesson', '@skillrecordings/ui'],
  eslint: {ignoreDuringBuilds: true},
  experimental: {scrollRestoration: true},
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      ...IMAGE_HOST_DOMAINS.map((domain) => ({
        protocol: 'https',
        hostname: domain,
      })),
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/stack',
        destination: '/epic-stack',
        permanent: false,
      },
      {
        source: '/authors/:slug*',
        destination: '/contributors/:slug*',
        permanent: true,
      },
      {
        source: '/conf',
        destination: '/conf/2025',
        permanent: false,
      },
      {
        source: '/conf/:path((?!2024|2025).*)',
        destination: '/conf/2025/:path*',
        permanent: true,
      },
      {
        source: '/conf/:year((?!2024|2025).*)/:path*',
        destination: '/conf/2025/:path*',
        permanent: true,
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
