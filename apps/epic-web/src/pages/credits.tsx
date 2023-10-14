import Layout from 'components/app/layout'
import drop from 'lodash/drop'
import Image from 'next/legacy/image'
import ReactMarkdown from 'react-markdown'
import {team, instructor, description} from 'components/credits'
import cx from 'classnames'
import {XIconTwitter} from 'components/x-icon'
import {HomeIcon} from '@heroicons/react/outline'
import Balancer from 'react-wrap-balancer'
import {useTheme} from 'next-themes'
import React from 'react'

const Credits = () => {
  return (
    <Layout
      meta={{
        title: 'Humans behind Epic Web',
        description,
        ogImage: {url: ''},
      }}
    >
      <main>
        <div>
          <div className="bg-gradient-to-tr from-primary to-indigo-500 text-primary-foreground">
            <Header />
            <div className="mx-auto max-w-screen-lg px-5">
              {instructor && <Instructor />}
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-screen-md flex-col gap-10 py-24 sm:gap-16 lg:gap-24">
            <Team />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Credits

const Team = () => {
  return (
    <>
      {drop(team).map(
        ({name, role, description, image, xHandle, website}, i) => {
          return (
            <article
              key={name}
              className={cx('flex flex-col gap-10 md:flex-row')}
            >
              <div className="flex items-center">
                <Image
                  src={image}
                  alt={name}
                  width={250}
                  height={250}
                  quality={100}
                  className="rounded-lg"
                  placeholder="blur"
                />
              </div>
              <div className="pt-5">
                <h2 className=" text-3xl font-bold">{name}</h2>
                <h3 className="pt-2 font-mono text-xs font-semibold uppercase text-primary">
                  {role}
                </h3>
                {description && (
                  <ReactMarkdown
                    components={{
                      p: ({children, ...props}) => {
                        return (
                          <p {...props}>
                            <Balancer>{children}</Balancer>
                          </p>
                        )
                      },
                    }}
                    className="prose max-w-lg pt-4 dark:prose-invert"
                  >
                    {description}
                  </ReactMarkdown>
                )}
                <div className="mt-5 flex items-center gap-3">
                  {website && (
                    <a
                      href={website}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="flex items-center justify-center gap-1 rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                    >
                      {extractDomainWithPath(website)}
                    </a>
                  )}
                  <a
                    href={`https://twitter.com/${xHandle}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <XIconTwitter className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </article>
          )
        },
      )}
    </>
  )
}

const Instructor = () => {
  return (
    <article className="flex flex-col items-end gap-10 text-center sm:text-left md:flex-row">
      <div className="flex flex-shrink-0 items-center justify-center overflow-hidden">
        {instructor?.image && (
          <Image
            src={instructor.image}
            alt={instructor.name}
            width={450}
            height={450}
            quality={100}
            placeholder="blur"
            priority
          />
        )}
      </div>
      <div className="pb-16">
        <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
          {instructor?.name}
        </h2>
        <h3 className="pt-2 font-mono text-sm font-medium uppercase">
          {instructor?.role}
        </h3>
        {instructor?.description && (
          <ReactMarkdown className="prose prose-invert pt-4 sm:prose-lg">
            {instructor.description}
          </ReactMarkdown>
        )}
        <div className="mt-5 flex items-center gap-3">
          {instructor?.website && (
            <a
              href={instructor.website}
              rel="noopener noreferrer"
              target="_blank"
              className="flex items-center justify-center gap-1 rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            >
              {extractDomainWithPath(instructor.website)}
            </a>
          )}
          {instructor?.xHandle && (
            <a
              href={`https://twitter.com/${instructor.xHandle}`}
              rel="noopener noreferrer"
              target="_blank"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <XIconTwitter className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

const Header = () => {
  const {theme} = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="px-5">
      <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center gap-5 pb-16 pt-16 lg:pt-20">
        <h1 className="w-full text-center text-3xl font-bold sm:text-4xl lg:text-5xl">
          <Balancer>Humans Behind Epic Web</Balancer>
        </h1>
        <div className="max-w-xl pt-3 text-center text-lg leading-relaxed opacity-90">
          <Balancer>
            Bringing Epic Web to you is a collaboration between Kent C. Dodds
            and the team behind{' '}
            <a
              href="https://badass.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              bada**.dev
            </a>
            . Kent created, designed and recorded all the content, while the
            rest of the team provided planning, design, development, and
            delivery support.
          </Balancer>
        </div>

        {mounted ? (
          <a
            href="https://badass.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5"
          >
            <Image
              src={
                theme === 'light'
                  ? require('../../public/credits/badass-badge-censored-light.svg')
                  : require('../../public/credits/badass-badge-censored-dark.svg')
              }
              alt="Powered by Badass.dev"
              width={186 / 1.2}
              height={56 / 1.2}
            />
          </a>
        ) : null}
      </div>
    </header>
  )
}

function extractDomainWithPath(url: string) {
  // Use a regular expression to match the domain along with the path
  const domainMatch = url.match(/:\/\/(www[0-9]?\.)?([^/]+)(\/[^]*)?/)

  if (domainMatch) {
    // Extract the matched domain and path
    const domainWithPath = domainMatch[2] + (domainMatch[3] || '')

    return domainWithPath
  }

  return url // Return the original URL if no domain found
}
