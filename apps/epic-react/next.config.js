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
  `image.mux.com`,
  process.env.NEXT_PUBLIC_HOST,
]

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  transpilePackages: ['@skillrecordings/skill-lesson', '@skillrecordings/ui'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  eslint: {ignoreDuringBuilds: true},
  experimental: {
    scrollRestoration: true,
  },
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
        source: '/fundamentals',
        destination: '/modules/react-fundamentals/react-fundamentals-welcome',
        permanent: false,
      },
      {
        source: '/hooks',
        destination: '/modules/react-hooks/react-hooks-welcome',
        permanent: false,
      },
      {
        source: '/advanced-hooks',
        destination:
          '/modules/advanced-react-hooks/advanced-react-hooks-welcome',
        permanent: false,
      },
      {
        source: '/patterns',
        destination:
          '/modules/advanced-react-patterns/advanced-react-patterns-welcome',
        permanent: false,
      },
      {
        source: '/performance',
        destination: '/modules/react-performance/react-performance-welcome',
        permanent: false,
      },
      {
        source: '/testing',
        destination: '/modules/testing-react-apps/testing-react-apps-welcome',
        permanent: false,
      },
      {
        source: '/suspense',
        destination: '/modules/react-suspense/react-suspense-welcome',
        permanent: false,
      },
      {
        source: '/app',
        destination:
          '/modules/build-an-epic-react-app/build-an-epic-react-app-welcome',
        permanent: false,
      },
    ]
  },
  webpack: (config, {isServer}) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
      }
    }
    config.externals = [...(config.externals || []), 'fsevents']
    return config
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
