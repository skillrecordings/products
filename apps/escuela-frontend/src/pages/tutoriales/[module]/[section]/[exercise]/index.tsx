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
      <div className="text-sm">
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
      <span className="inline-block w-24 rounded-full bg-brand px-2.5 py-1 font-mono text-xs font-semibold uppercase text-gray-50 sm:mt-5 lg:text-sm 2xl:mt-0 2xl:text-xs">
        {exercise._type}
      </span>
      <h1 className="text-2xl font-bold">{exercise.title}</h1>
      {exercise.solution.map((solution: any) => {
        return (
          <div>
            <h2>{solution.title}</h2>
            <p>{solution.description}</p>
          </div>
        )
      })}

      <span className="mt-10"></span>
    </Layout>
  )
}

export default ExercisePage
