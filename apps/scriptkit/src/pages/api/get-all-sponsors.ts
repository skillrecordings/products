// Next.js API route to check if user is a sponsor
import {gql, GraphQLClient} from 'graphql-request'
import {NextApiRequest, NextApiResponse} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let endpoint = 'https://api.github.com/graphql'

  let client = new GraphQLClient(endpoint, {
    headers: {
      'GraphQL-Features': 'discussions_api',
      authorization: `Bearer ${process.env.GITHUB_DISCUSSIONS_TOKEN}`,
    },
  })

  let query = gql`
    query {
      user(login: "johnlindquist") {
        ... on Sponsorable {
          sponsors(first: 100) {
            totalCount
            nodes {
              ... on User {
                __typename
                login
                id
                databaseId
              }
              ... on Organization {
                __typename
                login
                id
                databaseId
              }
            }
          }
        }
      }
    }
  `

  let response = await client.request(query)
  let sponsors = response.user.sponsors.nodes.map((n: any) => n)

  res.send(sponsors)
}
