import React from 'react'
import {trpc} from '../../../trpc/trpc.client'
import EditTip from 'pages/creator/tips/[slug]/index'

const CreatorTipsIndex = () => {
  const {data: tips} = trpc.tips.all.useQuery()
  const mostRecentTip = tips && tips[0].tips[0].slug

  return mostRecentTip ? <EditTip slug={mostRecentTip} /> : null
}

export default CreatorTipsIndex
