import * as React from 'react'
import Layout from 'components/app/layout'
import cx from 'classnames'
import Link from 'next/link'
import Markdown from 'react-markdown'
import groq from 'groq'
import {GetServerSideProps} from 'next'
import {sanityClient} from 'utils/sanity-client'

const Workshops: React.FC<any> = ({workshops}) => {
  const upcomingWorkshops = workshops.filter(({published}: any) => published)
  const pastWorkshops = workshops.filter(({published}: any) => !published)

  return (
    <Layout meta={{title: 'Accessibility Workshops'}}>
      <header className="relative px-5 py-28 overflow-hidden text-white bg-green-700 bg-noise">
        <h1 className="max-w-screen-md font-heading font-bold mx-auto leading-none text-center text-3xl sm:text-4xl lg:text-5xl">
          Accessibility Workshops
        </h1>
      </header>
      <main className="px-5 flex-grow">
        <div className="pb-16 mx-auto max-w-screen-lg w-full pt-16 gap-16">
          {upcomingWorkshops.length !== 0 && (
            <>
              <div className="relative flex-shrink-0">
                <h2 className="text-xl font-medium sticky top-24 inline-block w-full border-b pb-4 border-moss-100">
                  Upcoming workshops
                </h2>
              </div>
              <div className="grid lg:grid-cols-2 gap-10 pt-12">
                {upcomingWorkshops.map((workshop: any) => {
                  return (
                    <WorkshopItem key={workshop.title} workshop={workshop} />
                  )
                })}
              </div>
            </>
          )}
          {pastWorkshops.length !== 0 && (
            <>
              <div className="relative flex-shrink-0">
                <h2 className="text-lg font-bold sticky top-24 inline-block w-full border-b pb-4 border-moss-100">
                  Past workshops
                </h2>
              </div>
              <div className="grid lg:grid-cols-2 gap-10 pt-12">
                {pastWorkshops.map((workshop: any) => {
                  return (
                    <WorkshopItem key={workshop.title} workshop={workshop} />
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  )
}

const WorkshopItem = ({workshop}: any) => {
  const {title, description, slug, date, published} = workshop

  const DisplayDate = () => (
    <time className="block pt-8 font-medium" dateTime={date}>
      {date}
    </time>
  )

  const WorkshopTitle = () => (
    <h3 className="group-hover:underline sm:text-2xl font-heading text-xl font-bold">
      {title}
    </h3>
  )
  const getTitle = (slug: any) =>
    slug ? (
      <Link href={`/workshops/${slug}`} passHref>
        <a className="group inline-flex text-green-600">
          <WorkshopTitle />
        </a>
      </Link>
    ) : (
      <WorkshopTitle />
    )
  return (
    <article className={cx('', {'pb-10': slug, 'pb-4': !slug})}>
      {getTitle(slug)}
      <DisplayDate />
      <Markdown className="prose pt-3 pb-6">{description}</Markdown>
      {slug && (
        <Link href={`/workshops/${slug}`} passHref>
          <a
            className="font-nav px-3 py-2 rounded-md hover:bg-moss-200/50 transition bg-moss-100 text-green-600 font-semibold inline-flex"
            aria-label={`Sign up for the workshop on ${title}`}
          >
            {published ? (
              <>
                Sign up for the workshop{' '}
                <i aria-hidden className="pl-2">
                  →
                </i>
              </>
            ) : (
              'Read more'
            )}
          </a>
        </Link>
      )}
    </article>
  )
}

const workshopsQuery = groq`*[_type == "workshop"] | order(order asc){
    title,
    date,
    description,
    'slug': slug.current,
    published,
    order
}`

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await sanityClient.fetch(workshopsQuery)

  return {
    props: {workshops: data},
  }
}

export default Workshops
