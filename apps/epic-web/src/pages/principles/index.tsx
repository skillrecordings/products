import * as React from 'react'
import Layout from 'components/app/layout'
import type {NextPage} from 'next'
import LandingCopy from 'components/epic-principles.mdx'

const Index: NextPage<{}> = () => {
  return (
    <>
      <Layout
        meta={{
          titleAppendSiteName: true,
          title: 'Epic Principles',
        }}
        navigationClassName=""
      >
        <main className="">
          <Article />
        </main>
      </Layout>
    </>
  )
}

const Article = () => {
  return (
    <article className="prose mx-auto max-w-3xl px-5 pt-8 dark:prose-invert sm:prose-lg prose-headings:pt-8 prose-headings:font-bold prose-p:max-w-2xl prose-ul:pl-0 sm:pt-5">
      <LandingCopy />
    </article>
  )
}

export default Index
