'use client'

import {mdxComponents} from '@/app/_components/mdx'
import {MDXRemote} from 'next-mdx-remote'
import type React from 'react'

export const MDXBody: React.FC<any> = ({mdx}) => {
  return <>{mdx && <MDXRemote components={mdxComponents} {...mdx} />}</>
}
