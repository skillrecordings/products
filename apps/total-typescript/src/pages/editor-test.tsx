import Layout from '@/components/app/layout'
import {EditorTest} from '@/components/code-editor/lazy-loaded-editor'

import {cn} from '@skillrecordings/ui/utils/cn'
import Image from 'next/image'

const title = 'How to use TypeScript with React'

const config = {
  author: 'Matt Pocock',
  authorBio: 'Frontend Engineer, TypeScript Enthusiast',
}

const isBookTeaser = true

const ArticleTemplate: React.FC = () => {
  return (
    <Layout>
      <header
        className={cn(
          'relative z-10 mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center gap-10 px-5 pb-8 pt-24 sm:pb-16 sm:pt-32 lg:flex-row lg:gap-0',
        )}
      >
        <div
          className={cn(
            'relative z-10 mx-auto flex w-full max-w-2xl flex-shrink-0 flex-col items-center text-center',
          )}
        >
          <h1 className="block text-balance font-text text-4xl font-bold sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <div className="mt-10 flex w-full justify-center gap-10">
            <div
              className={cn('flex items-center gap-3', {
                // 'flex-grow': !isBookTeaser,
              })}
            >
              <div className="flex items-center justify-center overflow-hidden rounded-full">
                <Image
                  src={require('../../public/matt-pocock.jpg')}
                  alt="Matt Pocock"
                  width={56}
                  height={56}
                  priority
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-semibold">{config.author}</span>
                <span className="max-w-sm text-balance text-sm text-slate-400 sm:text-base">
                  {config.authorBio}
                </span>
              </div>
            </div>
          </div>
        </div>
        {isBookTeaser && (
          <div className="absolute top-14 after:absolute after:bottom-0 after:left-0 after:h-32 after:w-full after:bg-gradient-to-t after:from-background after:via-background after:to-transparent after:content-[''] sm:top-16">
            <Image
              src={require('../../public/assets/book-teaser-bg@2x.jpg')}
              width={800}
              alt=""
              quality={100}
              priority
              aria-hidden="true"
            />
          </div>
        )}
        {/* {image && !isBookTeaser && (
          <div
            className={cn(
              'relative flex h-full w-full flex-col items-end lg:-ml-24 lg:translate-y-16 lg:brightness-125',
            )}
          >
            <Image
              className="scale-[1] rounded-lg sm:scale-100"
              src={image}
              alt=""
              aria-hidden="true"
              width={1920 / 2}
              height={1080 / 2}
              quality={100}
              priority
            />
            <time dateTime={_createdAt} className="pt-3 text-sm text-slate-600">
              Published on {format(new Date(_createdAt), 'MMM dd, y')}
            </time>
          </div>
        )} */}
      </header>
      <main className="relative z-10 px-5 pt-10">
        <div className="prose relative z-10 mx-auto w-full max-w-3xl sm:prose-lg md:prose-xl prose-p:text-gray-300 prose-a:text-cyan-300 prose-a:transition hover:prose-a:text-cyan-200 sm:prose-pre:-mx-5">
          <EditorTest />
          <div className="mx-auto flex w-32 -rotate-6 items-center gap-2 text-slate-500">
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

export default ArticleTemplate
