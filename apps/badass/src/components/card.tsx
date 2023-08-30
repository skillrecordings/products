import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {twMerge} from 'tailwind-merge'
import cx from 'classnames'

import {ButtonPrimary, ButtonSecondary} from 'components/buttons'

type CardProps = {
  imageUrl: string | null | undefined
  title: string
  subtitle: string
  href: string
  type: 'caseStudy' | 'article' | 'project'
  horizontalOrientation?: boolean
  ctaText: string
  authorName?: string
  authorAvatarUrl?: string
  publishedDate?: string
  isEven?: boolean
  className?: string
}

const Card: React.FC<CardProps> = ({
  imageUrl,
  title,
  subtitle,
  href,
  className,
  type,
  horizontalOrientation = false,
  ctaText,
  authorName,
  publishedDate,
  authorAvatarUrl,
  isEven,
}) => {
  return (
    <div
      className={twMerge(
        cx(
          'rounded-2xl border-2 border-badass-gray-800 duration-150 hover:bg-badass-gray-800 flex flex-col items-center px-4 overflow-hidden',
          {
            'pb-10 lg:pb-14': type === 'caseStudy',
            'pb-10': type === 'article',
            'lg:px-8': !horizontalOrientation,
            'md:overflow-visible md:flex-row md:even:flex-row-reverse md:pb-0 lg:pb-0 md:min-h-[280px] lg:min-h-[380px] xl:min-h-[400px] md:px-10 lg:px-16 xl:px-24':
              horizontalOrientation,
          },
        ),
        className,
      )}
    >
      {imageUrl && (
        <div
          className={cx('flex items-center relative shrink-0  -top-7', {
            'w-full max-w-[482px] md:-top-9 lg:-top-7': !horizontalOrientation,
            'md:-top-0 md:w-[280px] lg:w-[380px] xl:w-[440px]':
              horizontalOrientation,
          })}
        >
          <Image
            src={imageUrl}
            alt={title}
            width={482}
            height={482}
            className={cx({
              'lg:absolute': horizontalOrientation,
            })}
          />
        </div>
      )}
      <div
        className={cx('flex flex-col relative grow items-center', {
          '-mt-[60px] lg:-mt-[80px]': !horizontalOrientation,
          'md:items-start -mt-[20px] md:-mt-0': horizontalOrientation,
          'md:mr-12 lg:mr-24 xl:mr-42': horizontalOrientation && isEven,
          'md:ml-12 lg:ml-24 xl:ml-42': horizontalOrientation && !isEven,
        })}
      >
        <div
          className={cx('items-center grow flex flex-col', {
            'md:items-start': horizontalOrientation,
          })}
        >
          <h2
            className={cx(
              'text-center text-2xl font-heading leading-[1.333] lg:leading-tight',
              {
                'mt-3 md:mt-0': type === 'caseStudy' && !horizontalOrientation,
                'mt-4': type === 'article',
                // '': horizontalOrientation,
                'lg:text-[2rem] max-w-[340px]': !horizontalOrientation,
                'md:text-left md:text-[1.75rem] lg:text-[2.125rem] xl:text-[2.5rem] lg:max-w-[400px] xl:max-w-none':
                  horizontalOrientation,
              },
            )}
          >
            {title}
          </h2>
          {type === 'caseStudy' && !horizontalOrientation && (
            <h3 className="text-neutral-200 uppercase font-medium leading-[1.42] lg:leading-[2.185] text-sm lg:text-base font-mono mt-2 lg:mt-4 tracking-[0.14px] lg:tracking-[0.16px] text-center">
              with {subtitle}
            </h3>
          )}
          {type === 'caseStudy' && horizontalOrientation && (
            <h3 className="font-mono uppercase opacity-70 mt-4 lg:mt-6 text-xs lg:text-sm xl:text-base flex flex-col xl:flex-row items-center md:items-start">
              <span>client: {subtitle}</span>
              <span className="hidden xl:inline lg:mx-3"> &middot; </span>
              <span>published: {publishedDate}</span>
            </h3>
          )}
          {type === 'article' && (
            <>
              {authorName && authorAvatarUrl && (
                <div className="flex space-x-2 md:space-x-4 items-center mt-5 md:mt-9">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden">
                    <Image
                      src={authorAvatarUrl}
                      alt={authorName}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="text-white opacity-80 uppercase font-mono tracking-[0.16px] text-sm md:text-base">
                    {authorName}
                  </div>
                </div>
              )}
              <h3 className="text-neutral-200 leading-normal md:leading-[1.75] mt-4 text-center text-base md:text-xl font-medium opacity-80">
                {subtitle}
              </h3>
            </>
          )}
        </div>
        <ButtonSecondary
          href={href}
          size="middle"
          className={cx({
            'mt-6 lg:mt-10': !horizontalOrientation,
            'mt-4': horizontalOrientation,
          })}
        >
          {ctaText}
        </ButtonSecondary>
      </div>
    </div>
  )
}
export default Card
