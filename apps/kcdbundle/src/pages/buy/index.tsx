import * as React from 'react'
import {FunctionComponent} from 'react'
import {SellableResource} from '@skillrecordings/types'
import Layout from '@skillrecordings/react/dist/layouts'
import config from 'config'
import {useCommerceMachine} from '@skillrecordings/commerce'
import {createCheckoutSession} from '../../utils/sessions'
import {loadStripe} from '@stripe/stripe-js/pure'
import {sellables} from './email'

type BuyProps = {
  bundles?: SellableResource[]
}

const Buy: FunctionComponent<BuyProps> = ({bundles}) => {
  const [state, send] = useCommerceMachine({
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
  })

  React.useEffect(() => {
    createCheckoutSession(sellables).then(async (data) => {
      if (!process.env.NEXT_PUBLIC_STRIPE_TOKEN)
        throw new Error('no stripe token')

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_TOKEN)
      if (stripe) {
        stripe.redirectToCheckout({
          sessionId: data.id,
        })
      }
    })
  }, [])

  const createStripeSession = () => {
    send('START_STRIPE_CHECKOUT')
  }

  return (
    <Layout meta={{title: `Buy ${config.defaultTitle}`}}>
      <button onClick={() => createStripeSession()}>buy</button>
      {process.env.NODE_ENV === 'development' && (
        <pre>{JSON.stringify(state.context.price, null, 2)}</pre>
      )}
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {},
  }
}

export default Buy
