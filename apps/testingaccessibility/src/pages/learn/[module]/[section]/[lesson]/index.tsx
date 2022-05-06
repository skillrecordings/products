import React from 'react'
import {getDecodedToken} from 'utils/get-decoded-token'
import {sanityClient} from 'utils/sanity-client'
import {SanityDocument} from '@sanity/client'
import {GetServerSideProps} from 'next'
import {getSdk} from 'lib/prisma-api'
import LessonTemplate from 'templates/lesson-template'
import flatten from 'lodash/flatten'
import isEmpty from 'lodash/isEmpty'
import last from 'lodash/last'
import find from 'lodash/find'
import uniq from 'lodash/uniq'
import get from 'lodash/get'
import groq from 'groq'

const lessonQuery = groq`*[_type == "lesson" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  body[]{
      ...,
      markDefs[]{
        ...,
      _type == "internalLink" => {
        "_id": @.reference->_id,
        "slug": @.reference->slug,
        "type": @.reference->_type,
        "modules": *[_type=='module']{
          "slug": slug.current,
          sections[]->{
            "slug": slug.current,
            lessons[]->{
              "slug": slug.current,
            }
          }
        }
      }
    }
  },
  }`

const allLessonsQuery = groq`*[_type == "lesson"]{
  "slug": slug.current,
  }`

const productQuery = groq`*[_type == "product" && productId == $productId][0]{
  productId,
  modules[]->{
    "slug": slug.current,
    title,
    sections[]->{
      "slug": slug.current,
      lessons[]->{
        "slug": slug.current,
      }
    }
  }
  }`

const sectionQuery = groq`*[_type == "section" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  image {
    url,
    alt
  },
  lessons[]->{
    title,
    "slug": slug.current
  }
  }`

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const sessionToken = await getDecodedToken(req)
  const {getPurchasesForUser} = getSdk()
  const purchases =
    sessionToken &&
    sessionToken.sub &&
    (await getPurchasesForUser(sessionToken.sub))
  const productId = purchases && get(last(purchases), 'productId')

  // fetch product from sanity based on user's productId associated with their purchase
  const product = await sanityClient.fetch(productQuery, {
    productId: productId,
  })

  // get array of available lessons
  const lessons: {slug: string}[] = flatten(
    product.modules.map((module: SanityDocument) =>
      flatten(
        module.sections.map((section: SanityDocument) =>
          uniq(section.lessons?.map((lesson: SanityDocument) => lesson)),
        ),
      ),
    ),
  )

  // determine current lesson based on the url
  const currentLesson: {slug: string} | undefined = find(lessons, {
    slug: params?.lesson as string,
  })

  const allLessons = await sanityClient.fetch(allLessonsQuery)

  // if the lesson doesn't exist
  if (isEmpty(find(allLessons, {slug: params?.lesson}))) {
    return {
      notFound: true,
    }
  }

  // if the section is not found, user is trying to access a section that is not included in their purchase
  if (isEmpty(currentLesson)) {
    // they need to upgrade
    return {
      redirect: {
        destination: '/buy',
        permanent: false,
      },
    }
  }

  const section = await sanityClient.fetch(sectionQuery, {
    slug: params?.section,
  })

  const module = find(product.modules, (module: SanityDocument) =>
    find(module.sections, {slug: section.slug}),
  )

  const lesson = await sanityClient.fetch(lessonQuery, {
    slug: currentLesson?.slug,
  })

  return {
    props: {lesson, section, module},
  }
}

type LessonPageProps = {
  module: SanityDocument
  section: SanityDocument
  lesson: SanityDocument
}

const LessonPage: React.FC<LessonPageProps> = ({module, section, lesson}) => {
  return <LessonTemplate module={module} section={section} lesson={lesson} />
}

export default LessonPage
