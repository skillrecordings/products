import * as React from 'react'
import {FunctionComponent} from 'react'
import Layout from 'layouts'
import {
  Category,
  DiscussionsProps,
  getDiscussions,
  Login,
} from 'lib/get-discussions'
import {LoadedScript} from 'utils/types'
import BlogTeaser from 'components/blog/teaser'
import Image from 'next/legacy/image'

const Blog: FunctionComponent<React.PropsWithChildren<DiscussionsProps>> = ({
  discussions,
}) => {
  return (
    <Layout meta={{title: 'Script Kit Blog'}} className="blog">
      <header className="relative z-10">
        <h1 className="text-center text-5xl tracking-tight font-semibold py-16">
          News & Announcements
        </h1>
      </header>
      <main className="z-10 pt-16 relative max-w-screen-sm mx-auto flex-grow flex flex-col w-full gap-16">
        {discussions.map((discussion) => {
          return <BlogTeaser key={discussion.url} discussion={discussion} />
        })}
      </main>
    </Layout>
  )
}

export async function getStaticProps(
  context: any,
): Promise<{props: {discussions: LoadedScript[]}}> {
  const discussions = await getDiscussions(
    Category.Announcements,
    Login.johnlindquist,
  )

  return {
    props: {
      discussions,
    },
  }
}

export default Blog
