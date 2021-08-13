// add a comment here
export default {
  defaultTitle: 'Keyboard Legend',
  description: 'A guide to mechanical keyboards.',
  author: 'Cassidy Williams',
  favicon: '/favicon.ico',
  email: 'team@keyboardlegend.dev',
  siteUrl: 'keyboardlegend.dev',
  additionalMetaTags: [
    {property: 'author', content: 'Cassidy Williams'},
    {
      property: 'keywords',
      content:
        'mechanical keyboard, mechanical, keyboard, learn, build, keyboards, cassidy, course',
    },
  ],
  twitter: {
    cardType: 'summary_large_image',
    handle: '@cassidoo',
  },
  openGraph: {
    type: 'website',
    site_name: 'Keyboard Legend',
    profile: {
      firstName: 'Cassidy',
      lastName: 'Williams',
    },
    images: [
      {
        url: 'https://keyboardlegend-dev-vojta.vercel.app/card@2x.png',
        width: 1280,
        height: 720,
      },
    ],
  },
}
