import {Product} from 'lib/products'
import {
  EXISTING_BULK_COUPON,
  INDIVIDUAL_TO_BULK_UPGRADE,
  NEW_BULK_COUPON,
  NEW_INDIVIDUAL_PURCHASE,
} from '@skillrecordings/types'
import * as React from 'react'
import Balancer from 'react-wrap-balancer'

type GetPostPurchaseThanksTextOptions = {
  stripeProductName: string
  seatsPurchased: number
  purchaseType: string
  product: Product
}

export const getPostPurchaseThanksText = (
  options: GetPostPurchaseThanksTextOptions,
) => {
  return options.product.type === 'live'
    ? getTextForLivePurchase(options)
    : getTextForSelfPacedPurchase(options)
}

function getTextForSelfPacedPurchase({
  purchaseType,
  product,
  seatsPurchased,
  stripeProductName,
}: GetPostPurchaseThanksTextOptions) {
  let byline = null
  let title = `Thank you for purchasing ${stripeProductName}`
  let loginLink = null

  switch (purchaseType) {
    case NEW_INDIVIDUAL_PURCHASE:
      loginLink = LoginLinkSelfPaced
      break
    case NEW_BULK_COUPON:
      byline = (
        <>
          Your purchase is for <strong>{seatsPurchased}</strong> seat
          {seatsPurchased > 1 && 's'}. You can always add more seats later when
          your team grows.
        </>
      )
      loginLink = LoginLinkSelfPaced
      break
    case EXISTING_BULK_COUPON:
      title = `Thank you for purchasing more seats for ${
        product?.title || process.env.NEXT_PUBLIC_SITE_TITLE
      }!`
      byline = (
        <>
          Your purchase is for <strong>{seatsPurchased}</strong> additional seat
          {seatsPurchased > 1 && 's'}. You can always add more seats later when
          your team grows.
        </>
      )

      break
    case INDIVIDUAL_TO_BULK_UPGRADE:
      title = `Thank you for purchasing more seats for ${
        product?.title || process.env.NEXT_PUBLIC_SITE_TITLE
      }!`
      byline = (
        <>
          Your purchase is for <strong>{seatsPurchased}</strong> additional seat
          {seatsPurchased > 1 && 's'}. You can always add more seats later when
          your team grows.
        </>
      )

      break
  }

  return {
    byline,
    title,
    loginLink,
  }
}

function getTextForLivePurchase({
  purchaseType,
  product,
  seatsPurchased,
  stripeProductName,
}: GetPostPurchaseThanksTextOptions) {
  let byline = null
  let title = `Thank you for purchasing ${stripeProductName}`
  let loginLink = null

  switch (purchaseType) {
    case NEW_INDIVIDUAL_PURCHASE:
      loginLink = LoginLinkLive
      break
    case NEW_BULK_COUPON:
      byline = (
        <>
          Your purchase is for <strong>{seatsPurchased}</strong> event ticket
          {seatsPurchased > 1 && 's'}. You can always add more tickets later
          before the event.
        </>
      )
      loginLink = LoginLinkLive
      break
    case EXISTING_BULK_COUPON:
      title = `Thank you for purchasing more tickets for ${
        product?.title || process.env.NEXT_PUBLIC_SITE_TITLE
      }!`
      byline = (
        <>
          Your purchase is for <strong>{seatsPurchased}</strong> event ticket
          {seatsPurchased > 1 && 's'}. You can always add more tickets later
          before the event.
        </>
      )

      break
    case INDIVIDUAL_TO_BULK_UPGRADE:
      title = `Thank you for purchasing more seats for ${
        product?.title || process.env.NEXT_PUBLIC_SITE_TITLE
      }!`
      byline = (
        <>
          Your purchase is for <strong>{seatsPurchased}</strong> event ticket
          {seatsPurchased > 1 && 's'}. You can always add more seats later
          before the event.
        </>
      )

      break
  }

  return {
    byline,
    title,
    loginLink,
  }
}

