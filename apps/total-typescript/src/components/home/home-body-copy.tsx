import LandingCopy from '../landing-copy.mdx'
import * as React from 'react'
import {SkillLevel} from './use-skill-level'
import type {MDXComponents} from 'mdx/types'

export const Copy = ({
  level,
  components,
}: {
  level?: SkillLevel
  components: MDXComponents
}) => {
  return (
    <article className="prose-base w-full sm:prose-lg md:prose-xl marker:text-cyan-400 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:text-balance prose-headings:px-5 prose-headings:font-text prose-headings:font-semibold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-normal prose-p:text-foreground prose-a:text-cyan-300 prose-strong:font-semibold prose-strong:text-white prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:translate-x-1 prose-ul:list-disc hover:prose-a:underline md:prose-h2:text-5xl">
      <LandingCopy components={components} level={level} />
    </article>
  )
}
