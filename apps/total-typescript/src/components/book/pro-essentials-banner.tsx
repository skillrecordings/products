import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {cn} from '@skillrecordings/ui/utils/cn'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const ProEssentialsBanner = React.forwardRef<
  HTMLAnchorElement,
  {location?: string; className?: string}
>(({location = 'chapter', className}, ref) => {
  return (
    <Link
      ref={ref}
      onClick={() => {
        track('clicked_pro_essentials_banner', {
          location,
        })
      }}
      href="/"
      className={cn(
        'group mt-5 flex w-full items-center justify-between overflow-hidden rounded bg-gradient-to-tr from-white/5 to-white/10 transition duration-300 ease-in-out hover:bg-[#E9BDA6]/5',
        className,
      )}
    >
      <div className="flex h-full flex-shrink-0 flex-col items-start justify-between py-4 pl-4">
        <h3 className="flex flex-col text-left">
          <div className="text-base leading-tight text-[#E9BDA6]">
            Total TypeScript
          </div>
          <div className="text-xl font-semibold text-white">Pro Complete</div>
        </h3>
        <div className="mt-5 inline-flex items-center justify-center rounded border border-[#E9BDA6] px-8 py-2 text-center text-sm font-semibold text-[#E9BDA6] transition duration-300 ease-in-out group-hover:brightness-125">
          <span className="relative transition duration-300 ease-in-out group-hover:-translate-x-2">
            Get Access
          </span>
          <span className="absolute translate-x-5 opacity-0 transition duration-300 ease-in-out group-hover:translate-x-6 group-hover:opacity-100">
            →
          </span>
        </div>
      </div>
      <Image
        className="lg:max-w-full"
        src={
          'https://res.cloudinary.com/total-typescript/image/upload/v1724417359/complete-volume_2x_vjtjuv.png'
        }
        width={130}
        height={130}
        alt="TypeScript Pro Complete"
      />
    </Link>
  )
})

export const InlineProEssentialsBanner = React.forwardRef<
  HTMLAnchorElement,
  {location?: string; className?: string}
>(({location = 'chapter_body', className}, ref) => {
  return (
    <Link
      ref={ref}
      onClick={() => {
        track('clicked_pro_essentials_banner', {
          location,
        })
      }}
      href="/workshops/typescript-pro-essentials"
      className={cn(
        'group mt-5 flex w-full items-center justify-between overflow-hidden rounded bg-gradient-to-tr from-white/5 to-white/10 transition duration-300 ease-in-out hover:bg-[#E9BDA6]/5',
        className,
      )}
    >
      <div className="flex h-full flex-col items-start justify-between py-4 pl-4">
        <h3 className="text-left">
          <div className="text-balance text-lg font-semibold leading-tight text-white">
            Want to become a TypeScript wizard?
          </div>
        </h3>
        <div className="mt-5 inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-center text-sm font-semibold text-black transition duration-300 ease-in-out group-hover:brightness-125">
          Unlock Pro Essentials
        </div>
      </div>
      <Image
        className="lg:max-w-full"
        src={
          'https://res.cloudinary.com/total-typescript/image/upload/v1718804538/TypeScript-Pro-Essentials-banner_2x_o37gbv.png'
        }
        width={130}
        height={130}
        alt="TypeScript Pro Essentials"
      />
    </Link>
  )
})
