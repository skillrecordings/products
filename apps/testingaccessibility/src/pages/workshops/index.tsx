import * as React from 'react'
import Layout from 'components/app/layout'
import cx from 'classnames'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {Wave} from 'components/images'
import WorkshopsImage from '../../../public/assets/workshops@2x.png'
import groq from 'groq'
import {GetServerSideProps} from 'next'
import {sanityClient} from 'utils/sanity-client'

const Workshops: React.FC<any> = ({workshops}) => {
  return (
    <Layout meta={{title: 'Accessibility Workshops'}}>
      <header className="relative px-5 py-28 overflow-hidden text-white bg-green-700 bg-noise">
        <h1 className="max-w-screen-md font-dinosaur font-bold mx-auto leading-none text-center text-3xl sm:text-4xl lg:text-5xl">
          Accessibility Workshops
        </h1>
      </header>
      <main className="bg-sand-50 px-5 flex-grow py-8">
        <div className="mx-auto max-w-screen-sm w-full">
          <div className="grid grid-cols-1 gap-4 divide-y divide-sand-100">
            {workshops
              .filter(({published}: any) => published)
              .map((workshop: any) => {
                return <WorkshopItem key={workshop.title} workshop={workshop} />
              })}
          </div>
        </div>
      </main>
    </Layout>
  )
}

const WorkshopItem = ({workshop}: any) => {
  const {title, description, slug, date} = workshop

  const DisplayDate = () => (
    <time
      className="inline-block pt-1 text-lg font-dinosaur font-medium"
      dateTime={date}
    >
      {date}
    </time>
  )

  const WorkshopTitle = () => (
    <h2 className="text-green-600 group-hover:underline sm:text-2xl font-aglet-slab text-xl font-bold">
      {title}
    </h2>
  )
  const getTitle = (slug: any) =>
    slug ? (
      <Link href={`/workshops/${slug}`} passHref>
        <a className="group inline-flex">
          <WorkshopTitle />
        </a>
      </Link>
    ) : (
      <WorkshopTitle />
    )
  return (
    <article className={cx('p-10', {'pb-10': slug, 'pb-4': !slug})}>
      {getTitle(slug)}

      <DisplayDate />

      <Markdown className="prose sm:prose-lg pt-3 pb-6">{description}</Markdown>
      {slug && (
        <Link href={`/workshops/${slug}`} passHref>
          <a
            className="px-3 py-2 rounded-md hover:bg-moss-200/50 transition bg-moss-100 text-green-600 font-semibold inline-flex"
            aria-label={`Sign up for the workshop on ${title}`}
          >
            Read more
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
