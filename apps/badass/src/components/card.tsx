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
          'overflow-hidden pb-14 rounded-2xl border-2 border-badass-gray-800 duration-150 hover:bg-badass-gray-800 flex flex-col items-center px-4 md:px-8',
          {
            'pb-14': type === 'caseStudy',
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
          className="-top-7 relative"
        />
      )}
      <div className="flex flex-col items-center -mt-[80px]">
        <h2
          className={cx(
            'text-[2rem] font-heading max-w-[340px] text-center leading-tight',
            {
              'mt-4': type === 'article',
            },
          )}
        >
          {title}
        </h2>
        {type === 'caseStudy' && (
          <h3 className="text-neutral-200 uppercase font-medium leading-[2.185] font-mono mt-4">
            with {subtitle}
          </h3>
        )}
        {type === 'article' && (
          <>
            {authorName && authorAvatarUrl && (
              <div className="flex space-x-4 items-center mt-9">
                <div className="rounded-full overflow-hidden">
                  <Image
                    src={authorAvatarUrl}
                    alt={authorName}
                    width={48}
                    height={48}
                  />
                </div>
                <div className="text-white opacity-80 uppercase font-mono tracking-[0.16px]">
                  {authorName}
                </div>
              </div>
            )}
            <h3 className="text-neutral-200 leading-[1.75] mt-4 text-center text-xl font-medium opacity-80">
              {subtitle}
            </h3>
          </>
        )}
        <ButtonSecondary href={href} size="middle" className="mt-10">
          {ctaText}
        </ButtonSecondary>
      </div>
    </div>
  )
}
export default Card
