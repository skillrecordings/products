// Name: Pull Discussion Docs

import '@johnlindquist/kit'
import {getMetadata} from '@johnlindquist/kit/core/utils'
import {gql, GraphQLClient} from 'graphql-request'
import slugify from 'slugify'

import {Discussion} from '../src/lib/get-discussions'
import {Extension, LoadedScript} from '../src/utils/types'

export enum Category {
  Announcements = 'MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyODIwMDgw',
  Guide = 'MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyODc5NjIx',
  Share = 'MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyMDg0MTcw',
  Docs = 'DIC_kwDOEu7MBc4B_u-c',
}

let endpoint = 'https://api.github.com/graphql'

const categoryKey = 'Docs'

let category = {
  name: categoryKey as string,
  value: (Category as any)[categoryKey] as string,
}

let client = new GraphQLClient(endpoint, {
  headers: {
    'GraphQL-Features': 'discussions_api',
    authorization: `Bearer ${await env('GITHUB_DISCUSSIONS_TOKEN')}`,
  },
})

let query = gql`
  query ($categoryId: ID) {
    repository(owner: "johnlindquist", name: "kit") {
      discussions(
        first: 100
        categoryId: $categoryId
        orderBy: {field: CREATED_AT, direction: DESC}
      ) {
        # type: DiscussionConnection
        totalCount # Int!
        nodes {
          title
          url
          author {
            ... on User {
              twitterUsername
              name
            }
            login
            avatarUrl
            url
          }
          body
          id
          createdAt
        }
      }
    }
  }
`

let response = await client.request(query, {categoryId: category.value})

let discussions: Discussion[] = response.repository.discussions.nodes.map(
  (d: Discussion) => {
    const slug = slugify(d.title, {
      lower: true,
      strict: true,
    })

    return {
      ...d,
      slug,
    }
  },
)

let loadedScripts: any[] = discussions.map(
  ({author, body, createdAt, id, slug, title, url: discussion}) => {
    let url =
      body.match(/(?<=(Install|Open).*)https:\/\/gist.*js(?=\"|\))/gim)?.[0] ||
      ''
    let metadata = getMetadata(body)

    let [, dir, file] = body.match(/(?<=<meta path=")(.*)\/(.*)(?=")/) || [
      null,
      '',
      '',
    ]

    let [description] = body.match(/(?<=<meta description=")(.*)(?=")/) || ['']
    let [tag] = body.match(/(?<=<meta tag=")(.*)(?=")/) || ['']
    let [section] = body.match(/(?<=<meta section=")(.*)(?=")/) || ['']
    let [i] = body.match(/(?<=<meta i=")(.*)(?=")/) || ['']
    let [sectionIndex] = body.match(/(?<=<meta sectionIndex=")(.*)(?=")/) || [
      '',
    ]

    let content = body
    // let prevLength = 0

    // let i = 0
    // for (let s of body.matchAll(/(`{3}js)(.{5,}?)(`{3})/gs)) {
    //   i++
    //   if (s[2] && s.index) {
    //     let c = Buffer.from(s[2]).toString('base64url')
    //     let name = `${slug}-example-${i}`
    //     let link = `\n\n[Create script from example below](kit:snippet?name=${name}&content=${c})\n`

    //     let index = s.index + prevLength
    //     content = [content.slice(0, index), link, content.slice(index)].join('')
    //     prevLength += link.length
    //   }
    // }

    return {
      ...metadata,
      avatar: author.avatarUrl,
      user: author.login,
      author: author.name,
      twitter: author.twitterUsername,
      discussion,
      url,
      title,
      command: slug,
      content,
      extension: Extension.md,
      dir,
      file,
      description,
      tag,
      section,
      i,
      sectionIndex,
    }
  },
)

await outputJson(
  projectPath('public', 'data', `${category.name.toLowerCase()}.json`),
  loadedScripts,
)
