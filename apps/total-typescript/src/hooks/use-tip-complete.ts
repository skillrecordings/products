import {z} from 'zod'
import {useIndexedDBStore} from 'use-indexeddb'
import {useQuery} from 'react-query'

export const TipEventSchema = z.object({
  lesson: z.string(),
  module: z.string(),
  eventName: z.string(),
  createdOn: z.date(),
})

export type TipEvent = z.infer<typeof TipEventSchema>

export const useTipComplete = (tipSlug: string) => {
  const {getManyByIndex} = useIndexedDBStore('progress')
  const {data: completionEvents, status} = useQuery(
    ['completionEvents', tipSlug],
    async () => {
      const tipEvents = await getManyByIndex('lesson', tipSlug)
      return z
        .array(TipEventSchema)
        .parse(tipEvents)
        .filter((tipEvent) => {
          return (
            tipEvent.eventName === 'completed video' &&
            tipEvent.module === 'tips'
          )
        })
    },
  )

  return {tipCompleted: completionEvents && completionEvents.length > 0, status}
}
