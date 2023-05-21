import * as React from 'react'
import {MDXRemote} from 'next-mdx-remote/rsc'

import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkA11yEmoji from '@fec/remark-a11y-emoji'
import remarkToc from 'remark-toc'
import {MDXComponents} from '@/components/mdx'

export function PostBody({children}: {children: string}) {
  return (
    // @ts-expect-error RSC
    <MDXRemote
      source={children}
      options={{
        mdxOptions: {
          development: process.env.NODE_ENV === 'development',
          remarkPlugins: [
            // Adds support for GitHub Flavored Markdown
            // remarkGfm,
            // Makes emojis more accessible
            // remarkA11yEmoji,
            // generates a table of contents based on headings
            // remarkToc,
          ],
          // These work together to add IDs and linkify headings
          // rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        },
      }}
      // components={MDXComponents}
    />
  )
}
