// nextjs get static props
import matter from 'gray-matter'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Concept, getAllConcepts, getConcept} from '@/lib/concepts'
import {getAllTips} from '@/lib/tips'
import {serialize} from 'next-mdx-remote/serialize'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import Layout from '@/components/app/layout'
import Share from '@/components/share'
import {ArticleNewsletterCta} from '@/components/primary-newsletter-cta'
import {ArticleTeaser} from '@/pages/articles'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const concept = await getConcept(params?.slug as string)

  const {data, content} = matter(concept?.body || '')
  const conceptBodySerialized = await serialize(content, {scope: data})

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
  return (
    <Layout
      meta={{
        title: concept.title,
        ogImage: {
          url: `${process.env.NEXT_PUBLIC_URL}/api/og?title=${encodeURI(
            concept.title,
          )}`,
          alt: concept.title,
        },
      }}
      className="bg-black/40"
    >
      <header className="relative z-10 flex w-full flex-col items-center justify-center px-5 pb-8 pt-24 sm:pb-10 sm:pt-36">
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col">
          <h1 className="inline-flex w-full max-w-2xl items-baseline text-3xl font-bold lg:text-4xl">
            {concept.title}
          </h1>
        </div>
      </header>
      <main className="relative z-10 pt-5">
        <div className="prose relative z-10 mx-auto w-full max-w-3xl px-5 sm:prose-lg md:prose-xl prose-p:text-gray-300 prose-a:text-cyan-300 prose-a:transition hover:prose-a:text-cyan-200 sm:prose-pre:-mx-5">
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
