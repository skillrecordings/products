import * as React from 'react'
import {GetServerSideProps} from 'next'
import {HomeTemplate} from 'templates/home-template'

export const getServerSideProps: GetServerSideProps = async ({res, query}) => {
  const {level} = query

  return {
    props: {
      level,
    },
  }
}

const LevelCustomHomePage = ({level}: {level: string}) => {
  return <HomeTemplate level={level} />
}

export default LevelCustomHomePage
