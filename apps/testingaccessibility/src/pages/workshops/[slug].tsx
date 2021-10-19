import * as React from 'react'
import groq from 'groq'
import {serialize} from 'next-mdx-remote/serialize'
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote'
import {GetServerSideProps} from 'next'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import {sanityClient} from 'utils/sanity-client'
import Layout from 'components/app/layout'
import Image from 'next/image'
import {Wave} from 'components/images'
import Link from 'next/link'
import {SubscribeToConvertkitForm} from '@skillrecordings/convertkit'
import Script from 'next/script'

const WorkshopPage: React.FC<any> = ({workshop, source}) => {
  const {title, date, ckFormId, description, status, url} = workshop

  const DisplayDate = () => <time dateTime={date}>{date}</time>
  const ReservationWidget = ({
    className = 'max-w-screen-md w-full mx-auto',
  }: any) => {
    const event = url.replace('https://ti.to/', '')

    return (
      <div className={className}>
        <div className="flex flex-col items-center rounded-3xl p-8 bg-white text-black border-4 border-gray-100 relative z-20 w-full">
          <div className="flex sm:flex-row flex-col items-center w-full justify-between pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-left ">Reserve your spot</h2>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="text-gray-500" />
              <DisplayDate />
            </div>
          </div>
          {/* @ts-ignore */}
          <tito-widget event={event} />

          <div className="opacity-70 text-sm pb-2">or</div>
          <a
            href={url}
            className="flex items-center text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="pr-2">Visit reservation page</span>
            <i className="gg-arrow-top-right scale-75" aria-hidden />{' '}
          </a>
        </div>
      </div>
    )
  }
  const InterestForm = ({className = 'max-w-screen-md w-full mx-auto'}: any) =>
    ckFormId ? (
      <div className={className}>
        <div className="flex flex-col items-center rounded-3xl p-8 bg-white text-black border-4 border-gray-100 relative z-20 w-full">
          <div className="flex sm:flex-row flex-col items-center w-full justify-between pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-left ">
              Interested in this workshop?
            </h2>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="text-gray-500" />
              <DisplayDate />
            </div>
          </div>

          <SubscribeToConvertkitForm
            formId={ckFormId}
            actionLabel="Join the waitlist"
            successMessage="Thanks! I'll keep you in the loop on my upcoming workshops."
          />
        </div>
      </div>
    ) : null

  return (
    <>
      <Script src="https://js.tito.io/v2" async />
      <Layout meta={{title, description}}>
        <div data-workshop-interest>
          <header className="relative px-5 text-white bg-black pb-32 pt-8 flex flex-col items-center justify-center text-center">
            <Link href="/workshops">
              <a className="group text-indigo-100 relative hover:text-white font-normal px-4 py-2 hover:bg-opacity-5 bg-opacity-0 bg-white rounded-full transition-all ease-in-out duration-300 opacity-80 hover:opacity-90 ">
                <span role="img" aria-label="left arrow">
                  ←
                </span>{' '}
                All Workshops
              </a>
            </Link>
            <h1 className="max-w-screen-md pt-8 mx-auto text-3xl font-extrabold leading-tight sm:text-4xl lg:text-6xl md:text-5xl">
              {title}
            </h1>
            <div className="pt-8 text-lg">
              {date && status === 'scheduled' ? (
                <div className="group px-5 py-2 rounded-full shadow-xl flex items-center space-x-2 bg-white bg-opacity-5 transition-all ease-in-out duration-150  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  <CalendarIcon /> <DisplayDate />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CalendarIcon />
                  <DisplayDate />
                </div>
              )}
            </div>
            {url ? (
              <ReservationWidget className="-mb-48 mt-16 max-w-screen-sm w-full" />
            ) : (
              <InterestForm className="-mb-48 mt-16 max-w-screen-md w-full" />
            )}
            <div className="absolute bottom-0 h-16 w-full overflow-hidden">
              <Wave
                preserveAspectRatio="none"
                className="absolute bottom-0 left-0 z-10 w-full transform scale-150 sm:scale-100"
                focusable="false"
                aria-hidden="true"
              />
            </div>
          </header>
          <main className="px-5">
            <div className="py-32 mx-auto prose xl:prose-xl lg:prose-lg max-w-screen-sm">
              <MDXRemote {...source} />
            </div>
            {url ? <ReservationWidget /> : <InterestForm />}
          </main>
          <footer className="px-5">
            <section className="flex flex-col items-center max-w-screen-lg py-24 mx-auto md:flex-row md:space-x-16">
              <div className="flex flex-col items-center py-16 space-y-4 text-center sm:py-24 sm:flex-row sm:items-start sm:text-left sm:space-x-8 sm:space-y-0">
                <div className="flex-shrink-0">
                  <Image
                    className="rounded-full"
                    src={'/marcy-sutton.jpg'}
                    width={120}
                    height={120}
                    quality={100}
                    alt="smiling Marcy Sutton holding a cat and standing next to a microphone"
                  />
                </div>
                <div>
                  <div className="opacity-80">Instructor</div>
                  <div className="text-3xl font-bold">Marcy Sutton</div>
                  <p className="mt-2 text-xl leading-relaxed">
                    Marcy is an award-winning accessibility specialist and
                    freelance web developer.
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 pt-16 pb-24 text-center sm:p-6">
                {/* <Share meta={{title: meta.title, slug: meta.slug}} /> */}
              </div>
            </section>
          </footer>
        </div>
      </Layout>
    </>
  )
}

const CalendarIcon: React.FC<{className?: string}> = ({className}) => {
  const title = 'calendar'
  return (
    <svg
      className={`w-4 transition-all ease-in-out duration-150 ${className}`}
      height="20"
      width="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g fill="none">
        <path
          d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1zm0 5a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H6z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
    </svg>
  )
}

const workshopQuery = groq`*[_type == "workshop" && slug.current == $slug][0]{
    title,
    'slug': slug.current,
    date,
    ckFormId,
    body,
    status,
    description,
    ogImage,
    url
    }`

const allWorkshopsQuery = groq`
    *[_type == "workshop"]{
      "slug": slug.current
    }`

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const allWorkshops = await sanityClient.fetch(allWorkshopsQuery)
  const currentWorkshop = find(allWorkshops, {slug: context.params.slug})

  if (isEmpty(currentWorkshop)) {
    return {
      notFound: true,
    }
  }

  const data = await sanityClient.fetch(workshopQuery, {
    slug: currentWorkshop.slug,
  })

  const {body, ...workshop} = data
  const mdxSource = await serialize(body)

  return {
    props: {workshop: workshop, source: mdxSource},
  }
}

export default WorkshopPage
