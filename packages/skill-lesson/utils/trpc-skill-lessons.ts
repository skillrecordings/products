import {httpBatchLink, loggerLink} from '@trpc/client'
import {createTRPCNext} from '@trpc/next'
import {inferRouterInputs, inferRouterOutputs} from '@trpc/server'
import superjson from 'superjson'
import {getBaseUrl} from './get-base-url'
import {type SkillLessonRouter} from '../trpc/routers/_skill-lesson-router'

export const trpcSkillLessons = createTRPCNext<SkillLessonRouter>({
  unstable_overrides: {
    useMutation: {
      /**
       * This function is called whenever a `.useMutation` succeeds
       **/
      async onSuccess(opts: any) {
        /**
         * @note that order here matters:
         * The order here allows route changes in `onSuccess` without
         * having a flash of content change whilst redirecting.
         **/
        // Calls the `onSuccess` defined in the `useQuery()`-options:
        await opts.originalFn()
        // Invalidate all queries in the react-query cache:
        await opts.queryClient.invalidateQueries()
      },
    },
  },
  config({ctx}) {
    return {
      transformer: superjson,
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  ssr: false,
})

export type RouterInput = inferRouterInputs<SkillLessonRouter>
export type RouterOutput = inferRouterOutputs<SkillLessonRouter>
