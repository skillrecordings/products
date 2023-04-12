// Menu: Kit Discussions
// Description: Search and launch Kit Github Discussions
// Author: John Lindquist
// Twitter: @johnlindquist

import {gql, GraphQLClient} from 'graphql-request'

import {NextApiRequest, NextApiResponse} from 'next'

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  let endpoint = 'https://api.github.com/graphql'

  let client = new GraphQLClient(endpoint, {
    headers: {
      'GraphQL-Features': 'discussions_api',
      authorization: `Bearer ${process.env.GITHUB_DISCUSSIONS_TOKEN}`,
    },
  })

  let query = gql`
    {
      repository(owner: "johnlindquist", name: "kit") {
        discussions(
          first: 100
          categoryId: "MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyMDg0MTcw"
          orderBy: {field: CREATED_AT, direction: DESC}
        ) {
          # type: DiscussionConnection
          totalCount # Int!
          nodes {
            # type: Discussion
            id
            title
            url
            author {
              login
            }
          }
        }
      }
    }
  `

  let response = await client.request(query)

  type DiscussionNode = {
    title: string
    author: {login: string}
    url: string
  }
  let data = response.repository.discussions.nodes.map(
    ({title, author, url}: DiscussionNode) => ({
      name: `${title} - ${author.login}`,
      description: author.login,
      value: url,
    }),
  )

  res.statusCode = 200
  res.json(data)
}
