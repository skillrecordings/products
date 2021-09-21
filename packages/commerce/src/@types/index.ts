import {Price, SellableResource} from '@skillrecordings/types'

export type StripePriceParams = {
  id?: string
}

export type EggheadSellableParam = {
  sellable_id: number
  sellable: string
  quantity?: number
  upgrade_from_sellable_id?: string
  upgrade_from_sellable?: string
}

export type EggheadPriceParams = {
  sellables: EggheadSellableParam[]
  site: string
  code?: string
}

export interface CommerceMachineContext {
  sellable?: SellableResource
  upgradeFromSellable?: SellableResource
  bulk: boolean
  error?: string
  price?: Price
  appliedCoupon?: string
  accessToken?: string
  notification?: string
  email?: string
  stripeToken?: string
  quantity?: number
  purchase?: {sellable: SellableResource}
  stripeCheckoutData?: any
  stripe?: any
  stripePriceId?: string
  pricingApiUrl: string
}

export type CommerceEvent =
  | {type: 'APPLY_COUPON'; appliedCoupon: string}
  | {type: 'DISMISS_COUPON'; appliedCoupon: undefined}
  | {
      type: 'SET_QUANTITY'
      quantity: number
      bulk: boolean
    }
  | {type: 'START_PURCHASE'}
  | {type: 'CLAIM_COUPON'; email: string}
  | {type: 'START_STRIPE_CHECKOUT'}
  | {type: 'CANCEL_PURCHASE'}
  | {type: 'HANDLE_PURCHASE'; email: string; stripeToken: string}
