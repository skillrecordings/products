import * as React from 'react'
import Layout from '../components/app/layout'
import BulkForm from '../components/contact/bulk-form'
import ForTeams from '../components/for-teams-copy.mdx'
import {Companies} from '../components/companies'
import Image from 'next/image'

const ForTeamsPage = () => {
  return (
    <Layout
      meta={{
        title: 'Total TypeScript For Teams',
        description:
          'Improve the skills of your team with Total TypeScript. Get a quote today and see how we can help you.',
        ogImage: {
          url: '',
        },
      }}
    >
      <header className="mx-auto w-full max-w-screen-md px-5 pt-16 text-center text-2xl font-bold">
        <h1 className="mb-4 mt-12 text-center font-heading text-4xl font-semibold sm:text-5xl">
          Total TypeScript For Teams
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
          <BulkForm />
        </div>
      </main>
      <Image
        fill
        aria-hidden="true"
        alt=""
        src={require('../../public/assets/landing/bg-divider-3.png')}
        className="-z-10 object-contain object-top"
      />
    </Layout>
  )
}

export default ForTeamsPage
