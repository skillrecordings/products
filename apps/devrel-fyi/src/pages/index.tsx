import React from 'react'
import Layout from '@/components/app/layout'
import type {GetStaticProps, NextPage} from 'next'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import {useRouter} from 'next/router'
import {trpc} from '@/trpc/trpc.client'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {getProduct} from '@/lib/products'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'
import {getAvailableBonuses} from '@/lib/available-bonuses'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import Container from '@/components/app/container'
import {getPage} from '@/lib/pages'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {cn} from '@skillrecordings/ui/utils/cn'
import {motion} from 'framer-motion'
import {Annotation} from '@/components/annotation'
import {
  AnimatedBurstPaths,
  AnimatedCirclePaths,
  AnimatedPenPaths,
  AnimatedPlanePaths,
  AnimatedScribblePaths,
  AnimatedThingy,
  InstructorBio,
  ListCheckmark,
  SoundWaveScribble,
} from '@/components/scribbles'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'
import {Logo} from '@/components/logo'

const defaultProductId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID

export const getStaticProps: GetStaticProps = async () => {
  // const defaultProduct = await getProduct(defaultProductId as string)
  // const products = await getAllProducts()
  // const availableBonuses = await getAvailableBonuses()
  const page = await getPage('/')
  const landingCopy = page.body && (await serializeMDX(page.body))

  return {
    props: {
      landingCopy,
      defaultProduct: null,
      products: [],
    },
    revalidate: 10,
  }
}

