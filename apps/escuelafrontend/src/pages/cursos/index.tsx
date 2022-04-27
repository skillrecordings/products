import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import {VerticalResourceCard} from 'components/cards/verticle-resource-card'

const Cursos: React.FC = (allCourses: any) => {
  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="w-full max-w-screen-lg py-16 m-auto mb-10 text-4xl font-extrabold tracking-tight text-center text-black transition-all duration-500 ease-in-out dark:text-white md:text-5xl leading-tighter sm:text-5xl lg:text-6xl xl:text-7xl">
        Cursos de ingeniería front-end modernos e interactivos
      </h1>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8`}>
        {allCourses.allCourses.map((resource: any) => {
          return (
            <div key={resource.path}>
              <VerticalResourceCard resource={resource} banner={true} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Cursos

const allCoursesQuery = groq`
*[_type == "course" && publishedAt < now()]|order(publishedAt desc) {
  title,
  slug,
  path,
  publishedAt,
  "image":{
    'url': image.url
  },
  "tag": softwarelibraries[0]-> {
    name,
    "slug": slug.current,
    "image": image.url
  }
}
`

export async function getStaticProps() {
  const allCourses = await sanityClient.fetch(allCoursesQuery)

  return {
    props: {
      allCourses,
    },
  }
}
