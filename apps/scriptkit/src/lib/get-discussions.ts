import path from 'path'
import {readJson} from 'fs-extra'
import _ from 'lodash'

import {LoadedScript} from 'utils/types'

export enum Category {
  Announcements = 'MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyODIwMDgw',
  Guide = 'MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyODc5NjIx',
  Docs = 'DIC_kwDOEu7MBc4B_u-c',
  Share = 'MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyMDg0MTcw',
}

export enum Login {
  johnlindquist = 'johnlindquist',
}

interface Author {
  login: string
  avatarUrl: string
  url: string
  resourcePath: string
  name: string
  twitterUsername: string
}

export interface Discussion {
  id: string
  title: string
  author: Author
  url: string
  body: string
  slug: string
  createdAt: string
}

export interface DiscussionsProps {
  discussions: LoadedScript[]
  host?: string
}

export interface DiscussionProps {
  discussion: LoadedScript
  link?: string
}

export const getDiscussions = async (category: Category, user: string = '') => {
  const categoryName = Object.entries(Category)
    .find(([, value]) => value === category)?.[0]
    .toLowerCase()
  const discussions: LoadedScript[] = await readJson(
    path.resolve('public', 'data', `${categoryName}.json`),
  )
  return discussions.filter((d) => (user ? d.user === user : true))
}

export async function getDiscussionPaths(category: Category, login = '') {
  const discussions = await getDiscussions(category, login)
  const paths = []
  for await (const {command} of discussions) {
    paths.push({
      params: {
        slug: command,
      },
    })
  }

  return {
    paths,
    fallback: false,
  }
}

export async function getDiscussionBySlug(
  category: Category,
  matchSlug: string,
) {
  const discussions = await getDiscussions(category)

  return discussions.find(({command}) => {
    return command === matchSlug
  })
}
