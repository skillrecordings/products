import React from 'react'
import {AppProps} from 'next/app'
import '../styles/globals.css'
import 'focus-visible'
import {DefaultSeo} from 'next-seo'
import SEO from '../../next-seo.json'
import '../styles/tailwind.css'
import {slugifyWithCounter} from '@sindresorhus/slugify'
import Layout from '../layouts'
import {SessionProvider} from 'next-auth/react'
import {ConvertkitProvider} from '@skillrecordings/skill-lesson/hooks/use-convertkit'

function getNodeText(node: any) {
  let text = ''
  for (let child of node.children ?? []) {
    if (typeof child === 'string') {
      text += child
    }
    text += getNodeText(child)
  }
  return text
}

function collectHeadings(nodes: any, slugify = slugifyWithCounter()): any {
  let sections = []

  for (let node of nodes) {
    if (/^h[23]$/.test(node.name)) {
      let title = getNodeText(node)
      if (title) {
        let id = slugify(title)
        node.attributes.id = id
        if (node.name === 'h3') {
          sections[sections.length - 1].children.push({
            ...node.attributes,
            title,
          })
        } else {
          sections.push({...node.attributes, title, children: []})
        }
      }
    }

    sections.push(...collectHeadings(node.children ?? [], slugify))
  }

  return sections
}

function MyApp({Component, pageProps}: any) {
  if ('markdoc' in pageProps) {
    let title = pageProps.markdoc?.frontmatter.title

    let pageTitle =
      pageProps.markdoc?.frontmatter.pageTitle ||
      `${pageProps.markdoc?.frontmatter.title} - Docs`

    let description = pageProps.markdoc?.frontmatter.description

    let tableOfContents = pageProps.markdoc?.content
      ? collectHeadings(pageProps.markdoc.content)
      : []

    return (
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <ConvertkitProvider>
          <Layout className="doc">
            <main className="max-w-screen-lg mx-auto flex-grow w-full pt-8 px-5">
              <Component {...pageProps} />
            </main>
          </Layout>
        </ConvertkitProvider>
      </SessionProvider>
    )
  }

  return (
    <>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} markdoc={pageProps} />
    </>
  )
}

export default MyApp
