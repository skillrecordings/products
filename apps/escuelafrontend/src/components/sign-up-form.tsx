import * as React from 'react'
import {useRouter} from 'next/router'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'

const SignUpForm: React.FC<React.PropsWithChildren<any>> = ({content}) => {
  const router = useRouter()

  return (
    <section className="flex flex-col items-center justify-center sm:pt-16 sm:pb-16 pt-12">
      <div className="relative max-w-2xl mx-auto flex flex-col items-center">
        <div className="rounded-lg relative z-10 overflow-hidden bg-gray-400/10 dark:bg-gray-700/90 bg-opacity-50 dark:shadow-xl shadow-md">
          <div
            className="aspect-[1/0.538] p-8 flex justify-center items-center relative before:absolute before:inset-0 before:bg-black/5 bg-cover"
            style={{backgroundImage: `url(/images/bg-sign-up-form.png)`}}
          >
            <h2 className="font-heading sm:text-[2.5rem] sm:leading-tight font-bold text-white text-3xl text-center relative">
              {content.heading}
            </h2>
          </div>
          <div className="px-16 pb-16">
            <div className="pt-10 pb-5 space-y-5 opacity-80 sm:text-lg">
              {content.description}
            </div>
            <SubscribeToConvertkitForm
              actionLabel={content.button}
              onSuccess={(subscriber: any) => {
                if (subscriber) {
                  const redirectUrl = redirectUrlBuilder(
                    subscriber,
                    '/confirmar',
                  )
                  router.push(redirectUrl)
                }
              }}
            />
            <p className="text-center pt-8 text-sm opacity-50 max-w-xs mx-auto">
              {content.info}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignUpForm
