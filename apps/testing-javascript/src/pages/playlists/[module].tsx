import React from 'react'
import {GetStaticPaths, GetStaticProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  PortableText,
  PortableTextComponents as PortableTextComponentsType,
} from '@portabletext/react'
import {User} from '@skillrecordings/database'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'

import {getPlaylist, getAllPlaylists} from 'lib/playlists'
import Layout from 'components/layout'
import Icon from 'components/icons'

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
  console.log({workshop})
  return (
    <Layout>
      {workshop?.sections?.map((section) => {
        return (
          <div
            key={section.slug}
            className="max-w-3xl mx-auto py-5 flex flex-col items-center"
          >
            {workshop?.image ? (
              <div className="w-full max-w-[340px]">
                <Image
                  src={workshop?.image}
                  alt={workshop?.title}
                  title={workshop?.title}
                  width={340}
                  height={340}
                />
              </div>
            ) : null}
            <h2 className="text-5xl mt-12">{section.title}</h2>
            <div className="mt-7 flex items-center space-x-6">
              <div className="space-x-2 flex items-center text-base">
                <Icon name="lesson" className="w-5 h-5" />
                <span>
                  {workshop?.sections?.[0]?.lessons?.length} video lessons
                </span>
              </div>
              <div className="space-x-2 flex items-center text-base">
                <Icon name="duration" className="w-5 h-5" />
                <span>Xh XXm of learning material</span>
              </div>
            </div>
            <Link
              href="/"
              className="space-x-4 inline-flex items-center bg-gray-100 text-black px-6 py-3 rounded-md mt-7 hover:bg-gray-200 duration-100"
            >
              <Icon name="play" className="w-[10px] h-[10px]" />
              <span>Start Watching</span>
            </Link>
            <div className="mt-7 text-[22px]">
              <PortableText
                value={workshop.body}
                components={{
                  listItem: {
                    bullet: ({children}) => (
                      <li>
                        <Icon name="check-circle" className="w-6 h-6" />{' '}
                        {children}
                      </li>
                    ),
                  },
                }}
              />
            </div>
            <ul>
              {section.lessons?.map((lesson) => {
                return (
                  <li key={lesson._id}>
                    <Link href={`/lessons/${lesson.slug}`}>{lesson.title}</Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </Layout>
  )
}

export default WorkshopPage
