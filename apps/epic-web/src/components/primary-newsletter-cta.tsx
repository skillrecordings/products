import * as React from 'react'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
  useConvertkitForm,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'
import {Button} from '@skillrecordings/react'

type PrimaryNewsletterCtaProps = {
  setStarfieldSpeed?: (s: number) => void
}

export const PrimaryNewsletterCta: React.FC<
  React.PropsWithChildren<PrimaryNewsletterCtaProps>
> = ({setStarfieldSpeed}) => {
  const router = useRouter()

  return (
    <>
      <SubscribeToConvertkitForm
        onSuccess={(subscriber: any) => {
          if (subscriber) {
            const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
            router.push(redirectUrl)
          }
        }}
        submitButtonElem={
          <Button
            data-sr-button=""
            onMouseOver={() => {
              setStarfieldSpeed && setStarfieldSpeed(2)
            }}
            onMouseOut={() => {
              setStarfieldSpeed && setStarfieldSpeed(0.5)
            }}
            onFocus={() => {
              setStarfieldSpeed && setStarfieldSpeed(2)
            }}
            onBlur={() => {
              setStarfieldSpeed && setStarfieldSpeed(0.5)
            }}
          >
            <span className="relative z-10">Become an Epic Web Dev</span>
          </Button>
        }
      />
      <p className="pt-8 opacity-80 text-sm text-center">
        I respect your privacy. Unsubscribe at any time.
      </p>
    </>
  )
}
