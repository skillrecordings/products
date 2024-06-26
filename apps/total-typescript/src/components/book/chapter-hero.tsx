import type {BookChapter} from '@/lib/book'
import {useInView} from 'framer-motion'
import Image from 'next/image'
import React, {forwardRef} from 'react'

export const ChapterHero = forwardRef<
  HTMLDivElement,
  {chapter: BookChapter; chapterIndex: number}
>(({chapter, chapterIndex}, ref) => {
  return (
    <section
      ref={ref}
      className="relative z-10 flex min-h-[80vh] w-full flex-col items-center justify-center bg-background"
    >
      <div className="absolute left-0 top-0 flex h-[calc(100%-2.5rem)] w-full flex-col items-center justify-center gap-20 overflow-hidden border-b border-gray-800 p-5 text-center sm:left-5 sm:top-10 sm:w-[calc(100%-2.5rem)] sm:border-x sm:p-16 lg:border">
        <p className="relative z-10 inline-flex items-center gap-3 font-text text-base font-medium text-primary sm:text-xl">
          {/* <span className="h-px w-10 bg-gray-800" aria-hidden="true" />{' '} */}
          Chapter {chapterIndex + 1}{' '}
          {/* <span className="h-px w-10 bg-gray-800" aria-hidden="true" /> */}
        </p>
        <h1 className="relative z-10 text-balance bg-gradient-to-b from-white to-foreground bg-clip-text font-heading text-4xl font-bold italic text-transparent drop-shadow-xl sm:text-6xl lg:text-8xl">
          {chapter.title}
        </h1>
        <p className="relative z-10 max-w-md text-balance text-center font-text text-base sm:text-xl">
          {chapter.description ? chapter.description : null}
        </p>
        <div className="pointer-events-none absolute z-0 select-none bg-gradient-to-t from-transparent to-white/10 bg-clip-text font-heading text-[80vh] font-bold text-transparent opacity-65 ">
          {chapterIndex + 1}
        </div>
      </div>
      <Image
        alt=""
        aria-hidden="true"
        src={require('../../../public/assets/chapter-hero-stars@2x.png')}
        width={1100}
        className="pointer-events-none absolute top-0 select-none"
        height={517}
        priority
      />
    </section>
  )
})

export function useIsScrolledPast({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement>
}) {
  const [isScrolledPast, setIsScrolledPast] = React.useState(false)

  const isInView = useInView(ref, {
    amount: 0.2,
  })

  React.useEffect(() => {
    if (!isInView) {
      setIsScrolledPast(true)
    } else {
      setIsScrolledPast(false)
    }
  }, [isInView])

  return isScrolledPast
}
