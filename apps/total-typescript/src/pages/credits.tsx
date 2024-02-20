import Layout from '@/components/app/layout'
import drop from 'lodash/drop'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import {team, instructor, description} from '@/components/credits'
import cx from 'classnames'
import Balancer from 'react-wrap-balancer'
import {Icon} from '@skillrecordings/skill-lesson/icons'

const Credits = () => {
  return (
    <Layout
      meta={{
        title: `Humans behind ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
        description,
        ogImage: {url: 'https://totaltypescript.com/credits/card@2x.png'},
      }}
    >
      <main>
        <Header />
        <div className="mx-auto w-full max-w-screen-xl">
          {instructor && <Instructor />}
          <div className="mx-auto grid auto-cols-max auto-rows-fr grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
            <Team />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Credits

const Instructor = () => {
  return (
    <article className="mx-auto flex w-full grid-cols-2 flex-col items-center bg-gray-800 md:grid">
      {instructor?.image && (
        <div className="relative aspect-square h-full w-full mix-blend-screen md:aspect-auto">
          <Image
            src={instructor.image}
            alt={instructor.name}
            // width={380}
            // height={380}
            placeholder="blur"
            quality={100}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="px-10 py-24">
        <h2 className="font-text text-5xl font-bold">{instructor?.name}</h2>
        <h3 className="text-lg text-cyan-300">{instructor?.role}</h3>
        {instructor?.description && (
          <Balancer>
            <ReactMarkdown className="prose pt-5 sm:prose-lg prose-p:text-gray-200">
              {instructor.description}
            </ReactMarkdown>
          </Balancer>
        )}
        {instructor?.twitter && (
          <a
            href={`https://twitter.com/${instructor.twitter}`}
            rel="noopener noreferrer"
            target="_blank"
            className="font-display mt-5 inline-flex items-center space-x-1 rounded-full border border-gray-700 p-3 font-medium text-gray-300 transition hover:border-gray-600 hover:text-cyan-300 hover:underline"
          >
            <Icon name="Twitter" />
            <span className="sr-only">{instructor?.name}'s Twitter</span>
          </a>
        )}
      </div>
    </article>
  )
}

const Team = () => {
  return (
    <>
      {drop(team).map((human, i) => {
        const {name, role, description, image, twitter} = human

        return (
          <article
            key={name}
            className="group flex w-full flex-col items-center border border-gray-800 transition hover:bg-gray-800/50 sm:flex-row"
          >
            <div className="relative aspect-square h-full w-full sm:aspect-auto">
              <Image
                className="object-cover mix-blend-screen transition group-hover:saturate-100 sm:saturate-0"
                src={image}
                alt={name}
                fill
                placeholder="blur"
                quality={100}
              />
            </div>
            <div className="w-full p-8">
              <h2 className="font-heading text-3xl font-bold">{name}</h2>
              <h3 className="font-medium text-cyan-300">{role}</h3>
              {description && (
                <Balancer>
                  <ReactMarkdown className="prose pt-3 leading-normal prose-p:text-gray-300">
                    {description}
                  </ReactMarkdown>
                </Balancer>
              )}
              {twitter && (
                <a
                  href={`https://twitter.com/${twitter}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="font-display mt-2 inline-flex items-center space-x-1 rounded-full border border-gray-700 p-3 font-medium text-gray-300 transition hover:border-gray-600 hover:text-cyan-300 hover:underline"
                >
                  <Icon name="Twitter" />
                  <span className="sr-only">{name}'s Twitter</span>
                </a>
              )}
            </div>
          </article>
        )
      })}
    </>
  )
}

const Header = () => {
  return (
    <header className="mx-auto flex w-full max-w-screen-xl flex-col justify-between px-5 pb-16 pt-32 sm:flex-row sm:pb-32 sm:pt-48">
      <h1 className="w-full pb-10 font-heading text-5xl font-semibold text-gray-100 sm:text-6xl">
        <Balancer>Humans behind Total TypeScript</Balancer>
      </h1>
      <div className="prose max-w-xl sm:prose-xl prose-p:text-gray-300">
        <p>
          Bringing Total TypeScript to you is a collaboration between Matt
          Pocock and the team behind{' '}
          <a
            href="https://badass.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            badass.dev
          </a>
          . Matt created the content, while the rest of the team provided
          planning, design, development, and delivery support.
        </p>
        <p>Meet the people who have made Total TypeScript possible.</p>
      </div>
    </header>
  )
}
