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

  if (!['ADMIN', 'SUPERADMIN'].includes(session?.user?.role || '')) {
    notFound()
  }

  return (
    <div>
      <form action={launch}>
        <RedButton />
      </form>
    </div>
  )
}
