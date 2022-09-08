import React from 'react'
import type {ActionFunction, LoaderFunction} from '@remix-run/node'
import {subscribeToForm} from '../lib/convertkit.server'
import {convertkitSubscriberCookie} from '~/cookies'
import {PortableText} from '@portabletext/react'
import {redirect, json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {getPage} from '~/lib/pages.server'
import {motion, useReducedMotion} from 'framer-motion'
import {z} from 'zod'
import SubscribeForm from '~/components/subscribe-form'
import AboutKent from '~/components/about-kent'
import Starfield from '~/components/starfield'
import Layout from '~/components/app/layout'
import isEmpty from 'lodash/isEmpty'

const FORM_ID = '3547851'

export const loader: LoaderFunction = async ({request}) => {
  const cookieHeader = request.headers.get('Cookie')
  const ckSubscriber =
    (await convertkitSubscriberCookie.parse(cookieHeader)) || {}
  const pageData = await getPage('/')

  return json({ckSubscriber, pageData})
}

export const action: ActionFunction = async ({request}) => {
  const formPayload = Object.fromEntries(await request.formData())

  const validationSchema = z.object({
    first_name: z.string(),
    email: z.string().email(),
  })

  try {
    const validatedSchema = validationSchema.parse(formPayload)
    const subscriber = await subscribeToForm({
      ...validatedSchema,
      formId: FORM_ID,
    })

    return redirect(`/confirm`, {
      headers: {
        'Set-Cookie': await convertkitSubscriberCookie.serialize(subscriber),
      },
    })
  } catch (error) {
    console.error(`form not submitted ${error}`)
    return redirect(`/?error=form-not-submitted`)
  }
}

const Index = () => {
  const {ckSubscriber, pageData} = useLoaderData()
  const [starfieldSpeed, setStarfieldSpeed] = React.useState(0.5)
  const {body} = pageData

  return (
    <Layout>
      <Header />
      <main className="sm:pb-48 pb-24">
        <Article body={body} />
        <Subscribe
          ckSubscriber={ckSubscriber}
          setStarfieldSpeed={setStarfieldSpeed}
        />
        <AboutKent />
      </main>
      <Starfield speed={starfieldSpeed} />
    </Layout>
  )
}

export default Index

const Article: React.FC<{body: any}> = ({body}) => {
  return (
    <article className="px-5 prose max-w-none prose-p:mx-auto md:prose-xl xl:prose-h2:mt-0 sm:prose-lg prose-p:max-w-2xl mx-auto sm:prose-p:py-2 prose-headings:text-center prose-headings:py-16 xl:prose-headings:fluid-2xl xl:prose-h3:text-3xl prose-h3:pt-0 prose-h3:pb-4 prose-h3:max-w-2xl prose-h3:mx-auto prose-h3:text-left sm:prose-h3:text-2xl prose-h3:text-xl">
      <PortableText value={body} />
    </article>
  )
}

const Header = () => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <header className="min-h-[70vh] flex items-center justify-center py-32">
      <div className="text-center mx-auto">
        <h1 className="fluid-3xl lg:w-[35ch] lg:px-16 px-5 font-bold leading-tight">
          Everything You Need to Know to Ship{' '}
          <motion.span className="relative">
            Modern Full-Stack
            <motion.div
              animate={shouldReduceMotion ? {} : {width: ['0%', '100%']}}
              transition={{
                delay: 0.5,
                type: 'spring',
                duration: 1,
              }}
              initial={{width: shouldReduceMotion ? '100%' : '0%'}}
              className="h-px bg-amber-200 w-full absolute bottom-0 left-0 lg:inline-block hidden"
            />
          </motion.span>{' '}
          Web Applications
        </h1>
      </div>
    </header>
  )
}

type SubscribeProps = {
  ckSubscriber: string
  setStarfieldSpeed: (speed: number) => void
}

const Subscribe: React.FC<SubscribeProps> = ({
  ckSubscriber,
  setStarfieldSpeed,
}) => {
  return (
    <section id="join" className="pt-10 sm:pb-48 pb-24">
      {isEmpty(ckSubscriber) ? (
        <SubscribeForm setStarfieldSpeed={setStarfieldSpeed} />
      ) : (
        <div className="lg:text-4xl sm:text-3xl text-2xl font-bold text-center">
          You're subscribed{' '}
          <span aria-hidden="true" className="text-brand">
            ✧
          </span>{' '}
          Thanks!
        </div>
      )}
    </section>
  )
}
