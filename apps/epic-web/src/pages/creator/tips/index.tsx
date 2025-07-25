import React from 'react'
import {trpc} from '../../../trpc/trpc.client'
import EditTip from 'pages/creator/tips/[slug]/index'
import {getAllTips} from 'lib/tips.server'
import {TipSchema} from 'lib/tips'
import {first, groupBy} from 'lodash'
import {GetServerSideProps} from 'next'
import {UserSchema} from '@skillrecordings/skill-lesson'
import {getCurrentAbility} from '@skillrecordings/skill-lesson'
import {getToken} from 'next-auth/jwt'

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const tips = await getAllTips(false)
  const mostRecentTipSlug = tips && first(tips)?.slug

  const token = await getToken({req})
  const user = UserSchema.parse(token)
  const ability = getCurrentAbility({user})
  if (!ability.can('create', 'Content')) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: `/creator/tips/${mostRecentTipSlug}`,
      permanent: false,
    },
  }
}

const CreatorTipsIndex = () => {
  const {data: tips} = trpc.tips.all.useQuery()
  const mostRecentTip = tips && tips[0].tips[0].slug

  return mostRecentTip ? <EditTip slug={mostRecentTip} /> : null
}

export default CreatorTipsIndex
