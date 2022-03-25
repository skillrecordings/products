import {getSdk} from './generated-api'
import {GraphQLClient} from 'graphql-request'

export const getAdminSDK = () => {
  const gqpClient = new GraphQLClient(process.env.HASURA_PROJECT_ENDPOINT, {
    headers: {
      [`x-hasura-admin-secret`]: process.env.HASURA_ADMIN_SECRET,
    },
  })

  return getSdk(gqpClient)
}
