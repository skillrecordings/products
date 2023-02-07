import z, {record} from 'zod'

export const SubscriberSchema = z.object({
  id: z.number(),
  first_name: z.string().nullish(),
  email_address: z.string(),
  state: z.string(),
  fields: record(z.string().nullable()).default({}),
  created_at: z.string().optional(),
})

export type Subscriber = z.infer<typeof SubscriberSchema>
