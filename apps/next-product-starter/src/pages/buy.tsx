import * as React from 'react'
import {FunctionComponent} from 'react'
import DevBundles from 'data/bundles.development.json'
import ProdBundles from 'data/bundles.production.json'

import {SellableResource} from '@skillrecordings/types'
import Layout from '@skillrecordings/react/dist/layouts'
import config from 'config'
import ClaimCoupon from '@skillrecordings/commerce/dist/components/claim-coupon'
import {
  CommerceContainer,
  CommerceBundles,
  CommerceGuarantee,
  CommerceHeader,
  CommerceBundleDescription,
  CommerceBundleDetails,
  CommerceBundleImage,
  CommerceBundleItemsList,
} from '@skillrecordings/commerce/dist/components'
import PurchaseBundle from '@skillrecordings/commerce/dist/components/purchase-bundle'

type BuyProps = {
  bundles: SellableResource[]
}

const Buy: FunctionComponent<BuyProps> = ({bundles}) => {
  const sellable = bundles[0]
  return (
    <Layout meta={{title: `Buy ${config.defaultTitle}`}}>
      <ClaimCoupon sellable={sellable} />
      <CommerceContainer>
        <CommerceHeader />
        <CommerceBundles>
          {bundles.map((bundle) => {
            return (
              <CommerceBundleDetails bundle={bundle}>
                <CommerceBundleImage bundle={bundle} />
                <PurchaseBundle bundle={bundle} />
                <CommerceBundleDescription bundle={bundle}>
                  <CommerceBundleItemsList bundle={bundle} />
                </CommerceBundleDescription>
              </CommerceBundleDetails>
            )
          })}
        </CommerceBundles>
        <CommerceGuarantee />
      </CommerceContainer>
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
