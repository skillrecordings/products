import * as React from 'react'
import {FunctionComponent} from 'react'
import Layout from '../components/app/layout'
import Link from 'next/link'
import useLoginRequired from 'hooks/use-required-login'
import {usePurchasedBundle} from 'hooks/use-purchased-bundle'
import getBundles from 'utils/get-bundles'
import {Resource, SellableResource} from '@skillrecordings/types'
import get from 'lodash/get'
import find from 'lodash/find'
import first from 'lodash/first'
import indexOf from 'lodash/indexOf'
import {useViewer} from '@skillrecordings/viewer'
import getCollections from 'utils/get-collections'
import useBundleProgress from 'hooks/use-bundle-progress'
import useRedirectUnclaimedBulkToInvoice from 'hooks/use-redirect-unclaimed-bulk-to-invoice'
import UpgradePurchase from '@skillrecordings/commerce/dist/components/upgrade-purchase'
import Module from 'components/learn/module'
import CallToAction from 'components/learn/cta'
import Spinner from '@skillrecordings/react/dist/components/spinner'
import Achievements from 'components/learn/achievements'
import {getBundleDescription} from '../utils/get-bundle-metadata'
// import {titlizeChapter} from 'utils/titlizeChapter'
// import {bookFilePaths} from 'utils/mdxUtils'
// import {getModuleImage} from 'utils/get-bundle-metadata'
// import WelcomeBanner from 'components/banners/welcome'

interface Props {
  bundles: SellableResource[]
  chapters: {
    title: string
    slug: string
  }[]
}

const Learn: FunctionComponent<Props> = ({bundles}) => {
  const purchasedBundle = usePurchasedBundle(bundles)
  const isVerifying = useLoginRequired()
  const isVerifyingBulkPurchase = useRedirectUnclaimedBulkToInvoice()
  const {viewer} = useViewer()
  const collections = getCollections()
  const {progress, getModuleProgress} = useBundleProgress(purchasedBundle)
  const modules = get(purchasedBundle, 'items')?.filter((m) => m.duration)
  const legitProgress = progress?.data?.resources?.filter(
    (m: any) => m.lesson_count !== 0,
  )
  const completedModules = modules?.filter(
    (_, i) => legitProgress[i].state === 'completed',
  )
  const sortedModules = modules
    ?.filter((_, i) => legitProgress[i].state !== 'completed')
    .concat(completedModules)

  if (isVerifying || isVerifyingBulkPurchase) {
    return null
  }

  const currentUsersModule = get(viewer, 'current_course', first(modules))
  const {completedLessonsCount, totalLessons, nextLesson} = getModuleProgress(
    currentUsersModule?.slug,
  )

  const currentModule =
    completedLessonsCount === totalLessons
      ? first(
          progress.data.resources.filter((r: any) => r.state !== 'completed'),
        )
      : find(modules, {
          slug: currentUsersModule?.slug,
        })

  const fullCurrentModule = find(modules, {slug: currentModule?.slug})

  // const bookDownloadUrl = purchasedBundle?.items[0]?.url as string | undefined
  // const bannerProps = isEmpty(viewAsEmail)
  //   ? {
  //       text:
  //         " Welcome! Thank you so much for purchasing Pure React. I know you'll love it.",
  //       cta: 'View your Invoice',
  //       path: '/invoice',
  //     }
  //   : {text: ` You are now viewing as ${viewAsEmail}. Logout to reset.`}

  return (
    <Layout>
      {/* TODO: style and enable this welcome banner */}
      {/* <WelcomeBanner
        className="z-0 w-full max-w-screen-lg mx-auto mt-4 mb-0 text-sm text-blue-600 bg-white border-2 border-blue-500 rounded-md shadow-lg bg-gradient-to-tr dark:text-white md:text-base xl:mb-4 xl:mt-0"
        {...bannerProps}
      /> */}
      <div className="grid flex-grow w-full h-full max-w-screen-xl grid-cols-1 gap-5 pt-16 mx-auto sm:grid-cols-12">
        <aside className="relative sm:col-span-3">
          <div className="space-y-3 sm:sticky top-5">
            <CallToAction
              viewer={viewer}
              nextLesson={nextLesson}
              firstLesson={collections[0]?.items[0]}
              currentModule={{
                ...currentModule,
                title: fullCurrentModule?.title,
              }}
              progress={getModuleProgress(currentModule?.slug)}
            />

            <Achievements purchasedBundle={purchasedBundle} />
          </div>
        </aside>
        <div className="space-y-3 sm:col-span-9">
          {sortedModules ? (
            sortedModules.map((module: Resource) => {
              const items: any = get(
                find(
                  collections,
                  (collection) => collection.slug === module.slug,
                ),
                'items',
              )
              const progress = getModuleProgress(module.slug)

              return (
                <Module
                  i={indexOf(modules, module)}
                  resource={module}
                  items={items}
                  progress={progress}
                  key={module.id}
                />
              )
            })
          ) : (
            <div className="flex items-center justify-center w-full h-full p-10 bg-gray-100 dark:bg-gray-900">
              <Spinner />
            </div>
          )}
        </div>
      </div>

      {/* TODO: handle displaying book */}
      {/* <Book chapters={chapters} bookDownloadUrl={bookDownloadUrl} /> */}
      <UpgradePurchase getBundleDescription={getBundleDescription} />
      <div className="flex items-center justify-center w-full pt-16">
        <Link href="/invoice">
          <a>Get your invoice</a>
        </Link>
      </div>
    </Layout>
  )
}

