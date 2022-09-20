import z from 'zod'

export const SubscriberSchema = z.object({
  id: z.number(),
  first_name: z.string().nullish(),
  email_address: z.string(),
  state: z.string(),
  fields: z.object({last_name: z.string().nullish()}),
})

export type Subscriber = z.infer<typeof SubscriberSchema>
