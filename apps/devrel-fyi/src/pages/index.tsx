import React from 'react'
import Layout from '@/components/app/layout'
import type {GetStaticProps, NextPage} from 'next'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import Balancer from 'react-wrap-balancer'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
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
import Image from 'next/image'
import Link from 'next/link'
import {getPage} from '@/lib/pages'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {cn} from '@skillrecordings/ui/utils/cn'
import {isBrowser} from '@skillrecordings/skill-lesson/utils/is-browser'
import {motion} from 'framer-motion'
import {motion as motion3d} from 'framer-motion-3d'
import {Icosahedron, Text, useTexture, Decal} from '@react-three/drei'
import {useMedia} from 'react-use'
import * as THREE from 'three'

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

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
    {
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

  return (
    <Layout>
      <Container
        as="header"
        className="relative flex min-h-[calc(100svh-80px-80px)] flex-col items-center justify-center space-y-4 overflow-hidden px-0 text-center sm:space-y-10 lg:px-0"
      >
        <Hero />
        <motion.h1
          animate={{
            opacity: [0, 0.95],
            y: [-50, 0],
          }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: 'easeInOut',
          }}
          initial={{
            opacity: 0,
            y: -50,
          }}
          className="pointer-events-none relative z-10 whitespace-nowrap text-center text-3xl sm:text-5xl md:sr-only lg:text-6xl"
        >
          Empower Developers
          <br /> and Grow Your Brand
        </motion.h1>
        <motion.h2
          animate={{
            opacity: [0, 0.75],
            y: [5, 0],
          }}
          transition={{
            duration: 1,
            delay: 0.6,
            ease: 'easeInOut',
          }}
          initial={{
            opacity: 0,
            y: 5,
          }}
          className="pointer-events-none relative z-10 font-mono text-xs uppercase text-primary opacity-75 shadow-primary/80 drop-shadow-lg sm:text-sm md:sr-only"
        >
          Professional DevRel™ Training
        </motion.h2>
      </Container>
      <div className="flex h-20 w-full justify-center gap-2 border-t font-mono text-sm">
        <Container className="flex h-full items-center justify-between">
          <div className="flex h-full items-center gap-5">
            <Link
              href="https://x.com/t3dotgg"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-center gap-2"
            >
              <Image
                className="inline-flex rounded-[2px]"
                src={require('../../public/theo.jpg')}
                alt="Theo"
                width={48}
                height={48}
              />
              <div className="flex flex-col opacity-75 transition group-hover:opacity-100">
                <span className="font-sans text-base font-medium leading-tight">
                  Theo - t3.gg
                </span>
                <span className="flex items-center gap-1 font-sans text-sm font-light opacity-75">
                  <span>Author & Instructor</span>
                  {/* <svg
                    viewBox="0 0 24 24"
                    className="inline-block h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  >
                    <g>
                      <path
                        fill="currentColor"
                        d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"
                      ></path>
                    </g>
                  </svg>
                  <span>San Francisco, CA</span> */}
                </span>
              </div>
            </Link>
          </div>
          <div className="flex h-full items-center gap-5">
            <div className="relative flex h-full items-center gap-1 opacity-50">
              <AnimatedThingy className="absolute -right-1/2" />
              <AnimatedThingy className="absolute -right-1/2 z-20 opacity-90 mix-blend-difference [&>div]:bg-foreground" />
              <svg
                className="relative z-10 w-5"
                viewBox="0 0 16 18"
                aria-hidden="true"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.9927 5.06245C15.9898 5.02826 15.9876 4.9941 15.9737 4.96062C15.9701 4.95189 15.9628 4.94606 15.9585 4.93734C15.949 4.91917 15.9381 4.90389 15.9257 4.88715C15.901 4.85296 15.8734 4.8246 15.8399 4.80135C15.8312 4.79552 15.8276 4.78461 15.8181 4.77953L8.18179 0.415911C8.0698 0.351923 7.93306 0.351923 7.82107 0.415911L0.184737 4.77953C0.17601 4.78536 0.172362 4.79552 0.163635 4.80135C0.128726 4.82535 0.0988963 4.85443 0.0734646 4.8908C0.0632714 4.90536 0.0531124 4.91845 0.0451011 4.93444C0.0400215 4.94388 0.0320102 4.95043 0.0276466 4.96062C0.011658 5.00061 0.00654438 5.04206 0.00511257 5.0828C0.00511257 5.08716 0.00146484 5.09153 0.00146484 5.09589V5.10172C0.00146484 5.10244 0.00146484 5.10244 0.00146484 5.10319V13.0908C0.00146484 13.0915 0.00146484 13.093 0.00146484 13.0937V13.0959C0.00146484 13.1031 0.00654435 13.1097 0.00729435 13.117C0.0101921 13.1679 0.0182034 13.2188 0.0429192 13.2653C0.0443851 13.2682 0.0472829 13.269 0.0487488 13.2719C0.0581919 13.2886 0.0749305 13.2995 0.0873054 13.3148C0.114203 13.3482 0.140385 13.381 0.176044 13.4035C0.179691 13.4057 0.181123 13.4101 0.184055 13.4115L7.82039 17.7752C7.87712 17.8072 7.93893 17.8232 8.00148 17.8232C8.06404 17.8232 8.12585 17.8072 8.18186 17.7752L15.8182 13.4115C15.8218 13.4094 15.8233 13.405 15.8269 13.4028C15.8604 13.3825 15.8836 13.3519 15.9091 13.3214C15.9237 13.3039 15.9433 13.2908 15.9542 13.2712C15.9557 13.269 15.9579 13.2676 15.9593 13.2654C15.9789 13.2276 15.9826 13.1861 15.9884 13.1454C15.9906 13.1286 16.0015 13.1134 16.0015 13.0959V5.09589C16.0014 5.08427 15.9934 5.07407 15.9927 5.06245ZM14.8029 5.0377L12.1352 6.1046L9.20144 1.83698L14.8029 5.0377ZM8.00145 1.37373L11.3105 6.1868H4.69236L8.00145 1.37373ZM6.79927 1.83773L3.8662 6.10464L1.19928 5.0377L6.79927 1.83773ZM0.728724 5.63262L3.48217 6.73443L0.728724 11.6915V5.63262ZM4.00001 7.3017L7.35198 13.3962L0.952734 12.7868L4.00001 7.3017ZM7.6378 16.8326L2.00873 13.6166L7.6378 14.1475V16.8326ZM8.00145 13.0682L4.61674 6.91405H11.3862L8.00145 13.0682ZM8.36506 16.8326V14.154L13.9912 13.618L8.36506 16.8326ZM8.6487 13.4028L12.0036 7.30388L15.0501 12.7875L8.6487 13.4028ZM15.2741 11.693L12.5192 6.73443L15.2741 5.63262V11.693Z"
                  fill="currentColor"
                />
              </svg>
              {/* <span className="text-base">©</span> {new Date().getFullYear()}{' '} */}
            </div>
          </div>
        </Container>
      </div>

      <main
        className={cn('', {
          'border-t': landingCopy,
        })}
      >
        {landingCopy && (
          <Container>
            <article className="prose mx-auto w-full max-w-2xl px-3 py-24 sm:prose-lg lg:prose-xl">
              <MDX contents={landingCopy} />
            </article>
          </Container>
        )}
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
        ) : subscriber ? null : (
          <div className="border-t" id="join">
            <Container className="flex items-center justify-center px-0 sm:px-0 lg:px-0">
              <PrimaryNewsletterCta className="w-full" />
            </Container>
          </div>
        )}
      </main>
    </Layout>
  )
}

