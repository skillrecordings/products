import matter from 'gray-matter'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Concept, getAllConcepts, getConcept} from '@/lib/concepts'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import Layout from '@/components/app/layout'
import Share from '@/components/share'
import {ArticleNewsletterCta} from '@/components/primary-newsletter-cta'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import Link from 'next/link'
import {getOgImage} from '@/utils/get-og-image'
import '@/styles/shiki-twoslash.css'
import {linkedHeadingComponents} from '@/components/mdx'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const concept = await getConcept(params?.slug as string)

  if (!concept) {
    return {
      notFound: true,
    }
  }

  const {data, content} = matter(concept?.body || '')
  const conceptBodySerialized = await serializeMDX(content, {
    scope: data,
    useShikiTwoslash: true,
    syntaxHighlighterOptions: {
      theme: 'dark-plus',
      authorization: process.env.SHIKI_AUTH_TOKEN,
      endpoint: process.env.SHIKI_ENDPOINT,
    },
  })

  return {
    props: {
      concept,
      conceptBodySerialized,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const concepts = await getAllConcepts()
  const paths = concepts.map((concept: Concept) => ({
    params: {slug: concept.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

export default function TipPage({
  concept,
  conceptBodySerialized,
}: {
  concept: Concept
  conceptBodySerialized: MDXRemoteSerializeResult
}) {
  const {subscriber, loadingSubscriber} = useConvertkit()
  const ogImage = getOgImage({title: concept.title})
  return (
    <Layout
      className="min-h-full"
      meta={{
        title: concept.title,
        ogImage,
      }}
    >
      <header className="relative z-10 mx-auto flex w-full max-w-3xl flex-col justify-center px-5 pb-8 pt-24 sm:pb-10 sm:pt-32">
        <Link
          href={'/concepts'}
          className="mb-5 inline-flex text-sm text-gray-400 transition hover:text-white sm:text-base"
        >
          ← Concepts
        </Link>
        <div className="relative z-10 flex w-full flex-col">
          <h1 className="inline-flex w-full max-w-2xl items-baseline font-text text-4xl font-bold sm:text-5xl">
            {concept.title}
          </h1>
        </div>
      </header>
      <main className="relative z-10 pt-5">
        <div className="prose relative z-10 mx-auto w-full max-w-3xl px-5 sm:prose-lg md:prose-xl prose-p:text-gray-300 prose-a:text-cyan-300 prose-a:transition hover:prose-a:text-cyan-200">
          <MDX
            contents={conceptBodySerialized}
            components={{
              ...linkedHeadingComponents,
            }}
          />
        </div>
        <section className="relative z-10 -mb-16 overflow-hidden pb-0 sm:mb-0">
          <div className="py-10">
            <Share title={concept.title} contentType="TypeScript Concept" />
          </div>
          {!subscriber && !loadingSubscriber && (
            <div className="w-full bg-white/5 px-5 pb-20 sm:mb-0">
              <ArticleNewsletterCta />
            </div>
          )}
        </section>
      </main>
    </Layout>
  )
}
