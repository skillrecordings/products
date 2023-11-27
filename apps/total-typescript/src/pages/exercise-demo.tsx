import Layout from '@/components/app/layout'
import {ExcludeExample} from '@/components/mdx/exclude-exercise'
import {PickExample} from '@/components/mdx/exercises'
import {ExtractExample} from '@/components/mdx/extract-exercise'
import {OmitExample} from '@/components/mdx/omit-exercise'
import {PartialExample} from '@/components/mdx/partial-exercise'
import {ReadonlyExample} from '@/components/mdx/readonly-exercise'
import {RequiredExample} from '@/components/mdx/required-exercise'
import '@/styles/shiki-twoslash.css'
import {cn} from '@skillrecordings/ui/utils/cn'
import {format} from 'date-fns'
import Image from 'next/legacy/image'
import Link from 'next/link'

const _createdAt = '2018-04-02'

const children = (
  <div className="space-y-12">
    <h1>Omit</h1>
    <OmitExample />
    <h1>Pick</h1>
    <PickExample />
    <h1>Partial</h1>
    <PartialExample />
    <h1>Required</h1>
    <RequiredExample />
    <h1>Readonly</h1>
    <ReadonlyExample />
    <h1>Exclude</h1>
    <ExcludeExample />
    <h1>Extract</h1>
    <ExtractExample />
  </div>
)

const Page = () => {
  return (
    <Layout meta={{}} className="bg-black/40">
      <header
        className={cn(
          'relative z-10 flex w-full flex-col items-center justify-center px-5 pb-8 pt-20 sm:pb-20 sm:pt-32',
        )}
      >
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col">
          <Link
            href="/articles"
            className="pb-5 text-sm opacity-75 transition hover:opacity-100 sm:text-base"
          >
            ← All Articles
          </Link>
          <h1 className="block text-left font-text text-4xl font-extrabold sm:text-4xl md:text-5xl">
            Hello
          </h1>
          <div className="flex items-center gap-3 pt-8">
            <div className="flex items-center justify-center overflow-hidden rounded-full">
              <Image
                src={require('../../public/matt-pocock.jpeg')}
                alt="Matt Pocock"
                width={40}
                height={40}
                priority
              />
            </div>
            <span className="font-medium">Matt Pocock</span>
            <time dateTime={_createdAt} className="pl-5 text-sm text-gray-300">
              {format(new Date(_createdAt), 'MMM dd, y')}
            </time>
          </div>
        </div>
      </header>
      <main className="relative z-10 pt-5">
        <div className="prose relative z-10 mx-auto w-full max-w-3xl px-5 sm:prose-lg md:prose-xl prose-p:text-gray-300 prose-a:text-cyan-300 prose-a:transition hover:prose-a:text-cyan-200 sm:prose-pre:-mx-5">
          {children}
          <div className="flex w-36 -rotate-6 gap-2 pt-10 text-gray-400">
            —
            <Image
              src={require('../../public/assets/signature.svg')}
              alt="Matt's signature"
            />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Page
