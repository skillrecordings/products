import LandingCopy from '../landing-copy.mdx'
import * as React from 'react'

export const Copy = ({level}: {level?: string}) => {
  return (
    <article className="prose-h2:text-3xl md:prose-h2:text-5xl md:prose-xl sm:prose-lg prose-base opacity-90 prose-p:font-light w-full prose-pre:overflow-auto prose-p:max-w-2xl prose-p:mx-auto prose-headings:max-w-2xl prose-headings:mx-auto prose-pre:max-w-2xl prose-pre:mx-auto prose-ul:max-w-2xl prose-ul:mx-auto prose-ul:list-disc marker:text-cyan-400 prose-headings:font-bold prose-p:px-5 prose-headings:px-5 prose-headings:font-text prose-h2:text-center">
      <LandingCopy level={level} />
    </article>
  )
}
