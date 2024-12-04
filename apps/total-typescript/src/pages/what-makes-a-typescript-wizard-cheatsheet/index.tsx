import Layout from '@/components/app/layout'
import Share from '@/components/share'
import {SubscribeToConvertkitForm} from '@skillrecordings/skill-lesson/convertkit'
import {Button} from '@skillrecordings/ui'
import {Download} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {handleOnSubscribe, IconSecure} from '../newsletter'
import {useRouter} from 'next/router'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'

const PDF_URL =
  'https://res.cloudinary.com/total-typescript/image/upload/v1733254720/what-makes-a-typescript-wizard-cheatsheet/What_Makes_A_Wizard_Cheat_Sheet.pdf'

const WhatMakesATypescriptWizardCheatsheet = () => {
  const router = useRouter()

  return (
    <Layout
      meta={{
        title: 'What Makes a TypeScript Wizard Cheatsheet',
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1733253333/what-makes-a-typescript-wizard-cheatsheet/card_2x_cu21y6.jpg',
        },
      }}
    >
      <main className="flex w-full flex-col items-center justify-center px-5 py-16">
        <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-between pb-10 pt-14 lg:flex-row">
          <div className="flex flex-col gap-2 text-center lg:gap-0 lg:text-left">
            <h1 className="text-balance font-sans text-4xl font-bold tracking-tight text-gray-100">
              What makes a TypeScript wizard?
            </h1>
            <h2 className="text-xl text-gray-300">
              a cheat sheet from Total TypeScript 🎁
            </h2>
          </div>
          <div className="flex flex-col items-center gap-5 pt-5 lg:flex-row lg:pt-0">
            <Share
              shareButtonClassName="p-2 hover:text-gray-100 text-primary saturate-50 hover:scale-105 transition"
              className="mt-0 flex-row items-center pb-0"
              title="Share"
            />
            <Button asChild variant={'secondary'}>
              <Link
                href={PDF_URL}
                download={'what-makes-a-typescript-wizard-cheatsheet.pdf'}
                className="gap-2"
                target="_blank"
                onClick={() => {
                  track('downloaded cheatsheet', {
                    name: 'what-makes-a-typescript-wizard-cheatsheet',
                  })
                }}
              >
                Download PDF <Download size={16} />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex w-full max-w-screen-lg flex-col items-center justify-center gap-5">
          {[
            'https://res.cloudinary.com/total-typescript/image/upload/v1733252503/what-makes-a-typescript-wizard-cheatsheet/Web_-_What_Makes_A_Wizard_Cheat_Sheet_2x_aaaazn.jpg',
            'https://res.cloudinary.com/total-typescript/image/upload/v1733244281/what-makes-a-typescript-wizard-cheatsheet/Web_-_P1_-_Knowledge_-_What_Makes_A_Wizard_Cheat_Sheet_2x_qjwfcj.jpg',
            'https://res.cloudinary.com/total-typescript/image/upload/v1733244281/what-makes-a-typescript-wizard-cheatsheet/Web_-_P2_-_Skills_-_What_Makes_A_Wizard_Cheat_Sheet_2x_kbi9n9.jpg',
            'https://res.cloudinary.com/total-typescript/image/upload/v1733244281/what-makes-a-typescript-wizard-cheatsheet/Web_-_P3_-_Results_-_What_Makes_A_Wizard_Cheat_Sheet_2x_udq6es.jpg',
          ].map((image, i) => {
            return (
              <Link
                key={image}
                target="_blank"
                href={PDF_URL}
                className="relative cursor-zoom-in overflow-hidden"
                onClick={() => {
                  track('viewed cheatsheet', {
                    name: 'what-makes-a-typescript-wizard-cheatsheet',
                  })
                }}
              >
                <div className="absolute -right-8 top-4 rotate-45 bg-yellow-500 px-8 py-1 text-sm font-bold uppercase text-black">
                  Print Me
                </div>
                <img
                  className="rounded shadow"
                  key={image}
                  src={image}
                  alt=""
                  //   priority={i === 0 ? true : false}
                  width={2376 / 1.5}
                  height={1836 / 1.5}
                />
              </Link>
            )
          })}
        </div>
        <section
          className="flex h-full w-full flex-col items-center px-5 py-16 sm:py-24"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, #1C2434 0%, hsl(var(--background)) 100%)',
          }}
          aria-label="Sign up to Total TypeScript"
        >
          <div className="flex max-w-xl flex-col items-center gap-7 text-center">
            <h2 className="text-balance text-3xl font-medium sm:text-4xl">
              Join over 40,000 developers on their journey to TypeScript mastery
            </h2>
            <h2 className="text-balance text-lg font-normal text-slate-300 sm:text-xl">
              A comprehensive production-grade TypeScript training by{' '}
              <Image
                src={require('../../../public/matt-pocock.jpg')}
                alt=""
                aria-hidden="true"
                className="mr-1 inline-block rounded-full"
                priority
                quality={100}
                width={30}
                height={30}
              />
              Matt Pocock
            </h2>
          </div>
          <SubscribeToConvertkitForm
            className="mt-12 flex w-full max-w-[360px] flex-col gap-5 [&_button]:mt-2 [&_button]:h-14 [&_button]:bg-gradient-to-tr [&_button]:from-[#4BCCE5] [&_button]:to-[#8AF7F1] [&_button]:text-base [&_button]:font-semibold [&_input]:h-14 [&_input]:border-[#2B394E] [&_input]:bg-black/30 [&_input]:px-4 [&_input]:text-base [&_input]:shadow-inner [&_input]:transition hover:[&_input]:border-[#3C506D]"
            actionLabel="Subscribe"
            onSuccess={(subscriber?: any, email?: string) => {
              return handleOnSubscribe(router, subscriber, email)
            }}
          />
          <div className="mt-16 inline-flex items-center gap-1">
            <IconSecure />
            <span className="text-sm text-[#A8B8CD]">
              I respect your privacy. Unsubscribe at any time.
            </span>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default WhatMakesATypescriptWizardCheatsheet
