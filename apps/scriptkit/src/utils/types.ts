import {ScriptMetadata, Metadata} from '@johnlindquist/kit/types/core'

export enum Extension {
  md = '.md',
  js = '.js',
  ts = '.ts',
  mjs = '.mjs',
}

export interface LoadedScript extends Partial<ScriptMetadata> {
  title: string
  command: string
  user: string
  content: string
  url: string
  discussion: string
  extension: Extension
  github?: string
  twitter?: string
  description?: string
  tag?: string
  dir?: string
  section?: string
  i?: string
  sectionIndex?: string
  createdAt?: string
}

export type Course = {
  title: string
  slug: string
  path: string
  duration: string
  image_thumb_url: string
  instructor: {
    full_name: string
  }
  lessons: {
    title: string
    path: string
    duration: string
  }[]
}

export type Testimonial = {
  name: string
  handle?: string
  avatar: string
  url?: string
  review: string
}
