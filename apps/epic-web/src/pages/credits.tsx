import Layout from 'components/app/layout'
import drop from 'lodash/drop'
import Image from 'next/legacy/image'
import ReactMarkdown from 'react-markdown'
import {team, instructor, description} from 'components/credits'
import cx from 'classnames'
import {XIconTwitter} from 'components/x-icon'

const Credits = () => {
  return (
    <Layout
      meta={{
        title: 'Humans behind Epic Web',
        description,
        ogImage: {url: ''},
      }}
      className=" bg-noise"
    >
      <main>
        <Header />
        <div className="mx-auto max-w-screen-lg px-5 pb-24">
          {instructor && <Instructor />}
          <div className="mx-auto flex w-full max-w-screen-md flex-col gap-10 pt-16 sm:grid sm:grid-cols-2 sm:gap-16 lg:gap-24">
            <Team />
          </div>
          <div className="flex items-center justify-center pt-24"></div>
          <div className="flex flex-col gap-10 py-20 lg:flex-row lg:py-32"></div>
        </div>
      </main>
    </Layout>
  )
}

export default Credits

const Team = () => {
  return (
    <>
      {drop(team).map((human, i) => {
        const {name, role, description, image, xHandle} = human

        return (
          <article key={name} className={cx('flex flex-col text-center')}>
            <div className="flex items-center justify-center">
              <Image
                src={image}
                alt={name}
                width={350}
                height={350}
                quality={100}
              />
            </div>
            <div>
              <h2 className=" text-3xl font-bold">{name}</h2>
              <h3 className=" font-medium">{role}</h3>
              {description && (
                <ReactMarkdown className="prose mx-auto max-w-lg pt-4 dark:text-white dark:text-opacity-75">
                  {description}
                </ReactMarkdown>
              )}
              <a
                href={`https://twitter.com/${xHandle}`}
                rel="noopener noreferrer"
                target="_blank"
                className="mt-2 inline-flex items-center space-x-1 rounded-full  border border-gray-700 p-3 font-medium  transition hover:border-gray-600 hover:bg-gray-300 dark:hover:bg-slate-900"
              >
                <XIconTwitter className="h-3 w-3" />
              </a>
            </div>
          </article>
        )
      })}
    </>
  )
}

const Instructor = () => {
  return (
    <article className="flex flex-col items-center gap-10 pb-0 pt-6 text-center sm:pb-16 sm:text-left md:flex-row">
      <div className="flex flex-shrink-0 items-center justify-center overflow-hidden">
        {instructor?.image && (
          <Image
            src={instructor.image}
            alt={instructor.name}
            width={450}
            height={450}
            quality={100}
          />
        )}
      </div>
      <div>
        <h2 className=" text-3xl font-bold sm:text-4xl lg:text-5xl">
          {instructor?.name}
        </h2>
        <h3 className=" pt-2 text-xl font-medium">{instructor?.role}</h3>
        {instructor?.description && (
          <ReactMarkdown className="prose pt-4 sm:prose-lg dark:text-white dark:text-opacity-75">
            {instructor.description}
          </ReactMarkdown>
        )}
        <a
          href={`https://twitter.com/${instructor?.xHandle}`}
          rel="noopener noreferrer"
          target="_blank"
          className="mt-2 inline-flex items-center space-x-1 rounded-full  border border-gray-700 p-3 font-medium  transition hover:border-gray-600 hover:bg-gray-300 dark:hover:bg-slate-900"
        >
          <XIconTwitter className="h-3 w-3" />
        </a>
      </div>
    </article>
  )
}

const Header = () => {
  return (
    <header className="px-5">
      <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center gap-5 pb-16 pt-16 sm:grid  lg:pt-24">
        <h1 className="pb-8 text-center text-4xl font-bold sm:text-left sm:text-5xl lg:text-6xl">
          Humans Behind Epic Web
        </h1>
        <div className="dark:text-opacity-85 prose mx-auto w-full max-w-screen-sm justify-center text-center text-lg sm:prose-xl dark:text-white sm:text-xl">
          <p>
            Bringing Epic Web to you is a collaboration between Kent C. Dodds
            and the team behind{' '}
            <a
              href="https://badass.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              badass.dev
            </a>
            . Kent created, designed and recorded all the content, while the
            rest of the team provided planning, design, development, and
            delivery support.
          </p>
          <p>Meet the people who have made Epic Web possible.</p>
        </div>
      </div>
    </header>
  )
}
