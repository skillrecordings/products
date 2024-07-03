const articles = {
  'improve-the-performance-of-your-react-forms': {
    title: 'Improve the Performance of your React Forms',
    slug: 'improve-the-performance-of-your-react-forms',
    date: '2021-05-26',
    image: '/improve-the-performance-of-your-react-forms/image@2x.png',
    socialImage:
      '/articles-images/improve-the-performance-of-your-react-forms/card@2x.png',
    imageAlt:
      'abstract and futuristicly visualized set of performant web forms',
    excerpt:
      "Forms can get slow pretty fast. Let's explore how state colocation can keep our React forms fast.",
  },
  'why-you-shouldnt-put-refs-in-a-dependency-array': {
    title: "Why you shouldn't put refs in a dependency array",
    slug: 'why-you-shouldnt-put-refs-in-a-dependency-array',
    date: '2021-05-19',
    image: '/why-you-shouldnt-put-refs-in-a-dependency-array/image@2x.png',
    socialImage:
      '/articles-images/why-you-shouldnt-put-refs-in-a-dependency-array/card@2x.png',
    imageAlt:
      '3d render of colorful objects tightly packed in rectangular shape in between of square brackets',
    excerpt:
      "If you use a ref in your effect callback, shouldn't it be included in the dependencies? Why refs are a special exception to the rule!",
  },
  'why-react-needs-a-key-prop': {
    title: 'Why React needs a key prop',
    slug: 'why-react-needs-a-key-prop',
    date: '2021-04-20',
    image: '/why-react-needs-a-key-prop/image@2x.png',
    socialImage: '/articles-images/why-react-needs-a-key-prop/card@2x.png',
    imageAlt: 'a row of door keys',
    excerpt: "Why can't React just magically know what to do without a key?",
  },
  'how-to-type-a-react-form-on-submit-handler': {
    title: 'How to type a React form onSubmit handler',
    slug: 'how-to-type-a-react-form-on-submit-handler',
    date: '2021-04-19',
    image: '/how-to-type-a-react-form-on-submit-handler/image@2x.png',
    socialImage:
      '/articles-images/how-to-type-a-react-form-on-submit-handler/card@2x.png',
    imageAlt:
      'Abstract illustration of a form labeling sections with TypeScript and React types',
    excerpt: 'Excellent TypeScript definitions for your React forms',
  },
  'the-latest-ref-pattern-in-react': {
    title: 'The Latest Ref Pattern in React',
    slug: 'the-latest-ref-pattern-in-react',
    date: '2021-04-15',
    image: '/the-latest-ref-pattern-in-react/image@2x.png',
    socialImage: '/articles-images/the-latest-ref-pattern-in-react/card@2x.png',
    imageAlt: 'illustration of a 5 by 6 grid of lines and dots',
    excerpt: 'How to improve your custom hook APIs with a simple pattern.',
  },
  'how-to-test-react-use-effect': {
    title: 'How to Test React.useEffect',
    slug: 'how-to-test-react-use-effect',
    date: '2020-11-16',
    image: '/how-to-test-react-use-effect/image@2x.png',
    socialImage: '/articles-images/how-to-test-react-use-effect/card@2x.png',
    imageAlt: 'abstract 3d render',
    excerpt: 'Testing React.useEffect is much simpler than you think it is.',
  },
  'how-react-uses-closures-to-avoid-bugs': {
    title: 'How React Uses Closures to Avoid Bugs',
    slug: 'how-react-uses-closures-to-avoid-bugs',
    date: '2020-11-13',
    image: '/how-react-uses-closures-to-avoid-bugs/image@2x.png',
    socialImage:
      '/articles-images/how-react-uses-closures-to-avoid-bugs/card@2x.png',
    imageAlt: 'a helix',
    excerpt:
      'The sneaky, surreptitious bug that React saved us from by using closures.',
  },
  'importing-react-through-the-ages': {
    title: 'Importing React Through the Ages',
    slug: 'importing-react-through-the-ages',
    date: '2020-11-10',
    image: '/importing-react-through-the-ages/image@2x.png',
    socialImage:
      '/articles-images/importing-react-through-the-ages/card@2x.png',
    imageAlt:
      'illustration of an old TV with bad signal, transmitting image of react.js logo with mustache',
    excerpt: 'How and why I import react using a namespace',
  },
  'css-variables': {
    title: 'Use CSS Variables instead of React Context',
    slug: 'css-variables',
    date: '2020-10-29',
    image: '/css-variables/image@2x.png',
    socialImage: '/articles-images/css-variables/card@2x.png',
    imageAlt: 'two TV remote controllers in black and white',
    excerpt:
      'How and why you should use CSS variables (custom properties) for theming instead of React context.',
  },
  'memoization-and-react': {
    title: 'Memoization and React',
    slug: 'memoization-and-react',
    date: '2020-10-29',
    image: '/memoization-and-react/image@2x.png',
    socialImage: '/articles-images/memoization-and-react/card@2x.png',
    imageAlt: 'abstract shapes getting pushed into cache storage',
    excerpt:
      'A basic introduction memoization and how React memoization features work.',
  },
  'stop-stumbling-around-in-react-learning-darkness': {
    title: 'Stop Stumbling Around in React Learning Darkness',
    slug: 'stop-stumbling-around-in-react-learning-darkness',
    date: '2020-09-28',
    image: '/stop-stumbling-around-in-react-learning-darkness/image@2x.png',
    socialImage:
      '/articles-images/stop-stumbling-around-in-react-learning-darkness/card@2x.png',
    imageAlt:
      'illustration of stairs in darkness with spotlight shedding light as a metaphor for react.js',
    excerpt:
      'Epic React is your learning spotlight so you can ship harder, better, faster, stronger.',
  },
  'one-react-mistake-thats-slowing-you-down': {
    title: "One React mistake that's slowing you down",
    slug: 'one-react-mistake-thats-slowing-you-down',
    date: '2020-09-25',
    image: '/one-react-mistake-thats-slowing-you-down/image@2x.png',
    socialImage:
      '/articles-images/one-react-mistake-thats-slowing-you-down/card@2x.png',
    imageAlt: 'silhouette of an falling object that is being blocked',
    excerpt:
      'Simplify and speed up your app development using React composition',
  },
  'myths-about-useeffect': {
    title: 'Myths about useEffect',
    slug: 'myths-about-useeffect',
    date: '2020-09-24',
    image: '/myths-about-useeffect/image@2x.png',
    socialImage: '/articles-images/myths-about-useeffect/card@2x.png',
    imageAlt:
      'abstract illustration of synchronised elements floating in a space',
    excerpt:
      'Some common mistakes I see people make with useEffect and how to avoid them.',
  },
  'render-as-you-fetch': {
    title: 'Render as you fetch (with and without suspense)',
    slug: 'render-as-you-fetch',
    date: '2020-09-21',
    image: '/render-as-you-fetch/image@2x.png',
    socialImage: '/articles-images/render-as-you-fetch/card@2x.png',
    imageAlt: 'illustration of web user interface with data being loaded',
    excerpt:
      'Speed up your app\'s loading of code/data/assets with "render as you fetch" with and without React Suspense for Data Fetching',
  },
  'my-state-management-mistake': {
    title: 'My State Management Mistake',
    slug: 'my-state-management-mistake',
    date: '2020-09-17',
    image: '/my-state-management-mistake/image@2x.png',
    socialImage: '/articles-images/my-state-management-mistake/card@2x.png',
    imageAlt:
      'abstract illustration interpretting state management in React application',
    excerpt:
      "It wasn't a library. It was the way I was thinking about and defining state.",
  },
  'why-youve-been-bad-about-profiling-react-apps': {
    title: "Why you've been bad about Profiling React Apps",
    slug: 'why-youve-been-bad-about-profiling-react-apps',
    date: '2020-09-14',
    image: '/why-youve-been-bad-about-profiling-react-apps/image@2x.png',
    socialImage:
      '/articles-images/why-youve-been-bad-about-profiling-react-apps/card@2x.png',
    imageAlt: 'stylized performance profile tab in developer tools',
    excerpt: 'Is your app as fast as you think it is for your users?',
  },
  'requisite-react': {
    title: 'Requisite React',
    slug: 'requisite-react',
    date: '2020-09-10',
    image: '/requisite-react/image@2x.png',
    socialImage: '/articles-images/requisite-react/card@2x.png',
    imageAlt: 'illustration of website layers',
    excerpt:
      "When was the last time you saw an error and had _no idea_ what it meant (and therefore no idea what to do about it)? Today? Yeah, you're not alone... Let's talk about how to fix that.",
  },
  'soul-crushing-components': {
    title: 'Avoid soul-crushing components',
    slug: 'soul-crushing-components',
    date: '2020-09-07',
    image: '/soul-crushing-components/image@2x.png',
    socialImage: '/articles-images/soul-crushing-components/card@2x.png',
    imageAlt: 'stylized react components',
    excerpt:
      'Truly maintainable, flexible, simple, and reusable components require more thought than: "I need it to do this differently, so I\'ll accept a new prop for that". Seasoned React developers know this leads to nothing but pain and frustration for both the maintainer and user of the component.',
  },
  'why-i-love-react': {
    title: 'Why I Love React',
    slug: 'why-i-love-react',
    date: '2020-08-31',
    image: '/why-i-love-react/image@2x.png',
    socialImage: '/articles-images/why-i-love-react/card@2x.png',
    imageAlt: 'stylized rockets with react logo, ready to launch',
    excerpt:
      'I still remember when I first heard about React. It was January 2014. I was listening to a podcast. Pete Hunt and Jordan Walke were on talking about this framework they created at Facebook that with no support for two way data-binding, no built-in HTTP library, no dependency injection, and in place of templates it had this weird XML-like syntax for the UI. And to top it all off, I was listening to it while driving to the first ever ng-conf.',
  },
}

export default articles
