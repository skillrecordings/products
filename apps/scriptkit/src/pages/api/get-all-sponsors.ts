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
        sponsorshipsAsMaintainer(first: 100) {
          nodes {
            sponsorEntity {
              __typename
              ... on User {
                id
                databaseId
                login
              }
              ... on Organization {
                id
                databaseId
                login
              }
            }
          }
        }
      }
    }
  `

  let response = await client.request(query)
  let sponsors = response.user.sponsorshipsAsMaintainer.nodes.map(
    (n: any) => n.sponsorEntity,
  )

  res.send(sponsors)
}
