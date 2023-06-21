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
  const {
    title,
    description,
    body,
    heroImage,
    _createdAt: date,
    partnerName,
  } = caseStudy

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
      <Header
        title={title}
        image={heroImage}
        date={date}
        partnerName={partnerName}
      />
      <main data-template-case-study="">
        <div className="max-w-screen-md lg:max-w-[880px] lg:px-14 mx-auto w-full">
          <div className="md:pt-16 pt-10 lg:px-0 px-5 pb-16">
            <article className="prose lg:prose-xl sm:prose-lg md:prose-code:text-sm max-w-none prose-p:text-neutral-200 prose-pre:prose-code:bg-transparent prose-code:bg-white/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded lg:prose-code:text-[78%] sm:prose-code:text-[80%] first-letter:text-badass-pink-500 first-letter:text-[4rem] first-letter:float-left first-letter:leading-none first-letter:font-expanded first-letter:mr-3 mb-2 font-medium">
              <MDX
                components={mdxComponents}
                contents={caseStudyBodySerialized}
              />
            </article>
            <div className="flex justify-center mt-28">
              <div className="max-w-[9rem]">
                <Image
                  src="/assets/thank-you.png"
                  width={294}
                  height={64}
                  alt="Thank you"
                />
              </div>
            </div>
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
  React.PropsWithChildren<{
    title: string
    image: string | null | undefined
    date: string
    partnerName: string
  }>
> = ({title, image, date, partnerName}) => {
  const dateObject = new Date(date)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(dateObject)
  return (
    <header className="flex items-center max-w-7xl mx-auto w-full">
      <div className="w-1/2">
        {image && (
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            width={1320}
            height={1320}
          />
        )}
      </div>
      <div className="w-1/2 pl-24">
        <h3 className="text-badass-red-400 font-script text-[2.5rem]">
          Case Study
        </h3>
        <h2 className="font-heading text-5xl leading-tight">
          <Balancer>{title}</Balancer>
        </h2>
        <div className="font-mono uppercase opacity-70 mt-4">
          client: {partnerName} &middot; published:{formattedDate}
          {}
        </div>
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
