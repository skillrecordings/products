import React from 'react'
import {toPlainText} from '@portabletext/react'
import Layout from 'components/layout'
import Image from 'next/image'
import {CallToActionForm} from 'components/call-to-action-form'
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
    slug,
    description,
    body,
    heroImage,
    ogImage,
    _createdAt: date,
    partnerName,
    publishedDate,
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
          url:
            ogImage ||
            `https://badass-ogimage.vercel.app/api/card?title=${title}`,
        },
      }}
    >
      <Header
        title={title}
        image={heroImage}
        publishedDate={publishedDate}
        partnerName={partnerName}
      />
      <main data-template-case-study={slug} className="pb-10">
        <div className="max-w-screen-md lg:max-w-[880px] lg:px-14 mx-auto w-full">
          <div className="md:pt-16 pt-10 lg:px-0 px-5 pb-16">
            <article className="prose lg:prose-xl sm:prose-lg md:prose-code:text-sm max-w-none prose-p:text-neutral-200 prose-pre:prose-code:bg-transparent prose-code:bg-white/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded lg:prose-code:text-[78%] sm:prose-code:text-[80%] mb-2 font-medium">
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
      </main>
      <CallToActionForm content={genericCallToActionContent} />
    </Layout>
  )
}

export default CaseStudyTemplate

const Header: React.FC<
  React.PropsWithChildren<{
    title: string
    image: string | null | undefined
    publishedDate: string
    partnerName: string
  }>
> = ({title, image, publishedDate, partnerName}) => {
  return (
    <header className="flex flex-col md:flex-row items-center max-w-7xl mx-auto w-full px-5">
      <div className="w-full md:w-2/5 lg:w-1/2 shrink-0">
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
      <div className="w-full md:w-3/5 lg:w-1/2 md:pl-10 lg:pl-16 xl:pl-24 shrink-0">
        <h3 className="text-badass-red-400 font-script text-2xl md:text-3xl lg:text-[2.5rem]">
          Case Study
        </h3>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-tight lg:leading-tight mt-2">
          <Balancer>{title}</Balancer>
        </h2>
        <div className="font-mono uppercase opacity-70 mt-4 lg:mt-6 text-xs lg:text-sm xl:text-base">
          client: {partnerName} &middot; published: {publishedDate}
        </div>
      </div>
    </header>
  )
}