const LoginLinkSelfPaced: React.FC<{email: string}> = ({email}) => {
  return (
    <div className="relative mx-auto flex w-full items-center justify-center gap-5">
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <MailIcon />
          <h2 className="flex flex-col items-center justify-center break-all pt-3 text-center text-xl font-semibold">
            <span className="drop-shadow-sm">Login link sent to:</span>
            <span className="font-normal drop-shadow-sm">{email}</span>
          </h2>
        </div>
        <p className="max-w-sm pt-5 text-center text-sm opacity-90">
          <Balancer>
            As a final step to access the course you need to check your inbox (
            <strong>{email}</strong>) where you will find an email from{' '}
            <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> with a link
            to access your purchase and start learning.
          </Balancer>
        </p>
      </div>
    </div>
  )
}

const LoginLinkLive: React.FC<{email: string}> = ({email}) => {
  return (
    <div className="relative mx-auto flex w-full items-center justify-center gap-5">
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <MailIcon />
          <h2 className="flex flex-col items-center justify-center break-all pt-3 text-center text-xl font-semibold">
            <span className="drop-shadow-sm">Login link sent to:</span>
            <span className="font-normal drop-shadow-sm">{email}</span>
          </h2>
        </div>
        <p className="max-w-sm pt-5 text-center text-sm opacity-90">
          <Balancer>
            As a final step to access the event tickets you need to check your
            inbox (<strong>{email}</strong>) where you will find an email from{' '}
            <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> with a link
            to access your event tickets.
          </Balancer>
        </p>
      </div>
    </div>
  )
}

const MailIcon = () => {
  return (
    <div className="rounded-full bg-black/5 p-5 shadow-inner">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-12 w-12 brightness-110 drop-shadow-lg"
      >
        <title>send</title>
        <g>
          <path
            d="M13 43C12.798 43 17.046 25.702 17.046 25.702C17.15 25.368 17.421 25.112 17.761 25.029C18.1 24.943 18.46 25.046 18.707 25.293L25.707 32.293C25.912 32.498 26.018 32.781 25.997 33.071C25.976 33.36 25.832 33.626 25.6 33.8L13.6 42.8C13.423 42.934 13.211 43 13 43Z"
            fill="url(#nc-ui-3-0_linear_119_134)"
          ></path>
          <path
            d="M35.992 44.9999C35.779 44.9999 35.567 44.9319 35.392 44.7999L3.4 20.7999C3.11 20.5829 2.961 20.2279 3.008 19.8689C3.055 19.5109 3.292 19.2059 3.628 19.0709L43.629 3.07095C43.97 2.93595 44.358 2.99495 44.64 3.23095C44.922 3.46495 45.053 3.83495 44.981 4.19595L36.973 44.1959C36.906 44.5329 36.67 44.8109 36.349 44.9339C36.234 44.9779 36.113 44.9989 35.993 44.9989L35.992 44.9999Z"
            fill="url(#nc-ui-3-1_linear_119_134)"
          ></path>
          <path
            d="M13.001 43C12.947 43 12.894 42.996 12.84 42.987C12.356 42.908 12 42.49 12 42V27C12 26.684 12.15 26.386 12.404 26.197L43.404 3.19704C43.829 2.88204 44.423 2.95204 44.763 3.35304C45.104 3.75604 45.073 4.35404 44.693 4.72004L17.199 31.151L13.949 42.316C13.811 42.729 13.425 43 13.001 43Z"
            fill="url(#nc-ui-3-2_linear_119_134)"
          ></path>
          <defs>
            <linearGradient
              id="nc-ui-3-0_linear_119_134"
              x1="19.4963"
              y1="24.9991"
              x2="19.4963"
              y2="43"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A2A3B4"></stop>
              <stop offset="1" stopColor="#83849B"></stop>
            </linearGradient>
            <linearGradient
              id="nc-ui-3-1_linear_119_134"
              x1="24"
              y1="2.99976"
              x2="24"
              y2="44.9999"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#E0E0E6"></stop>
              <stop offset="1" stopColor="#C2C3CD"></stop>
            </linearGradient>
            <linearGradient
              id="nc-ui-3-2_linear_119_134"
              x1="28.4999"
              y1="2.99988"
              x2="28.4999"
              y2="43"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C2C3CD"></stop>
              <stop offset="1" stopColor="#A2A3B4"></stop>
            </linearGradient>
          </defs>
        </g>
      </svg>
    </div>
  )
}
