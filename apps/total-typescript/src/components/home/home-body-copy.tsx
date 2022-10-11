import LandingCopy from '../landing-copy.mdx'
import * as React from 'react'
import {SkillLevel} from './use-skill-level'

export const Copy = ({level}: {level?: SkillLevel}) => {
  console.log(level)
  return (
    <article className="prose-base w-full opacity-90 marker:text-cyan-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:px-5 prose-headings:font-text prose-headings:font-bold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-light prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:list-disc sm:prose-lg md:prose-xl md:prose-h2:text-5xl">
      <LandingCopy level={level} />
    </article>
  )
}