const Home: NextPage<{
  landingCopy?: MDXRemoteSerializeResult
  defaultProduct?: SanityProduct
  products: SanityProduct[]
  bonuses: any[]
}> = ({landingCopy, defaultProduct, products, bonuses}) => {
  const router = useRouter()
  const ALLOW_PURCHASE =
    router.query.allowPurchase === 'true' || defaultProduct?.state === 'active'
  const {subscriber, loadingSubscriber} = useConvertkit()
  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({
      ...router.query,
      productId: defaultProduct?.productId,
    })

  // TODO: should we move the coupon call down into `<Pricing>` so that it
  // can be called separate for each product?
  const productId = products[0].productId

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
    {
      id: productId,
      image: {
        url: 'https://res.cloudinary.com/epic-web/image/upload/v1695972887/coupon_2x.png',
        width: 132,
        height: 112,
      },
      title: defaultProduct?.title as string,
      description: defaultProduct?.description,
    },
  )

  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? commerceProps?.couponFromCode?.id : undefined)

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []

  const videoRef = React.useRef<HTMLVideoElement>(null)
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [])

  return (
    <Layout withFooter={false} className="overflow-x-hidden">
      <Container
        as="header"
        wrapperClassName="px-0 lg:px-0 sm:px-0"
        className="relative flex min-h-[calc(100svh-80px)] max-w-screen-2xl flex-col items-center justify-center overflow-hidden border-x-0 to-transparent px-0 text-center before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:bg-gradient-to-r before:from-background before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] sm:space-y-10 sm:before:w-56 sm:after:w-56 lg:px-0"
      >
        <video
          className="absolute left-0 top-0 z-0 h-full w-full object-cover opacity-75"
          ref={videoRef}
          playsInline
          poster="/hero-thumb.jpg"
          autoPlay
          muted
          loop
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <h1 className="relative z-10 scale-75 font-serif text-7xl lg:scale-100">
          <span className="relative inline-block">
            <span className="relative z-10 font-bold">Empower</span>
            <svg
              aria-hidden="true"
              className="absolute -left-20 -top-10 text-primary"
              width="59"
              height="77"
              viewBox="0 0 59 77"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27.1481 71.0655C31.3675 71.1315 34.6073 70.9995 37.8095 71.4948C38.2239 71.5608 38.8269 71.3298 38.9776 71.8251C39.1283 72.4194 38.4878 72.5515 37.998 72.6836C34.3437 73.7731 30.5764 74.6315 26.7338 75.0277C19.9526 75.7541 13.1713 76.3485 6.42781 76.9759C4.95855 77.1079 3.60229 76.7116 3.11254 75.4569C2.58511 74.0372 4.01669 73.4428 5.22224 73.1457C8.76352 72.2542 12.4179 71.8581 16.0722 71.5939C20.1032 71.2637 24.1341 70.8344 27.2233 71.0655H27.1481Z"
                fill="currentColor"
              />
              <path
                d="M40.1783 0C41.5853 0.263131 42.2518 1.31583 42.8443 2.29317C45.2509 6.39049 47.7316 10.4877 49.9902 14.6602C52.8041 19.8101 55.322 25.1478 58.4321 30.1097C58.7654 30.636 59.3948 31.3503 58.6543 31.8765C57.9878 32.3276 57.6914 31.4253 57.3212 31.0494C51.8784 25.7492 47.9909 19.2839 44.3254 12.6681C42.4371 9.24737 40.4376 5.86427 39.1788 2.10526C38.7344 0.752022 39.1418 0.338347 40.1415 0.0376268L40.1783 0Z"
                fill="currentColor"
              />
              <path
                d="M31.7297 40.9948C27.4911 39.4113 23.105 37.9902 18.8295 36.1631C13.4852 33.8893 8.25143 31.3314 2.98078 28.8547C2.72277 28.7329 2.4278 28.6922 2.16979 28.5298C0.806058 27.8396 -0.48388 26.7839 0.179558 25.038C0.806139 23.3733 2.31736 24.104 3.45995 24.5506C12.6375 28.286 21.299 33.1179 29.9237 38.1932C30.6978 38.6398 31.4718 39.0863 32.2458 39.5329C32.6512 39.7765 33.0933 40.0202 32.9828 40.5886C32.8353 41.2788 32.2457 40.8729 31.7297 40.9541V40.9948Z"
                fill="currentColor"
              />
            </svg>
            <svg
              className="absolute -left-10 -top-10 w-[370px] text-primary"
              aria-hidden="true"
              viewBox="0 0 240 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <AnimatedCirclePaths />
            </svg>
          </span>{' '}
          Developers
          <br />
          and{' '}
          <span className="relative inline-block font-bold">
            Grow
            <svg
              viewBox="0 0 500 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -left-10 top-5 w-[250px] text-primary"
            >
              <AnimatedScribblePaths />
            </svg>
          </span>{' '}
          Your Brand
        </h1>
        <h2 className="relative z-10 font-mono text-sm font-normal uppercase opacity-50">
          Professional DevRel™ Training
        </h2>
      </Container>
      <main
        className={cn('', {
          'border-t': landingCopy,
        })}
      >
        <article>
          <Container as="section" className="relative">
            <SoundWaveScribble />
            <div className="prose mx-auto w-full max-w-3xl px-3 py-24 sm:prose-lg lg:prose-xl sm:[&>p]:pl-16">
              <h2 className="not-prose relative mb-10 inline-block font-serif text-5xl text-foreground sm:mb-20 sm:mt-10 sm:text-6xl">
                <span className="">
                  Bridge the <br />
                  <strong>DevRel Gap</strong>
                </span>
                <svg
                  className="absolute -right-5 -top-20 text-primary sm:-right-20"
                  aria-hidden="true"
                  width="150"
                  height="150"
                  viewBox="0 0 150 150"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <AnimatedPlanePaths />
                </svg>
                <svg
                  className="text-primary"
                  width="321"
                  height="20"
                  viewBox="0 0 321 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.5153 17.2115C34.7583 18.0163 41.9511 17.2115 49.0935 16.7589C53.5701 16.5074 58.097 16.3565 62.5735 16.0044C73.6896 15.1996 84.8056 15.1493 95.9719 14.596C112.721 13.7409 129.521 13.7912 146.271 13.2379C161.964 12.6847 177.607 13.3385 193.3 12.6847C211.206 11.9805 229.062 12.7853 246.969 12.0308C263.769 11.3769 280.518 12.1817 297.318 11.3769C304.963 11.0248 312.558 11.9302 320.606 11.4775C318.946 12.7853 317.387 12.7853 315.828 12.7853C297.418 12.7853 279.059 13.2882 260.7 13.59C247.019 13.8415 233.388 13.4894 219.707 14.093C204.014 14.7972 188.371 14.0427 172.677 14.6966C161.511 15.1996 150.395 14.8978 139.229 15.1996C126.101 15.602 112.923 15.8032 99.7946 16.4068C89.9864 16.8595 80.1278 17.1612 70.3195 17.6642C51.9102 18.6199 33.5009 19.978 14.9909 19.9277C14.3873 19.9277 13.7838 19.9277 13.1802 19.9277C12.1742 19.9277 10.8664 19.9277 10.9167 18.6199C10.9167 17.5636 12.0233 17.0606 13.0796 16.9097C17.6065 16.2559 22.1334 15.5014 26.6602 14.4954C23.8938 14.4954 21.1274 14.4451 18.3609 14.4954C12.7275 14.6463 7.19463 13.6906 1.61147 13.2379C0.907284 13.1876 -0.0483924 13.0367 0.00190633 12.232C0.102504 11.0751 1.25937 11.3769 1.91326 11.4775C15.6951 13.5397 29.5776 12.735 43.4097 12.5338C55.7329 12.3326 68.0058 11.1254 80.329 10.3709C84.4535 10.1194 88.5277 10.0188 92.6522 9.76733C103.567 9.11345 114.482 8.91225 125.447 8.35897C141.492 7.60448 157.487 6.7494 173.533 5.89432C184.347 5.34104 195.161 4.73745 205.975 4.13387C220.914 3.32909 235.802 2.52431 250.691 1.66923C257.984 1.21654 265.277 0.612956 272.571 0.0596695C273.627 0.00937074 275.086 -0.29242 275.337 1.16624C275.589 2.9267 273.728 2.52431 272.923 2.62491C268.497 3.27879 264.02 3.73148 259.493 4.08357C249.836 4.88835 240.128 5.69313 230.471 6.39731C223.177 6.9003 215.884 7.35299 208.54 7.70508C193.602 8.40926 178.663 8.86195 163.775 9.61643C155.475 10.0691 147.176 10.4715 138.826 10.7733C124.491 11.2763 110.156 11.8799 95.821 12.6344C87.2199 13.087 78.6188 13.4894 69.9675 13.7409C59.0526 14.093 48.1881 14.7469 37.3236 16.0547C34.0542 16.4571 30.7847 16.608 27.5153 16.9097V17.2115Z"
                    fill="currentColor"
                  />
                </svg>
              </h2>
              <p>
                There's a disconnect in the corporate tech world. Companies want
                to make an impact across various platforms, but it's a struggle.
              </p>
              <p>
                Developer preferences change rapidly– not just in terms of
                technology, but also in terms of content and how it is consumed.
                Changes in the way platforms work behind the scenes adds another
                layer of complexity to an already tough situation.
              </p>
              <p>
                You need to be{' '}
                <Annotation as="strong">more than just informative</Annotation>.
                The content created by your company needs to be engaging and
                retain the audience of developers. You have to find the sweet
                spot between authenticity, enthusiasm, and reliability, whether
                it's on social media, blogs, podcasts, or on YouTube.
              </p>
              <p>
                It takes strategy and operational management to create a
                coherent cross-platform strategy. You have to balance the
                expectations of corporate stakeholders with the actual interests
                and expectations of developers.
              </p>
              <p>
                Imagine your content being not just informative but captivating,
                seamlessly blending technical expertise with engaging
                narratives. Visualize a content strategy that builds a vibrant
                community around your product. Dream of a{' '}
                <Annotation as="strong">DevRel team</Annotation> where
                authenticity and enthusiasm shines through, without coming
                across like the "fellow kids" meme.
              </p>
              <p>
                In this ideal DevRel world, your content transcends traditional
                corporate communication, striking the perfect blend of education
                and promotion, and resonates with developers across every
                platform.
              </p>
              <p>
                <strong>
                  <Logo className="mr-2 inline-block w-[85px]" />
                  is how you get there.
                </strong>
              </p>
            </div>
          </Container>
          <div className="sm:border-t">
            <Container as="section" className="relative">
              <svg
                className="absolute bottom-10 right-28 text-gray-200 dark:text-gray-800"
                width="120"
                height="80"
                viewBox="0 0 120 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M60.6963 63.6118C49.6397 63.5152 37.5209 61.8253 27.2851 56.6591C20.8636 53.6657 16.325 62.8393 13.8144 67.4261C13.2833 68.5365 11.8348 72.8819 10.8692 69.8884C8.11708 40.9192 3.57857 20.8338 37.714 11.9499C58.0408 7.16999 80.7817 7.45968 99.1771 18.3714C109.509 23.779 116.124 37.298 107.482 47.1476C95.9422 60.3286 77.4019 63.3221 60.6963 63.6118ZM12.0762 63.5635C12.1245 63.5635 12.2211 63.6118 12.2694 63.6118C15.0214 59.1215 17.6769 54.0036 23.4708 52.9414C27.3816 53.3277 30.7131 56.466 34.6722 57.1903C52.1021 62.791 71.3666 62.8393 88.6516 56.8523C100.143 53.2794 115.496 41.4986 106.371 28.5107C88.2171 5.86637 37.1346 5.23871 16.9044 25.4689C13.0901 29.428 11.69 34.1597 12.4142 39.6156C11.7382 47.5821 12.2211 55.5969 12.0762 63.5635Z"
                  fill="currentColor"
                />
                <path
                  d="M41.6249 34.6907C38.052 42.7056 34.286 45.6025 34.286 34.4493C32.3547 36.8152 31.3408 39.8569 29.0232 41.9331C28.3956 42.6573 27.3816 41.7882 28.1059 41.1123C30.52 37.7325 32.8375 34.3045 34.5274 30.4902C34.8171 29.3797 36.3138 29.8143 36.2173 30.8765C36.2655 33.8699 36.1207 36.4289 36.7966 39.519C40.7558 33.8699 44.8598 22.8133 43.7976 37.8291C45.7288 37.1048 49.5431 28.3658 51.5227 28.7038C53.1643 30.3454 51.233 35.2218 51.7641 37.5877C53.9851 35.8495 55.2887 32.6146 57.22 30.3454C61.5654 26.5793 58.2339 37.9739 59.0064 39.7604C61.2274 39.4707 64.752 29.09 66.3936 30.1039C68.0352 30.8282 66.4418 35.7529 66.8764 37.5877C66.7315 40.726 68.8077 38.9878 69.8216 37.4428C71.2701 35.9461 73.0565 30.8765 74.9395 30.7799C76.8225 31.8904 74.0221 36.5255 74.2636 38.5533C73.5876 44.1058 81.2162 33.2423 82.037 32.0352C82.7612 30.3936 84.4994 31.2627 83.9683 32.856C83.8234 34.5459 82.9543 36.7669 83.8234 38.2636C86.0444 39.2293 89.231 32.0835 90.2932 32.5663C90.7277 34.6907 88.2171 38.3119 86.6238 39.9052C83.3889 42.6573 80.9748 40.4846 80.6851 36.9117C78.3675 40.9191 71.2701 47.2441 71.946 38.1188C68.6145 43.3815 63.7863 42.8504 64.5106 36.1392C63.8346 36.2358 63.7381 36.6703 63.5932 37.0083C62.7241 38.6016 61.7102 40.0983 60.5997 41.4985C59.5858 43.1401 57.22 42.7056 56.8337 40.8226C56.0612 38.6499 57.1717 36.622 56.9303 34.401C54.8059 36.0426 53.3574 41.9331 50.6536 41.7882C48.2878 40.2915 50.2674 35.7047 49.5914 33.3871C47.6118 35.3184 45.7771 41.2088 42.9285 40.8708C40.4661 39.6155 42.0594 37.0083 41.6249 34.6907Z"
                  fill="currentColor"
                />
              </svg>
              <motion.svg
                style={{
                  rotateZ: 12,
                }}
                className="absolute bottom-20 right-10 text-primary"
                width="120"
                height="80"
                viewBox="0 0 120 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M67.0214 74.3849C55.2406 74.2883 41.2871 73.5641 28.8786 73.371C17.6772 73.8055 11.835 62.4592 12.0764 52.6097C12.9455 36.58 6.95852 6.78997 30.9064 6.93482C35.0104 7.03138 39.1627 6.11403 43.2667 6.11403C58.8618 5.72778 74.4569 6.40372 89.9554 6.93482C109.123 6.78997 108.351 26.1994 108.351 40.2977C110.958 76.4128 97.8254 74.1918 67.0214 74.3849ZM14.2491 44.5949C14.9734 52.2717 13.0421 63.0386 20.0913 68.4462C24.3884 72.7916 30.6168 71.15 36.1209 71.5846C40.3215 72.0674 44.522 72.4536 48.7225 72.4053C63.2072 70.7637 103.233 80.0339 105.454 59.7072C107.096 48.554 105.695 37.3525 106.082 26.1511C106.564 18.426 99.8533 10.1697 91.7419 10.6525C87.0585 10.3629 82.3752 9.54206 77.6918 9.54206C62.0967 10.6043 29.3131 3.69992 18.6428 15.1911C13.4283 19.971 14.5388 26.7788 14.5871 33.152C14.4905 36.8214 14.1526 40.4909 14.2491 44.5949Z"
                  fill="currentColor"
                />
                <path
                  d="M50.4607 54.7823C50.3158 45.6087 49.3502 36.4351 49.7365 27.2615C49.8813 25.282 50.5573 24.8474 52.2954 25.8614C58.8618 29.6274 65.6696 32.9106 71.9945 36.9663C73.5395 38.2699 79.0437 39.3804 76.0985 41.9393C73.2981 44.2568 70.2081 46.1399 67.1663 48.0711C62.6278 51.0163 57.6547 53.0925 52.9714 55.6997C51.9092 56.3274 50.171 56.5688 50.4607 54.7823ZM52.054 45.9467C52.392 47.0089 51.0884 54.4927 53.1645 52.4648C59.4412 48.6505 65.7178 44.8845 72.0428 41.0702C73.0567 40.4426 73.105 40.2977 72.1876 39.7666C65.911 35.8558 59.0066 32.9106 53.1162 28.3238C52.5851 27.8892 52.3437 28.1306 52.3437 28.7583C52.73 34.5039 51.9092 40.2012 52.054 45.9467Z"
                  fill="currentColor"
                />
              </motion.svg>
              <div className="prose mx-auto w-full max-w-3xl px-3 pb-40 pt-0 sm:prose-lg lg:prose-xl sm:pb-24 sm:pt-24 sm:[&>p]:pl-16">
                <h2 className="not-prose relative mb-10 inline-block font-serif text-5xl text-foreground sm:mb-20 sm:mt-10 sm:text-6xl">
                  <Balancer>
                    <strong>Solutions</strong> for Every Aspect of Developer
                    Relations
                  </Balancer>
                  <svg
                    className="absolute -left-20 -top-20 text-primary"
                    aria-hidden="true"
                    width="150"
                    height="150"
                    viewBox="0 0 150 150"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <AnimatedBurstPaths />
                  </svg>
                  <svg
                    className="text-primary"
                    aria-hidden="true"
                    width="329"
                    height="21"
                    viewBox="0 0 329 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M38.8159 13.3307C43.872 13.3307 48.8883 13.3307 53.8647 13.3307C54.7405 13.3307 55.6163 13.1317 56.4921 13.1317C67.5597 12.9327 78.5874 12.8529 89.655 12.5345C100.364 12.216 111.073 11.9374 121.783 11.6189C132.571 11.3004 143.36 11.1011 154.149 10.6632C170.432 9.98641 186.754 10.2653 203.037 10.3449C212.592 10.3449 222.186 11.1808 231.701 12.2159C232.697 12.3353 233.971 12.4946 234.05 13.7686C234.13 15.162 232.776 15.2416 231.861 15.4804C228.039 16.4757 224.058 16.6351 220.156 16.874C212.99 17.2721 205.784 17.7497 198.618 18.0284C191.97 18.2673 185.361 18.5459 178.713 18.944C165.256 19.8199 151.761 19.7403 138.304 19.9791C136.553 19.9791 134.761 20.5364 133.169 19.3819C133.368 18.6653 133.965 18.8645 134.363 18.8645C144.276 18.7053 154.149 17.5508 164.062 17.3517C171.348 17.1925 178.633 16.7543 185.918 16.396C195.274 15.9581 204.59 15.6396 213.906 14.923C217.33 14.6444 220.873 15.162 224.416 13.7686C221.948 13.3307 219.678 13.3306 217.449 13.2112C201.365 12.415 185.242 11.8179 169.118 12.2956C158.887 12.5743 148.655 12.8529 138.424 13.251C133.049 13.4501 127.635 13.0917 122.26 13.6889C116.687 14.2861 111.153 13.8085 105.619 14.0872C90.6105 14.8038 75.6016 14.7638 60.5928 15.2017C51.7945 15.4406 42.9962 15.8388 34.1979 16.0777C26.9921 16.2768 19.8262 16.7943 12.6203 17.0331C10.5103 17.1128 8.4002 17.4312 6.25039 17.4312C5.37454 17.4312 4.65793 17.272 4.49869 16.2369C4.29963 14.9629 5.29505 14.7239 6.13108 14.6443C10.9881 14.087 15.8848 13.6094 20.7417 13.0919C27.7485 12.3355 34.7155 11.579 41.7223 10.8226C47.057 10.2652 52.4314 9.74764 57.7661 9.2699C64.4544 8.63293 71.1429 8.03567 77.8311 7.4385C82.2502 7.04039 86.6691 6.7221 91.0881 6.40361C96.5422 6.0055 101.997 5.64702 107.451 4.97022C106.615 4.97022 105.779 4.97022 104.943 4.97022C83.8028 4.81098 62.6232 4.81116 41.4835 4.41305C33.2027 4.25381 24.8822 4.01494 16.6015 3.41777C11.426 3.05947 6.17082 3.17884 1.07498 2.10393C0.676869 2.02431 0.278679 2.02434 0 1.38736C0.756413 0.949436 1.59256 1.1485 2.34897 1.1485C17.7559 1.30775 33.1628 1.90475 48.5697 2.22324C70.1474 2.70097 91.6853 2.22322 113.223 2.70096C121.106 2.8602 128.949 3.01968 136.831 2.94006C148.655 2.82062 160.439 1.74553 172.263 1.50667C176.762 1.42704 181.301 1.26794 185.839 1.1485C191.651 0.989257 197.424 0.750244 203.236 0.750244C215.498 0.829867 227.72 0.750264 239.982 1.26781C253.08 1.78536 266.178 1.94456 279.276 2.22324C286.601 2.38248 293.887 2.34282 301.212 2.6215C309.771 2.9798 318.291 3.53706 326.81 4.01479C327.766 4.05461 329 4.09441 329 5.24893C329 6.5627 327.726 6.32399 326.81 6.40361C320.401 6.88135 314.031 6.48316 307.621 6.32391C299.699 6.12486 291.816 5.72682 283.894 5.40833C273.463 4.9306 263.033 3.77608 252.562 4.17419C237.992 4.73155 223.461 4.21399 208.89 4.65191C187.113 5.3287 165.296 4.69166 143.52 5.08977C134.761 5.24902 126.003 6.08503 117.284 6.80163C114.457 7.0405 111.631 7.15999 108.764 7.35904C103.27 7.71734 97.7368 8.0357 92.2826 8.71249C89.8541 9.03098 87.4256 8.95134 84.9573 9.1902C76.7163 10.0262 68.4355 10.504 60.1945 11.2206C53.0683 11.8576 45.9423 12.6141 38.7365 13.3307H38.8159Z"
                      fill="currentColor"
                    />
                  </svg>
                </h2>
                <p>
                  In this comprehensive workshop, you'll find solutions for
                  every aspect of your developer relations program: content
                  creation, audience engagement, strategic planning, and more.
                  You'll gain a{' '}
                  <Annotation as="strong">deep understanding</Annotation> of
                  every aspect of developer relations, from the technical to the
                  creative.
                </p>
                <ul className="flex flex-col pl-0 sm:pl-5 [&>li]:inline-flex [&>li]:items-baseline">
                  <li className="!mb-0 ">
                    <ListCheckmark />
                    <span>
                      <strong>Bridge the Gap:</strong> Showcase your technical
                      expertise in an engaging manner, overcoming technical and
                      creative limitations.
                    </span>
                  </li>
                  <li className="!my-0 ">
                    <ListCheckmark />
                    <span>
                      <strong>Engage Your Audience:</strong> Analyze developer
                      community trends, build dedicated communities, and
                      overcome stereotypes of corporate content.
                    </span>
                  </li>
                  <li className="!my-0 ">
                    <ListCheckmark />
                    <span>
                      <strong>Strategic Integration:</strong> Effectively
                      integrate YouTube strategy into your marketing goals,
                      balance content types, and manage resources efficiently.
                    </span>
                  </li>
                  <li className="!my-0 ">
                    <ListCheckmark />
                    <span>
                      <strong>Navigate Distribution Challenges:</strong> Address
                      platform restrictions, audience mismatches, and measure
                      ROI effectively while maintaining high content standards.
                    </span>
                  </li>
                  <li className="!my-0 ">
                    <ListCheckmark />
                    <span>
                      <strong>Form Effective Collaborations:</strong> Engage
                      with independent creators and strategize for smaller teams
                      and remote engagement.
                    </span>
                  </li>
                </ul>
              </div>
            </Container>
          </div>
          <div className="sm:border-t">
            <Container as="section" className="relative">
              <svg
                className="bottom-10 right-10 hidden sm:absolute sm:block"
                aria-hidden="true"
                width="177"
                height="159"
                viewBox="0 0 177 159"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_283_248)">
                  <path
                    d="M71.4024 69.0102C73.044 69.4798 75.0828 73.0478 76.4218 70.6102C78.0603 68.4821 80.627 60.6052 83.9804 63.9076C86.0377 64.9587 87.2339 71.5242 89.3473 69.8752C102.149 62.3741 114.456 53.8362 128.022 47.7327C128.404 47.5436 128.838 47.3841 129.116 47.6128C130.985 49.5803 141.217 47.3585 138.379 51.8C135.1 56.5331 142.089 70.8145 126.829 68.4938C125.597 68.2609 125.236 68.5308 125.399 69.7863C126.807 75.0392 121.157 78.1987 116.413 77.3044C115.262 77.0498 113.893 76.464 112.996 76.8342C111.989 77.2774 112.392 78.9449 111.903 80.0287C108.366 89.9413 106.069 81.8519 100.855 84.375C97.1568 85.9288 96.7585 86.382 99.2901 89.6881C104.573 97.9301 98.0856 96.507 91.9126 96.9051C89.9535 96.8671 89.9319 96.7862 90.2091 98.7908C91.9635 110.187 84.5237 121.535 73.4009 124.472C56.1911 129.906 39.9748 116.582 35.4607 100.381C29.2765 80.2112 51.2478 56.8275 71.4024 69.0102ZM134.494 54.2703C117.681 64.5786 100.533 74.2838 82.9336 83.1138C82.3304 83.4486 81.5656 83.8268 81.1145 82.9516C80.7364 82.1867 81.5957 81.9998 82.0373 81.7082C86.8139 78.5228 91.7657 75.5069 96.6664 72.4615C108.778 64.9719 121.297 58.196 133.744 51.3097C136.504 49.4875 128.007 49.2956 127.12 50.8326C115.246 59.2111 101.74 65.2121 89.3641 72.6858C88.0668 73.9862 87.6195 73.9328 86.6503 72.4169C81.2925 62.7656 82.9937 67.9831 77.7649 73.8449C76.6942 75.3444 76.1877 75.3935 74.8282 74.1987C63.6587 62.8999 44.4075 67.0188 38.8051 82.6384C30.8564 101.139 46.1117 124.292 66.3453 123.678C80.4312 124.364 91.457 110.236 87.7087 96.7323C87.2778 94.6391 87.6248 94.1563 89.8638 93.9462C96.2244 92.6316 100.664 95.9461 95.9419 88.5064C94.256 84.8006 93.9364 85.709 97.132 83.2504C100.056 80.9079 103.324 80.3354 106.713 82.1556C109.174 83.0985 109.495 78.6385 110.199 77.0639C110.845 72.0403 115.845 74.8583 119.207 74.477C123.287 74.5099 122.991 70.1718 123.979 67.3951C124.983 64.3543 128.779 65.5893 131.11 66.0473C135.337 67.5998 133.447 57.1494 134.494 54.2703Z"
                    className="text-primary"
                    fill="currentColor"
                  />
                  <path
                    d="M55.7587 95.1591C64.1633 99.5333 56.173 112.545 48.5412 107.66C40.0796 102.912 47.3996 90.4696 55.7587 95.1591ZM48.4553 98.935C45.2549 104.123 53.0504 108.488 55.766 103.429C58.7002 98.7018 51.2358 94.119 48.4553 98.935Z"
                    className="text-primary"
                    fill="currentColor"
                  />
                </g>
                <path
                  d="M74.3753 37.7551C71.396 39.4032 68.8284 41.7359 65.8975 43.4854C65.0982 43.9672 64.2989 44.4235 63.4753 44.8292C62.7486 45.1842 61.9493 45.3871 61.3437 44.6265C60.7382 43.8404 61.0047 42.9529 61.5861 42.2937C62.894 40.8231 64.2505 39.3524 65.6796 38.0086C68.2229 35.6252 70.7662 33.2418 73.1642 30.7063C74.9324 28.8554 76.7975 27.1312 78.7595 25.5085C79.2681 25.0775 79.801 24.7226 80.237 25.3058C80.6246 25.8636 79.8495 26.1172 79.5589 26.4214C75.5622 30.6557 71.8804 35.1942 67.5204 39.4539C68.3439 39.4539 68.7315 39.0483 69.0949 38.7694C73.6971 35.0422 78.8321 32.1516 83.5797 28.6525C84.3063 28.1201 85.1542 27.6637 85.9051 28.5004C86.7528 29.4386 86.0262 30.2247 85.4448 30.8586C83.0953 33.4702 80.6731 35.9802 78.0328 38.3129C77.718 38.5918 77.2577 38.7693 77.282 39.3271C77.1851 39.3271 76.9913 39.2765 77.1366 39.5046C77.1851 39.4286 77.2335 39.3778 77.2577 39.3018C79.2439 38.4143 80.7216 36.6901 82.6351 35.6252C84.6213 34.5349 86.5106 33.2673 88.4484 32.101C88.739 31.9235 89.0782 31.822 89.3931 31.7713C89.9744 31.6446 90.58 31.6699 90.9676 32.2277C91.3793 32.8362 91.3066 33.4448 90.8706 34.028C89.4657 35.8789 87.9154 37.6283 86.2925 39.3018C85.3721 40.2399 84.5001 41.2542 83.4343 42.3952C84.5728 41.9895 85.348 41.3048 86.22 40.8738C88.2304 39.8596 90.2892 38.8708 92.3481 37.9834C93.099 37.6538 93.9952 37.5016 94.625 38.2876C95.2547 39.0483 94.9884 39.9103 94.5766 40.6963C93.7531 42.2683 92.5419 43.4854 91.5004 44.8546C90.8706 45.6913 90.1924 46.452 89.4173 47.4408C90.58 47.7197 91.3793 47.0098 92.2512 46.8323C92.5661 46.7563 92.9295 46.4774 93.1475 46.8577C93.3655 47.2634 92.9537 47.4408 92.7115 47.669C91.0401 49.1142 89.1509 50.2552 87.3342 51.4722C86.5591 52.0047 85.6145 52.3597 84.912 51.3963C84.258 50.5088 84.3548 49.4439 84.9604 48.5819C86.1472 46.8831 87.4795 45.2603 88.739 43.6376C88.957 43.3587 89.1508 43.1051 89.4656 42.6994C87.9396 42.6234 86.9708 43.5615 85.9051 44.1193C83.7251 45.2603 81.6904 46.7309 79.3893 47.6437C78.4931 47.9987 77.7907 47.8466 77.1851 47.162C76.5311 46.4267 76.6038 45.6659 77.1366 44.8292C78.2024 43.1557 79.5588 41.812 81.0606 40.6203C81.9326 39.961 82.6592 39.2004 83.4101 38.4144C82.9499 37.9834 82.732 38.4144 82.4898 38.5411C79.2682 40.7217 76.1678 43.1304 72.7524 45.0321C72.0258 45.4377 71.3718 45.9448 70.4998 45.9702C69.1191 45.9702 68.4893 45.032 69.0706 43.7389C69.8942 41.888 71.396 40.6456 72.8735 39.4539C73.4306 38.9975 74.0847 38.6172 74.4238 37.9326C74.6418 37.8566 74.8597 37.7805 74.9323 37.5016C75.0292 37.4509 75.2473 37.4762 75.0293 37.2734C74.9809 37.3494 74.9567 37.4255 74.9082 37.4763C74.6418 37.4255 74.4479 37.5269 74.3268 37.7551H74.3753ZM83.9673 37.7551L84.258 37.4509C84.258 37.4509 84.3064 37.3749 84.3548 37.3495C84.3548 37.4002 84.3064 37.4255 84.2822 37.4763C84.1853 37.5777 84.0884 37.6791 83.9916 37.7805C83.9189 37.8312 83.6767 37.7298 83.8462 37.9834L83.9673 37.7805V37.7551Z"
                  className="text-gray-200 dark:text-gray-800"
                  fill="currentColor"
                />
                <path
                  d="M142.621 107.783C140.125 108.652 137.28 108.126 134.461 108.442C131.697 108.758 128.878 108.231 126.114 107.757C126.006 107.757 125.926 107.651 125.818 107.651C122.463 107.362 122.275 105.887 123.483 103.306C125.496 98.9331 127.778 94.6922 130.381 90.6094C131.428 88.95 131.938 88.8711 133.468 90.0564C134.595 90.952 135.374 92.1636 136.206 93.2962C138.541 96.536 141.494 99.2755 143.748 102.594C144.124 103.147 144.554 103.701 144.876 104.306C145.305 105.07 145.654 105.755 146.728 105.781C147.238 105.781 147.748 106.256 147.721 106.861C147.694 107.573 147.077 107.573 146.513 107.599C145.305 107.599 144.124 108.257 142.621 107.81V107.783ZM125.308 105.65C130.891 105.834 136.286 105.439 141.977 105.307C138.246 101.146 134.569 97.3262 132.287 92.1636C130.113 97.0102 127.724 101.277 125.308 105.65Z"
                  className="text-gray-200 dark:text-gray-800"
                  fill="currentColor"
                />
                <path
                  d="M134.358 15.2843C128.158 17.6022 121.689 17.5233 115.113 17.5497C116.455 22.7123 115.435 27.875 115.462 33.0113C115.462 35.2766 115.381 35.2502 117.555 34.618C121.421 33.5117 125.393 33.0903 129.393 33.0377C130.547 33.0377 131.084 32.8005 130.949 31.5625C130.601 28.6914 131.218 25.8204 131.245 22.9494C131.245 21.8167 131.62 20.7105 131.594 19.5516C131.594 18.7877 131.943 18.0237 133.043 18.1027C134.144 18.1817 134.063 18.9194 134.117 19.6832C134.519 25.1883 133.902 30.6144 132.828 36.0141C132.748 36.4092 132.909 36.936 132.318 37.015C131.728 37.0677 131.755 36.4617 131.594 36.1456C130.574 34.1174 130.6 34.1174 128.373 34.8286C124.615 35.9876 120.723 36.5409 116.965 37.6472C115.703 38.0159 114.442 37.7789 113.878 36.0405C113.368 34.4864 112.885 33.0377 112.885 31.3782C112.939 27.4272 112.939 23.5026 112.805 19.5516C112.778 18.3663 113.368 17.4707 113.61 16.4171C113.744 15.8113 114.522 15.7848 115.086 15.6531C119.756 14.6785 124.507 14.5733 129.285 14.5996C130.976 14.5996 132.613 14.9419 134.331 15.2843H134.358Z"
                  className="text-gray-200 dark:text-gray-800"
                  fill="currentColor"
                />
                <defs>
                  <clipPath id="clip0_283_248">
                    <rect
                      width="147.036"
                      height="98.0241"
                      fill="white"
                      transform="translate(0 73.5181) rotate(-30)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <div className="mx-auto flex w-full max-w-screen-lg flex-col px-3 py-5 sm:py-48 xl:flex-row">
                <h2 className="not-prose relative mb-10 inline-block max-w-lg font-serif text-5xl text-foreground sm:text-6xl xl:mb-0 xl:flex-shrink-0">
                  <span className="">
                    Transform Your <br />
                    <strong>DevRel Program</strong>
                  </span>
                  <svg
                    className="absolute -bottom-10 -right-16 w-[320px] text-primary sm:-right-28"
                    aria-hidden="true"
                    viewBox="0 0 240 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <AnimatedPenPaths />
                  </svg>
                </h2>
                <p className="font-light leading-relaxed opacity-90 sm:pl-40 sm:text-lg sm:leading-relaxed lg:text-xl lg:leading-relaxed">
                  DevRel.fyi is your key to transform the way your company
                  engages with developers. Together we'll transform your
                  challenges into strengths, and set a new standard for the
                  content you create and share.
                </p>
              </div>
            </Container>
          </div>
        </article>
        <InstructorBio />
        {ALLOW_PURCHASE ? (
          <section id="buy">
            {products
              ?.filter((product: any) => product.state !== 'unavailable')
              .map((product, i) => {
                return (
                  <PriceCheckProvider
                    key={product.slug}
                    purchasedProductIds={purchasedProductIds}
                  >
                    <div data-pricing-container="" key={product.name}>
                      <Pricing
                        bonuses={bonuses}
                        allowPurchase={ALLOW_PURCHASE}
                        userId={commerceProps?.userId}
                        product={product}
                        purchased={purchasedProductIds.includes(
                          product.productId,
                        )}
                        index={i}
                        couponId={couponId}
                      />
                    </div>
                  </PriceCheckProvider>
                )
              })}
          </section>
        ) : (
          <div className="sm:border-t" id="join">
            <Container
              className="flex max-w-none items-center justify-center py-20 sm:px-0 sm:py-40 lg:px-0"
              wrapperClassName="sm:px-0 lg:px-0 px-0 bg-primary text-primary-foreground"
            >
              {subscriber ? (
                <p>You're subscribed, thanks!</p>
              ) : (
                <PrimaryNewsletterCta className="w-full" />
              )}
            </Container>
          </div>
        )}
        <Container
          as="section"
          className="flex w-full items-center justify-center py-24"
        >
          <Link href="/" className="relative">
            <AnimatedThingy className="absolute h-full w-full mix-blend-difference" />
            <Logo />
            {/* <svg
              className="text-gray-300 dark:text-gray-700"
              width="93"
              height="44"
              viewBox="0 0 93 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.110224 44C3.63394 33.0672 10.2773 23.8078 15.8565 13.8418C11.9658 14.2137 8.29546 14.4368 4.62492 14.9574C3.52375 15.1061 2.45924 14.9573 1.35808 15.106C0.807501 15.1804 0.293822 14.9573 0.183706 14.3623C0.110295 13.7301 0.587053 13.47 1.13763 13.3956C3.78042 12.9494 6.42337 12.4658 9.10287 12.0939C11.5621 11.7221 14.0214 11.499 16.4807 11.1643C17.435 11.0155 18.1324 10.5322 18.7197 9.63974C20.1145 7.40855 21.6927 5.28893 23.1976 3.13211C23.5647 2.6115 23.6382 1.42146 24.6659 2.128C25.5836 2.72299 24.7763 3.46679 24.4459 4.06177C23.3081 6.10703 22.0968 8.11514 20.7754 10.3835C25.2167 10.2348 29.3274 9.52823 33.2916 8.52419C35.2737 8.00358 35.7876 5.6236 36.9621 4.06177C37.9532 2.79743 38.8344 1.45876 40.0457 0.380348C40.5596 -0.0658897 41.2567 -0.140372 41.6238 0.26868C42.101 0.78929 41.3667 1.16122 41.0364 1.4959C39.4948 3.02054 38.5408 4.95429 37.2928 6.66487C37.0726 6.99955 36.8888 7.33407 37.0724 7.66875C37.3293 8.18936 37.77 8.00346 38.2104 7.92908C47.4235 6.47881 56.5995 5.0286 65.8125 3.57833C66.6568 3.42958 67.5012 3.13208 68.3454 2.87178C69.2631 2.57429 70.034 2.90889 70.3277 3.72699C70.6213 4.61947 69.7768 5.14002 69.1161 5.28876C66.9138 5.84656 64.7117 6.293 62.5094 6.66487C56.3796 7.74328 50.2865 8.82149 44.1567 9.71396C41.3671 10.123 38.6141 10.7182 35.8245 11.0901C34.7233 11.2388 34.1361 11.6105 33.6223 12.5029C32.2275 14.8085 30.7223 17.077 29.2541 19.3826C30.135 19.9032 30.6491 19.1595 31.3098 18.9736C32.3009 18.6761 33.3283 18.4156 34.1725 19.2337C34.98 19.9774 34.8703 20.9072 34.5766 21.9112C34.1729 23.2499 33.8058 24.5888 33.5855 25.9647C33.4387 27.0059 33.2182 28.233 35.0901 27.3033C38.6138 25.5927 42.1746 23.9937 44.1567 20.275C44.4503 19.7544 44.744 19.2337 45.1111 18.8247C46.0287 17.8207 47.1663 16.0358 48.4509 17.1143C49.9192 18.3786 47.8638 19.2709 47.1663 20.2378C46.3955 21.279 44.8175 22.3575 45.5883 23.5847C46.4325 24.8862 48.0106 23.7705 49.0751 23.2127C53.3696 20.9443 57.5171 18.4529 60.7839 14.697C61.4079 13.9905 62.2892 13.3583 63.0233 13.9905C63.9777 14.7714 63.0967 15.5524 62.5094 16.1846C62.3626 16.3333 62.2158 16.5193 62.069 16.668C61.188 17.6349 60.5274 18.6016 61.1881 20.0147C61.5184 20.7212 62.0687 21.0186 62.7661 20.8699C64.1609 20.6096 65.2621 19.7543 65.4823 18.3412C65.7392 16.4076 65.9597 14.3995 63.9042 13.0236C63.2435 12.6146 62.5459 11.6105 63.2066 10.7181C63.9774 9.71403 64.7851 10.2717 65.666 10.8667C67.7215 12.2426 70.1071 11.6477 72.2727 11.4246C77.5583 10.904 82.8075 10.1232 87.7627 8.00353C88.8272 7.55729 90.0382 7.33402 90.6622 6.21842C91.176 5.28876 91.9102 5.10285 92.6077 5.7722C93.3418 6.51593 92.9381 7.37121 92.2774 7.85464C90.4789 9.23054 88.4601 10.272 86.3312 11.0901C80.7152 13.1725 74.9158 14.0649 68.9328 13.8046C67.4646 13.7302 66.9505 13.9162 67.2808 15.7012C67.9048 19.2339 66.6568 21.5393 64.0507 22.7292C62.0686 23.6217 60.4171 23.2499 59.2058 21.1675C58.3983 19.7544 57.9212 20.0147 56.9301 20.7585C54.0304 22.9525 51.057 25.0721 47.5333 26.3364C46.1385 26.8199 44.8173 26.6712 44.0832 25.9274C42.6517 24.44 41.8074 25.4068 40.8164 26.1505C38.8343 27.6752 36.742 28.9766 34.3195 29.7575C32.5576 30.3153 31.3465 29.4602 31.2731 27.5636C31.163 25.5928 32.044 23.8077 32.3009 21.9112C32.3743 21.4278 32.8515 20.9072 32.2642 20.5353C31.8604 20.275 31.4564 20.5354 31.0526 20.7957C28.52 22.2088 26.2809 23.9193 24.6292 26.3364C23.1243 28.4932 21.7298 30.7617 19.8945 32.6954C19.3439 33.2532 18.8667 34.1457 17.9857 33.4019C17.2149 32.7326 17.9857 32.026 18.3894 31.5054C22.7207 25.7415 26.6116 19.6429 30.4657 13.5815C31.3466 12.1684 31.2729 11.7594 29.6945 11.9453C26.1708 12.3543 22.6471 12.8377 19.1601 13.2839C18.426 13.3955 18.3529 14.065 18.0592 14.5484C12.4066 23.845 6.71694 33.1415 1.6883 42.81C1.43137 43.3306 1.32139 44.1859 0 43.9256L0.110224 44Z"
                fill="currentColor"
              />
            </svg> */}
          </Link>
        </Container>
      </main>
    </Layout>
  )
}

export default Home
