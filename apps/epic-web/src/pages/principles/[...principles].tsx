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
import {Card, CardContent} from '@skillrecordings/ui'

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
  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Content not found</h1>
      </div>
    )
  }

  return (
    <PrinciplesLayout sections={sections}>
      <div className="prose prose-slate max-w-none dark:prose-invert">
        <h1 className="mb-8 text-4xl font-bold">{content.data.title}</h1>

        {content.type === 'overview' && (
          <>
            <p className="mb-8 text-lg">{content.data.description}</p>
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
                    <p className="mt-2 text-muted-foreground">
                      {section.description}
                    </p>
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
                <Card key={principle.slug}>
                  <CardContent className="pt-6">
                    <Link
                      href={`/principles/${content.data.slug}/${principle.slug}`}
                      className="mb-2 block text-xl font-semibold transition-colors hover:text-primary"
                    >
                      {principle.title}
                    </Link>
                    <p className="mt-2 text-muted-foreground">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {content.data.subsections?.map((subsection: any) => (
                <Card key={subsection.slug}>
                  <CardContent className="pt-6">
                    <Link
                      href={`/principles/${content.data.slug}/${subsection.slug}`}
                      className="mb-2 block text-xl font-semibold transition-colors hover:text-primary"
                    >
                      {subsection.title}
                    </Link>
                    <p className="mt-2 text-muted-foreground">
                      {subsection.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {content.type === 'subsection' && (
          <>
            <p className="mb-8 text-lg">{content.data.description}</p>
            <div className="grid gap-6">
              {content.data.principles?.map((principle: any) => (
                <Card key={principle.slug}>
                  <CardContent className="pt-6">
                    <Link
                      href={`/principles/${content.parentSlug}/${content.data.slug}/${principle.slug}`}
                      className="mb-2 block text-xl font-semibold transition-colors hover:text-primary"
                    >
                      {principle.title}
                    </Link>
                    <p className="mt-2 text-muted-foreground">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {content.type === 'principle' && (
          <>
            <p className="mb-4 text-lg">{content.data.description}</p>
            {content.data.details && (
              <p className="mb-4">{content.data.details}</p>
            )}
            {content.data.examples && content.data.examples.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-4 text-xl font-semibold">Examples</h3>
                <ul className="list-disc space-y-3 pl-5">
                  {content.data.examples.map(
                    (example: string, index: number) => (
                      <li key={index} className="text-muted-foreground">
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
    </PrinciplesLayout>
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
          data: principle,
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
        data: principle,
      },
      sections: allPrinciples.sections,
    },
  }
}
