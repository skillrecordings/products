import * as React from 'react'
import Layout from '../components/layout'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import Button from '@skillrecordings/react/dist/components/button'
import {useRouter} from 'next/router'

type ArticleTemplateProps = {
  meta?: any
}

const HomeTemplate: React.FC<ArticleTemplateProps> = ({meta, children}) => {
  const {headline} = meta
  const router = useRouter()
  return (
    <Layout meta={meta}>
      <article>
        <header>
          <div className="mx-auto max-w-screen-md">
            <h2 className="lg:text-6xl md:text-5xl text-4xl font-extrabold tracking-tight leading-tight text-center  pt-32">
              {headline}
            </h2>
          </div>
        </header>
        <main className="prose dark:prose-dark lg:prose-xl prose-lg mx-auto pt-32 max-w-screen-md">
          {children}
        </main>
      </article>
      <section className="flex flex-col items-center justify-center w-full relative overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full relative z-10 sm:py-32 py-24 px-5">
          <h3 className=" font-extrabold pb-4 sm:text-5xl text-3xl text-center">
            Start Using TypeScript Today
          </h3>
          <div className="font-display pb-8 tracking-wide text-brand-cream text-center max-w-[40ch]">
            3 email lessons delivered over 3 days that will give you a taste of
            real-world TypeScript!
          </div>
          <SubscribeToConvertkitForm
            onSuccess={(subscriber: any) => {
              if (subscriber) {
                const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                router.push(redirectUrl)
              }
            }}
            submitButtonElem={
              <Button className="mt-3 w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Start the Course Now!
              </Button>
            }
          />
          <div className="text-center pt-16 text-sm italic text-brand-text opacity-70">
            No spam, unsubscribe any time.
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default HomeTemplate
