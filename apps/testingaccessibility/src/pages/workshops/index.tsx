import * as React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {Wave} from 'components/images'
// import {workshops, otherWorkshops} from 'components/content/workshops'
import WorkshopsImage from '../../../public/assets/workshops@2x.png'
import groq from 'groq'
import {GetServerSideProps} from 'next'
import {sanityClient} from 'utils/sanity-client'

const Workshops: React.FC<any> = ({workshops: workshopGroups}) => {
  return (
    <Layout meta={{title: 'Upcoming Workshops'}}>
      <article>
        <header className="relative px-5 overflow-hidden text-white bg-black max-h-[80vh]">
          <h1 className="max-w-screen-md py-16 mx-auto text-3xl font-extrabold leading-tight text-center sm:text-4xl lg:text-6xl md:text-5xl">
            Upcoming Workshops
          </h1>
          <div className="flex items-center justify-center max-w-screen-md mx-auto">
            <Image
              src={WorkshopsImage}
              alt={'Upcoming workshops'}
              quality={100}
              placeholder="blur"
              priority={true}
            />
          </div>
          <Wave
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 z-10 w-full transform scale-150 sm:scale-100 text-gray-50"
            focusable="false"
            aria-hidden="true"
          />
        </header>
        <main className="bg-gray-50 px-5">
          <div className="pb-16 mx-auto max-w-screen-sm w-full">
            {workshopGroups.map(({title, workshops}: any) => {
              return (
                <>
                  <h2 className="font-mono uppercase text-sm font-semibold pb-8 pt-16">
                    {title}
                  </h2>
                  <div className="grid grid-cols-1 gap-5">
                    {workshops
                      .filter(({published}: any) => published)
                      .map((workshop: any) => (
                        <WorkshopItem workshop={workshop} />
                      ))}
                  </div>
                </>
              )
            })}
          </div>
        </main>
        <footer>
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
          </section>
        </footer>
      </article>
    </Layout>
  )
}

const WorkshopItem = ({workshop}: any) => {
  const {title, description, slug, date} = workshop

  const DisplayDate = () => <time dateTime={date}>{date}</time>

  const WorkshopTitle = () => (
    <h3 className="sm:text-2xl text-xl font-bold">{title}</h3>
  )
  const getTitle = (slug: any) =>
    slug ? (
      <Link href={`/workshops/${slug}`} passHref>
        <a className="hover:underline hover:text-indigo-500">
          <WorkshopTitle />
        </a>
      </Link>
    ) : (
      <WorkshopTitle />
    )
  return (
    <article
      className={`p-10 ${
        slug ? 'pb-10' : 'pb-4'
      } bg-white shadow-sm rounded-lg`}
    >
      {getTitle(slug)}
      <div className="pt-3 opacity-90 font-semibold">
        <DisplayDate />
      </div>
      <Markdown className="prose sm:prose-lg pt-3 pb-6">{description}</Markdown>
      {slug && (
        <Link href={`/workshops/${slug}`} passHref>
          <a className="px-5 py-3 rounded-full hover:bg-indigo-600 transition-all ease-in-out duration-300 bg-indigo-500 text-white  font-semibold inline-flex">
            View more and sign-up{' '}
            <span role="img" aria-label="arrow right" className="pl-2">
              →
            </span>
          </a>
        </Link>
      )}
    </article>
  )
}

const workshopsQuery = groq`*[_type == "workshops"]{
    title,
    workshops[]->{
        title,
        date,
        description,
        'slug': slug.current,
        published
    }
    }`

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await sanityClient.fetch(workshopsQuery)
  console.log(data[0].workshops)
  return {
    props: {workshops: data},
  }
}

export default Workshops
