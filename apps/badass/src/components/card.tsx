import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {ButtonPrimary, ButtonSecondary} from 'components/buttons'

type CardProps = {
  imageUrl: string | null | undefined
  title: string
  subtitle: string
  slug: string
  type: 'caseStudy' | 'article' | 'project'
}

const Card: React.FC<CardProps> = ({imageUrl, title, subtitle, slug, type}) => {
  return (
    <div className="overflow-hidden pb-14 rounded-2xl border-2 border-badass-gray-800 flex flex-col items-center">
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
        <h2 className="text-[2rem] font-heading max-w-[340px] text-center leading-tight">
          {title}
        </h2>
        <h3 className="text-neutral-200 uppercase font-medium leading-[2.185] font-mono mt-4">
          with {subtitle}
        </h3>
        <ButtonSecondary
          href={`/partners/${slug}`}
          size="middle"
          className="mt-10"
        >
          Read Case Study
        </ButtonSecondary>
      </div>
    </div>
  )
}
export default Card
