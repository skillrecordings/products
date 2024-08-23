import {
  Article,
  getAllArticles,
  getOtherArticles,
  getArticle,
} from '@/lib/articles'
import {GetStaticPaths, GetStaticProps, NextPage} from 'next'
import ArticleTemplate from '@/templates/article-template'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import {
  extractMarkdownHeadings,
  type MarkdownHeading,
} from '@/utils/extract-markdown-headings'

const ARTICLES_WITH_TOC = ['how-to-create-an-npm-package']

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
        authorization: process.env.SHIKI_AUTH_TOKEN,
        endpoint: process.env.SHIKI_ENDPOINT,
      },
    }))

  // Fetch first 6 articles only
  const otherArticles = await getOtherArticles(article.slug, {limit: 6})

  let toc = null
  if (ARTICLES_WITH_TOC.includes(article.slug)) {
    toc = article?.body
      ? extractMarkdownHeadings(article.body, article.title)
      : null
  }

  return {
    props: {
      article,
      articleBody,
      articles: otherArticles,
      toc,
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
  toc: MarkdownHeading[]
}

const ArticleRoute: NextPage<ArticlePageProps> = ({
  article,
  articleBody,
  articles,
  toc,
}) => {
  return (
    <ArticleTemplate
      article={article}
      articleBody={articleBody}
      articles={articles}
      toc={toc}
    />
  )
}

export default ArticleRoute