export default Home

const Hero = () => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isMdScreen = useMedia('(min-width: 768px)')
  return mounted ? (
    <motion.div
      className="absolute left-0 top-0 h-full w-full"
      animate={{opacity: [0, 1]}}
      initial={{opacity: 0}}
      transition={{
        duration: 1,
        delay: 0.1,
        ease: 'easeInOut',
      }}
    >
      <Canvas
        camera={{position: [0, 0, 5], fov: 50}}
        gl={{antialias: true}}
        dpr={isBrowser() ? window.devicePixelRatio : 1}
        style={{
          height: '100%',
          position: 'absolute',
          background: '#000',
        }}
        shadows
      >
        <Object />
        <ambientLight intensity={0.5} />
        <spotLight
          intensity={0.7}
          position={[20, 10, 10]}
          angle={0.2}
          penumbra={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        <spotLight
          intensity={0.2}
          position={[-20, -10, 10]}
          angle={0.2}
          penumbra={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        {isMdScreen && (
          <>
            <motion3d.group
              receiveShadow
              animate={{
                opacity: [0, 0.95],
                y: [0.2, 0],
              }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: 'easeInOut',
              }}
              initial={{
                opacity: 0,
                y: 0.2,
              }}
              position={[0, 0, -0.4]}
            >
              <Text
                // color="white"
                material={new THREE.MeshStandardMaterial({color: '#fafafa'})}
                receiveShadow
                fillOpacity={0.9}
                fontSize={0.325}
                font={'/fonts/378efe47-19c4-4140-a227-728b09adde45.woff'}
                position={[0, 0.3, 0]}
              >{`Empower Developers`}</Text>
              <Text
                material={new THREE.MeshStandardMaterial({color: '#fafafa'})}
                receiveShadow
                font={'/fonts/378efe47-19c4-4140-a227-728b09adde45.woff'}
                fillOpacity={0.9}
                fontSize={0.325}
                position={[0, -0.05, 0]}
              >{`and Grow Your Brand`}</Text>
            </motion3d.group>
            <motion3d.group
              position={[0, 0, -0.4]}
              animate={{
                opacity: [0, 1],
                y: [-0.15, 0],
              }}
              transition={{
                duration: 1,
                delay: 0.4,
                ease: 'easeInOut',
              }}
              initial={{
                opacity: 0,
                y: -0.15,
              }}
            >
              <Text
                material={new THREE.MeshStandardMaterial({color: '#1FD073'})}
                receiveShadow
                font={'/fonts/fcf3fad0-df0b-4a20-9c50-e5748f25a15d.woff'}
                fillOpacity={1}
                fontSize={0.08}
                position={[0, -0.45, 0]}
              >
                {'PROFESSIONAL DEVREL™ TRAINING'}
              </Text>
            </motion3d.group>
          </>
        )}
        <mesh receiveShadow position={[0, 0, -0.42]}>
          <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
          <meshPhongMaterial attach="material" color="#171717" />
        </mesh>
      </Canvas>
    </motion.div>
  ) : null
}

