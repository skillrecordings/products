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
import {
  getBundleImage,
  getBundleStyles,
  getBundleDescription,
} from 'utils/get-bundle-metadata'
import PurchaseBundle from '@skillrecordings/commerce/dist/components/purchase-bundle'
import {useCommerceMachine} from '@skillrecordings/commerce'

type BuyProps = {
  bundles: SellableResource[]
}

const Buy: FunctionComponent<BuyProps> = ({bundles}) => {
  const sellable = bundles[0]

  const [state, send] = useCommerceMachine({
    pricingApiUrl: 'http://app.egghead.af:5000/api/v1/next/pricing',
  })

  return (
    <Layout meta={{title: `Buy ${config.defaultTitle}`}}>
      <CommerceContainer>
        <CommerceHeader />
        <CommerceBundles>
          {bundles.map((bundle) => {
            return (
              <CommerceBundleDetails
                getBundleStyles={getBundleStyles}
                bundle={bundle}
              >
                <CommerceBundleImage
                  bundle={bundle}
                  getBundleImage={getBundleImage}
                />
                <PurchaseBundle bundle={bundle} />
                <CommerceBundleDescription
                  bundle={bundle}
                  getBundleDescription={getBundleDescription}
                >
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
