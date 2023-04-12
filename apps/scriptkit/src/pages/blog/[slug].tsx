import * as React from 'react'
import {FunctionComponent} from 'react'
import {
  Category,
  getDiscussionPaths,
  getDiscussionBySlug,
  DiscussionProps,
  Login,
} from 'lib/get-discussions'
import ArticleTemplate from 'templates/article-template'

const BlogPost: FunctionComponent<React.PropsWithChildren<DiscussionProps>> = ({
  discussion,
}) => {
  return <ArticleTemplate discussion={discussion} />
}

export async function getStaticProps(context: any) {
  const {params} = context
  const {slug} = params
  const discussion = await getDiscussionBySlug(Category.Announcements, slug)

  return {
    props: {
      discussion,
    },
  }
}

export async function getStaticPaths() {
  return await getDiscussionPaths(Category.Announcements, Login.johnlindquist)
}

export default BlogPost
