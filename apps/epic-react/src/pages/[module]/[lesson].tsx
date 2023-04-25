import React from 'react'
import Layout from 'components/layout'
import {NextPage, GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  return {
    props: {
      lesson: {
        title: params?.lesson,
        description: `A description for ${params?.lesson}.`,
        module: {title: params?.module},
      },
    },
  }
}

const Lesson: NextPage<{
  lesson: {title: string; description: string; module: {title: string}}
}> = ({lesson}) => {
  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex flex-grow flex-col items-center justify-center px-5">
        <div className="max-w-screen-sm text-center font-light">
          <h1 className="font-heading py-8 text-4xl font-bold lg:text-5xl">
            {lesson.title}
          </h1>
          <h2 className="font-heading py-4 text-4xl font-bold lg:text-3xl">
            {lesson.module.title}
          </h2>
          <p className="mx-auto pb-8 leading-relaxed sm:text-xl">
            {lesson.description}
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default Lesson
