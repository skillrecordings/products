import * as React from 'react'
import {FunctionComponent} from 'react'
import Layout from 'layouts'
import Link from 'next/link'
import useLoginRequired from 'hooks/use-required-login'
import {usePurchasedBundle} from 'hooks/use-purchased-bundle'
import getBundles from 'utils/get-bundles'
import {Resource, SellableResource} from '@types'
import get from 'lodash/get'
import find from 'lodash/find'
import first from 'lodash/first'
import indexOf from 'lodash/indexOf'
import {useViewer} from 'contexts/viewer-context'
import getCollections from 'utils/get-collections'
import useBundleProgress from 'hooks/use-bundle-progress'
import useRedirectUnclaimedBulkToInvoice from 'hooks/use-redirect-unclaimed-bulk-to-invoice'
import UpgradePurchase from 'components/commerce/upgrade-purchase'
import Module from 'components/learn/module'
import CallToAction from 'components/learn/cta'
import Spinner from 'components/spinner'
import Achievements from 'components/learn/achievements'
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
        className="max-w-screen-lg mx-auto bg-gradient-to-tr border-2 bg-white border-blue-500 shadow-lg rounded-md w-full text-blue-600 dark:text-white md:text-base text-sm z-0 xl:mb-4 mb-0 xl:mt-0 mt-4"
        {...bannerProps}
      /> */}
      <div className="grid sm:grid-cols-12 grid-cols-1 max-w-screen-xl w-full mx-auto pt-16 gap-5 h-full flex-grow">
        <aside className="sm:col-span-3 relative">
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
        <div className="sm:col-span-9 space-y-3">
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
            <div className="flex w-full h-full items-center justify-center bg-gray-100 dark:bg-gray-900 p-10">
              <Spinner />
            </div>
          )}
        </div>
      </div>

      {/* TODO: handle displaying book */}
      {/* <Book chapters={chapters} bookDownloadUrl={bookDownloadUrl} /> */}
      <UpgradePurchase />
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
//     <div className="mt-16 max-w-screen-md w-full grid md:grid-cols-6 grid-cols-1 mx-auto md:pt-0 pt-5 gap-8">
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
//       <div className=" space-y-8 col-span-4">
//         <h3 className="text-3xl font-bold leading-tight">Pure React Book</h3>
//         <a
//           download
//           target="_blank"
//           href={bookDownloadUrl}
//           className="bg-gradient-to-tr leading-tight py-4 px-3 from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transition-all ease-in-out duration-300  text-white dark:text-white shadow-inner rounded-md overflow-hidden inline-flex items-center space-x-2"
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
//                 <a className="hover:shadow-lg hover:bg-white dark:hover:bg-coolGray-900 hover:rounded-md hover:border-transparent hover:text-blue-600 dark:hover:text-blue-400 transition-all ease-in-out duration-150 flex p-3 items-center space-x-3 group border-b dark:border-gray-900 border-gray-100 leading-tight">
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
