import FrontLink from './front-link'

const PurchaserLinks = ({email}: {email: string}) => {
  return (
    <div>
      <div>
        <FrontLink href={`https://dashboard.stripe.com/search?query=${email}`}>
          Stripe
        </FrontLink>
      </div>
      <div>
        <FrontLink
          href={`https://account.postmarkapp.com/servers/2456630/streams/outbound/events?utf8=%E2%9C%93&f%5Bquery%5D=${email}`}
        >
          Postmark
        </FrontLink>
      </div>
    </div>
  )
}

export default PurchaserLinks
