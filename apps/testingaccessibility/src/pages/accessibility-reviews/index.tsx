import * as React from 'react'
import Layout from 'components/app/layout'
import Link from 'next/link'
import Image from 'next/image'
import {Wave} from 'components/images'
import ReviewsImage from '../../../public/assets/reviews@2x.png'
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
      <header className="relative px-5 overflow-hidden text-white bg-black max-h-[80vh]">
        <h1 className="max-w-screen-md py-16 mx-auto text-3xl font-semibold leading-tight text-center sm:text-4xl lg:text-5xl md:text-4xl">
          Accessibility Reviews
        </h1>
        <div className="flex items-center justify-center max-w-screen-md mx-auto">
          <Image
            src={ReviewsImage}
            alt={'Accessibility reviews'}
            quality={100}
            placeholder="blur"
            priority={true}
            width={960 / 2}
            height={326 / 2}
          />
        </div>
        <Wave
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 z-10 w-full transform scale-150 sm:scale-100 text-gray-50"
          focusable="false"
          aria-hidden="true"
        />
      </header>
      <main className="bg-gray-50 px-5 flex-grow">
        <div className="md:py-16 py-10 mx-auto max-w-screen-sm w-full">
          <div className="grid grid-cols-1 gap-5">
            {reviews.map(({title, description, slug, image, date}: any) => {
              return (
                <div className="flex sm:flex-row flex-col sm:text-left text-center items-center gap-5 p-8 bg-white shadow-sm rounded-lg">
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
                        <a className="text-3xl font-semibold hover:underline">
                          {title.replace('Accessibility Review of ', '')}
                        </a>
                      </Link>
                      <time
                        dateTime={date}
                        className="block opacity-80 sm:text-base text-sm"
                      >
                        {format(new Date(date), 'MMMM d, yyyy')}
                      </time>
                      <p>{description}</p>
                    </div>
                  </div>
                  {slug && (
                    <Link href={`/accessibility-reviews/${slug}`} passHref>
                      <a
                        className="flex-shrink-0 px-5 py-3 rounded-full hover:bg-indigo-600 transition-all ease-in-out duration-300 bg-indigo-600 text-white font-semibold inline-flex"
                        aria-label={`Sign up for the workshop on ${title}`}
                      >
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
      <footer className="bg-gray-50">
        <section className="flex flex-col items-center max-w-lg py-8 mx-auto md:flex-row md:space-x-16">
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
              <div className="opacity-80">Your Instructor</div>
              <div className="text-3xl font-bold">Marcy Sutton</div>
              <p className="mt-2 text-xl leading-relaxed">
                Marcy is an award-winning accessibility specialist and freelance
                web developer.
              </p>
            </div>
          </div>
        </section>
      </footer>
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
