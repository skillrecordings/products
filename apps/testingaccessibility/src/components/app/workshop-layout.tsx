import * as React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import {Wave} from 'components/images'
import Link from 'next/link'
import {SubscribeToConvertkitForm} from '@skillrecordings/convertkit'

const WorkshopLayout: React.FC<{meta: any}> = ({children, meta}) => {
  const {
    title,
    startDate,
    endDate,
    status,
    formId,
    description,
    displayDate,
    displayTime,
  } = meta
  const draft = status === 'draft' || false
  const upcoming = status === 'upcoming' || true // !draft ? isFuture(date) : true
  const date: any = !draft ? new Date(startDate) : startDate
  const endTime = endDate && new Date(endDate)

  const DisplayDate = () => (
    <time dateTime={JSON.stringify(date)}>
      {displayDate} {displayTime}
    </time>
  )
  return (
    <Layout meta={{title, description}}>
      <div data-workshop-interest>
        <header className="relative px-5 text-white bg-black pb-32 pt-8 flex flex-col items-center justify-center text-center">
          <Link href="/workshops">
            <a className="group text-indigo-100 relative hover:text-white font-normal px-4 py-2 hover:bg-opacity-5 bg-opacity-0 bg-white rounded-full transition-all ease-in-out duration-300 opacity-80 hover:opacity-90 ">
              <span aria-role="img" aria-label="left arrow">
                ←
              </span>{' '}
              All Workshops
            </a>
          </Link>
          <h1 className="max-w-screen-md pt-8 mx-auto text-3xl font-extrabold leading-tight sm:text-4xl lg:text-6xl md:text-5xl">
            {title}
          </h1>
          <div className="pt-8 text-lg">
            {upcoming && !draft ? (
              <div className="group px-5 py-2 rounded-full shadow-xl flex items-center space-x-2 bg-white bg-opacity-5 transition-all ease-in-out duration-150  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <CalendarIcon /> <DisplayDate />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CalendarIcon />
                <DisplayDate />
              </div>
            )}
          </div>
          {upcoming && (
            <div className="-mb-48 mt-16 max-w-screen-md w-full">
              <div className="rounded-3xl p-8 bg-white text-black shadow-xl relative z-20 w-full ">
                <h2 className="text-xl font-bold text-left pb-4 mb-8 border-b border-gray-100">
                  Interested in this workshop?
                </h2>
                <SubscribeToConvertkitForm
                  formId={formId}
                  actionLabel="Join the waitlist"
                  successMessage="Thanks! I'll keep you in the loop on my upcoming workshops."
                />
              </div>
            </div>
          )}
          <div className="absolute bottom-0 h-16 w-full overflow-hidden">
            <Wave
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 z-10 w-full transform scale-150 sm:scale-100"
              focusable="false"
              aria-hidden="true"
            />
          </div>
        </header>
        <main>
          <div className="py-32 mx-auto prose xl:prose-xl lg:prose-lg max-w-screen-sm">
            {children}
          </div>
          {upcoming && (
            <div className=" max-w-screen-md w-full mx-auto">
              <div className="rounded-3xl p-8 bg-white text-black border-4 border-gray-100 relative z-20 w-full">
                <div className="flex sm:flex-row flex-col items-center w-full justify-between pb-4 mb-8 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-left ">
                    Interested in this workshop?
                  </h2>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="text-gray-500" />
                    <DisplayDate />
                  </div>
                </div>
                <SubscribeToConvertkitForm
                  formId={formId}
                  actionLabel="Join the waitlist"
                  successMessage="Thanks! I'll keep you in the loop on my upcoming workshops."
                />
              </div>
            </div>
          )}
        </main>
        <footer>
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
            <div className="flex-shrink-0 pt-16 pb-24 text-center sm:p-6">
              {/* <Share meta={{title: meta.title, slug: meta.slug}} /> */}
            </div>
          </section>
        </footer>
      </div>
    </Layout>
  )
}

const CalendarIcon: React.FC<{className?: string}> = ({className}) => {
  const title = 'calendar'
  return (
    <svg
      className={`w-4 transition-all ease-in-out duration-150 ${className}`}
      height="20"
      width="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g fill="none">
        <path
          d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1zm0 5a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H6z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
    </svg>
  )
}

export default WorkshopLayout
