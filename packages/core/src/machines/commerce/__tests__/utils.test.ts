import {
  getPriceParams,
  getStripeCheckoutParams,
} from '../utils'

const getContext = (options: any = {}) => {
  const defaultContext = {
    sellable: null,
    upgradeFromSellable: null,
    bulk: false,
    quantity: 1,
    stripePriceId: undefined,
  }

  return {...defaultContext, ...options}
}

describe('getPriceParams', () => {
  it('returns the stripe price id as {id}', () => {
    const machineContext = getContext({stripePriceId: 'abc123', sellable: {}})
    const params = getPriceParams(machineContext)
    expect(params).toStrictEqual({id: 'abc123'})
  })

  it('errors when sellable is null', () => {
    const machineContext = getContext()
    expect(() => getPriceParams(machineContext)).toThrow()
  })

  it('returns sellable params', () => {
    const contextOverride = {
      quantity: 1,
      sellable: {id: 'abc123', type: 'type', site: 'site'},
    }
    const machineContext = getContext(contextOverride)
    const params = getPriceParams(machineContext)
    expect(params).toStrictEqual({
      sellables: [
        {
          quantity: contextOverride.quantity,
          sellable: contextOverride.sellable.type,
          sellable_id: contextOverride.sellable.id,
        },
      ],
      site: 'TEST_PRODUCT',
    })
  })

  it('returns sellable params with applied coupon', () => {
    const contextOverride = {
      quantity: 1,
      sellable: {id: 'abc123', type: 'type'},
      appliedCoupon: 'coupon',
    }
    const machineContext = getContext(contextOverride)
    const params = getPriceParams(machineContext)
    expect(params).toStrictEqual({
      sellables: [
        {
          quantity: contextOverride.quantity,
          sellable: contextOverride.sellable.type,
          sellable_id: contextOverride.sellable.id,
        },
      ],
      site: 'TEST_PRODUCT',
      code: contextOverride.appliedCoupon,
    })
  })

  it('returns sellable params with an upgradeFromSellable', () => {
    const contextOverride = {
      quantity: 1,
      sellable: {id: 'abc123', type: 'type'},
      upgradeFromSellable: {
        slug: 'upgrade',
        type: 'type',
      },
    }
    const machineContext = getContext(contextOverride)
    const params = getPriceParams(machineContext)
    expect(params).toStrictEqual({
      sellables: [
        {
          quantity: contextOverride.quantity,
          sellable: contextOverride.sellable.type,
          sellable_id: contextOverride.sellable.id,
          upgrade_from_sellable_id: contextOverride.upgradeFromSellable.slug,
          upgrade_from_sellable: contextOverride.upgradeFromSellable.type,
        },
      ],
      site: 'TEST_PRODUCT',
    })
  })
})

describe('getStripeCheckoutParams', () => {
  it('returns the stripe price id as {stripe_price_id}', () => {
    const machineContext = getContext({stripePriceId: 'abc123', sellable: {}})
    const params = getStripeCheckoutParams(machineContext)
    expect(params).toStrictEqual({stripe_price_id: 'abc123', quantity: 1})
  })

  it('errors when sellable is null', () => {
    const machineContext = getContext()
    expect(() => getStripeCheckoutParams(machineContext)).toThrow()
  })

  it('returns sellable params', () => {
    const contextOverride = {
      quantity: 1,
      sellable: {slug: 'abc123', type: 'type', site: 'site'},
    }
    const machineContext = getContext(contextOverride)
    const params = getStripeCheckoutParams(machineContext)
    expect(params).toStrictEqual({
      sellables: [
        {
          quantity: contextOverride.quantity,
          sellable: contextOverride.sellable.type,
          sellable_id: contextOverride.sellable.slug,
          site: contextOverride.sellable.site,
        },
      ],
    })
  })

  it('returns sellable params with applied coupon', () => {
    const contextOverride = {
      quantity: 1,
      sellable: {slug: 'abc123', type: 'type', site: 'site'},
      appliedCoupon: 'coupon',
    }
    const machineContext = getContext(contextOverride)
    const params = getStripeCheckoutParams(machineContext)
    expect(params).toStrictEqual({
      sellables: [
        {
          quantity: contextOverride.quantity,
          sellable: contextOverride.sellable.type,
          sellable_id: contextOverride.sellable.slug,
          site: contextOverride.sellable.site,
        },
      ],
      code: contextOverride.appliedCoupon,
    })
  })

  it('returns sellable params with an upgradeFromSellable', () => {
    const contextOverride = {
      quantity: 1,
      sellable: {slug: 'abc123', type: 'type', site: 'site'},
      upgradeFromSellable: {
        slug: 'upgrade',
        type: 'type',
      },
    }
    const machineContext = getContext(contextOverride)
    const params = getStripeCheckoutParams(machineContext)
    expect(params).toStrictEqual({
      sellables: [
        {
          quantity: contextOverride.quantity,
          sellable: contextOverride.sellable.type,
          sellable_id: contextOverride.sellable.slug,
          site: contextOverride.sellable.site,
          upgrade_from_sellable_id: contextOverride.upgradeFromSellable.slug,
          upgrade_from_sellable: contextOverride.upgradeFromSellable.type,
        },
      ],
    })
  })

  it('returns sellable params with bulk purchase', () => {
    const contextOverride = {
      quantity: 2,
      bulk: true,
      sellable: {slug: 'abc123', type: 'type', site: 'site'},
      upgradeFromSellable: {
        slug: 'upgrade',
        type: 'type',
      },
    }
    const machineContext = getContext(contextOverride)
    const params = getStripeCheckoutParams(machineContext)
    expect(params).toStrictEqual({
      sellables: [
        {
          bulk: contextOverride.bulk,
          quantity: contextOverride.quantity,
          sellable: contextOverride.sellable.type,
          sellable_id: contextOverride.sellable.slug,
          site: contextOverride.sellable.site,
          upgrade_from_sellable_id: contextOverride.upgradeFromSellable.slug,
          upgrade_from_sellable: contextOverride.upgradeFromSellable.type,
        },
      ],
    })
  })
})
