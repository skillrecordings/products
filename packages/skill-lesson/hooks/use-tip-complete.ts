import {z} from 'zod'
import {useQuery} from '@tanstack/react-query'
import {localProgressDb} from '../utils/dexie'

export const TipEventSchema = z.object({
  lesson: z.string(),
  module: z.string(),
  eventName: z.string(),
  createdOn: z.date(),
})

export type TipEvent = z.infer<typeof TipEventSchema>

export const useTipComplete = (tipSlug: string) => {
  const {data: completionEvents, status} = useQuery(
    ['completionEvents', tipSlug],
    async () => {
      const tipEvents = await localProgressDb.progress
        .where('lesson')
        .equals(tipSlug)
        .toArray()

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
