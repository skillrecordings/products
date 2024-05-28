import React from 'react'
import {motion} from 'framer-motion'
import Party from '@/components/party'
import {get, findIndex, flatten, map, find} from 'lodash'

import Link from 'next/link'
import {trpc} from '@/trpc/trpc.client'
import {GetStaticPaths, GetServerSideProps} from 'next/types'
import {getAllWorkshops, getWorkshop} from '@/lib/workshops'
import {getAllBonuses} from '@/lib/bonuses'
import Layout from '@/components/app/layout'
import {getToken} from 'next-auth/jwt'
import {getModuleProgress} from '@skillrecordings/skill-lesson/lib/module-progress'
import ModuleCertificate from '@/certificate/module-certificate'
import {MODULES_WITH_NO_CERTIFICATE} from '@/pages/learn'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {params, req} = context
  const token = await getToken({req})

  const moduleSlug = params?.module as string
  const allModules = await getAllWorkshops()
  const module = find(
    allModules,
    (module) => module.slug.current === moduleSlug,
  )
  const moduleIndex = findIndex(allModules, (module, i) => {
    return module.slug.current === moduleSlug
  })
  const nextModule = allModules[moduleIndex + 1]

  const moduleWithSectionsAndLessons = {
    ...module,
    useResourcesInsteadOfSections: true,
  }
  if (!token?.sub || !module?.slug.current) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const {moduleCompleted, nextLesson} = await getModuleProgress({
    moduleSlug: module?.slug.current,
    userId: token.sub,
  })

  if (!moduleCompleted) {
    return {
      redirect: {
        destination: `/modules/${module?.slug.current}/${nextLesson?.slug}`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      module: moduleWithSectionsAndLessons,
      nextModule,
    },
  }
}

const CompletedPage: React.FC<any> = ({module, nextModule}) => {
  return (
    <>
      <Layout
        meta={{
          title: `Congratulations on completing ${module.title}!`,
        }}
        className="justify-center"
      >
        <Party />
        <div className="flex w-full items-center justify-center p-8 pt-20 text-text sm:pt-0 lg:p-0">
          <div className="mx-auto grid max-w-screen-lg grid-cols-1 items-center justify-center gap-16 md:grid-cols-5">
            <motion.div
              initial={{scale: 0.6}}
              animate={{scale: 1}}
              transition={{
                duration: 1.6,
                type: 'spring',
                mass: 1.5,
                stiffness: 20,
              }}
              className="relative col-span-1 mx-auto flex h-64 w-64 items-center justify-center overflow-hidden rounded-full bg-gray-100 p-16 md:col-span-2 lg:h-80 lg:w-80"
            >
              <motion.img
                initial={{y: 300}}
                animate={{y: 0}}
                transition={{
                  duration: 2.5,
                  type: 'spring',
                  mass: 1.8,
                  stiffness: 50,
                }}
                src={
                  module
                    ? module?.image ||
                      'https://p-ZmFjNlQ.b3.n0.cdn.getcloudapp.com/items/DOuAzNP9/ER_Build4_Launch@2x.png'
                    : 'https://p-ZmFjNlQ.b3.n0.cdn.getcloudapp.com/items/DOuAzNP9/ER_Build4_Launch@2x.png'
                }
              />
            </motion.div>
            <div className="flex flex-col items-center md:col-span-3 md:items-start">
              <h1 className="mb-4 inline-flex max-w-lg items-center text-2xl font-semibold leading-tight sm:text-4xl">
                <motion.svg
                  className="mr-2 text-indigo-500"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  initial={{scale: 0}}
                  animate={{scale: 1}}
                  transition={{duration: 4, type: 'spring'}}
                >
                  {/* <g fill="none" fillRule="evenodd"> */}
                  <circle cx="16" cy="16" r="16" fill="#6875F5" />
                  <motion.path
                    initial={{pathLength: 0}}
                    animate={{pathLength: 1}}
                    transition={{duration: 1, ease: 'easeOut'}}
                    stroke="#FFF"
                    fill="none"
                    strokeDasharray="0 1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M8 16 13 21 24 11"
                  />
                  {/* </g> */}
                </motion.svg>
                Great work!
              </h1>
              {module && (
                <p className="mb-8 text-center text-base text-er-gray-600 sm:text-lg md:text-left">
                  You&apos;ve completed {module.title} workshop.
                </p>
              )}
              {module &&
                !MODULES_WITH_NO_CERTIFICATE.includes(module.slug.current) && (
                  <ModuleCertificate module={module} />
                )}
              {module && <div className="mt-4 h-px w-full bg-er-gray-200" />}
              {/* {nextLesson && (
                <Link
                  className="mt-10 px-4 py-3 md:px-5 md:py-4 md:text-base inline-flex items-center font-semibold text-sm border border-transparent leading-6 rounded-md text-white bg-indigo-600 hover:bg-indigo-500 transition-colors ease-in-out duration-150"
                  to={nextLesson.path}
                >
                  Continue to next module
                  <svg className="ml-2 text-indigo-200" width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
                </Link>
              )} */}
              {nextModule && (
                <Link
                  className="mt-10 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-semibold leading-6 text-white transition-colors duration-150 ease-in-out hover:bg-indigo-500 md:px-5 md:py-4 md:text-base"
                  href={`/modules/${nextModule.slug.current}/${nextModule.resources[0].slug}`}
                >
                  Continue to {nextModule.title}
                  {/* prettier-ignore */}
                  <svg className="ml-2 text-indigo-200" width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default CompletedPage
