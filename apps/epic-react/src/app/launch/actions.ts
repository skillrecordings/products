'use server'

import {sanityWriteClient} from '@/utils/sanity-server'
import groq from 'groq'
import 'server-only'

export async function launch() {
  const prices = await sanityWriteClient.fetch(groq`
    *[_type == "pricing" && slug.current == "epic-react-v2"][0]`)

  await sanityWriteClient
    .patch(prices._id)
    .set({
      active: true,
    })
    .commit()
}
