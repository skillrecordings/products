import z from 'zod'

export const SubscriberSchema = z.object({
  id: z.number(),
  first_name: z.string().optional(),
  email_address: z.string(),
  state: z.string(),
})

export type Subscriber = z.infer<typeof SubscriberSchema>
