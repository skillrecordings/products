import * as React from 'react'

type ContentSectionProps = {
  title: string
  subtitle: string
}

const ContentSection: React.FC<
  React.PropsWithChildren<ContentSectionProps>
> = ({children, title, subtitle}) => {
  return (
    <>
      <h3 className="text-badass-pink-500 font-condensed text-[1.75rem] uppercase">
        {title}
      </h3>
      <h2 className="font-heading text-[2.5rem] leading-[1.2] mt-6">
        {subtitle}
      </h2>
      {children}
    </>
  )
}
export default ContentSection
