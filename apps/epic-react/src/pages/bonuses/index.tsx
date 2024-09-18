import React from 'react'
import Layout from '@/components/app/layout'
import {motion} from 'framer-motion'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Balancer from 'react-wrap-balancer'
import {getAllBonuses, Bonus} from '@/lib/bonuses'
import {ModuleProgressProvider} from '@skillrecordings/skill-lesson/video/module-progress'

export async function getStaticProps() {
  const bonuses = await getAllBonuses()

  return {
    props: {
      bonuses,
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

const BonusesPage: React.FC<{
  bonuses: Bonus[]
}> = ({bonuses}) => {
  return (
    <Layout
      meta={{
        title: `Bonuses`,
        description: `Interviews with Experts`,
        // ogImage: {
        //   url: 'https://res.cloudinary.com/epic-web/image/upload/v1726226118/epic-react-v2-workshops-card_2x.jpg',
        //   alt: 'Epic React Bonuses',
        // },
      }}
    >
      <header className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center px-5 pt-16">
        <div className="flex flex-col items-center space-y-3 text-center">
          <h1 className="flex flex-col text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            <span className="mb-2 inline-block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-xl uppercase tracking-widest text-transparent dark:from-blue-300 dark:to-blue-500">
              Epic React
            </span>
            Bonuses
          </h1>
          <h2 className="w-full max-w-md text-base text-gray-600 dark:text-gray-400">
            <Balancer>Interviews with Experts</Balancer>
          </h2>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-screen-lg flex-col justify-center gap-5 px-5 pb-24 pt-16">
        {bonuses && (
          <ul className="flex flex-col gap-5">
            {bonuses.map((bonus, i) => {
              return (
                <ModuleProgressProvider
                  key={bonus._id}
                  moduleSlug={bonus.slug.current}
                >
                  <Teaser bonus={bonus} key={bonus.slug.current} index={i} />
                </ModuleProgressProvider>
              )
            })}
          </ul>
        )}
      </main>
    </Layout>
  )
}

export default BonusesPage

const Teaser: React.FC<{
  bonus: Bonus
  index?: number
}> = ({bonus, index}) => {
  let {title, slug, image, description} = bonus

  return (
    <motion.li>
      <Link
        className="relative flex w-full flex-col items-center gap-10 overflow-hidden rounded-md border bg-white p-5 shadow-2xl shadow-gray-500/20 transition dark:bg-white/5 dark:shadow-none dark:hover:bg-gray-800 md:flex-row md:p-10 md:pl-16"
        href={{
          pathname: '/bonuses/[module]',
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
            {bonus.resources && <>{bonus.resources.length} videos</>}
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
