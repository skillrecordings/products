import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import HeroWave from 'components/waves/hero-wave'
import {HorizontalResourceCard} from 'components/cards/horizontal-resource-card'
import Jumbotron from 'components/pages/home/jumbotron'
import {find} from 'lodash'
import reactPageData from '../data/react-page-data'

export default function Home({allArticles}: any) {
  const jumbutron: any = find(reactPageData, {id: 'jumbotron'})
  return (
    <>
      <div className="flex-grow">
        <section className="relative overflow-hidden w-auto -m-5 top-0 -z-10 hero-gradiente">
          <div
            className="absolute w-full bg-no-repeat bg-left-top bg-contain md:bg-cover -z-10 h-full top-32 hero-animation-1"
            style={{
              backgroundImage: `url(/images/hero-image-1.svg)`,
            }}
          ></div>

          <div
            className="absolute w-full bg-no-repeat bg-left-top bg-contain md:bg-cover h-full top-64 -z-10 hero-animation-2"
            style={{
              backgroundImage: `url(/images/hero-image-2.svg)`,
            }}
          ></div>
          <div
            className="absolute w-full bg-no-repeat bg-left-top bg-contain  md:bg-cover h-full top-96 -z-10 hero-animation-3"
            style={{
              backgroundImage: `url(/images/hero-image-3.svg)`,
            }}
          ></div>

          <div
            className="absolute w-full bg-no-repeat bg-left-top bg-cover top-64 -z-10 h-full hero-animation-4"
            style={{
              backgroundImage: `url(/images/hero-image-4.svg)`,
            }}
          ></div>

          <div className="relative px-4 sm:pb-96 pb-80 pt-48 opacity-0 initial-load-hero">
            <h1 className="lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-extrabold max-w-screen-lg text-white transition-all ease-in-out duration-500 text-center mx-auto">
              Conviértete en un Frontend Developer Profesional
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-center text-xl sm:text-2xl md:text-3xl text-white sm:max-w-3xl">
              <span className="opacity-80">Accede a contenido de</span>{' '}
              <strong className="opacity-100 text-white">alta calidad</strong>{' '}
              <span className="opacity-80">
                para construir una carrera exitosa como Frontend Developer
              </span>
            </p>
          </div>
        </section>

        <HeroWave />

        <div className="mx-auto max-w-screen-xl -mt-48">
          <Jumbotron resource={jumbutron} />
        </div>

        <section className="lg:py-24 sm:py-16 py-10 mx-auto max-w-screen-xl">
          <h2 className="py-16 mb-10 text-center lg:text-5xl md:text-4xl sm:text-3xl text-2xl w-full font-extrabold leading-tighter max-w-screen-lg m-auto">
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
