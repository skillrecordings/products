import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({token, profile}) {
      // this is only adding github but you could add anything here
      // and it's async, so you could load other stuff as needed as
      // well probably...
      token.profile = profile
      return token
    },
  },
})
