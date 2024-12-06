import {GetStaticProps} from 'next'
import {BookOpen} from 'lucide-react'
import Link from 'next/link'
import {PrinciplesLayout} from 'templates/principles-layout'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@skillrecordings/ui'
import {getPrinciples} from 'lib/principles'
import Layout from 'components/app/layout'
import Image from 'next/image'

export default function PrinciplesIndex({principles}: {principles: any}) {
  return (
    <Layout
      withFooter={false}
      withContentNav={false}
      meta={{
        titleAppendSiteName: false,
        title: 'Epic Programming Principles',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1733313122/principles-card_2x.jpg',
          alt: 'Programming Principles',
        },
      }}
    >
      <PrinciplesLayout sections={principles.sections}>
        <div className="mb-8 flex items-center gap-3 pt-8 sm:pt-0">
          <h1 className="text-4xl font-extrabold tracking-tighter md:text-5xl">
            {principles.title}
          </h1>
        </div>

        <div className="prose mb-5 max-w-none dark:prose-invert sm:prose-lg dark:prose-p:text-gray-300 sm:mb-12">
          <p>{principles.description}</p>
        </div>
        <PrinciplesCheatSheetBanner />
        <div className="grid gap-6">
          {principles.sections.map((section: any) => (
            <Card key={section.slug} className="">
              <CardHeader className="pb-3">
                <Link
                  href={`/principles/${section.slug}`}
                  className="transition hover:text-primary"
                >
                  <CardTitle className="text-2xl font-bold tracking-tight transition-colors sm:text-3xl">
                    {section.title}
                  </CardTitle>
                </Link>
              </CardHeader>
              <CardContent>
                <p className="mb-5 font-medium sm:text-lg">
                  {section.description}
                </p>
                {section.principles && section.principles.length > 0 && (
                  <ul className="grid divide-y divide-border/50">
                    {section.principles.map((principle: any) => (
                      <li key={principle.slug} className="flex w-full">
                        <Link
                          className="w-full px-0 py-2 text-lg text-primary brightness-100 transition duration-200 ease-in-out hover:bg-primary/5 hover:text-primary dark:brightness-150 sm:px-3"
                          href={`/principles/${section.slug}/${principle.slug}`}
                        >
                          {principle.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {section.subsections && section.subsections.length > 0 && (
                  <ul className="divide-y divide-border/50">
                    {section.subsections.map((subsection: any) => (
                      <li
                        className="flex w-full flex-col"
                        key={subsection.slug}
                      >
                        <Link
                          href={`/principles/${section.slug}/${subsection.slug}`}
                          className="w-full border-b border-border/50 px-0 py-2 text-lg font-bold text-primary brightness-100 transition duration-200 ease-in-out hover:bg-primary/5 hover:text-primary dark:brightness-150 sm:px-3"
                        >
                          {subsection.title}
                        </Link>
                        <ul className="divide-y divide-border/50">
                          {subsection.principles.map((principle: any) => (
                            <li className="flex w-full" key={principle.slug}>
                              <Link
                                href={`/principles/${section.slug}/${subsection.slug}/${principle.slug}`}
                                className="w-full py-2 pl-5 text-lg text-primary brightness-100 transition duration-200 ease-in-out hover:bg-primary/5 hover:text-primary dark:brightness-150 sm:px-3 sm:pl-8"
                              >
                                {principle.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </PrinciplesLayout>
    </Layout>
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

const PrinciplesCheatSheetBanner = () => {
  return (
    <Link
      href="/principles/cheatsheet"
      className="group mb-6 flex w-full flex-col-reverse items-center justify-between overflow-hidden rounded-lg border border-gray-300 bg-gray-100 dark:border-primary/10 dark:bg-primary/5 lg:flex-row"
    >
      <div className="flex w-full flex-col px-6 py-4 lg:block lg:px-10">
        <h2 className="text-xl font-bold tracking-tight transition group-hover:text-primary dark:group-hover:brightness-150 sm:text-2xl">
          Printable Cheat Sheet
        </h2>
        <p className="mb-5 opacity-75">Perfect for your office space.</p>
        <Button asChild>
          <div>Free Download</div>
        </Button>
      </div>
      <div className="relative aspect-[321/112] w-full lg:aspect-[173/112] lg:max-w-[300px]">
        <Image
          src={
            'https://res.cloudinary.com/epic-web/image/upload/v1733476754/principles-cheatsheet-thumb_2x.jpg'
          }
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute bottom-2 right-2 rounded border border-amber-200 bg-amber-300 px-1.5 py-1 text-sm font-semibold uppercase leading-none text-amber-800 shadow-lg">
          PDF
        </div>
      </div>
    </Link>
  )
}
