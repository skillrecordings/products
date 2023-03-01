import React from 'react'
import type {NextPage} from 'next'
import {useRouter} from 'next/router'
import Image from 'next/legacy/image'
import Layout from 'components/layout'
import toast from 'react-hot-toast'
import Simon from '../../public/assets/simon-vrachliotis.png'
import SimonWithPuppies from '../../public/assets/simon-with-puppies.jpg'
import SurfingCorgi from '../../public/assets/surfing-corgi.svg'
import NewsletterSubscribeForm from 'components/subscribe-form'
import LandingCopy from 'components/landing-copy.mdx'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {getActiveProducts} from '../path-to-purchase-react/products.server'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '../path-to-purchase-react/use-coupon'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const token = await getToken({req})
  const {products = []} = await getActiveProducts()

  return await propsForCommerce({query, token, products})
}

const Home: React.FC<React.PropsWithChildren<CommerceProps>> = (props) => {
  const router = useRouter()
  const {
    couponFromCode,
    purchases = [],
    userId,
    products,
    couponIdFromCoupon,
    defaultCoupon,
  } = props

  React.useEffect(() => {
    const {query} = router
    if (query.message) {
      toast(query.message as string, {
        icon: '✅',
      })
    }
  }, [router])

  const {redeemableCoupon, RedeemDialogForCoupon} = useCoupon(couponFromCode)

  return (
    <Layout meta={{titleAppendSiteName: false}} defaultCoupon={defaultCoupon}>
      <Header />
      <main>
        <Copy />
        <NewsletterSubscribeForm />
        <Bio />
      </main>
      {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
    </Layout>
  )
}

export default Home

const Header = () => {
  return (
    <header className="w-full px-8 pt-10 pb-16 sm:pt-28 sm:pb-28">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-16 md:flex-row">
        <div className="flex w-80 items-center justify-center md:w-auto lg:flex-shrink-0">
          <Image
            src={SurfingCorgi}
            alt=""
            aria-hidden="true"
            quality={100}
            priority
          />
        </div>
        <HeaderContent />
      </div>
    </header>
  )
}

const HeaderContent = () => {
  return (
    <div className="flex w-full flex-col items-center md:items-start">
      <h1 className="mx-auto max-w-[19ch] text-center font-heading text-4xl font-black tracking-tight sm:text-5xl md:ml-0 md:text-left xl:text-6xl">
        Advanced Tailwind CSS{' '}
        <span className="text-brand-red">Concepts & Patterns</span>
      </h1>
      <p className="max-w-sm pt-5 text-center text-lg sm:text-xl md:text-left">
        Increase development velocity and craft sustainable systems for your
        team
      </p>
      <Instructor />
    </div>
  )
}

const Instructor = () => {
  return (
    <div className="flex items-center gap-3 pt-10">
      <div className="flex items-center justify-center overflow-hidden rounded-full">
        <Image src={Simon} alt="Simon Vrachliotis" width={64} height={64} />
      </div>
      <div>
        New course by
        <div className="font-semibold">Simon Vrachliotis</div>
      </div>
    </div>
  )
}

const Copy = () => {
  return (
    <div className="prose mx-auto w-full max-w-2xl px-5 pb-16 sm:prose-lg md:px-0">
      <LandingCopy />
    </div>
  )
}

const Bio = () => {
  return (
    <section className="relative z-10 -mt-24 flex items-center justify-center py-10 px-5 sm:py-16 md:mt-0 lg:py-24">
      <div className="flex max-w-screen-sm flex-col items-center justify-center gap-10 md:max-w-screen-md md:flex-row md:items-start">
        <div className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-md shadow-xl ring-4 ring-white/30">
          <Image
            src={SimonWithPuppies}
            width={180}
            height={240}
            placeholder="blur"
            loading={'eager'}
            alt="Simon Vrachliotis"
            className="object-cover"
          />
        </div>
        <div className="max-w-md space-y-4 text-lg leading-relaxed md:max-w-none">
          <p>
            Hi, I'm Simon. <span aria-label="waving hand">👋</span>
          </p>
          <p>
            I'm a hybrid designer, developer and content creator with an
            optimistic and enthusiastic approach to life!
          </p>
          <p>
            Rather than pretending to be a "10×" developer, I take pride in
            helping people around me get more productive ❤️
          </p>
          <p className="font-semibold">
            I will be your Pro Tailwind instructor. Let's have some fun!
          </p>
        </div>
      </div>
    </section>
  )
}
