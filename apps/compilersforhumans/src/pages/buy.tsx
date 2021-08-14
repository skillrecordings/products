import * as React from 'react'
import {FunctionComponent} from 'react'
import DevBundles from '../data/bundles.development.json'
import ProdBundles from '../data/bundles.production.json'
import Commerce from '../components/commerce'
import {SellableResource} from '@skillrecordings/types'
import Layout from 'layouts'
import config from '../config.json'
import ClaimCoupon from 'components/commerce/claim-coupon'

type BuyProps = {
  bundles: SellableResource[]
}

const Buy: FunctionComponent<BuyProps> = ({bundles}) => {
  const sellable = bundles[0]
  return (
    <Layout meta={{title: `Buy ${config.defaultTitle}`}}>
      <ClaimCoupon sellable={sellable} />
      <Commerce bundles={bundles} />
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
