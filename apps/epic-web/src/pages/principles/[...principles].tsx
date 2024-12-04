import {GetStaticPaths, GetStaticProps} from 'next'
import {
  getAllPaths,
  getPrinciples,
  getSection,
  getSubsection,
  getPrinciple,
} from '../../lib/principles'
import {PrinciplesLayout} from '../../templates/principles-layout'

import Link from 'next/link'
import {Button, Card, CardContent, CardFooter} from '@skillrecordings/ui'
import Layout from 'components/app/layout'
import Share from 'components/share'
import {ChevronRight, CircleEllipsis, Menu, X} from 'lucide-react'
import React from 'react'
import {cn} from '@skillrecordings/ui/utils/cn'
import {useRouter} from 'next/router'
import {getOgImage} from 'utils/get-og-image'

interface PrinciplesPageProps {
  content: {
    type: 'overview' | 'section' | 'subsection' | 'principle'
    data: any
    parentSlug?: string
  }
  sections: any[]
}

export default function PrinciplesPage({
  content,
  sections,
}: PrinciplesPageProps) {
  const router = useRouter()

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false)
  }, [router])

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Content not found</h1>
      </div>
    )
  }

  return (
    <Layout
      withFooter={false}
      withContentNav={false}
      meta={{
        titleAppendSiteName: false,
        title: content.data.title || `Epic Web Principles`,

        ogImage: getOgImage({
          title: content.data.title,
        }),
      }}
    >
      {mobileMenuOpen && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 z-50 h-full w-full bg-background/80 backdrop-blur-sm" />
          <Button
            className="fixed right-1 top-1 z-[55] h-16 w-16"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
            }}
            variant={'ghost'}
            size="icon"
          >
            <X size={24} />
          </Button>
        </>
      )}
      <PrinciplesLayout
        asideClassName={cn('', {
          'md:block block fixed left-0 w-full top-0 z-50 pt-0 [&_aside]:sm:w-full h-full [&_aside]:dark:bg-background':
            mobileMenuOpen,
        })}
        sections={sections}
      >
        <div className="-mx-6 mb-8 flex items-center justify-between gap-3 border-b px-6 text-sm md:hidden">
          <div className="flex max-w-[80%] items-center gap-1.5">
            <Link className="truncate text-ellipsis" href="/principles">
              Epic Programming Principles
            </Link>
            <ChevronRight size={14} className="opacity-75" />
            <Link
              className="truncate text-ellipsis"
              href={`/principles/${content.parentSlug}`}
            >
              {content.data.sectionTitle}
            </Link>
            {/* <ChevronRight size={16} />
              <span className='flex'>{content.data.title}</span> */}
          </div>
          <Button
            className="flex flex-shrink-0"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
            }}
            variant={'ghost'}
            size="icon"
          >
            <Menu size={16} />
          </Button>
        </div>

        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
          {content.data.title}
        </h1>
        <div className="prose max-w-none dark:prose-invert sm:prose-lg">
          {content.type === 'overview' && (
            <>
              <p className="mb-8 ">{content.data.description}</p>
              <div className="grid gap-6">
                {content.data.sections.map((section: any) => (
                  <Card key={section.slug}>
                    <CardContent className="pt-6">
                      <Link
                        href={`/principles/${section.slug}`}
                        className="mb-2 block text-2xl font-semibold transition-colors hover:text-primary"
                      >
                        {section.title}
                      </Link>
                      <p className="mt-2">{section.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {content.type === 'section' && (
            <>
              <p className="mb-8 text-lg">{content.data.description}</p>
              <div className="grid gap-6">
                {content.data.principles?.map((principle: any) => (
                  <Card key={principle.slug} className="not-prose relative">
                    <CardContent className="pt-7">
                      <div className="flex w-full items-center justify-between">
                        <Link
                          href={`/principles/${content.data.slug}/${principle.slug}`}
                          className="block text-balance text-xl font-semibold text-blue-600 transition-colors hover:underline dark:text-blue-300 sm:text-2xl"
                        >
                          {principle.title}
                        </Link>
                        <div className="relative -translate-y-4 font-mono text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-500">
                          Principle
                        </div>
                      </div>
                      <p className="prose mt-4 dark:prose-invert sm:prose-lg">
                        {principle.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex w-full items-center justify-between">
                      <Link
                        href={`/principles/${content.data.slug}/${principle.slug}`}
                        className="inline-flex items-center gap-1 text-base text-primary hover:underline dark:brightness-150"
                      >
                        Read more <ChevronRight size={13} />
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
                {content.data.subsections?.map((subsection: any) => (
                  <Card key={subsection.slug} className="not-prose">
                    <CardContent className="pt-7">
                      <Link
                        href={`/principles/${content.data.slug}/${subsection.slug}`}
                        className="block text-balance text-xl font-semibold text-blue-600 transition-colors hover:underline dark:text-blue-300 sm:text-2xl"
                      >
                        {subsection.title}
                      </Link>
                      <p className="prose mt-4 dark:prose-invert sm:prose-lg">
                        {subsection.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href={`/principles/${content.data.slug}/${subsection.slug}`}
                        className="inline-flex items-center gap-1 text-base text-primary hover:underline dark:brightness-150"
                      >
                        Read more <ChevronRight size={13} />
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}

          {content.type === 'subsection' && (
            <>
              <p className="mb-8 ">{content.data.description}</p>
              <div className="grid gap-3">
                {content.data.principles?.map((principle: any) => (
                  <Card key={principle.slug} className="not-prose">
                    <CardContent className="pt-7">
                      <div className="flex w-full items-center justify-between">
                        <Link
                          href={`/principles/${content.parentSlug}/${content.data.slug}/${principle.slug}`}
                          className="block text-balance text-xl font-semibold text-blue-600 transition-colors hover:underline dark:text-blue-300 sm:text-2xl"
                        >
                          {principle.title}
                        </Link>
                        <div className="relative -translate-y-4 font-mono text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-500">
                          Principle
                        </div>
                      </div>
                      <p className="prose mt-4 dark:prose-invert sm:prose-lg">
                        {principle.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href={`/principles/${content.parentSlug}/${content.data.slug}/${principle.slug}`}
                        className="inline-flex items-center gap-1 text-base text-primary hover:underline dark:brightness-150"
                      >
                        Read more <ChevronRight size={13} />
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}

          {content.type === 'principle' && (
            <>
              <p className="mb-4 ">{content.data.description}</p>
              {content.data.details && (
                <p className="mb-4">{content.data.details}</p>
              )}
              {content.data.examples && content.data.examples.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-4 text-xl font-semibold">Examples</h3>
                  <ul className="list-disc space-y-3 pl-5">
                    {content.data.examples.map(
                      (example: string, index: number) => (
                        <li key={index} className="">
                          {example}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
        <div className="mt-12">
          <Share
            title={content.data.title}
            contentType="principle"
            withFriends={false}
            className="rounded bg-card dark:bg-card [&_p]:text-base"
          />
        </div>
      </PrinciplesLayout>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPaths()
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const principles = params?.principles as string[]
  const allPrinciples = getPrinciples()

  if (!principles || principles.length === 0) {
    return {
      props: {
        content: {
          type: 'overview',
          data: allPrinciples,
        },
        sections: allPrinciples.sections,
      },
    }
  }

  const [sectionSlug, secondSlug, thirdSlug] = principles
  const section = getSection(sectionSlug)

  if (!section) {
    return {notFound: true}
  }

  if (!secondSlug) {
    return {
      props: {
        content: {
          type: 'section',
          data: section,
        },
        sections: allPrinciples.sections,
      },
    }
  }

  // Check if secondSlug is a subsection
  const subsection = section.subsections?.find((sub) => sub.slug === secondSlug)
  if (subsection) {
    if (!thirdSlug) {
      return {
        props: {
          content: {
            type: 'subsection',
            data: subsection,
            parentSlug: sectionSlug,
          },
          sections: allPrinciples.sections,
        },
      }
    }

    const principle = subsection.principles.find((p) => p.slug === thirdSlug)
    if (!principle) {
      return {notFound: true}
    }

    return {
      props: {
        content: {
          type: 'principle',
          data: {
            ...principle,
            sectionTitle: section.title, // Add section title
          },
          parentSlug: sectionSlug, // Add parent section slug
        },
        sections: allPrinciples.sections,
      },
    }
  }

  // If not a subsection, then secondSlug should be a principle
  const principle = section.principles?.find((p) => p.slug === secondSlug)
  if (!principle) {
    return {notFound: true}
  }

  return {
    props: {
      content: {
        type: 'principle',
        data: {
          ...principle,
          sectionTitle: section.title, // Add section title
        },
        parentSlug: sectionSlug, // Add parent section slug
      },
      sections: allPrinciples.sections,
    },
  }
}
