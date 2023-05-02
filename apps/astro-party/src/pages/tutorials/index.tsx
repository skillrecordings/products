import React from 'react'
import Layout from 'components/app/layout'
import {getAllTutorials} from 'lib/tutorials'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Balancer from 'react-wrap-balancer'
import Header from 'components/app/header'
import pluralize from 'pluralize'
import {getOgImage} from 'utils/get-og-image'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'

export async function getStaticProps() {
  const tutorials = await getAllTutorials()

  return {
    props: {tutorials},
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

const Tutorials: React.FC<{tutorials: Module[]}> = ({tutorials}) => {
  const title = 'Free Tutorials'

  return (
    <Layout
      meta={{
        title,
        openGraph: {
          images: [getOgImage({title})],
        },
      }}
    >
      <Header title={title} />
      <main className="mx-auto w-full max-w-screen-md px-5">
        {tutorials && (
          <ul className="flex flex-col justify-center gap-5">
            {tutorials.map(({title, slug, image, description, sections}, i) => {
              return (
                <li key={slug.current} className="w-full">
                  <Link
                    href={{
                      pathname: '/tutorials/[module]',
                      query: {
                        module: slug.current,
                      },
                    }}
                    className="relative flex w-full flex-col items-center gap-8 rounded-md sm:flex-row"
                  >
                    {image && (
                      <div className="flex flex-shrink-0 items-center justify-center">
                        <Image
                          src={image}
                          alt={title}
                          quality={100}
                          width={240}
                          height={240}
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                      <h2 className="text-3xl font-bold">
                        <Balancer>{title}</Balancer>
                      </h2>
                      <div className="pb-3 pt-4 font-mono text-xs font-semibold uppercase text-brand-primary">
                        {i === 0 && (
                          <span className="mr-3 rounded-full bg-brand-primary px-2 py-0.5 font-mono font-semibold uppercase text-white">
                            New
                          </span>
                        )}
                        {sections && sectionsFlatMap(sections).length}{' '}
                        {sections &&
                          pluralize(
                            sectionsFlatMap(sections)[0]._type,
                            sectionsFlatMap(sections).length,
                          )}
                      </div>
                      {description && (
                        <p className="text-gray-300">{description}</p>
                      )}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </Layout>
  )
}

export default Tutorials
