import React from 'react'
import {toPlainText} from '@portabletext/react'
import {LinkedIn, Twitter} from '@skillrecordings/react'
import {useRouter} from 'next/router'
import JoelHooksHeadshotImage from '../../public/joel-hooks.jpg'
import Layout from 'components/layout'
import Image from 'next/image'
import {SmallCallToActionForm} from '../components/call-to-action-form'
import {genericCallToActionContent} from '../components/landing-content'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import mdxComponents from 'components/mdx'

import Balancer from 'react-wrap-balancer'
import type {CaseStudy} from 'lib/case-studies'

type CaseStudyTemplateProps = {
  caseStudy: CaseStudy
  caseStudyBodySerialized: MDXRemoteSerializeResult
}

const CaseStudyTemplate: React.FC<
  React.PropsWithChildren<CaseStudyTemplateProps>
> = ({caseStudy, caseStudyBodySerialized}) => {
  const {title, description, body, image, _createdAt: date} = caseStudy

  const shortDescription =
    description || (body && toPlainText(body).substring(0, 157) + '...')

  return (
    <Layout
      className="overflow-hidden"
      meta={{
        title,
        description: shortDescription,
        type: 'article',
        date,
        article: {
          publishedTime: date,
        },
        url: `${process.env.NEXT_PUBLIC_URL}/partners/${caseStudy.slug}`,
        ogImage: {
          url: `https://badass-ogimage.vercel.app/api/card?title=${title}`,
        },
      }}
    >
      <Header title={title} image={image} />
      <main>
        <div className="max-w-screen-md lg:max-w-[880px] lg:px-14 mx-auto w-full">
          <div className="md:pt-16 pt-10 lg:px-0 px-5 pb-16">
            <article className="prose lg:prose-xl sm:prose-lg md:prose-code:text-sm max-w-none prose-p:text-neutral-200 prose-pre:prose-code:bg-transparent prose-code:bg-white/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded lg:prose-code:text-[78%] sm:prose-code:text-[80%] first-letter:text-badass-pink-500 first-letter:text-[4rem] first-letter:float-left first-letter:leading-none first-letter:font-expanded first-letter:mr-3 mb-2">
              <MDX
                components={mdxComponents}
                contents={caseStudyBodySerialized}
              />
            </article>
          </div>
        </div>
        <section data-article="">
          <SmallCallToActionForm content={genericCallToActionContent} />
        </section>
      </main>
    </Layout>
  )
}

export default CaseStudyTemplate

const Header: React.FC<
  React.PropsWithChildren<{title: string; image: string | null | undefined}>
> = ({title, image}) => {
  return (
    <header className="flex items-center justify-center pb-24 bg-badass-neutral-1000 aspect-video max-h-[calc(100vh-120px)] relative">
      {image && (
        <Image
          src={image}
          fill
          className="object-contain"
          alt=""
          aria-hidden="true"
        />
      )}
      <div className="flex flex-col items-center px-5 w-full relative z-10">
        <h1 className="max-w-screen-lg drop-shadow-2xl shadow-black w-full sm:text-6xl text-3xl font-heading uppercase sm:leading-tight leading-tight text-center">
          <Balancer>{title}</Balancer>
        </h1>
      </div>
    </header>
  )
}

const Share: React.FC<React.PropsWithChildren<{title: string}>> = ({title}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const className =
    'p-3 hover:bg-white hover:bg-opacity-10 transition rounded-full focus-visible:ring-white'
  const message = `${title} by @jhooks`

  return (
    <div className="flex">
      <Twitter className={className} link={url} message={message} />
      <LinkedIn className={className} link={url} message={message} />
    </div>
  )
}

export const Author = () => {
  return (
    <div className="flex items-center">
      <Image
        src={JoelHooksHeadshotImage}
        alt="Joel Hooks"
        width={48}
        height={48}
        placeholder="blur"
        priority
        loading="eager"
        className="rounded-full"
      />
      <span className="pl-2 font-medium leading-tight">Joel Hooks</span>
    </div>
  )
}
