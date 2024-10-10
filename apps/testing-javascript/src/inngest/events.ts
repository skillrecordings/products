import {Account, User} from 'next-auth'
import {AdapterUser} from 'next-auth/adapters'

export const OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT =
  'user/oauth-provider-account-linked'

export type OauthProviderAccountLinked = {
  name: typeof OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT
  data: {
    account: Account
    profile: User | AdapterUser
  }
}
