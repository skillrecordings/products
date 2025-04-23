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
import {take} from 'lodash'

const ARTICLES_WITH_TOC = [
  'how-to-create-an-npm-package',
  'typescript-utility-types',
  'typescript-and-node',
  'build-a-node-app-with-typescript-and-esbuild',
  'tsconfig-cheat-sheet',
  'type-vs-interface-which-should-you-use',
]

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

  const shortenedArticleBody =
    article.body &&
    (await serializeMDX(take(article.body?.split('\n'), 6).join('\n'), {
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
      shortenedArticleBody: shortenedArticleBody,
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
  shortenedArticleBody: MDXRemoteSerializeResult
  toc: MarkdownHeading[]
}

const ArticleRoute: NextPage<ArticlePageProps> = ({
  article,
  articleBody,
  shortenedArticleBody,
  articles,
  toc,
}) => {
  return (
    <ArticleTemplate
      article={article}
      articleBody={articleBody}
      shortenedArticleBody={shortenedArticleBody}
      articles={articles}
      toc={toc}
    />
  )
}

export default ArticleRoute
