import React from 'react'

import {User} from '@skillrecordings/database'
import {SanityDocument} from '@sanity/client'
import {getAllCourses, getModule} from 'lib/courses'
import {GetStaticPaths, GetStaticProps} from 'next'
import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import Link from 'next/link'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const course = await getModule(params?.module as string)

  return {
    props: {course},
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const courses = await getAllCourses()
  const paths = courses.map((course: any) => ({
    params: {module: course.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

const CoursePage: React.FC<{
  course: SanityDocument
}> = ({course}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY

  return (
    <>
      <div className="flex flex-col flex-grow w-full mx-auto mb-32">
        <div className="grid w-full max-w-screen-lg grid-cols-5 gap-4 m-auto my-20">
          <div className="col-span-3">
            <h1 className="mx-auto mb-12 text-2xl font-black tracking-tight lg:text-6xl">
              {course && course.title}
            </h1>
            <span className="w-full mt-5 prose prose-lg prose-p:my-12 max-w-none prose-a:text-blue-400 prose-headings:font-heading prose-h2:text-xl prose-h2:font-extrabold">
              <PortableText value={course.body} />
            </span>
          </div>

          <div className="flex flex-col items-center justify-start col-span-2 mb-4 md:col-span-2 md:mb-0">
            <Image
              src={course.image}
              alt="image"
              width={300}
              height={300}
              quality={100}
            />
            <h1 className="m-4 mx-auto text-2xl font-black tracking-tight lg:text-3xl">
              Secciones
            </h1>
            <div>
              {course.modules &&
                course.modules.map((resource: any) => (
                  <div>
                    <h2 className='className="p-3 py-4 mx-auto mb-2 text-2xl font-bold text-black tracking-bold lg:text-2xl border-rounded'>
                      {resource.moduleTitle}
                    </h2>
                    {resource.lessons && (
                      <ul>
                        {resource.lessons.map((lesson: any) => {
                          return (
                            <li key={lesson.lessonSlug}>
                              <Link
                                href={{
                                  pathname: '/aprende/[module]/[lesson]',
                                  query: {
                                    module: course.slug,
                                    lesson: lesson.lessonSlug,
                                  },
                                }}
                              >
                                <a className="group inline-flex items-center py-2.5 text-lg font-semibold">
                                  <span
                                    className="w-8 font-mono text-xs text-gray-400"
                                    aria-hidden="true"
                                  >
                                    *
                                  </span>
                                  <span className="w-full leading-tight group-hover:underline">
                                    {lesson?.lessonTitle}
                                  </span>
                                </a>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CoursePage
