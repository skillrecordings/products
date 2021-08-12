export default {
  defaultTitle: 'Rust Adventure',
  description: 'Rust Adventure',
  author: 'Chris Biscardi',
  favicon: '/favicon.ico',
  email: 'team@rustadventure.dev',
  siteUrl: 'rustadventure.dev',
  additionalMetaTags: [
    {property: 'author', content: 'Chris Biscardi'},
    {
      property: 'keywords',
      content:
        'rust, rustlang, adventure, programming, rustlings, concepts, learn rust, learn',
    },
  ],
  twitter: {
    cardType: 'summary_large_image',
    handle: 'chrisbiscardi',
    site: 'chrisbiscardi',
  },
  openGraph: {
    type: 'website',
    site_name: 'Rust Adventure',
    profile: {
      firstName: 'Chris',
      lastName: 'Biscardi',
    },
    images: [
      {
        url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1627473990/rustadventure.dev/card_2x.png',
        width: 1280,
        height: 720,
      },
    ],
  },
}
