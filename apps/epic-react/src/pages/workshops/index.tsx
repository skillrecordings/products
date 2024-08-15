import React from 'react'
import Layout from '@/components/app/layout'
import {motion} from 'framer-motion'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Balancer from 'react-wrap-balancer'
import {useRouter} from 'next/router'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {getAllWorkshops, Workshop} from '@/lib/workshops'

export async function getStaticProps() {
  const workshops = await getAllWorkshops()

  return {
    props: {
      workshops,
    },
    revalidate: 10,
  }
}

// There are multiple sections containing arrays of lessons. I'd like to flat map them into a single array of lessons.
const sectionsFlatMap = (sections: any[]) => {
  const map = sections.flatMap((section) => {
    return section.lessons || []
  })

  return map
}

const WorkshopsPage: React.FC<{
  workshops: Workshop[]
}> = ({workshops}) => {
  const router = useRouter()
  const {subscriber, loadingSubscriber} = useConvertkit()

  console.log({workshops})

  return (
    <Layout
      meta={{
        title: `Professional React Workshops from Kent C. Dodds`,
        description: `Professional React workshops by Kent C. Dodds that will help you learn professional web development through exercise driven examples.`,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1721252858/epicreact-skill-stack/ogImage-workshops.png',
          alt: 'Epic React Workshops',
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center px-5 pt-16">
        <div className="flex flex-col items-center space-y-3 text-center">
          <h1 className="flex flex-col text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            <span className="mb-2 inline-block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-xl uppercase tracking-widest text-transparent dark:from-blue-300 dark:to-blue-500">
              Professional
            </span>{' '}
            Epic React Workshops
          </h1>
          <h2 className="w-full max-w-md text-base text-gray-600 dark:text-gray-400">
            <Balancer>
              A collection of exercise-driven, in-depth React workshops.
            </Balancer>
          </h2>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-screen-lg flex-col justify-center gap-5 px-5 pb-24 pt-16">
        {workshops && (
          <ul className="flex flex-col gap-5">
            {workshops.map((workshop, i) => {
              return (
                <ModuleProgressProvider
                  key={workshop._id}
                  moduleSlug={workshop.slug.current}
                >
                  <Teaser
                    workshop={workshop}
                    key={workshop.slug.current}
                    index={i}
                  />
                </ModuleProgressProvider>
              )
            })}
          </ul>
        )}
      </main>
    </Layout>
  )
}

export default WorkshopsPage

const Teaser: React.FC<{
  workshop: any
  index?: number
}> = ({workshop, index}) => {
  let {title, slug, image, description} = workshop

  return (
    <motion.li>
      <Link
        className="relative flex w-full flex-col items-center gap-10 overflow-hidden rounded-md border bg-white p-5 shadow-2xl shadow-gray-500/20 transition dark:bg-white/5 dark:shadow-none dark:hover:bg-gray-800 md:flex-row md:p-10 md:pl-16"
        href={{
          pathname: '/workshops/[module]',
          query: {
            module: slug.current,
          },
        }}
      >
        {image && (
          <div className="flex items-center justify-center lg:flex-shrink-0">
            <Image
              src={image}
              alt={title}
              width={300}
              quality={100}
              height={300}
              priority
            />
          </div>
        )}
        <div className="flex w-full flex-col items-center text-center md:items-start md:text-left">
          <div className="flex w-full items-center justify-center gap-3 md:justify-start">
            <h3 className="w-full max-w-xl text-2xl font-semibold leading-tight sm:text-3xl ">
              <Balancer>{title}</Balancer>
            </h3>
          </div>
          <div className="mt-3 pb-3 font-mono text-xs font-semibold uppercase dark:text-white">
            {index === 0 && (
              <span className="mr-3 rounded-md bg-blue-500 px-2 py-0.5 font-sans font-semibold uppercase text-white">
                New
              </span>
            )}
            {workshop.sections && (
              <>{sectionsFlatMap(workshop.sections).length} exercises</>
            )}
          </div>

          {description && (
            <div className="pt-5">
              <p className="text-gray-600 dark:text-gray-300">
                <Balancer>{description}</Balancer>
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.li>
  )
}
