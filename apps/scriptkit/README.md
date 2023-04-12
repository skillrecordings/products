This is an opinonated Next.js starter project that makes it relatively simple to spin up a new project.

## Getting Started

First, run the development server:

```bash
yarn dev
```

If you'd like serverless function support:

```bash
vercel dev
```

I'm personally in the "just do Next.js the Vercel way because it gives me modern best practices without a lot of friction" but if you've got other preferences you probably know how to manage them anyway. 🤪

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.js`. The page auto-updates as you edit the file.

You can also add mdx files in `src/pages/` and they will be presented at the cooresponding route.

Tailwind and Emotion are available for styling using utility classes and css-in-js respectively.

Testing is facilitated through React Testing Library and Jest.

`next-seo` and `next-sitemap` are doing their jobs very well. Be sure to update `/next-sitemap.js` and `/next-seo.json` with your information!
