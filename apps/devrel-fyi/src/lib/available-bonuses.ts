import groq from 'groq'
import {sanityClient} from '@/utils/sanity-client'

export const getAvailableBonuses = async () => {
  const availableBonuses = await sanityClient.fetch(
    groq`*[_type == "bonus" && expiresAt > $date && validFrom < $validFrom]{
    title,
    "slug": slug.current,
    "image": image.asset->{url},
    filter,
    description,
    expiresAt,
  }`,
    {
      date: new Date().toISOString(),
      validFrom: new Date().toISOString(),
    },
  )
  return availableBonuses
}
