import React from 'react'
import matter from 'gray-matter'
import Balancer from 'react-wrap-balancer'
import {GetStaticPaths, GetStaticProps} from 'next'
import {Email, getAllEmails, getEmail} from '@/lib/emails'
import {getEmailHtml} from '@skillrecordings/skill-lesson/utils/get-email-html'
import cx from 'classnames'
import Layout from '@/components/app/layout'
import Share from '@/components/share'
import {ArticleNewsletterCta} from '@/components/primary-newsletter-cta'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import Link from 'next/link'
import {getOgImage} from '@/utils/get-og-image'
import {serialize} from 'next-mdx-remote/serialize'
import {useCopyToClipboard} from 'react-use'
import toast from 'react-hot-toast'

export const getStaticProps: GetStaticProps = async ({params}) => {
  const email = await getEmail(params?.slug as string)

  const {data, content} = matter(email?.body || '')

  const emailBodySerialized = await serialize(content, {
    scope: {...data, subscriber: 'there'},
  })

  const {html, errors} = getEmailHtml(emailBodySerialized, email)

  if (errors) {
    console.debug({errors})
  }

  const emails = await getAllEmails()

  return {
    props: {
      email,
      emailHtml: html,
      emails,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const emails = await getAllEmails()
  const paths = emails.map((email: Email) => ({
    params: {slug: email.slug.current},
  }))
  return {paths, fallback: 'blocking'}
}

export default function EmailPage({
  email,
  emailHtml,
  emails,
}: {
  email: Email
  emailHtml: string
  emails: Email[]
}) {
  const {subscriber, loadingSubscriber} = useConvertkit()
  const ogImage = getOgImage({title: email.title})
  const [_, setCopiedtoClipboard] = useCopyToClipboard()
  const currentEmail = email
  const handleCopyHtmlToClipboard = () => {
    const htmlWithConvertkitSubscriberVariableSyntax = emailHtml.replace(
      'Hey there',
      `Hey {{ subscriber.first_name | strip | default: "there" }}`,
    )
    setCopiedtoClipboard(htmlWithConvertkitSubscriberVariableSyntax)
    toast.success('Copied')
  }
  return (
    <Layout
      className="min-h-full"
      meta={{
        title: email.title,
        ogImage,
      }}
    >
      <header className="relative z-10 mx-auto flex w-full max-w-screen-lg flex-col justify-center pb-8 pt-16 sm:pb-5 sm:pt-24">
        <Link
          href={'/newsletter'}
          className="inline-flex text-sm text-gray-400 transition hover:text-white sm:text-base"
        >
          ← Emails
        </Link>
      </header>
      <main className="relative z-10 text-black">
        <article className="mx-auto flex h-full w-full max-w-screen-lg">
          <aside className="w-full max-w-[260px] rounded-l-lg bg-white/90 py-5">
            {emails ? (
              <ul>
                {emails.map((email: Email) => {
                  const isCurrent =
                    email.slug.current === currentEmail.slug.current
                  return (
                    <li key={email.slug.current} className="">
                      <Link
                        href={`/newsletter/${email.slug.current}`}
                        className={cx(
                          'inline-flex w-full px-4 py-3 text-base font-medium transition duration-75 hover:bg-black/5',
                          {
                            'bg-white hover:bg-white/80': isCurrent,
                          },
                        )}
                      >
                        <Balancer>{email.title}</Balancer>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div>No emails</div>
            )}
          </aside>
          <div className="flex w-full flex-col items-center justify-center rounded-r-lg border-l border-gray-200 bg-white shadow-2xl">
            <div className="flex w-full flex-row items-center justify-between gap-10 border-b border-gray-100 p-5">
              <div className="flex items-center space-x-2">
                <div className="text-gray-600">Subject: </div>
                <div className="font-medium">{email.title}</div>
              </div>
              <button
                onClick={handleCopyHtmlToClipboard}
                type="button"
                className="rounded-md border border-black/10 bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow drop-shadow-lg transition-all hover:brightness-105"
              >
                Copy HTML
              </button>
            </div>
            <div className="px-5 pb-5 pt-3 selection:bg-blue-500 selection:text-white">
              <div dangerouslySetInnerHTML={{__html: emailHtml}} />
              <div className="flex flex-col space-y-3 py-3">
                <small>
                  <span className="text-blue-500 underline">​Unsubscribe</span>{' '}
                  from Total TypeScript emails
                </small>
                <small>
                  12333 Sowden Rd, Ste. B, PMB #97429, Houston, TX 77080
                </small>
              </div>
            </div>
          </div>
        </article>
        <section className="relative z-10 -mb-16 overflow-hidden pb-0 text-white sm:mb-0">
          <Share title={email.title} contentType="TypeScript Newsletter" />
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
