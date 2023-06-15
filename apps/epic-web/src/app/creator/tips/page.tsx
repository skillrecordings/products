import React from 'react'
import {Metadata} from 'next'
import {getAllTips} from 'lib/tips'
import {groupBy} from 'lodash'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tips',
}

const CreatorTipsIndex = async () => {
  const tips = await getAllTips()
  const tipGroups = groupBy(tips, 'state')
  const tipGroupsArray = Object.entries(tipGroups).map(([key, value]) => {
    return {state: key, tips: value}
  })

  return (
    <>
      <header className="flex w-full items-center justify-between pb-10">
        <h1 className="text-4xl font-bold">Tips</h1>
        <Link
          href={`/creator/tips/new`}
          className="flex items-center justify-center rounded-md bg-black px-3 py-2 text-center font-semibold text-white"
        >
          New Tip
        </Link>
      </header>
      <ul>
        {tipGroupsArray.map((tipGroup) => {
          return (
            <li key={tipGroup.state} className="py-3">
              <h2 className="pb-3 font-mono font-bold uppercase text-gray-600">
                {tipGroup.state}
              </h2>
              <ul className="flex flex-col gap-1">
                {tipGroup.tips.map((tip) => {
                  return (
                    <li key={tip._id}>
                      <Link
                        href={`creator/tips/${tip.slug}`}
                        className="text-lg font-medium hover:underline"
                      >
                        {tip.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default CreatorTipsIndex
