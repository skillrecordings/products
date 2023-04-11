const Testimonials: Testimonial[] = [
  {
    body: 'I can see myself falling dedeply in love with this.',
    url: 'https://twitter.com/filearts/status/1381785812359114758?s=21',
    created_at: new Date('04-13-2021'),
    author: {
      name: 'Geoff Goodman',
      url: 'https://twitter.com/filearts',
      image:
        'https://pbs.twimg.com/profile_images/1036993434983297024/Nyg3wsS6_400x400.jpg',
    },
  },
  {
    body: 'Just checked script kit out and it is freaking amazing!!! Thank you.',
    url: 'https://twitter.com/raineycode/status/1381530751536144386?s=21',
    created_at: new Date('04-12-2021'),
    author: {
      name: 'Rainey',
      url: 'https://twitter.com/RaineyCode',
      image:
        'https://pbs.twimg.com/profile_images/1378439789809184770/EQxtx1Wh_400x400.jpg',
      description: 'Founder [@WomenCanCode](https://twitter.com/WomenCanCode)',
    },
  },
  {
    body: 'Just started playing with https://scriptkit.com by @johnlindquist and I love it!\n\nWithin about 30 minutes I was able to go from zero to automating two cumbersome, multi-window daily workflows of mine. Combining it with @elgato streamdeck is just 🔥',
    url: 'https://twitter.com/mrjameshenry/status/1383389643605872642?s=21',
    created_at: new Date('04-17-2021'),
    author: {
      name: 'James Henry',
      url: 'https://twitter.com/MrJamesHenry',
      image:
        'https://pbs.twimg.com/profile_images/1081214007363522561/xDGpee0C_400x400.jpg',
      description: 'Consultant Architect @nrwl_io',
    },
  },
  {
    body: 'We are using ScriptKit to quickly automate tedious processes in our production pipeline and it’s awesome.',
    url: 'https://twitter.com/jhooks/status/1383457083547258887',
    created_at: new Date('04-17-2021'),
    author: {
      name: 'Joel Hooks',
      url: 'https://twitter.com/jhooks',
      image:
        'https://pbs.twimg.com/profile_images/1325176854832050177/rVIbqUBG_400x400.jpg',
    },
  },
  {
    body: 'Enjoying the updated design for ScriptKit by @johnlindquist. The fact that it is just JS scripts at the end of the day really motivating for automating frequent workflows',
    url: 'https://twitter.com/lannonbr/status/1383199368841412609',
    created_at: new Date('04-17-2021'),
    author: {
      name: 'Benjamin Lannon',
      url: 'https://twitter.com/lannonbr',
      image:
        'https://pbs.twimg.com/profile_images/1046497067357671425/_TtQRq3X_400x400.jpg',
    },
  },
]

type Testimonial = {
  body: string
  url?: string
  created_at: Date
  author: {
    name: string
    url?: string
    image?: string
    description?: string
  }
}

export default Testimonials
