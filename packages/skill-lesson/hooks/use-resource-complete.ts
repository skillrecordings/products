import {z} from 'zod'
import {useQuery} from '@tanstack/react-query'
import {localProgressDb} from '../utils/dexie'

export const ResourceEventSchema = z.object({
  lesson: z.string(),
  module: z.string(),
  eventName: z.string(),
  createdOn: z.date(),
})

export type TipEvent = z.infer<typeof ResourceEventSchema>

export const useResourceComplete = (resourceSlug: string) => {
  const {data: completionEvents, status} = useQuery(
    ['completionEvents', resourceSlug],
    async () => {
      const tipEvents = await localProgressDb.progress
        .where('lesson')
        .equals(resourceSlug)
        .toArray()

      return z
        .array(ResourceEventSchema)
        .parse(tipEvents)
        .filter((tipEvent) => {
          return tipEvent.eventName === 'completed video'
        })
    },
  )

  return {
    resourceCompleted: completionEvents && completionEvents.length > 0,
    status,
  }
}

export const useCompletedResources = (resourceSlugs: string[]) => {
  const {data: completedResources, status} = useQuery(
    ['completionEvents', resourceSlugs],
    async () => {
      const tipEvents = await localProgressDb.progress
        .where('lesson')
        .anyOf(resourceSlugs)
        .toArray()

      return z
        .array(ResourceEventSchema)
        .parse(tipEvents)
        .filter((tipEvent) => {
          return tipEvent.eventName === 'completed video'
        })
    },
  )

  return {
    completedResources,
    status,
  }
}
