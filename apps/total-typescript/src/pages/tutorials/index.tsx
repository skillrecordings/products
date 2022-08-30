import React from 'react'
import Layout from 'components/app/layout'
import {SanityDocument} from '@sanity/client'
import {getAllTutorials} from 'lib/tutorials'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import {checkIfConvertkitSubscriber} from '@skillrecordings/convertkit'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tutorials = await getAllTutorials()
  const hasSubscribed = await checkIfConvertkitSubscriber(context)
  console.log({hasSubscribed})

  return {
    props: {tutorials},
  }
}

const TutorialsPage: React.FC<{tutorials: SanityDocument[]}> = ({
  tutorials,
}) => {
  return (
    <Layout>
      <main className="flex flex-grow items-center justify-center flex-col">
        <h1 className="font-heading text-4xl font-bold">Tutorials</h1>
        {tutorials && (
          <ul>
            {tutorials.map(({title, slug}) => {
              return (
                <li key={slug}>
                  <Link
                    href={{
                      pathname: '/tutorials/[tutorial]',
                      query: {
                        tutorial: slug,
                      },
                    }}
                  >
                    <a className="text-3xl font-heading font-bold">{title}</a>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </Layout>
  )
}

export default TutorialsPage
