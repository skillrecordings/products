import {setupServer} from 'msw/node'
import {handlers} from './handlers'

process.env.HASURA_PROJECT_ENDPOINT = 'http://localhost:8080/v1/graphql'
process.env.HASURA_ADMIN_SECRET = 'admin_secret'

export const server = setupServer(...handlers)
