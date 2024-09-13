import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {getPage, type Page} from '@/lib/pages'
import Layout from '@/components/app/layout'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const page = await getPage('whats-new-in-epic-react-v2')

  if (!page?.body) {
    return {
      notFound: true,
    }
  }

  const pageBodySerialized = await serializeMDX(page.body, {
    syntaxHighlighterOptions: {
      theme: 'slack-dark',
      showCopyButton: true,
    },
  })
  return {
    props: {
      pageBodySerialized,
      page,
    },
    revalidate: 10,
  }
}

const WhatsNewPage = ({
  pageBodySerialized,
  page,
}: {
  pageBodySerialized: MDXRemoteSerializeResult
  page: Page
}) => {
  return (
    <Layout
      meta={{
        title: page.title,
        ogImage: {
          url: page.ogImage?.secure_url as string,
        },
      }}
    >
      <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:py-16">
        <h1 className="mb-10 border-b pb-3 text-3xl font-bold sm:text-4xl">
          {page.title}
        </h1>
        <article className="prose max-w-none dark:prose-invert sm:prose-lg">
          <MDX
            components={{
              table: (props) => {
                return (
                  <div className="overflow-x-auto">
                    <table
                      className="mt-0 w-full table-auto [&_td]:whitespace-nowrap [&_td]:p-2 sm:[&_td]:whitespace-normal [&_th]:whitespace-nowrap [&_th]:p-2 sm:[&_th]:whitespace-normal"
                      {...props}
                    />
                  </div>
                )
              },
            }}
            contents={pageBodySerialized}
          />
        </article>
      </main>
    </Layout>
  )
}

export default WhatsNewPage
