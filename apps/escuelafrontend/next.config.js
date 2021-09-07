const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withMDX = require('@next/mdx')()
const checkEnv = require(`@47ng/check-env`).default

// Check that the critical environment variables are set
checkEnv({
  required: [`NEXT_PUBLIC_DEPLOYMENT_URL`],
})

const IMAGE_HOST_DOMAINS = [
  `res.cloudinary.com`,
  `d2eip9sf3oo6c2.cloudfront.net`,
  `cdn.sanity.io`,
]

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: IMAGE_HOST_DOMAINS,
  },
  async redirects() {
    return [...shortURLRoutes]
  },
}

const shortURLRoutes = [
  {
    source: `/sanity`,
    destination: `https://escuelafrontend.sanity.studio/desk`,
    permanent: true,
  },
]

module.exports = withPlugins(
  [
    withImages(),
    withMDX({
      pageExtensions: ['ts', 'tsx', 'mdx'],
      remarkPlugins: [
        require('remark-slug'),
        require('remark-footnotes'),
        require('remark-code-titles'),
      ],
      rehypePlugins: [require('mdx-prism')],
    }),
  ],
  nextConfig,
)
