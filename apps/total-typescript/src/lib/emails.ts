import {sanityWriteClient} from '@/utils/sanity-server'
import z from 'zod'

export const EmailSchema = z.object({
  _type: z.string(),
  _updatedAt: z.string().optional(),
  title: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  body: z.nullable(z.string().optional()),
})

export type Email = z.infer<typeof EmailSchema>

export async function getAllEmails() {
  const emails = await sanityWriteClient.fetch(`*[_type == 'mail']`)
  return emails.map((email: Email) => {
    return EmailSchema.parse({
      ...email,
    })
  })
}

export async function getEmail(slug?: string) {
  const emailContent = await sanityWriteClient.fetch(
    `*[_type == "mail" && slug.current == $slug][0]`,
    {slug},
  )

  return EmailSchema.parse(emailContent)
}
