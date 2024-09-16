import * as React from 'react'

export const CodebaseTransformation = () => {
  return (
    <div className="not-prose relative mx-auto my-10 w-full max-w-2xl rounded border border-border bg-white p-2 dark:border-white/10 dark:bg-[#1D2232]">
      <div className="flex items-center gap-1" aria-hidden="true">
        <div className="size-2 rounded-full bg-[#FF5F57] sm:size-3" />
        <div className="size-2 rounded-full bg-[#FEBD2E] sm:size-3" />
        <div className="size-2 rounded-full bg-[#27C840] sm:size-3" />
      </div>
      <div className="mt-2 grid grid-cols-2 overflow-hidden rounded font-mono text-xs leading-relaxed text-black dark:text-white sm:text-base">
        <div className="flex">
          <ul className="bg-[#FE5E56]/40 p-2 [&_li]:opacity-75">
            <li>-</li>
            <li>-</li>
            <li>-</li>
            <li>-</li>
          </ul>
          <ul className="w-full bg-[#FE5E56]/10 p-2">
            <li>stale</li>
            <li>kludgy</li>
            <li>spaghetti-twisted</li>
            <li>repetitive</li>
          </ul>
        </div>
        <div className="flex">
          <ul className="bg-emerald-500/40 p-2 dark:bg-[#56FE85]/40 [&_li]:opacity-75">
            <li>+</li>
            <li>+</li>
            <li>+</li>
            <li>+</li>
          </ul>
          <ul className="w-full bg-emerald-500/10 p-2 dark:bg-[#56FE85]/10">
            <li>fresh</li>
            <li>functional</li>
            <li>elegant</li>
            <li>reusable</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
