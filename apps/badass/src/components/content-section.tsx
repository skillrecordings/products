import * as React from 'react'
import {twMerge} from 'tailwind-merge'

type ContentSectionProps = {
  title?: string
  subtitle?: string
  className?: string
}

const ContentSection: React.FC<
  React.PropsWithChildren<ContentSectionProps>
> = ({title, subtitle, className, children}) => {
  return (
    <div className={twMerge('container', className)}>
      {title && (
        <h3 className="text-badass-pink-500 font-condensed text-[1.75rem] uppercase">
          {title}
        </h3>
      )}
      {subtitle && (
        <h2 className="font-heading text-[2.5rem] leading-[1.2] mt-6">
          {subtitle}
        </h2>
      )}
      {children}
    </div>
  )
}
export default ContentSection
