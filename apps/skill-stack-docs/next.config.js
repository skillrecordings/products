const withMarkdoc = require('@markdoc/next.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@skillrecordings/skill-lesson', '@skillrecordings/ui'],
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'js', 'jsx', 'md'],
  experimental: {
    scrollRestoration: true,
  },
}

module.exports = withMarkdoc()(nextConfig)
