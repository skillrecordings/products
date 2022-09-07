import React from 'react'
import {SanityDocument} from '@sanity/client'
import Layout from 'components/app/layout'
import {EmailTemplate} from 'components/portable-text/mjml'
import {render} from 'mjml-react'
import {GetServerSideProps} from 'next'
import {useCopyToClipboard} from '@skillrecordings/react'
import {getEmail} from 'lib/emails'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async (req) => {
  const {slug} = req.query
  const emailMeta = await getEmail(`${slug}`)
  const email = await getEmail(`${req.query.slug}`)
  const {body: emailBody, title, description, image} = email

  const {html, errors} = render(
    <EmailTemplate
      emailBody={emailBody}
      title={title}
      description={description}
      image={image}
    />,
    {validationLevel: 'soft'},
  )

  return {
    props: {email: html, title: emailMeta.title},
  }
}

const Email: React.FC<{email: SanityDocument; title: string}> = ({
  email,
  title,
}) => {
  const {copyToClipboard, isCopied} = useCopyToClipboard(`${email}`)

  return (
    <Layout meta={{title}} className="bg-gray-200 py-16" noIndex>
      <main className="pt-16 flex flex-col min-h-screen">
        <h1 className="max-w-screen-md mx-auto w-full pb-2 font-bold text-3xl">
          <span className="font-normal">
            <Link href="/emails" passHref>
              <a className="underline">Emails</a>
            </Link>{' '}
            /
          </span>{' '}
          {title}
        </h1>
        <article className="bg-white  md:p-16 p-5 max-w-screen-md mx-auto w-full flex-grow relative">
          <button
            className="absolute top-0 right-0 py-3 px-5 bg-black text-white flex items-center justify-center"
            onClick={copyToClipboard}
          >
            Copy to clipboard
            {isCopied && (
              <span className="absolute bg-white text-black p-2 animate-ping text-xs">
                copied
              </span>
            )}
          </button>
          <div
            dangerouslySetInnerHTML={{__html: email} as any}
            className="max-w-screen-xl flex-grow"
          />
        </article>
        <div className=" w-full flex items-center justify-center">
          <div className="flex md:flex-row flex-col items-start p-16 gap-10 w-full">
            <textarea
              readOnly
              onClick={(e) => {
                e.currentTarget.select()
              }}
              value={email as any}
              className="h-80 w-full text-xs font-mono bg-gray-100 p-5"
            />
          </div>
        </div>
      </main>{' '}
    </Layout>
  )
}

export default Email
