import * as React from 'react'
import {FunctionComponent} from 'react'
import Layout from 'layouts'
import DiscussionPost from 'components/discussion-post'
import Link from 'next/link'

import {
  Category,
  Discussion,
  DiscussionsProps,
  getDiscussions,
  Login,
} from 'lib/get-discussions'
import {LoadedScript} from 'utils/types'

const Docs: FunctionComponent<React.PropsWithChildren<DiscussionsProps>> = ({
  discussions,
}) => {
  return (
    <Layout className="blog">
      <main className="max-w-screen-lg mx-auto flex-grow w-full">
        {discussions.map((discussion) => (
          <Link
            key={discussion.url}
            href={`/guide/${discussion.command}`}
            className="md:text-3xl text-2xl font-bold leading-tight text-white hover:underline flex flex-row px-2 pb-2"
          >
            {discussion.title}
          </Link>
        ))}
      </main>
      <section className="max-w-screen-lg mx-auto"></section>
    </Layout>
  )
}

export async function getStaticProps(
  context: any,
): Promise<{props: {discussions: LoadedScript[]}}> {
  let discussions = await getDiscussions(Category.Guide, Login.johnlindquist)
  discussions = discussions.sort((a, b) => (a.title > b.title ? 1 : -1))
  return {
    props: {
      discussions,
    },
  }
}

export default Docs
