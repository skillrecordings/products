// add a comment here
export default {
  defaultTitle: 'Skill Recordings',
  description: 'A guide to mechanical keyboards by Cassidy Williams.',
  author: 'Skill Recordings',
  favicon: '/favicon.ico',
  email: 'team@skillrecordings.com',
  siteUrl: 'skillrecordings.com',
  additionalMetaTags: [
    {property: 'author', content: 'Skill Recordings'},
    {
      property: 'keywords',
      content: 'skill recordings',
    },
  ],
  twitter: {
    cardType: 'summary_large_image',
    handle: '@skillrecordings',
  },
  openGraph: {
    type: 'website',
    site_name: 'Skill Recordings',
    profile: {
      firstName: 'Skill',
      lastName: 'Recordings',
    },
    images: [
      {
        url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1628845298/keyboardlegend/card_2x.png',
        width: 1280,
        height: 720,
      },
    ],
  },
}
