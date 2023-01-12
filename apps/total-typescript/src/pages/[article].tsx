import {Article, getAllArticles, getArticle} from 'lib/articles'
import {GetStaticPaths, GetStaticProps, NextPage} from 'next'
import ArticleTemplate from 'templates/article-template'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const article = await getArticle(params?.article as string)

  if (!article) {
    return {
      notFound: true,
    }
  }

  const articles = (await getAllArticles()).filter(
    (a) => a.slug !== article.slug,
  )

  return {
    props: {
      article,
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
}

const Article: NextPage<ArticlePageProps> = ({article, articles}) => {
  return <ArticleTemplate article={article} articles={articles} />
}

export default Article
