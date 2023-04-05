import React from 'react'

import {User} from '@skillrecordings/database'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {getPlaylist, getAllPlaylists} from '../../lib/playlists'
import Link from 'next/link'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const workshop = await getPlaylist(params?.module as string)

  return {
    props: {workshop},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const workshops = await getAllPlaylists()
  const paths = workshops.map((workshop: any) => {
    return {
      params: {module: workshop.slug.current},
    }
  })
  return {paths, fallback: 'blocking'}
}

const WorkshopPage: React.FC<{
  workshop: Module
}> = ({workshop}) => {
  return (
    <div>
      {workshop?.sections?.map((section) => {
        return (
          <div key={section.slug}>
            <h2 className="font-bold">{section.title}</h2>
            <ul>
              {section.lessons?.map((lesson) => {
                return (
                  <li key={lesson._key}>
                    <Link href={`/lessons/${lesson.slug}`}>{lesson.title}</Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default WorkshopPage
