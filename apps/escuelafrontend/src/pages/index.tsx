import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import HeroWave from 'components/waves/hero-wave'
import {HorizontalResourceCard} from 'components/cards/horizontal-resource-card'

export default function Home({allArticles}: any) {
  return (
    <>
      <div className="flex-grow">
        <section className="relative top-0 w-auto -m-5 overflow-hidden -z-10 hero-gradiente">
          <div
            className="absolute w-full h-full bg-left-top bg-no-repeat bg-contain md:bg-cover -z-10 top-32 hero-animation-1"
            style={{
              backgroundImage: `url(/images/hero-image-1.svg)`,
            }}
          ></div>

          <div
            className="absolute w-full h-full bg-left-top bg-no-repeat bg-contain md:bg-cover top-64 -z-10 hero-animation-2"
            style={{
              backgroundImage: `url(/images/hero-image-2.svg)`,
            }}
          ></div>
          <div
            className="absolute w-full h-full bg-left-top bg-no-repeat bg-contain md:bg-cover top-96 -z-10 hero-animation-3"
            style={{
              backgroundImage: `url(/images/hero-image-3.svg)`,
            }}
          ></div>

          <div
            className="absolute w-full h-full bg-left-top bg-no-repeat bg-cover top-64 -z-10 hero-animation-4"
            style={{
              backgroundImage: `url(/images/hero-image-4.svg)`,
            }}
          ></div>

          <div className="relative z-10 flex flex-col items-center justify-center max-w-screen-lg px-4 pt-48 mx-auto opacity-0 sm:pb-96 pb-80 initial-load-hero">
            <h1 className="text-4xl font-extrabold tracking-tight text-center text-white transition-all duration-500 ease-in-out sm:text-5xl lg:text-6xl xl:text-7xl">
              Conviértete en un Frontend Developer Profesional
            </h1>
            <p className="mt-6 text-xl text-center text-white sm:text-2xl md:text-3xl sm:max-w-3xl">
              <span className="opacity-80">Accede a contenido de</span>{' '}
              <strong className="text-white opacity-100">alta calidad</strong>{' '}
              <span className="opacity-80">
                para construir una carrera exitosa como Frontend Developer
              </span>
            </p>
          </div>
        </section>

        <HeroWave />

        <section className="max-w-screen-xl py-10 mx-auto lg:py-24 sm:py-16">
          <h2 className="w-full max-w-screen-lg py-16 m-auto mb-10 text-2xl font-extrabold text-center lg:text-5xl md:text-4xl sm:text-3xl leading-tighter">
            Artículos Recientes
          </h2>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8`}>
            {allArticles.map((resource: any) => {
              return (
                <div key={resource.path}>
                  <HorizontalResourceCard resource={resource} />
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}

const allArticlesQuery = groq`
*[_type == "post" && publishedAt < now()]|order(publishedAt desc) {
  title,
  slug,
  path,
  publishedAt,
  "author": collaborators[0]->{
    title,
    'slug': person->slug.current,
    'name': person->name,
    'path': person->website,
    'twitter': person->twitter,
    'image': person->image.url
  },
  "image":{
    'url': image.url
  },
  "tag": softwarelibraries[0]-> {
    name,
    "image": image.url
  }
}[0..5]
`

export async function getStaticProps() {
  const allArticles = await sanityClient.fetch(allArticlesQuery)

  return {
    props: {
      allArticles,
    },
  }
}
