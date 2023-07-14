import React from 'react'
import Layout from 'components/layout'
import {type SanityDocument} from '@sanity/client'
import {getAllPlaylists} from 'lib/playlists'
import Playlist from 'components/playlist'

export async function getStaticProps() {
  const playlists = await getAllPlaylists()

  return {
    props: {modules: playlists},
    revalidate: 10,
  }
}

const WorkshopsPage: React.FC<{modules: SanityDocument[]}> = ({modules}) => {
  return (
    <Layout
      meta={{
        title: `Testing JavaScript with Kent C. Dodds`,
        description: `This course will teach you the fundamentals of testing your JavaScript applications using ESlint, TypeScript, Jest, and Cypress.`,
      }}
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-32 sm:py-40">
        <h1 className="px-5 text-center font-heading text-5xl font-bold sm:text-5xl">
          Testing JavaScript with Kent C. Dodds
        </h1>
        {modules && (
          <ul className="flex max-w-screen-lg flex-col gap-5 px-5 pt-10 sm:gap-8 sm:pt-20">
            {modules.map((playlist) => {
              return (
                <Playlist
                  key={playlist._id}
                  playlist={playlist}
                  purchased={true}
                />
              )
            })}
          </ul>
        )}
      </main>
    </Layout>
  )
}

export default WorkshopsPage
