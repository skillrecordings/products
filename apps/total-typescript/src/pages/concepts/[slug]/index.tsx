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

export const getStaticProps: GetStaticProps = async ({params}) => {
  const concept = await getConcept(params?.slug as string)

  const {data, content} = matter(concept?.body || '')
  const conceptBodySerialized = await serializeMDX(content, {
    scope: data,
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
      meta={{
        title: concept.title,
        ogImage,
      }}
      className="bg-black/40"
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
        <div className="prose relative z-10 mx-auto w-full max-w-3xl px-5 sm:prose-lg md:prose-xl prose-p:text-gray-300 prose-a:text-cyan-300 prose-a:transition prose-pre:bg-gray-700 hover:prose-a:text-cyan-200 sm:prose-pre:-mx-5">
          <MDX contents={conceptBodySerialized} />
        </div>
        <section className="relative z-10 overflow-hidden px-5 pb-24">
          <Share title={concept.title} contentType="TypeScript Concept" />
          {!subscriber && !loadingSubscriber && <ArticleNewsletterCta />}
        </section>
      </main>
    </Layout>
  )
}
