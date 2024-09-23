'use server'

import 'server-only'

export async function launch() {
  await fetch(
    `${process.env.NEXT_PUBLIC_PARTY_KIT_URL}/party/${process.env.NEXT_PUBLIC_PARTYKIT_ROOM_NAME}`,
    {
      method: 'POST',
      body: JSON.stringify({
        name: 'launch.initiated',
      }),
    },
  )
    .then((res) => {
      return res.text()
    })
    .catch((e) => {
      console.error(e)
    })

  return {success: 'LAUNCH!'}
}
