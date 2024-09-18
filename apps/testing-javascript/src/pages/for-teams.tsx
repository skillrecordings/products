import Layout from '@/components/layout'
import React from 'react'
import BulkForm from '@/components/contact/bulk-form'
import ForTeams from '@/components/for-teams-copy.mdx'
import {Companies} from '@/components/companies'

const ForTeamsPage = () => {
  return (
    <Layout
      meta={{
        title: 'Testing JavaScript For Teams',
        description:
          'Improve the skills of your team with Testing JavaScript. Get a quote today and see how we can help you.',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1726611827/ogImages/og-image-default_1.png',
          alt: 'for teams ogimage',
        },
      }}
    >
      <header className="mx-auto w-full max-w-screen-md px-5 pt-16 text-center text-2xl font-bold">
        <h1 className="mx-auto text-center text-4xl font-semibold">
          Testing JavaScript For Teams
        </h1>
      </header>
      <main>
        <div className="prose prose-lg mx-auto w-full max-w-2xl px-5 py-16  text-black">
          <ForTeams />
          <Companies />
        </div>
        <div className="mx-auto text-center ">
          <h1 className=" text-2xl font-semibold">
            Invest in Your Team, Invest in Your Future
          </h1>
          <p className="pb-12 pt-4 text-lg">
            Fill out the form below to request a quote for your team:
          </p>
        </div>
        <div className="mx-auto flex w-full max-w-lg items-center justify-center px-5 pb-16">
          <BulkForm />
        </div>
      </main>
    </Layout>
  )
}

export default ForTeamsPage