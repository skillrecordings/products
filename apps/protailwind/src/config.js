export default {
  title: 'Pro Tailwind',
  description:
    'Increase development velocity and craft sustainable systems for your team',
  author: 'Simon Vrachliotis',
  favicon: '/favicon.ico',
  email: 'team@protailwind.com',
  siteUrl: 'protailwind.com',
  additionalMetaTags: [
    {property: 'author', content: 'Simon Vrachliotis'},
    {
      property: 'keywords',
      content: 'tailwind, tailwindcss',
    },
  ],
  twitter: {
    cardType: 'summary_large_image',
    handle: '@simonswiss',
  },
  openGraph: {
    type: 'website',
    site_name: 'Pro Tailwind',
    profile: {
      firstName: 'Simon',
      lastName: 'Vrachliotis',
    },
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/card@2x.png`,
        width: 1280,
        height: 720,
      },
    ],
  },
}
