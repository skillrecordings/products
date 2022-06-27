import * as React from 'react'
import EpicPlusTestingImage from '../../../public/images/pricing@2x.png'
import Spinner from '@skillrecordings/react/dist/components/spinner'
import Countdown from './countdown'
import Image from 'next/image'
import Link from 'next/link'
import find from 'lodash/find'
import get from 'lodash/get'
import axios from 'axios'

const Purchase = () => {
  const [state, setState] = React.useState<any>()
  const epicReactId = 'epic-react-pro-e28f'
  const testingJavaScriptId = 'pro-testing'

  const epicReactPrices = find(state, {slug: epicReactId})
  const testingJavaScriptPrices = find(state, {slug: testingJavaScriptId})

  let price =
    get(epicReactPrices, 'price') + get(testingJavaScriptPrices, 'price')
  let fullPrice =
    get(epicReactPrices, 'full_price') +
    get(testingJavaScriptPrices, 'full_price')

  // egghead api is not returning correct price with 10% discount
  // so we hardcode it. during sale this should still remain dynamic.
  if (price === fullPrice) {
    price = 837
    fullPrice = 931
  }

  const fetchPrice = React.useCallback(async () => {
    const body = JSON.stringify({
      site: 'kcdbundle',
      sellables: [
        {
          site: 'epic_react',
          sellable_id: 'epic-react-pro-e28f',
          sellable: 'playlist',
          quantity: 1,
        },
        {
          site: 'pro_testing',
          sellable_id: 'pro-testing',
          sellable: 'playlist',
          quantity: 1,
        },
      ],
    })
    await axios
      .post(`https://app.egghead.io/api/v1/sellable_purchases/prices`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(({data}) => setState(data))
      .catch((err) => console.debug(err.message))
  }, [])

  React.useEffect(() => {
    fetchPrice()
  }, [fetchPrice])

  const expiresAt =
    Number(epicReactPrices?.coupon?.coupon_expires_at) * 1000 || false

  const displayPrice = price
  const displayFullPrice = fullPrice

  const displayPercentOff = () => {
    if (!state) return
    const percentOff: number =
      ((displayFullPrice - displayPrice) / displayFullPrice) * 100
    return Number(percentOff.toFixed())
  }

  const DisplayPrice = () => {
    return (
      <div className="flex items-start">
        <div className="leading-none flex flex-start text-gray-700">
          <abbr title="the U.S. dollar" className="pr-px pt-px text-sm">
            USD
          </abbr>
          <span className="font-bold text-lg">$</span>
        </div>
        <span className="text-5xl font-bold tabular-nums">
          {displayPrice ? displayPrice : <Spinner className="my-3" />}
        </span>
      </div>
    )
  }

  const FullPrice = () => {
    if (!displayPrice) return null
    if (displayPrice === fullPrice) return null

    return (
      <div className="flex flex-col pl-2">
        <del className="text-3xl font-medium text-gray-500 tabular-nums leading-none">
          {displayFullPrice.toString()}
        </del>
        <div className="text-xs uppercase leading-none font-bold text-blue-500">
          Save {displayPercentOff()}%
        </div>
      </div>
    )
  }

  const PriceBox = () => {
    return (
      <div>
        <div className="flex items-center">
          <DisplayPrice />
          <FullPrice />
        </div>
        <div className="text-xs text-center pt-1 font-medium text-gray-600 uppercase tracking-wide">
          Forever Yours
        </div>
      </div>
    )
  }

  const PurchaseButton = () => {
    return (
      <div className="sm:px-10 px-5 py-2 w-full">
        <Link href="/buy/email">
          <a className="w-full flex items-center justify-center text-center bg-gradient-to-t from-blue-600 to-blue-500 rounded-md text-white px-5 py-4 font-medium shadow-md hover:scale-105 transition-all ease-in-out duration-200 hover:shadow-lg border border-blue-700 border-opacity-20">
            Level Up as a Web Developer
          </a>
        </Link>
      </div>
    )
  }

  const WhatsInside = () => {
    const contents = [
      {
        title: 'Epic React Pro Package',
        byline: 'Original price: $599',
        image: require('../../../public/images/epic-react/pro-package@2x.png'),
        items: [
          'All 8 interactive self-paced workshops full of dense React knowledge',
          '13 interviews with industry experts',
          'Full source code for all workshops',
          'Discord community access',
        ],
      },
      {
        title: 'Testing JavaScript Pro Package',
        byline: 'Original price: $332',
        image: require('../../../public/images/testing-js/pro-package@2x.png'),
        items: [
          'All 8 self-paced workshops full of dense testing knowledge',
          '10 interviews with industry experts',
          'Fullly annotated transcripts with inline code and screenshots',
          'Full source code for all workshops',
          'The Essential Testing Glossary',
          'Testing Checklist',
        ],
      },
    ]
    return (
      <div className="flex flex-col py-4 w-full">
        <div className="flex relative items-center justify-center">
          <div
            className="h-px bg-gray-100 w-full absolute left-0"
            aria-hidden
          />
          <div className="uppercase text-xs tracking-wide text-gray-600 text-center bg-white px-3 font-medium relative z-10">
            Includes
          </div>
        </div>
        <div className="p-5">
          {contents.map(({title, byline, image, items}, i) => {
            return (
              <div className="px-4 pt-4" key={title}>
                <div className="pb-2 flex items-center">
                  <Image
                    src={image}
                    width={48}
                    height={48}
                    quality={100}
                    alt={title}
                  />
                  <p className="font-medium leading-tight pl-1 text-lg">
                    {title}
                    <span className="block text-sm text-gray-600">
                      {byline}
                    </span>
                  </p>
                </div>
                <ul>
                  {items.map((item) => {
                    return (
                      <li key={item} className="list--check">
                        {item}
                      </li>
                    )
                  })}
                </ul>
                {i === 0 && (
                  <div
                    className="text-xl text-center text-gray-400 pt-4"
                    aria-hidden
                  >
                    +
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full max-w-sm bg-white shadow-smooth flex flex-col rounded-lg items-center mx-auto">
        <div className="max-w-[260px] -translate-y-10">
          <Image
            src={EpicPlusTestingImage}
            quality={100}
            placeholder="blur"
            alt="Epic React and Testing JavaScript by Kent C. Dodds"
          />
        </div>
        <form className="w-full flex flex-col items-center space-y-5">
          <PriceBox />
          <PurchaseButton />
          {expiresAt && (
            <div className="sm:px-5 px-2 w-full">
              <Countdown date={expiresAt} />
            </div>
          )}
          <WhatsInside />
        </form>
      </div>
    </>
  )
}

export default Purchase
