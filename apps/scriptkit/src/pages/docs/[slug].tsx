import * as React from 'react'
import {FunctionComponent} from 'react'
import Layout from 'layouts'

import {
  Category,
  getDiscussionPaths,
  getDiscussionBySlug,
  DiscussionProps,
  Login,
} from 'lib/get-discussions'
import DiscussionPost from 'components/discussion-post'

const Doc: FunctionComponent<React.PropsWithChildren<DiscussionProps>> = ({
  discussion,
}) => {
  return (
    <Layout className="doc">
      <main className="max-w-screen-lg mx-auto flex-grow w-full pt-8">
        <DiscussionPost discussion={discussion} key={discussion.url} />
      </main>
    </Layout>
  )
}

export async function getStaticProps(context: any) {
  const {params} = context
  const {slug} = params
  const discussion = await getDiscussionBySlug(Category.Docs, slug)

  return {
    props: {
      discussion,
    },
  }
}

export async function getStaticPaths() {
  return await getDiscussionPaths(Category.Docs, Login.johnlindquist)
}

export default Doc