function Object() {
  const {viewport, scene, size} = useThree()
  const targetPosition = [0, 0, 0]
  const targetRotation = [0, 0, 0]
  const smoothFactor = 0.1 // Adjust this value to control the smoothness

  const ref = React.useRef<any>(null)

  useFrame(({mouse}) => {
    if ((mouse.x === 0 && mouse.y === 0) || !mouse) {
      ref.current.position.x = viewport.width / 2.3
      ref.current.position.y = viewport.height / 2.7
    }
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2

    // Smoothly interpolate the position and rotation
    ref.current.position.x += (x - ref.current.position.x) * smoothFactor
    ref.current.position.y += (y - ref.current.position.y) * smoothFactor

    ref.current.rotation.x += (-y * 1.5 - ref.current.rotation.x) * smoothFactor
    ref.current.rotation.y += (x * 1.5 - ref.current.rotation.y) * smoothFactor
  })

  // const texture = useTexture('/icosahedron-texture.png')

  return (
    <>
      <motion3d.group
        ref={ref}
        animate={{
          opacity: [0, 1],
        }}
        transition={{
          duration: 1,
          delay: 2,
          ease: 'easeInOut',
        }}
        initial={{
          opacity: 0,
        }}
      >
        <Icosahedron castShadow receiveShadow args={[0.6]}>
          <meshStandardMaterial attach="material" color="#2B2B2B" />
          <Decal
            debug={false}
            castShadow
            receiveShadow
            polygonOffsetFactor={-1}
            position={[0, 0, 0.5]}
            rotation={[0, 0, 0]}
            scale={[1, 0.5, 0.5]}
            geometry={new THREE.IcosahedronGeometry(0.6, 0)}
          >
            <meshStandardMaterial
              // map={texture}
              color="#2B2B2B"
            />
          </Decal>
        </Icosahedron>
      </motion3d.group>
    </>
  )
}

export const AnimatedThingy: React.FC<{className?: string}> = ({className}) => {
  return (
    <motion.div
      className={cn('grid h-6 w-10 grid-cols-3 overflow-hidden', className)}
    >
      {new Array(3).fill({}).map((_, i) => {
        return (
          <motion.div
            animate={{
              opacity: [1, 0, 1],
              y: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeatDelay: 1,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: 'mirror',
              type: 'spring',
            }}
            className="h-full w-full bg-foreground/30"
          />
        )
      })}
    </motion.div>
  )
}
