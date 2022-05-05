import type {parseAlgoliaHitHighlight} from '@algolia/autocomplete-preset-algolia'
import React, {Fragment} from 'react'

export function highlight(
  highlighted: ReturnType<typeof parseAlgoliaHitHighlight>,
  options?: {
    as: keyof JSX.IntrinsicElements
  },
) {
  const Tag = options?.as || 'mark'

  return highlighted.map(({value, isHighlighted}, index) => {
    if (isHighlighted) {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <Tag key={index} className="bg-blue-100 text-blue-900 rounded-sm">
          {value}
        </Tag>
      )
    }

    // eslint-disable-next-line react/no-array-index-key
    return <Fragment key={index}>{value}</Fragment>
  })
}
