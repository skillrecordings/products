import * as React from 'react'
import Layout from 'components/app/layout'
import Link from 'next/link'
import Image from 'next/image'
import groq from 'groq'
import {GetServerSideProps} from 'next'
import {sanityClient} from 'utils/sanity-client'
import {format} from 'date-fns'

const meta = {
  title: 'Accessibility Reviews',
  ogImage: {
    url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1646816239/testingaccessibility.com/accessibility-reviews/accessibility-reviews-card_2x.png',
  },
}

const Reviews: React.FC<any> = ({reviews}) => {
  return (
    <Layout meta={meta}>
      <header className="relative px-5 py-28 overflow-hidden text-white bg-green-700 bg-noise">
        <h1 className="max-w-screen-md font-aglet-slab font-bold mx-auto leading-none text-center text-3xl sm:text-4xl lg:text-5xl">
          Accessibility Reviews
        </h1>
      </header>
      <main className="bg-gray-50 px-5 flex-grow">
        <div className="pb-16 mx-auto max-w-lg w-full pt-16 gap-16">
          <div className="grid grid-cols-1 gap-5">
            {reviews.map(({title, description, slug, image, date}: any) => {
              return (
                <div
                  key={slug}
                  className="flex sm:flex-row flex-col sm:text-left text-center items-center gap-5"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={image}
                      alt={title}
                      width={60}
                      height={60}
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex w-full sm:justify-between justify-center">
                    <div>
                      <Link href={`/accessibility-reviews/${slug}`} passHref>
                        <a className="text-green-600 group-hover:underline sm:text-3xl font-aglet-slab text-xl font-bold">
                          {title.replace('Accessibility Review of ', '')}
                        </a>
                      </Link>
                      <time
                        dateTime={date}
                        className="block font-dinosaur font-medium"
                      >
                        {format(new Date(date), 'MMMM d, yyyy')}
                      </time>
                      <p>{description}</p>
                    </div>
                  </div>
                  {slug && (
                    <Link href={`/accessibility-reviews/${slug}`} passHref>
                      <a className="flex-shrink-0 px-3 py-2 rounded-md hover:bg-moss-200/50 transition bg-moss-100 text-green-600 font-semibold inline-flex">
                        Watch the review
                        <i aria-hidden className="pl-2">
                          →
                        </i>
                      </a>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </Layout>
  )
}

const reviewsQuery = groq`*[_type == "review"] | order(order asc){
    title,
    description,
    'slug': slug.current,
    hlsUrl,
    published,
    image,
    date,
    order
}`

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await sanityClient.fetch(reviewsQuery)

  return {
    props: {reviews: data},
  }
}

export default Reviews
