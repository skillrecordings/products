import type {
  HeadersFunction,
  LinksFunction,
  MetaFunction,
} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import tailwindStyles from '~/tailwind.css'
import fonts from '~/styles/fonts/index.css'

export const meta: MetaFunction = () => {
  return {
    title: 'Epic Web Dev by Kent C. Dodds',
    description: 'Learn full-stack web development with Kent C. Dodds',
    'twitter:site': '@kentcdodds',
    'twitter:creator': '@kentcdodds',
    'twitter:title': 'Epic Web by Kent C. Dodds',
    'twitter:description':
      'Learn full-stack web development with Kent C. Dodds',
    'twitter:image': 'https://epicweb.dev/card@2x.png',
    'og:image': 'https://epicweb.dev/card@2x.png',
    'og:title': 'Epic Web by Kent C. Dodds',
    'og:description': 'Learn full-stack web development with Kent C. Dodds',
    'og:url': 'https://epicweb.dev',
    'og:type': 'website',
    'og:site_name': 'Epic Web by Kent C. Dodds',
  }
}

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: tailwindStyles,
    },
    {
      rel: 'stylesheet',
      href: fonts,
    },
    {
      rel: 'icon',
      href: '/favicon.png',
      type: 'image/png',
    },
    {
      rel: 'icon',
      href: '/favicon.svg',
      type: 'image/svg+xml',
    },
  ]
}

export const headers: HeadersFunction = () => {
  return {
    'Cache-Control': 'max-age=1800',
  }
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-900 text-yellow-50 antialiased">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
