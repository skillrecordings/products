import * as React from 'react'
import {twMerge} from 'tailwind-merge'

type ContentSectionProps = {
  title?: string
  subtitle?: string
  className?: string
  subtitleClassName?: string
  renderAdditionalComponent?: any
}

const ContentSection: React.FC<
  React.PropsWithChildren<ContentSectionProps>
> = ({
  title,
  subtitle,
  className,
  subtitleClassName,
  renderAdditionalComponent,
  children,
}) => {
  const additionalComponent =
    renderAdditionalComponent && renderAdditionalComponent()
  return (
    <div className={twMerge('container', className)}>
      {title && (
        <div className="relative">
          <h3 className="text-badass-pink-500 font-condensed text-[1.75rem] uppercase">
            {title}
          </h3>
          <div className="absolute right-0 top-[10px] md:top-5">
            {additionalComponent ? additionalComponent : null}
          </div>
        </div>
      )}
      {subtitle && (
        <h2
          className={twMerge(
            'font-heading text-2xl md:text-[2.5rem] leading-[1.333] md:leading-[1.2] mt-4 md:mt-6',
            subtitleClassName,
          )}
        >
          {subtitle}
        </h2>
      )}
      {children}
    </div>
  )
}
export default ContentSection
