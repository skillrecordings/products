import Layout from 'components/app/layout'
import drop from 'lodash/drop'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import {TwitterIcon} from './welcome'
import {
  team,
  instructor,
  description,
  contentReviewTeam,
} from 'components/content/credits'
import cx from 'classnames'

const Credits = () => {
  return (
    <Layout
      meta={{
        title: 'Humans behind Testing Accessibility',
        description,
        ogImage: {url: 'https://testingaccessibility.com/credits/card@2x.png'},
      }}
      className="bg-sand-50 text-green-800 bg-noise"
    >
      <main>
        <Header />
        <div className="max-w-screen-lg mx-auto px-5 pb-24">
          {instructor && <Instructor />}
          <div className="grid sm:grid-cols-2 lg:gap-24 sm:gap-16 gap-10 max-w-screen-md w-full pt-16 mx-auto">
            <Team />
          </div>
          <div className="flex items-center justify-center pt-24">
            <Image
              src={require('../../public/assets/divider-topography-1.png')}
              alt=""
              aria-hidden="true"
              width={571 / 1.3}
              height={102 / 1.3}
              quality={100}
            />
          </div>
          <div className="flex lg:flex-row flex-col gap-10 lg:py-32 py-20">
            <ContentReviewTeam />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Credits

const ContentReviewTeam = () => {
  return (
    <>
      <div className="lg:max-w-sm max-w-screen-md mx-auto w-full sm:text-left text-center">
        <h2 className="text-4xl font-heading font-bold">
          Content Review and Production Team
        </h2>
        <p className="pt-4 font-display prose max-w-none">
          Alana, Megan, Lucas, and Cree did UX testing on the workshop modules
          to identify and fix quality issues ahead of the launch and updated
          content assets such as images and code blocks.
        </p>
      </div>
      <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 text-center w-full">
        {contentReviewTeam.map((human, i) => {
          const {name, image, twitter} = human
          return (
            <article key={name} className="flex flex-col">
              <div className="flex items-center justify-center drop-shadow-md">
                <Image
                  className="rounded-full"
                  src={image}
                  alt={name}
                  width={140}
                  height={140}
                  placeholder="blur"
                  quality={100}
                />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold pt-4 leading-tight">
                  {name}
                </h1>
                {twitter && (
                  <a
                    href={`https://twitter.com/${twitter}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="hover:underline inline-flex font-display font-medium items-center space-x-1 mt-2 text-green-600"
                  >
                    <TwitterIcon />
                    <span>
                      <span className="sr-only">{name} on </span>
                      Twitter
                    </span>
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

const Team = () => {
  return (
    <>
      {drop(team).map((human, i) => {
        const {name, role, description, image, twitter} = human
        const isLast = team.length - 2 === i

        return (
          <article
            key={name}
            className={cx('flex flex-col text-center', {
              'col-span-2': isLast,
            })}
          >
            <div className="flex items-center justify-center drop-shadow-lg">
              <Image
                className="rounded-full"
                src={image}
                alt={name}
                width={150}
                height={150}
                placeholder="blur"
                quality={100}
              />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold pt-4">{name}</h1>
              <h2 className="text-sand-600 font-medium">{role}</h2>
              {description && (
                <ReactMarkdown className="prose font-display pt-4 max-w-lg mx-auto">
                  {description}
                </ReactMarkdown>
              )}
              <a
                href={`https://twitter.com/${twitter}`}
                rel="noopener noreferrer"
                target="_blank"
                className="hover:underline inline-flex font-display font-medium items-center space-x-1 mt-2 text-green-600"
              >
                <TwitterIcon />
                <span>
                  <span className="sr-only">{name} on </span>
                  Twitter
                </span>
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
    <article className="flex md:flex-row flex-col items-center gap-10 sm:pb-16 pb-0 sm:text-left text-center">
      <div className="-rotate-6 flex items-center justify-center flex-shrink-0 rounded-full overflow-hidden">
        {instructor?.image && (
          <Image
            src={instructor.image}
            alt={instructor.name}
            width={250}
            height={250}
            placeholder="blur"
            quality={100}
          />
        )}
      </div>
      <div>
        <h1 className="font-heading lg:text-5xl sm:text-4xl text-3xl font-bold">
          {instructor?.name}
        </h1>
        <h2 className="font-medium text-xl pt-2 text-sand-600">
          {instructor?.role}
        </h2>
        {instructor?.description && (
          <ReactMarkdown className="prose sm:prose-lg font-display pt-4">
            {instructor.description}
          </ReactMarkdown>
        )}
        <a
          href={`https://twitter.com/${instructor?.twitter}`}
          rel="noopener noreferrer"
          target="_blank"
          className="hover:underline inline-flex font-display font-medium items-center space-x-1 mt-2 text-green-600"
        >
          <TwitterIcon />
          <span>Twitter</span>
        </a>
      </div>
    </article>
  )
}

const Header = () => {
  return (
    <header className="px-5">
      <div className="max-w-screen-lg sm:grid lg:grid-cols-3 mx-auto w-full pb-16 lg:pt-24 pt-16 justify-center gap-5">
        <h1 className="font-heading lg:text-6xl sm:text-5xl text-4xl font-bold col-span-2 sm:text-left text-center">
          Humans behind Testing Accessibility
        </h1>
        <div className="text-sand-700 text-lg font-display leading-relaxed sm:max-w-screen-md sm:pt-0 pt-8">
          <p>
            Bringing Testing Accessibility to you is a collaboration between
            Marcy Sutton and the team behind{' '}
            <a
              className="underline"
              href="https://egghead.io"
              rel="noopener noreferrer"
              target="_blank"
            >
              egghead.io
            </a>
            . Marcy created the content, while the rest of the team provided
            planning, design, development, and delivery support.
          </p>
          <p className="pt-4">
            Meet the people who have made Testing Accessibility possible.
          </p>
        </div>
      </div>
    </header>
  )
}
