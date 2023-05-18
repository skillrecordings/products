import groq from 'groq'
import {GetStaticPaths, InferGetStaticPropsType} from 'next'
import ArticleTemplate from 'templates/article-template'
import {fetchFromSanity} from 'utils/fetch-from-sanity'
import {z} from 'zod'

export const getStaticProps = async (req: {params: {slug: string}}) => {
  const conceptPage = await fetchFromSanity(
    z.object({
      _id: z.string(),
      title: z.string(),
      slug: z.string(),
      body: z.array(z.any()),
      description: z.string().nullable(),
      summary: z.array(z.any()).nullable(),
      _createdAt: z.string(),
      _updatedAt: z.string(),
    }),
    groq`*[_type == 'conceptPage' && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      body,
      description,
      summary,
      _createdAt,
      _updatedAt,
    }`,
    {slug: req.params.slug},
  )

  return {
    props: conceptPage,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const result = await fetchFromSanity(
    z.array(
      z.object({
        _id: z.string(),
        slug: z.string(),
      }),
    ),
    groq`*[_type == 'conceptPage']{
      _id,
      "slug": slug.current,
    }`,
  )

  return {
    paths: result.map((conceptPage) => {
      return {
        params: {
          slug: conceptPage.slug,
        },
      }
    }),
    fallback: true,
  }
}

const Concept = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <ArticleTemplate
      article={{
        _createdAt: props._createdAt,
        slug: props.slug,
        title: props.title,
        body: props.body,
        _updatedAt: props._updatedAt,
        summary: props.summary,
        description: props.description,
      }}
      articles={[]}
    />
  )
}

export default Concept
