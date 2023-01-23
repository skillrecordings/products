const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: '@mdx-js/react',
  },
})

const IMAGE_HOST_DOMAINS = [
  `res.cloudinary.com`,
  `d2eip9sf3oo6c2.cloudfront.net`,
  `cdn.sanity.io`,
  `image.mux.com`,
  `typescriptcourse.com`,
]

const nextConfig = {
  transpilePackages: ['three', '@skillrecordings/skill-lesson'],
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  eslint: {
    ignoreDuringBuilds: true, // 😭
  },
  reactStrictMode: true,
  images: {
    domains: IMAGE_HOST_DOMAINS,
  },
  async redirects() {
    return []
  },
}

module.exports = withMDX(nextConfig)
