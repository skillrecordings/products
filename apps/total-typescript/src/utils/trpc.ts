import {createReactQueryHooks} from '@trpc/react'
import type {inferProcedureOutput} from '@trpc/server'
import {AppRouter} from 'server/routers/_app'
import superjson from 'superjson'

export const trpc = createReactQueryHooks<AppRouter>()

export const transformer = superjson

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<
  TRouteKey extends keyof AppRouter['_def']['queries'],
> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>
