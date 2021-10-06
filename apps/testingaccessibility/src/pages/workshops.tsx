import * as React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import Markdown from 'react-markdown'
import {useConvertkit} from '@skillrecordings/convertkit'
import {Wave} from 'components/images'
import {useRouter} from 'next/router'
import {workshops, otherWorkshops} from 'components/content/workshops'
import {format, parseISO} from 'date-fns'

const Workshops: React.FC<{meta: any}> = () => {
  const {subscriber} = useConvertkit()
  const router = useRouter()
  return (
    <Layout meta={{title: 'Upcoming Workshops'}}>
      <article>
        <header className="relative px-5 overflow-hidden text-white bg-black">
          <h1 className="max-w-screen-md py-16 mx-auto text-3xl font-extrabold leading-tight text-center sm:text-4xl lg:text-6xl md:text-5xl">
            Upcoming Workshops
          </h1>
          <div className="flex items-center justify-center max-w-screen-lg mx-auto">
            <Image
              src={'/assets/workshops@2x.png'}
              alt={'Upcoming workshops'}
              width={960}
              height={540}
              quality={100}
              priority={true}
            />
          </div>
          <Wave
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 z-10 w-full transform scale-150 sm:scale-100 text-gray-50"
            focusable="false"
            aria-hidden="true"
          />
        </header>
        <main className="bg-gray-50 px-5">
          <div className="py-16 mx-auto max-w-screen-lg w-full">
            <h2 className="font-mono uppercase text-sm font-semibold pb-8">
              Testing Accessibility Workshop Series
            </h2>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">
              {workshops.map((workshop) => {
                return <WorkshopItem workshop={workshop} />
              })}
            </div>
            <h2 className="font-mono uppercase text-sm font-semibold pb-8 pt-16">
              Other Workshops
            </h2>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-8">
              {otherWorkshops.map((workshop) => {
                return <WorkshopItem workshop={workshop} />
              })}
            </div>
          </div>
        </main>
        <footer>
          {/* {!subscriber && (
            <div className="relative overflow-hidden">
              <SubscribeToConvertkitForm
                onSuccess={(subscriber: any) => {
                  if (subscriber) {
                    const redirectUrl = redirectUrlBuilder(
                      subscriber,
                      '/confirm',
                    )
                    router.push(redirectUrl)
                  }
                }}
                actionLabel="Start Testing Accessibility →"
              />
              <Wave
                preserveAspectRatio="none"
                height={12}
                className="absolute bottom-0 left-0 w-full transform scale-150 sm:scale-100"
                focusable="false"
                aria-hidden="true"
              />
            </div>
          )} */}
          <section className="flex flex-col items-center max-w-screen-lg py-24 mx-auto md:flex-row md:space-x-16">
            <div className="flex flex-col items-center py-16 space-y-4 text-center sm:py-24 sm:flex-row sm:items-start sm:text-left sm:space-x-8 sm:space-y-0">
              <div className="flex-shrink-0">
                <Image
                  className="rounded-full"
                  src={'/marcy-sutton.jpg'}
                  width={120}
                  height={120}
                  quality={100}
                  alt="smiling Marcy Sutton holding a cat and standing next to a microphone"
                />
              </div>
              <div>
                <div className="opacity-80">Instructor</div>
                <div className="text-3xl font-bold">Marcy Sutton</div>
                <p className="mt-2 text-xl leading-relaxed">
                  Marcy is an award-winning accessibility specialist and
                  freelance web developer.
                </p>
              </div>
            </div>
          </section>
        </footer>
      </article>
    </Layout>
  )
}

const WorkshopItem = ({workshop}: any) => {
  const {
    title,
    description,
    url,
    startDate: startDate_,
    endDate: endDate_,
    draft,
  } = workshop
  const startDate = new Date(startDate_)
  const endDate = endDate_ && new Date(endDate_)

  const DisplayDate = () =>
    parseISO(startDate_).getDate() ? (
      <time dateTime={JSON.stringify(startDate)}>
        {format(startDate, `MMMM do, y, h:mmb ${!endDate ? '(O)' : ''}`)}
        {endDate && `—${format(endDate, 'h:mmb (O)')}`}
      </time>
    ) : (
      startDate_
    )
  const WorkshopTitle = () => (
    <h3 className="sm:text-3xl text-2xl font-bold">{title}</h3>
  )
  const getTitle = (url: any) =>
    url ? (
      <Link href={url} passHref>
        <a className="hover:underline hover:text-indigo-500">
          <WorkshopTitle />
        </a>
      </Link>
    ) : (
      <WorkshopTitle />
    )
  return (
    <article
      className={`p-10 ${url ? 'pb-10' : 'pb-4'} bg-white shadow-sm rounded-lg`}
    >
      {getTitle(url)}
      <div className="pt-3 opacity-90 font-semibold">
        <DisplayDate />
      </div>
      <Markdown className="prose sm:prose-lg pt-3 pb-6">{description}</Markdown>
      {url && (
        <Link href={url} passHref>
          <a className="px-5 py-3 rounded-full bg-indigo-500 text-white  font-semibold inline-flex">
            View more and sign-up →
          </a>
        </Link>
      )}
    </article>
  )
}

export default Workshops
