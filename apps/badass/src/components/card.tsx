import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {twMerge} from 'tailwind-merge'
import cx from 'classnames'

import Icon from 'components/icons'
import {ButtonSecondary} from 'components/buttons'

type CardProps = {
  imageUrl: string | null | undefined
  title: string
  subtitle?: string
  href: string
  type: 'caseStudy' | 'article' | 'project'
  horizontalOrientation?: boolean
  ctaText: string
  authorName?: string
  authorAvatarUrl?: string
  description?: string | null | undefined
  publishedDate?: string
  isEven?: boolean
  featuredCardColor?: string
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
  description,
  isEven,
  featuredCardColor,
}) => {
  return (
    <Link
      data-badass-card=""
      href={href}
      className={twMerge(
        cx(
          'rounded-2xl border-2 border-badass-gray-800 duration-150 hover:bg-badass-gray-800 flex flex-col items-center px-4 overflow-hidden group',
          {
            'pb-10 lg:pb-14': type === 'caseStudy' || type === 'project',
            'pb-10': type === 'article',
            'lg:px-8': !horizontalOrientation,
            'md:overflow-visible md:flex-row md:even:flex-row-reverse md:pb-0 lg:pb-0 md:min-h-[280px] lg:min-h-[380px] xl:min-h-[400px] md:px-10 lg:px-16 xl:px-24':
              horizontalOrientation,
          },
        ),
        className,
      )}
      {...(featuredCardColor && {
        'data-badass-card-is-featured': featuredCardColor,
      })}
    >
      {imageUrl && (
        <div
          className={cx('flex items-center relative shrink-0', {
            'max-w-[482px] -top-7 md:-top-9 lg:-top-7':
              type !== 'article' && !horizontalOrientation,
            'max-w-[160px] md:max-w-[200px] lg:max-w-[300px] xl:max-w-[360px]':
              type === 'article' && !horizontalOrientation,
            'w-full': !horizontalOrientation,
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
          '-mt-[60px] lg:-mt-[80px]':
            !horizontalOrientation && type !== 'article',
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
              'text-center text-2xl font-heading leading-[1.333] lg:leading-tight grow',
              {
                'mt-3 md:mt-0': type === 'caseStudy' && !horizontalOrientation,
                'mt-6': type === 'article',
                'max-w-[340px]': !horizontalOrientation && type !== 'article',
                'lg:text-[2rem]': !horizontalOrientation,
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
              {subtitle && <span>client: {subtitle}</span>}
              <span className="hidden xl:inline lg:mx-3"> &middot; </span>
              {publishedDate && <span>published: {publishedDate}</span>}
            </h3>
          )}
          {type === 'article' && (
            <>
              {authorName && authorAvatarUrl && (
                <div className="flex space-x-2 md:space-x-4 items-center mt-5 md:mt-6">
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
              {description && (
                <h3 className="text-neutral-200 leading-normal md:leading-[1.25] mt-4 text-center text-base md:text-xl font-medium opacity-80">
                  {description}
                </h3>
              )}
            </>
          )}
          {type === 'project' && (
            <h3 className="text-gray-300 uppercase font-medium leading-[1.42] lg:leading-[2.185] text-sm lg:text-base font-mono mt-2 lg:mt-4 tracking-[0.14px] lg:tracking-[0.16px] text-center">
              {subtitle}
            </h3>
          )}
        </div>
        <ButtonSecondary
          tag="button"
          size="middle"
          className={cx(
            'group-hover:border-badass-green-500 group-hover:bg-badass-green-500 group-hover:text-black',
            {
              'mt-6 lg:mt-10': !horizontalOrientation,
              'mt-4': horizontalOrientation,
            },
          )}
        >
          <span>{ctaText}</span>
          {type === 'project' && (
            <Icon
              aria-hidden="true"
              name="arrow-top-right"
              className="w-5 h-5 shrink-0 ml-2"
            />
          )}
        </ButtonSecondary>
      </div>
    </Link>
  )
}
export default Card
