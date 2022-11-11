import React from 'react'

import {GetStaticPaths, GetStaticProps} from 'next'
import {getAllTutorials, getTutorial} from 'lib/tutorials'
import {getExercise} from 'lib/exercises'
import {getSection} from 'lib/sections'
import Link from 'next/link'
import Layout from 'components/app/layout'

export const getStaticProps: GetStaticProps = async (context) => {
  const {params} = context
  const exerciseSlug = params?.exercise as string
  const sectionSlug = params?.section as string

  const module = await getTutorial(params?.module as string)
  const exercise = await getExercise(exerciseSlug)
  const section = await getSection(sectionSlug)

  return {
    props: {exercise, module, section},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  const tutorials = await getAllTutorials()

  // flatMap to extract exercises in sections from workshops
  const paths = tutorials.flatMap((tutorial: any) => {
    return (
      tutorial.sections?.flatMap((section: any) => {
        return (
          section.exercises?.map((exercise: any) => ({
            params: {
              module: tutorial.slug.current,
              section: section.slug,
              exercise: exercise.slug,
            },
          })) || []
        )
      }) || []
    )
  })

  return {paths, fallback: 'blocking'}
}

const ExercisePage: React.FC<any> = ({exercise, module, section}) => {
  return (
    <Layout className="py-20 px-5">
      <div>
        <Link
          href={{
            pathname: '/tutoriales/[module]',
            query: {
              module: module.slug.current,
            },
          }}
        >
          <a className="underline">{module.title}</a>
        </Link>
        /{section.title}/{exercise.title}
      </div>
      <br />
      <strong className="text-sm uppercase">{exercise._type}</strong>
      <h1 className="text-2xl font-bold">{exercise.title}</h1>
    </Layout>
  )
}

export default ExercisePage
