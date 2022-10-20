import * as React from 'react'
import {GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async ({res}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  return {
    redirect: {
      destination: '/podcast/migrate',
      permanent: false,
    },
  }
}

const Podcast = () => {
  return <div>Ih oh! We shouldn't see this.</div>
}

export default Podcast
