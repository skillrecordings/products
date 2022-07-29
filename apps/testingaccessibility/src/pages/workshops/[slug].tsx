import * as React from 'react'
import groq from 'groq'
import {serialize} from 'next-mdx-remote/serialize'
import {GetServerSideProps} from 'next'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import {sanityClient} from 'utils/sanity-client'
import LiveWorkshopTemplate from 'templates/live-workshop-template'

const LiveWorkshop: React.FC<React.PropsWithChildren<any>> = ({
  workshop,
  source,
}) => {
  return <LiveWorkshopTemplate workshop={workshop} source={source} />
}

const workshopQuery = groq`*[_type == "workshop" && slug.current == $slug][0]{
    title,
    'slug': slug.current,
    date,
    ckFormId,
    body,
    status,
    description,
    ogImage,
    url
    }`

const allWorkshopsQuery = groq`
    *[_type == "workshop"]{
      "slug": slug.current
    }`

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const allWorkshops = await sanityClient.fetch(allWorkshopsQuery)
  const currentWorkshop = find(allWorkshops, {slug: context.params.slug})

  if (isEmpty(currentWorkshop)) {
    return {
      notFound: true,
    }
  }

  const data = await sanityClient.fetch(workshopQuery, {
    slug: currentWorkshop.slug,
  })

  const {body, ...workshop} = data
  const mdxSource = await serialize(body)

  return {
    props: {workshop: workshop, source: mdxSource},
  }
}

export default LiveWorkshop
