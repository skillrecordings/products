import {initTRPC} from '@trpc/server'
import superjson from 'superjson'
import {Context} from './context'

export const t = initTRPC.context<Context>().create({
  // Optional:
  // transformer: superjson,
  // Optional:
  errorFormatter({shape}) {
    return {
      ...shape,
      data: {
        ...shape.data,
      },
    }
  },
})
