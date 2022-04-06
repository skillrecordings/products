import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import ArticleTemplate from '../../layouts/article'
import {serialize} from 'next-mdx-remote/serialize'

const Course = (props: any) => {
  return <ArticleTemplate meta={props} />
}

const allCoursesQuery = groq`
  *[_type == "course" && publishedAt < now()]{
    "slug": slug.current
  }
`

const query = groq`*[_type == "course" && slug.current == $slug][0]{
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
  const {body = '', ...course} = await sanityClient.fetch(query, {
    slug: context.params.slug,
  })

  const mdxSource = await serialize(body, {
    mdxOptions: {
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
    props: {...course, body: mdxSource},
    revalidate: 1,
  }
}

export async function getStaticPaths() {
  const allCourses = await sanityClient.fetch(allCoursesQuery)

  const paths = allCourses.map((course: {slug: string}) => {
    return {
      params: {
        slug: course.slug,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export default Course
