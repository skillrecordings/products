import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import ArticleTemplate from '../../templates/article'
import {serialize} from 'next-mdx-remote/serialize'

const Post = (props: any) => {
  return <ArticleTemplate meta={props} />
}

const allPostsQuery = groq`
  *[_type == "post" && publishedAt < now()]{
    "slug": slug.current
  }
`

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  body,
  seo,
  "slug": slug.current,
  "author": collaborators[0]->{
    role,
    'slug': person->slug.current,
    'name': person->name,
    'path': person->website,
    'twitter': person->twitter,
    'image': person->image.url
  },
	"tag": softwarelibraries[0]-> {
    name,
    "image": image.url
  },
  "relatedResources": related[]-> {
    title,
    slug,
    path,
    "author": collaborators[0]->{
      'name': person->name,
      'image': person->image.url
    },
    "image":{
      'url': image.url
    },
    "tag": softwarelibraries[0]-> {
      name,
      "image": image.url
    }
  }
}`

export async function getStaticProps(context: any) {
  const {body = '', ...post} = await sanityClient.fetch(query, {
    slug: context.params.slug,
  })

  const mdxSource = await serialize(body, {
    mdxOptions: {
      remarkPlugins: [
        require(`remark-slug`),
        require(`remark-footnotes`),
        require(`remark-code-titles`),
      ],
      rehypePlugins: [
        [
          require(`rehype-shiki`),
          {
            theme: `./src/styles/material-theme-dark.json`,
            useBackground: false,
          },
        ],
      ],
    },
  })

  return {
    props: {...post, body: mdxSource},
    revalidate: 1,
  }
}

export async function getStaticPaths() {
  const allPosts = await sanityClient.fetch(allPostsQuery)

  const paths = allPosts.map((post: {slug: string}) => {
    return {
      params: {
        slug: post.slug,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export default Post
