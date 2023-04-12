import '@johnlindquist/kit'
import {gql, GraphQLClient} from 'graphql-request'
import slugify from 'slugify'

import {Discussion} from '../src/lib/get-discussions'

export enum Category {
  Announcements = 'MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyODIwMDgw',
  Docs = 'MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyODc5NjIx',
  Share = 'MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyMDg0MTcw',
}

let endpoint = 'https://api.github.com/graphql'

let categoryId = await arg(
  'Category',
  Object.entries(Category).map(([name, value]) => {
    return {
      name,
      value,
    }
  }),
)

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

let response = await client.request(query, {categoryId})

let discussions = response.repository.discussions.nodes.map((d: Discussion) => {
  const slug = slugify(d.title, {
    lower: true,
    strict: true,
  })

  return {
    ...d,
    slug,
  }
})

// let scripts = await getAllScripts()

// await outputJson(path.resolve(cwd(), 'public', 'data', 'scripts.json'), scripts)
