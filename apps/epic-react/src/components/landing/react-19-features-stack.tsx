import React from 'react'

const FEATURES = [
  "'use server'",
  'useOptimistic',
  'React Server Components',
  'Concurrent Rendering',
  'useActionState',
  'Improved Hydration',
  'Form Actions',
  'Server Actions',
  'Suspense',
  "'use client'",
  'useTransition',
  'React Compiler',
  'Streaming',
  'useFormStatus',
  'New React Hooks',
  'use()',
  'Automatic Memoization',
]

export const React19FeaturesStack = () => {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden sm:static">
      <div className="not-prose my-5 w-[800px] max-w-screen-xl sm:relative sm:my-10 sm:w-full">
        <ul className="flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4">
          {FEATURES.map((feature, index) => {
            return (
              <li
                key={feature}
                className="flex h-10 items-center justify-center rounded border border-[#DEDFE2] bg-gradient-to-b from-[#E8E9EC] to-[#D7D9E1] px-5 text-center text-sm font-medium dark:border-[#484F60] dark:from-[#343A4D] dark:to-[#2A3043] dark:font-normal sm:h-12 sm:px-7 sm:text-lg"
              >
                {feature}
              </li>
            )
          })}
          <div
            className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full bg-[linear-gradient(270deg,_hsl(var(--background))_0%,_hsl(var(--background))_5%,_rgba(17,_23,_41,_0.00)_49.8%,_hsl(var(--background))_95%,_hsl(var(--background))_100%)] sm:bg-[linear-gradient(270deg,_hsl(var(--background))_0%,_hsl(var(--background))_10%,_rgba(17,_23,_41,_0.00)_49.8%,_hsl(var(--background))_91.5%,_hsl(var(--background))_100%)]" // bg-gradient-to-r from-background via-transparent to-background
            aria-hidden="true"
          />
        </ul>
      </div>
    </div>
  )
}
