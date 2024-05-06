import * as React from 'react'

const ChapterLayout: React.FC<
  React.PropsWithChildren<{params: {chapter: string}}>
> = async ({children, params}) => {
  return <div>{children}</div>
}

export default ChapterLayout
