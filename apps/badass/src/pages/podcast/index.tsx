import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getPodcast, Podcast} from '../../lib/podcast'
import Layout from '../../components/layout'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  return {
    redirect: {
      destination: '/podcast/course-builders',
      permanent: false,
    },
  }
}

const PodcastPage: React.FC<{podcast: Podcast}> = ({podcast}) => {
  return <Layout>Ih oh! We shouldn't see this.</Layout>
}

export default PodcastPage
