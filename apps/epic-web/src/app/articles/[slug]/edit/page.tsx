import {getArticle} from 'lib/articles'
import {notFound} from 'next/navigation'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import readingTime from 'reading-time'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import React from 'react'
import {getServerAuthSession} from 'server/auth'
import {getCurrentAbility} from '@skillrecordings/skill-lesson/utils/ability'

export default async function ArticleEditPage({
  params,
}: {
  params: {slug: string}
}) {
  const session = await getServerAuthSession()
  const ability = getCurrentAbility({user: session?.user})
  const article = await getArticle(params?.slug as string)

  if (!article || !ability.can('create', 'Content')) {
    notFound()
  }

  const articleBodySerialized = await serializeMDX(article.body, {
    syntaxHighlighterOptions: {
      theme: 'material-theme-palenight',
      showCopyButton: true,
    },
  })
  const estimatedReadingTime = readingTime(article.body)

  return (
    <div>
      <h1>Article Edit</h1>
      <main className="invert-svg prose mx-auto w-full max-w-3xl px-5 py-8 dark:prose-invert md:prose-xl prose-code:break-words prose-pre:bg-gray-900 prose-pre:leading-relaxed md:py-16 md:prose-code:break-normal">
        <MDX contents={articleBodySerialized} />
      </main>
    </div>
  )
}
