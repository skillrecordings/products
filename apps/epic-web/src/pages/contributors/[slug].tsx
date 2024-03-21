import React from 'react'
import {GetStaticProps} from 'next'
import {
  Contributor,
  ContributorResource,
  getAllContributors,
  getContributor,
  getContributorResources,
  getKentsResources,
} from 'lib/contributors'
import ContributorTemplate from 'templates/contributor-template'

export const getStaticPaths = async () => {
  const contributors = await getAllContributors()
  const paths = contributors.map((contributor) => ({
    params: {slug: contributor.slug},
  }))

  return {paths, fallback: false}
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const isKent = params?.slug === 'kent-c-dodds'
  const contributor = await getContributor(params?.slug as string)
  const resources = isKent
    ? await getKentsResources()
    : await getContributorResources(contributor?._id as string)

  return {props: {contributor, resources}, revalidate: 10}
}

const InstructorPage: React.FC<{
  contributor: Contributor
  resources: ContributorResource[]
}> = ({contributor, resources}) => {
  return <ContributorTemplate contributor={contributor} resources={resources} />
}

export default InstructorPage
