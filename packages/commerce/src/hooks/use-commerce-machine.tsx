import React from 'react'
import get from 'lodash/get'
import {useMachine} from '@xstate/react'
import {SellableResource} from '@skillrecordings/types'
import commerceMachine from '../machines/commerce'

type CreateCommerceMachineProps = {
  sellable: SellableResource
  upgradeFromSellable?: SellableResource
  stripePriceId?: string
  pricingApiUrl?: string
}

const createCommerceMachine = ({
  sellable,
  upgradeFromSellable,
  stripePriceId,
  pricingApiUrl = `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/sellable_purchases`,
}: CreateCommerceMachineProps) =>
  commerceMachine.withContext({
    sellable,
    upgradeFromSellable,
    bulk: false,
    quantity: 1,
    stripePriceId,
    pricingApiUrl,
  })

type UseCommerceMachineProps = {
  sellable: SellableResource
  upgradeFromSellable?: SellableResource
  stripePriceId?: string
  pricingApiUrl?: string
}

export const useCommerceMachine: any = ({
  sellable,
  upgradeFromSellable,
  stripePriceId,
  pricingApiUrl,
}: UseCommerceMachineProps) => {
  const sellableSlug = get(sellable, 'slug')
  const commerceMachine = React.useMemo(() => {
    return createCommerceMachine({
      sellable,
      upgradeFromSellable,
      stripePriceId,
      pricingApiUrl,
    })
  }, [sellableSlug, upgradeFromSellable])

  return useMachine(commerceMachine)
}
