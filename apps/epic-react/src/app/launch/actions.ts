'use server'

import {sanityWriteClient} from '@/utils/sanity-server'
import groq from 'groq'
import 'server-only'
import {getServerSession} from 'next-auth/next'

export async function launch() {
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
    return {error: 'not authorized'}
  }

  const prices = await sanityWriteClient.fetch(groq`
    *[_type == "pricing" && slug.current == "epic-react-v2"][0]`)

  const PRO_ID = '2b20d9d6-239e-48e6-8862-9162ec009a83'
  const STANDARD_ID = '2c7866b2-2aa2-48bd-846c-b6aa1388ae5f'
  const BASIC_ID = '1ee952f5-9bf2-47f7-9c91-a6fe8c10a509'

  const sanityProductIds = [PRO_ID]

  for (const sanityProductId of sanityProductIds) {
    await sanityWriteClient
      .patch(sanityProductId)
      .set({
        state: 'active',
      })
      .commit()
  }

  await sanityWriteClient
    .patch(prices._id)
    .set({
      active: true,
    })
    .commit()

  return {success: 'LAUNCH!'}
}
