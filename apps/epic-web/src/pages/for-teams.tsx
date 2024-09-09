import Layout from 'components/app/layout'
import React from 'react'
import ContactForm from 'components/contact/contact-form'
import ForTeams from 'components/for-teams-copy.mdx'
import {Companies} from 'components/companies'

const ForTeamsPage = () => {
  return (
    <Layout
      meta={{
        title: 'For Teams',
      }}
    >
      <header className="mx-auto w-full max-w-screen-md px-5 pt-16 text-center text-2xl font-bold">
        <h1 className="mx-auto text-center text-4xl font-semibold">
          Epic Web For Teams
        </h1>
      </header>
      <main>
        <div className="prose prose-lg mx-auto w-full max-w-2xl px-5 py-16 dark:prose-invert">
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
          <ContactForm />
        </div>
      </main>
    </Layout>
  )
}

export default ForTeamsPage
