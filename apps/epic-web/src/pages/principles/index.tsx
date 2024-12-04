import {GetStaticProps} from 'next'
import {BookOpen} from 'lucide-react'
import Link from 'next/link'
import {PrinciplesLayout} from 'templates/principles-layout'
import {Card, CardContent, CardHeader, CardTitle} from '@skillrecordings/ui'
import {getPrinciples} from 'lib/principles'

export default function PrinciplesIndex({principles}: {principles: any}) {
  return (
    <PrinciplesLayout sections={principles.sections}>
      <div className="mb-8 flex items-center gap-3">
        <BookOpen className="h-10 w-10" />
        <h1 className="text-4xl font-bold">{principles.title}</h1>
      </div>

      <div className="prose prose-slate mb-12 max-w-none dark:prose-invert">
        <p className="text-lg">{principles.description}</p>
      </div>

      <div className="grid gap-6">
        {principles.sections.map((section: any) => (
          <Card key={section.slug} className="group">
            <CardHeader>
              <Link
                href={`/principles/${section.slug}`}
                className="transition-colors hover:text-primary"
              >
                <CardTitle className="text-2xl transition-colors group-hover:text-primary">
                  {section.title}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                {section.description}
              </p>
              {section.principles && section.principles.length > 0 && (
                <div className="grid gap-2">
                  {section.principles.map((principle: any) => (
                    <Link
                      key={principle.slug}
                      href={`/principles/${section.slug}/${principle.slug}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {principle.title}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </PrinciplesLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const principles = getPrinciples()

  return {
    props: {
      principles,
    },
  }
}
