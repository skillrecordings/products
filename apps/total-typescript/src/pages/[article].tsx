import {Article, getAllArticles, getArticle} from '@/lib/articles'
import {GetStaticPaths, GetStaticProps, NextPage} from 'next'
import ArticleTemplate from '@/templates/article-template'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const article = await getArticle(params?.article as string)

  if (!article) {
    return {
      notFound: true,
    }
  }
  const articleBody =
    article.body &&
    (await serializeMDX(article.body, {
      useShikiTwoslash: true,
      syntaxHighlighterOptions: {
        theme: 'github-dark',
        authorization: process.env.SHIKI_AUTH_TOKEN,
        endpoint: process.env.SHIKI_ENDPOINT,
      },
    }))

  // Fetch first 6 articles only
  const articles = (await getAllArticles())
    .filter((a) => a.slug !== article.slug)
    .slice(0, 6)

  return {
    props: {
      article,
      articleBody,
      articles,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getAllArticles()
  const paths = articles.map((article) => ({
    params: {article: article.slug},
  }))
  return {paths, fallback: 'blocking'}
}

export type ArticlePageProps = {
  article: Article
  articles: Article[]
  articleBody: MDXRemoteSerializeResult
}

const Article: NextPage<ArticlePageProps> = ({
  article,
  articleBody,
  articles,
}) => {
  return (
    <ArticleTemplate
      article={article}
      articleBody={articleBody}
      articles={articles}
    />
  )
}

export default Article
