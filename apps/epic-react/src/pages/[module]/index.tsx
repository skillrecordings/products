import React from 'react'
import Layout from 'components/layout'
import {NextPage, GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  return {
    props: {
      module: {
        lessons: [],
        title: params?.module,
      },
    },
  }
}

const Module: NextPage<{module: {title: string; lessons: Array<Object>}}> = ({
  module,
}) => {
  const {title, lessons} = module

  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex flex-grow flex-col items-center justify-center px-5">
        <div className="max-w-screen-sm text-center font-light">
          <h1 className="font-heading py-8 text-4xl font-bold lg:text-5xl">
            {title}
          </h1>
          <p className="mx-auto pb-8 leading-relaxed sm:text-xl">
            There are {lessons.length} lessons in this module.
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default Module
