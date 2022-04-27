import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import ProfileTemplate from 'layouts/profile'

const InstructorProfile = (props: any) => {
  return <ProfileTemplate meta={props.instructorResource[0]} />
}

const allInstructorsQuery = groq`*[_type == "person"]{
  "slug": slug.current
}
`

const allResourcesQuery = groq`*[_type == "person" && slug.current == $slug][0]{
  "slug": slug.current,
  "instructorResource": *[_type=='collaborator' && references(^._id)]{ 
    "instructor": {
      'slug': person->slug.current,
      'name': person->name,
      role,
      'twitter': person->twitter,
      'website': person->website,
      'image': person->image.url,
      'bio': person->bio,
      'title': person->title,
      "featuredResource": person->featuredResource[]-> {
        title,
        slug,
        path,
        publishedAt,
        "tag": softwarelibraries[0]-> {
          name,
          "slug": slug.current,
          "image": image.url
        },
      }
    },
    "allArticles": *[_type=='post' && references(^._id)]{ 
      title,
      slug,
      path,
      publishedAt,
      "tag": softwarelibraries[0]-> {
        name,
        "image": image.url
      },
    }
	}
}
`

export async function getStaticProps(context: any) {
  const {...instructor} = await sanityClient.fetch(allResourcesQuery, {
    slug: context.params.slug,
  })

  return {
    props: {...instructor},
    revalidate: 1,
  }
}

export async function getStaticPaths() {
  const allInstructors = await sanityClient.fetch(allInstructorsQuery)

  const paths = allInstructors.map((instructor: {slug: string}) => {
    return {
      params: {
        slug: instructor.slug,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export default InstructorProfile
