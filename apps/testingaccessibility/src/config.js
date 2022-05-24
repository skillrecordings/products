// add a comment here
export default {
  defaultTitle: 'Build Accessible Web Apps',
  description:
    'Learn how to build accessible web applications with Marcy Sutton.',
  author: 'Marcy Sutton',
  favicon: '/favicon.ico',
  email: 'marcy@testingaccessibility.com',
  siteUrl: 'testingaccessibility.com',
  additionalMetaTags: [
    {property: 'author', content: 'Marcy Sutton'},
    {
      property: 'keywords',
      content: 'a11y, accessibility',
    },
  ],
  twitter: {
    cardType: 'summary_large_image',
    handle: '@marcysutton',
  },
  openGraph: {
    type: 'website',
    site_name: 'Testing Accessibility',
    profile: {
      firstName: 'Marcy',
      lastName: 'Sutton',
    },
    images: [
      {
        url: 'https://testingaccessibility.com/card@2x.png',
        // url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1607009484/testingaccessibility.com/card_2x.png',
        width: 1280,
        height: 720,
      },
    ],
  },
}