// const Book: React.FC<{chapters: any; bookDownloadUrl: string | undefined}> = ({
//   chapters,
//   bookDownloadUrl,
// }) => {
//   if (!bookDownloadUrl || !chapters) {
//     return null
//   }

//   return (
//     <div className="grid w-full max-w-screen-md grid-cols-1 gap-8 pt-5 mx-auto mt-16 md:grid-cols-6 md:pt-0">
//       <div className="flex items-start justify-center col-span-2">
//         <div className="flex overflow-hidden rounded-lg shadow-xl">
//           <Image
//             src="/pure-react-cover@2x.png"
//             width={235}
//             height={332}
//             quality={100}
//           />
//         </div>
//       </div>
//       <div className="col-span-4 space-y-8 ">
//         <h3 className="text-3xl font-bold leading-tight">Pure React Book</h3>
//         <a
//           download
//           target="_blank"
//           href={bookDownloadUrl}
//           className="inline-flex items-center px-3 py-4 space-x-2 overflow-hidden leading-tight text-white transition-all duration-300 ease-in-out rounded-md shadow-inner bg-gradient-to-tr from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl dark:text-white"
//         >
//           <div className="pr-4 font-medium">
//             Download Pure React{' '}
//             <span className="text-sm text-blue-100">(PDF, epub, mobi)</span>
//           </div>
//         </a>
//         <ul>
//           {chapters.map((chapter: any, i: string) => (
//             <li key={chapter.slug}>
//               <Link href={`/book/${chapter.slug}`}>
//                 <a className="flex items-center p-3 space-x-3 leading-tight transition-all duration-150 ease-in-out border-b border-gray-100 hover:shadow-lg hover:bg-white dark:hover:bg-gray-900 hover:rounded-md hover:border-transparent hover:text-blue-600 dark:hover:text-blue-400 group dark:border-gray-900">
//                   <div className="text-xs text-gray-600 dark:text-gray-400">
//                     {i + 1}
//                   </div>
//                   <div className="text-lg font-semibold ">{chapter.title}</div>
//                 </a>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   )
// }

export const getStaticProps = async () => {
  const bundles = getBundles()
  //   const chapters = bookFilePaths
  //     // Remove file extensions for page paths
  //     .filter((path) => path !== '00-front-matter.mdx')
  //     .map((path) => path.replace(/\.mdx?$/, ''))
  //     // Map the path into the static paths object required by Next.js
  //     .map((slug) => {
  //       return {slug, title: titlizeChapter(slug)}
  //     })
  return {
    props: {
      bundles,
      //  chapters
    },
  }
}

export default Learn
