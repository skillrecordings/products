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
  ctaText: string
  authorName?: string
  authorAvatarUrl?: string
  className?: string
}

const Card: React.FC<CardProps> = ({
  imageUrl,
  title,
  subtitle,
  href,
  className,
  type,
  ctaText,
  authorName,
  authorAvatarUrl,
}) => {
  return (
    <div
      className={twMerge(
        cx(
          'overflow-hidden pb-14 rounded-2xl border-2 border-badass-gray-800 duration-150 hover:bg-badass-gray-800 flex flex-col items-center px-4 lg:px-8',
          {
            'pb-10 lg:pb-14': type === 'caseStudy',
            'pb-10': type === 'article',
          },
        ),
        className,
      )}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          width={482}
          height={482}
          className="-top-7 md:-top-9 lg:-top-7 relative"
        />
      )}
      <div className="flex flex-col items-center -mt-[80px] md:-mt-[60px] lg:-mt-[80px] relative grow">
        <div className="grow flex flex-col items-center">
          <h2
            className={cx(
              'text-2xl lg:text-[2rem] font-heading max-w-[340px] text-center leading-[1.333] lg:leading-tight',
              {
                'mt-3 md:mt-0': type === 'caseStudy',
                'mt-4': type === 'article',
              },
            )}
          >
            {title}
          </h2>
          {type === 'caseStudy' && (
            <h3 className="text-neutral-200 uppercase font-medium leading-[1.42] lg:leading-[2.185] text-sm lg:text-base font-mono mt-2 lg:mt-4 tracking-[0.14px] lg:tracking-[0.16px] text-center">
              with {subtitle}
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
        <ButtonSecondary href={href} size="middle" className="mt-6 lg:mt-10">
          {ctaText}
        </ButtonSecondary>
      </div>
    </div>
  )
}
export default Card
