import * as React from 'react'
import {FunctionComponent} from 'react'
import DevBundles from 'data/bundles.development.json'
import ProdBundles from 'data/bundles.production.json'
import {SellableResource} from '@skillrecordings/types'
import Layout from '@skillrecordings/react/dist/layouts'
import config from 'config'
import {useCommerceMachine} from '@skillrecordings/commerce'

type BuyProps = {
  bundles: SellableResource[]
}

const Buy: FunctionComponent<BuyProps> = ({bundles}) => {
  const [state, send] = useCommerceMachine({
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
  })

  return (
    <Layout meta={{title: `Buy ${config.defaultTitle}`}}>
      {JSON.stringify(state.context)}
    </Layout>
  )
}

export async function getStaticProps() {
  const bundles =
    process.env.NODE_ENV === 'production' ? ProdBundles : DevBundles
  return {
    props: {bundles},
  }
}

export default Buy
