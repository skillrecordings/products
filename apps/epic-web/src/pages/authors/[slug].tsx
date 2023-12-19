import React from 'react'
import {GetStaticProps} from 'next'
import {
  Author,
  AuthorResource,
  getAllAuthors,
  getAuthor,
  getAuthorResources,
  getKentsResources,
} from 'lib/authors'
import AuthorTemplate from 'templates/author-template'

export const getStaticPaths = async () => {
  const authors = await getAllAuthors()
  const paths = authors.map((author) => ({
    params: {slug: author.slug},
  }))

  return {paths, fallback: false}
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const isKent = params?.slug === 'kent-c-dodds'
  const author = await getAuthor(params?.slug as string)
  const resources = isKent
    ? await getKentsResources()
    : await getAuthorResources(author?._id as string)

  return {props: {author, resources}}
}

const AuthorPage: React.FC<{
  author: Author
  resources: AuthorResource[]
}> = ({author, resources}) => {
  return <AuthorTemplate author={author} resources={resources} />
}

export default AuthorPage
