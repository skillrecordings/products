import React from 'react'
import get from 'lodash/get'
import {useMachine} from '@xstate/react'
import {SellableResource} from '../@types'
import commerceMachine from '../machines/commerce'

type CreateCommerceMachineProps = {
  sellable: SellableResource
  upgradeFromSellable?: SellableResource
}

const createCommerceMachine = ({
  sellable,
  upgradeFromSellable,
}: CreateCommerceMachineProps) =>
  commerceMachine.withContext({
    sellable,
    upgradeFromSellable,
    bulk: false,
    quantity: 1,
  })

type UseCommerceMachineProps = {
  sellable: SellableResource
  upgradeFromSellable?: SellableResource
}

export const useCommerceMachine = ({
  sellable,
  upgradeFromSellable,
}: UseCommerceMachineProps) => {
  const sellableSlug = get(sellable, 'slug')
  const commerceMachine = React.useMemo(() => {
    return createCommerceMachine({
      sellable,
      upgradeFromSellable,
    })
  }, [sellableSlug, upgradeFromSellable])

  return useMachine(commerceMachine)
}
