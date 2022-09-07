import React from 'react'
import {SanityDocument} from '@sanity/client'
import Layout from 'components/app/layout'
import {GetServerSideProps} from 'next'
import {getAllEmails} from 'lib/emails'
import Link from 'next/link'

const Email: React.FC<{emails: SanityDocument[]}> = ({emails}) => {
  const title = 'Emails'
  return (
    <Layout meta={{title}} className="bg-gray-200 py-16" noIndex>
      <main className="pt-16 flex flex-col min-h-screen max-w-screen-md mx-auto w-full">
        <h1 className="max-w-screen-md mx-auto w-full pb-5 font-bold text-4xl">
          {title}
        </h1>
        <ul className="flex flex-col gap-2">
          {emails.map(({title, slug}) => {
            return (
              <li key={title} className="text-xl">
                <h2>
                  <Link href={`/emails/${slug}`} passHref>
                    <a className="underline">{title}</a>
                  </Link>
                </h2>
              </li>
            )
          })}
        </ul>
      </main>
    </Layout>
  )
}

export default Email

export const getServerSideProps: GetServerSideProps = async (req) => {
  const emails = await getAllEmails()

  return {
    props: {emails},
  }
}
