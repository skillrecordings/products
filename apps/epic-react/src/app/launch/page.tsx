import RedButton from '@/app/launch/red-button'
import {launch} from '@/app/launch/actions'
import {getServerSession} from 'next-auth/next'
import {notFound} from 'next/navigation'

export default async function LaunchPage() {
  const session = await getServerSession({
    callbacks: {
      session: async ({session, token}) => {
        if (token?.id && session.user) {
          // @ts-ignore
          session.user.role = token.role
        }
        return session
      },
    },
  })

  const canPress = ['ADMIN', 'SUPERADMIN'].includes(session?.user?.role || '')

  return (
    <div>
      <form
        action={async () => {
          'use server'
          launch()
        }}
      >
        <RedButton canPress={canPress} />
      </form>
    </div>
  )
}
