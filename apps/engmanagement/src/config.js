export default {
  defaultTitle: 'Engineering Management for the Rest of Us',
  description:
    'A guide for collaborating with networks of people, working together towards a common purpose.',
  author: 'Sarah Drasner',
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  siteUrl: 'engmanagement.dev',
  favicon: '/favicon.ico',
  titleTemplate: '%s | Engineering Management for the Rest of Us',
  additionalMetaTags: [
    {property: 'author', content: 'Sarah Drasner'},
    {
      property: 'keywords',
      content:
        'engineering management for the rest of us,book,sarah drasner,guide',
    },
  ],
  twitter: {
    cardType: 'summary_large_image',
    handle: '@sarah_edo',
  },
  openGraph: {
    title: 'Engineering Management for the Rest of Us by Sarah Drasner',
    description:
      'A guide for collaborating with networks of people, working together towards a common purpose.',
    type: 'website',
    site_name: 'Engineering Management for the Rest of Us',
    profile: {
      firstName: 'Sarah',
      lastName: 'Drasner',
    },
    images: [
      {
        url: 'https://engmanagement.dev/card@2x.png',
        width: 1280,
        height: 720,
      },
    ],
  },
}
