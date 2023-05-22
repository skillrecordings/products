import * as React from 'react'
import matter from 'gray-matter'
import {sanityWriteClient} from '@/utils/sanity-server'
import Markdown from 'react-markdown'

async function getConcept(slug: string) {
  const postContent = await sanityWriteClient.fetch(
    `*[_type == "concept" && slug.current == $slug][0]`,
    {slug},
  )

  console.log(postContent)

  const {data, content} = matter(postContent.body)

  return {...data, body: content}
}

export default async function ConceptListPage({
  params,
}: {
  params: {slug: string}
}) {
  const concept = await getConcept(params.slug)
  return (
    <div>
      <h1>concepts</h1>
      <Markdown>{concept?.body}</Markdown>
    </div>
  )
}
