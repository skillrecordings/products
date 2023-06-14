// Next.js API route to check if user is a sponsor
import {gql, GraphQLClient} from 'graphql-request'
import {NextApiRequest, NextApiResponse} from 'next'
import {createClient, SupabaseClient} from '@supabase/supabase-js'
import {readJSON} from 'fs-extra'

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_API_KEY as string,
)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let endpoint = 'https://api.github.com/graphql'

  let {id, login, node_id, twitter_username, email, name, feature} = req.body

  // Load in the "free-riders.json" from /public
  console.log(`Loading free-riders.json`)
  const {logins} = await readJSON(`${process.cwd()}/public/free-riders.json`)

  console.log({logins})
  if (logins.includes(login)) {
    return res.send({
      ...req.body,
      id: node_id,
    })
  }

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

  if (response.error) {
    res.status(500).json({error: response.error})
  }

  let sponsors = response.user.sponsors.nodes.map((n: any) => n)

  let isSponsor = sponsors.find((s: any) => {
    return s.id === node_id && s.login === login && s.databaseId === id
  })

  if (!isSponsor && feature && feature !== 'Login') {
    try {
      supabase
        .from('users')
        .insert([
          {
            database_id: id,
            login,
            node_id,
            twitter_username,
            email,
            name,
            feature,
          },
        ])
        .then((response) => {
          if (response && response?.error) {
            console.error({error: response.error})
          }
        })
    } catch (error) {
      console.error({error})
    }
  }

  res.send(isSponsor)
}
