import React from 'react'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {format} from 'date-fns'
import Layout from 'components/layout'
import Image from 'next/legacy/image'
import {CallToActionForm} from 'components/call-to-action-form'
import {genericCallToActionContent} from '../components/landing-content'
import Balancer from 'react-wrap-balancer'
import type {Article} from 'lib/articles'
import mdxComponents from 'components/mdx'

type ArticleTemplateProps = {
  article: Article
  articleBodySerialized: MDXRemoteSerializeResult
}

type HeaderProps = {
  // TODO fix types
  imageUrl: string | null | undefined
  title: string
  author: string
  authorAvatar: string
  publishedDate: string
}

const Header: React.FC<HeaderProps> = ({
  imageUrl,
  title,
  author,
  authorAvatar,
  publishedDate,
}) => {
  return (
    <header className="flex flex-col md:flex-row items-center max-w-5xl mx-auto w-full px-5 lg:space-x-8">
      <div className="w-full max-w-[400px] lg:max-w-none lg:w-[440px] shrink-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="article header image"
            aria-hidden="true"
            width={880}
            height={880}
          />
        )}
      </div>
      <div className="w-full grow">
        <h3
          data-header-label=""
          className="text-badass-cyan-500 font-script text-2xl md:text-3xl lg:text-[2.5rem]"
        >
          Article
        </h3>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.5rem] leading-tight md:leading-tight lg:leading-[1.2] mt-2">
          <Balancer>{title}</Balancer>
        </h2>
        <div className="mt-4 lg:mt-6 flex items-center space-x-2">
          {authorAvatar && author && (
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <Image src={authorAvatar} alt={author} width={80} height={80} />
            </div>
          )}
          <div className="font-mono uppercase opacity-70 text-xs lg:text-sm xl:text-base">
            {author} &middot; {format(new Date(publishedDate), 'dd MMMM, y')}
          </div>
        </div>
      </div>
    </header>
  )
}

const ArticleTemplate: React.FC<
  React.PropsWithChildren<ArticleTemplateProps>
> = ({article, articleBodySerialized}) => {
  const {
    title,
    description,
    _createdAt: publishedDate,
    author,
    authorAvatar,
    articleHeaderImage,
    shareCardImage,
  } = article

  const shareCardUrlFallback = `${
    process.env.NEXT_PUBLIC_URL
  }/api/og-image/?title=${encodeURI(title)}`

  return (
    <Layout
      className="overflow-hidden"
      meta={{
        title,
        description: description,
        type: 'article',
        publishedDate,
        article: {
          publishedTime: publishedDate,
        },
        url: `${process.env.NEXT_PUBLIC_URL}/${article.slug}`,
        ogImage: {
          url: shareCardImage || shareCardUrlFallback,
        },
      }}
    >
      {articleBodySerialized && (
        <>
          <Header
            title={title}
            imageUrl={articleHeaderImage}
            author={author}
            authorAvatar={authorAvatar}
            publishedDate={publishedDate}
          />
          <main data-template-article="" className="pb-10">
            <div className="max-w-screen-md lg:max-w-[880px] lg:px-14 mx-auto w-full">
              <div className="md:pt-16 pt-10 lg:px-0 px-5 pb-16">
                <article className="prose lg:prose-xl sm:prose-lg md:prose-code:text-sm max-w-none prose-p:text-neutral-200 prose-pre:prose-code:bg-transparent prose-code:bg-white/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded lg:prose-code:text-[78%] sm:prose-code:text-[80%] mb-2 font-medium">
                  <MDX
                    components={mdxComponents}
                    contents={articleBodySerialized}
                  />
                </article>
              </div>
            </div>
          </main>
        </>
      )}
      <CallToActionForm content={genericCallToActionContent} />
    </Layout>
  )
}

export default ArticleTemplate
