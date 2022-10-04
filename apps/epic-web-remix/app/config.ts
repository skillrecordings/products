export default {
  title: `Epic Web Dev by Kent C. Dodds`,
  description: 'Learn full-stack web development with Kent C. Dodds',
  author: `Kent C. Dodds`,
  additionalLinkTags: [
    {
      rel: 'icon',
      href: `/favicon.ico`,
    },
  ],
  additionalMetaTags: [
    {
      property: 'author',
      content: `Kent C. Dodds`,
    },
    {
      property: 'keywords',
      content:
        'web development, programming, software, developer, typescript, javascript, remix, full-stack',
    },
  ],
  twitter: {
    cardType: 'summary_large_image',
    handle: `@kentcdodds`,
  },
  openGraph: {
    type: 'website',
    site_name: `Epic Web Dev by Kent C. Dodds`,
    profile: {
      firstName: `Kent`,
      lastName: `C. Dodds`,
    },
    images: [
      {
        url: `/images/card@2x.png`,
        width: 1280,
        height: 720,
      },
    ],
  },
}
