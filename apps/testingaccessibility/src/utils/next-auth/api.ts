import {getSdk} from './admin'
import {GraphQLClient} from 'graphql-request'

export const getAdminSDK = ({
  endpoint,
  adminSecret,
}: {
  endpoint: string
  adminSecret: string
}) => {
  const gqpClient = new GraphQLClient(endpoint, {
    headers: {
      [`x-hasura-admin-secret`]: adminSecret,
    },
  })

  return getSdk(gqpClient)
}
