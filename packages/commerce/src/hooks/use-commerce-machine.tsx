import React from 'react'
import get from 'lodash/get'
import {useMachine} from '@xstate/react'
import {SellableResource} from '@skillrecordings/types'
import commerceMachine from '../machines/commerce'

type CreateCommerceMachineProps = {
  sellable: SellableResource
  upgradeFromSellable?: SellableResource
  stripePriceId?: string
}

const createCommerceMachine = ({
  sellable,
  upgradeFromSellable,
  stripePriceId,
}: CreateCommerceMachineProps) =>
  commerceMachine.withContext({
    sellable,
    upgradeFromSellable,
    bulk: false,
    quantity: 1,
    stripePriceId,
  })

type UseCommerceMachineProps = {
  sellable: SellableResource
  upgradeFromSellable?: SellableResource
  stripePriceId?: string
}

export const useCommerceMachine: any = ({
  sellable,
  upgradeFromSellable,
  stripePriceId,
}: UseCommerceMachineProps) => {
  const sellableSlug = get(sellable, 'slug')
  const commerceMachine = React.useMemo(() => {
    return createCommerceMachine({
      sellable,
      upgradeFromSellable,
      stripePriceId,
    })
  }, [sellableSlug, upgradeFromSellable])

  return useMachine(commerceMachine)
}
