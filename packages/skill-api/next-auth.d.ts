import NextAuth, {DefaultSession} from 'next-auth'

type Resolve<T> = T extends Function ? T : {[K in keyof T]: T[K]}

type User = Resolve<
  {
    role?: string
    purchases?: any[]
  } & DefaultSession['user']
>

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the
   * `SessionProvider` React Context
   */
  interface Session {
    user?: User
  }
}
