// add a comment here
export default {
  defaultTitle: 'KCD Bundle',
  description:
    'Get Testing JavaScript and Epic React workshops at lower price!',
  author: 'Kent C. Dodds',
  favicon: '/favicon.ico',
  email: 'team@kentcdodds.com',
  siteUrl: 'kcdbundle.com',
  additionalMetaTags: [
    {property: 'author', content: 'Kent C. Dodds'},
    {
      property: 'keywords',
      content: 'epic react, testing javascript, bundle',
    },
  ],
  twitter: {
    cardType: 'summary_large_image',
    handle: '@kentcdodds',
    site: '@kentcdodds',
  },
  openGraph: {
    type: 'website',
    site_name: 'KCD Bundle',
    profile: {
      firstName: 'Kent',
      lastName: 'C. Dodds',
    },
    images: [
      {
        url: '/card@2x.png',
        width: 1280,
        height: 720,
      },
    ],
  },
}
