import '@johnlindquist/kit'
import {Extension, LoadedScript} from '../src/utils/types'

const githubURL = 'https://api.github.com/graphql'

let token = env.GITHUB_DISCUSSIONS_TOKEN

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
    'GraphQL-Features': 'discussions_api',
  },
}

const discussionInnerQuery = `
# type: DiscussionConnection
  totalCount # Int!
  nodes {
    # type: Discussion
    id,
    title,
    url,
    # bodyText,
    createdAt,
    resourcePath,
    category {
      id,
      name,
      emoji,
    },
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
  }
`

const buildChoice = (node: any) => {
  const {
    title,
    resourcePath,
    createdAt,
    category,
    slug,
    id,
    body,
    author,
    url,
  } = node

  const description = `Created by ${author.login}`
  return {
    avatar: author.avatarUrl,
    user: author.login,
    author: author.name,
    twitter: author.twitterUsername,
    discussion: url,
    url,
    title,
    name: title,
    command: slug,
    extension: Extension.md,
    description,
    resourcePath,
    createdAt,
    category,
    id,
    body,
    value: url,
    img: author.avatarUrl,
  }
}

const fetchPosts = async (categoryId = '') => {
  const query = `
  query {
    repository(owner: "johnlindquist", name: "kit") {
      discussions(first: 100, categoryId: "${categoryId}", orderBy: {
        field: CREATED_AT,
        direction: DESC,
      }) {
        ${discussionInnerQuery}
      }
    }
  }`

  let options = {
    query,
  }

  let response: any = await post(githubURL, options, config)

  return response?.data?.data?.repository?.discussions?.nodes
}

const downloadCategory = async () => {
  const showAndTell = await fetchPosts(
    'MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyMDg0MTcw',
  ) //showandtell
  const announcements = await fetchPosts(
    'MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyODIwMDgw',
  ) //Announcements

  const nodes = [...showAndTell, ...announcements]

  const choices = nodes
    .map(buildChoice)
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))

  await outputJson(projectPath('public', 'data', 'hot.json'), choices)
}

await downloadCategory()
