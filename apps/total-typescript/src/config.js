export default {
  defaultTitle: 'Total TypeScript',
  description:
    'A systematic approach to becoming an effective TypeScript Engineer',
  additionalLinkTags: [
    {
      rel: 'icon',
      href: 'https://www.totaltypescript.com/favicon.ico',
    },
  ],
  additionalMetaTags: [
    {property: 'author', content: 'Matt Pocock'},
    {
      property: 'keywords',
      content: 'typescript, xstate',
    },
  ],
  twitter: {
    cardType: 'summary_large_image',
    handle: '@mattpocockuk',
  },
  openGraph: {
    type: 'website',
    site_name: 'Total TypeScript',
    profile: {
      firstName: 'Matt',
      lastName: 'Pocock',
    },
    images: [
      {
        url: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/card@2x.png`,
        width: 1280,
        height: 720,
      },
    ],
  },
}
