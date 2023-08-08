import React from 'react'
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
import {getActiveProducts} from 'server/products.server'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import ResourceTeaser from 'components/resource-teaser'
import {InlineTestimonial} from 'components/mdx'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const token = await getToken({req})
  const {products = []} = await getActiveProducts()
  const tutorials =
    await sanityClient.fetch(groq`*[_type == "module" && moduleType == 'tutorial' && state == 'published'] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    "image": image.asset->url,
    "sections": resources[@->._type == 'section']->{
    _id,
    "lessons": resources[@->._type in ['exercise', 'explainer']]->{      
    },
  }
  }`)
  const {props: commerceProps} = await propsForCommerce({
    query,
    token,
    products,
  })

  return {
    props: {
      ...commerceProps,
      tutorials,
    },
  }
}

const Home: React.FC<
  React.PropsWithChildren<CommerceProps & {tutorials: Module[]}>
> = (props) => {
  const router = useRouter()
  const {
    tutorials,
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
        <FreeTutorials tutorials={tutorials} />
        <NewsletterSubscribeForm />
        <Bio />
      </main>
      {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
    </Layout>
  )
}

export default Home

const FreeTutorials: React.FC<{tutorials: Module[]}> = ({tutorials}) => {
  return (
    <section className="w-fll mx-auto mb-5 max-w-screen-lg">
      <h2 className="-mb-8 px-5 font-heading text-3xl font-extrabold">
        Free Tailwind Tutorials
      </h2>
      <div className="mx-auto flex w-full flex-row gap-6 overflow-x-auto py-16 pl-5 pr-10 sm:px-5">
        {tutorials.map((tutorial) => {
          return <ResourceTeaser key={tutorial._id} resource={tutorial} />
        })}
      </div>
    </section>
  )
}

const Header = () => {
  return (
    <header className="w-full px-8 pb-16 pt-10 sm:pb-28 sm:pt-28">
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
        Ride the <span className="text-brand-red">Tailwind CSS wave</span> like
        a pro.
      </h1>
      <p className="max-w-lg pt-5 text-center text-lg sm:text-xl md:text-left">
        Level-up on advanced Tailwind concepts and patterns. Power-up with
        multi-theme, multi-style and multi-project UI components.
      </p>
      <Instructor />
    </div>
  )
}

const Instructor = () => {
  return (
    <div className="flex items-center gap-6 pt-10">
      <div className="flex aspect-square w-24 items-center justify-center overflow-hidden rounded-full object-cover ring-4 ring-brand-red ring-offset-4">
        <Image
          src={SimonWithPuppies}
          alt="Simon Vrachliotis"
          width={200}
          height={200}
          className="object-cover"
        />
      </div>
      <div>
        <span className="text-sm font-semibold uppercase tracking-widest text-brand-red">
          A course by
        </span>
        <div className="text-lg font-semibold">Simon Vrachliotis</div>
      </div>
    </div>
  )
}

const Copy = () => {
  return (
    <div className="relative">
      <ShakaIllustration />
      <SurfboardIllustration />
      <div className="prose mx-auto w-full max-w-2xl px-5 pb-16 sm:prose-lg md:px-0">
        <LandingCopy />
      </div>
    </div>
  )
}

const Bio = () => {
  return (
    <section className="group/signature prose relative z-10 mx-auto -mt-32 max-w-screen-lg px-10 py-10 sm:prose-lg sm:py-16 md:mt-0 md:px-0 lg:py-24">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
        <div className="w-64 shrink-0">
          <Image
            src={SimonWithPuppies}
            width={360}
            height={480}
            placeholder="blur"
            loading={'eager'}
            alt="Simon Vrachliotis"
            className="rounded-lg object-cover"
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="mt-0 sm:mt-0">
            Hi, I'm Simon <span aria-label="heart emoji">❤️</span>
          </h2>
          <p>
            You might know me from my popular videos on the{' '}
            <strong>official Tailwind Labs YouTube channel</strong>.
          </p>
          <p>
            I've been an <strong>advocate for utility-first CSS</strong> since{' '}
            <strong>before Tailwind even existed</strong>. I truly love this
            approach to CSS, and still do to this day.
          </p>
          <p>
            I will be <strong>your Pro Tailwind intstructor</strong>. I can't
            wait to share my genuine passion and excitement for Tailwind with
            you.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-screen-md">
        <hr />
        <h3>Driving Tailwind CSS adoption since day 1</h3>
        <p>
          I can confidently say I've had a significant impact on the adoption of
          the Tailwind CSS framework.
        </p>

        <div className="py-8">
          <InlineTestimonial
            author={{
              name: 'Phil Hawksworth',
              bio: 'DX at Netlify',
              avatar: '/assets/phil-hawksworth-avatar.jpeg',
            }}
            url="https://twitter.com/philhawksworth/status/1172110612438114304"
          >
            Looking at utility-first CSS tooling such as Tachyons and Tailwind
            CSS with fresh eyes and piqued interest after watching this
            brilliantly constructed talk by @simonswiss.
          </InlineTestimonial>
        </div>
        <p>
          A lot of web developers attribute their <strong>aha 💡 moment</strong>{' '}
          to hearing my conference talks, reading my articles or watching my
          screencasts.
        </p>

        <p>
          I take a lot of pride in consistently bringing a fun, friendly and
          positive "vibe" to the Tailwind community. Throughout everything I do,
          to this day.
        </p>
        <h3>Entertaining & high-quality teaching materials</h3>
        <p>
          I made a name for myself in the industry for the{' '}
          <strong>high production quality</strong> and the{' '}
          <strong>entertainment factor</strong> of my eductaional materials.
        </p>
        <p>
          I used to be a <strong>primary school teacher</strong>. I understand
          that effective learning comes through{' '}
          <strong>fun and engaging</strong> content, high production value and
          an <strong>enthusiastic delivery</strong>.
        </p>
        <p>
          Pro Tailwind will not only teach you advanced concepts about Tailwind
          CSS. It will get you excited, energized and curious about what else
          you could build with Tailwind.
        </p>
        <p>Let's have some fun!</p>

        <Signature />
      </div>
    </section>
  )
}

const Signature = () => {
  return (
    <svg
      aria-hidden="true"
      className="w-56 max-w-full text-indigo-600"
      viewBox="0 0 102 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.85697 28.611C2.10333 28.8813 2.40115 28.9867 2.657 28.9668L8.29568 28.655C8.55153 28.635 8.69895 28.4626 8.48458 28.1898C8.33666 27.9439 7.9329 27.718 7.64507 27.7405C6.2329 27.7865 4.05319 27.8924 2.74196 27.9948C2.39016 28.0223 2.07285 28.0793 1.84898 28.0968C1.59313 28.1168 1.6476 28.4021 1.85697 28.611ZM26.2399 28.0898C23.3956 27.9259 20.098 27.3147 19.3944 25.3104C19.229 24.8407 19.1301 24.3979 19.0926 23.9182C18.8703 21.0719 20.9016 18.2426 23.9888 15.7491C25.7143 14.3594 28.9844 12.5595 31.7028 12.3471C32.7901 12.2622 33.7696 12.4431 34.5501 12.9613C35.1682 13.46 35.4521 14.2101 35.522 15.1055C35.6269 16.4487 35.2082 18.0903 34.59 19.6508C34.3352 20.5073 35.1442 20.1546 35.6054 19.0567C36.2261 17.5281 36.6623 16.1104 36.5674 14.8952C36.4924 13.9357 36.1052 13.0972 35.2432 12.3601C33.9849 11.4931 32.4493 11.1948 30.8503 11.3197C28.1639 11.5296 25.2796 12.9132 22.9739 14.7022C20.157 16.9493 17.708 20.1974 17.9728 23.5874C18.0227 24.227 18.1711 24.8911 18.4475 25.5453C19.4888 28.1667 23.3006 28.7699 26.4353 28.9433C28.6989 29.0882 31.7376 29.2692 33.717 30.3051C29.9152 31.8891 26.3723 33.9034 24.232 36.1621C23.2196 37.2064 22.6279 38.2823 22.6414 39.2787C22.7913 41.1976 24.6912 41.6283 26.4821 41.4884C26.9938 41.4485 27.4686 41.347 27.9113 41.2481C32.4566 40.1208 37.2283 36.9487 36.931 33.1429C36.8461 32.0556 36.4269 31.2196 35.7643 30.5634L38.5136 29.5121L42.3624 28.1174C42.5813 28.036 42.6107 28.0015 42.4383 27.8541C42.133 27.6527 41.0826 27.7991 38.1609 28.703C37.0615 29.0463 35.9646 29.4216 34.8728 29.8608C32.4352 28.3137 28.4396 28.2397 26.2399 28.0898ZM35.7352 33.0755C35.8232 36.6723 31.1789 39.4162 27.652 40.3996C27.0223 40.5775 26.4517 40.6864 25.94 40.7264C24.5967 40.8313 23.6663 40.4535 23.6013 39.622C23.5489 38.9504 24.0226 38.0125 25.2144 36.7932C27.0009 34.9483 30.0026 33.0085 34.7364 30.9977C35.293 31.5334 35.6678 32.212 35.7352 33.0755ZM42.0358 30.3953C42.6959 31.0194 43.5744 31.1438 44.3714 31.0494C46.5706 30.7811 49.2836 28.0272 49.8038 26.8604C50.1326 26.1268 49.7978 25.9599 49.6798 26.0979C48.7954 27.1322 45.6052 29.9556 43.6224 30.1105C43.2706 30.1379 42.9433 30.067 42.6724 29.8951C42.1602 29.5168 42.5176 25.853 42.7534 25.5771C42.7729 25.4147 42.561 25.1739 42.1993 25.0734C41.808 25.0074 41.4907 25.0644 41.4712 25.2268C41.1619 25.798 41.0474 26.8044 41.1249 27.7958C41.2073 28.8512 41.5161 29.9211 42.0358 30.3953ZM42.1278 22.9232C42.4281 23.0606 42.8119 23.0306 42.8979 22.8952C42.9813 22.7278 43.1822 22.0042 43.2337 21.8393C43.3146 21.6399 43.2971 21.4161 43.2871 21.2881C43.3386 21.1232 43.0628 20.8874 42.6395 20.8239C42.3097 20.721 41.9629 20.8124 41.9779 21.0043L41.9514 21.489C41.9 21.6539 41.7261 22.311 41.6696 22.412C41.5197 22.5524 41.734 22.8252 42.1278 22.9232ZM49.8994 29.234C50.0254 29.6103 50.9068 30.1849 51.1452 29.9411C52.3075 28.7563 53.0706 26.9913 54.6192 25.8085C55.0045 27.0333 55.2538 27.7539 55.6286 28.4325C55.8479 28.7693 56.4806 29.0417 56.7264 28.8937C57.5449 28.2506 58.2945 27.5485 59.6412 26.2528C59.7597 26.5332 59.947 26.8725 60.1959 27.1748C60.5137 27.5361 60.8635 27.8949 61.3682 28.1772C62.1068 28.57 62.8893 28.7019 63.5609 28.6494C65.3838 28.507 67.3402 26.7776 67.7525 25.8766C68.0813 25.143 67.6455 24.9197 67.5621 25.0871C67.1743 25.8896 63.8108 27.729 62.7874 27.8089C62.3396 27.8439 61.9434 27.714 61.5741 27.5176C60.892 27.0239 60.6421 25.885 60.2724 25.2704C60.021 24.9361 59.3884 24.6638 59.177 24.8411L56.2722 27.61C55.8969 26.5131 55.8125 25.844 55.3957 25.04C55.1124 24.7082 54.5437 24.4309 54.2979 24.5788C52.9752 25.3578 51.9877 26.722 50.9633 28.0247C50.8489 26.9718 50.9319 26.3862 50.8349 25.5572C50.8984 25.1339 49.788 24.5128 49.7346 25.0639C49.6691 25.8735 49.6456 26.8084 49.7256 27.8318C49.7605 28.2796 49.83 28.7568 49.8994 29.234ZM76.607 24.5414C77.3546 24.2256 77.546 23.7923 76.621 23.8968C76.3332 23.9192 75.0959 24.1446 73.5928 24.262C72.8572 24.3195 72.0232 24.3525 71.2162 24.319C70.6915 23.7808 69.9554 23.42 69.0819 23.3595C68.4398 23.3775 68.2434 23.7468 68.1505 24.2045C68.0865 24.2095 68.057 24.244 67.9931 24.249C67.2775 24.5623 66.5659 26.1623 66.8947 27.4881C67.1246 28.3711 68.0015 29.3 69.1898 29.2715C70.6685 29.2526 71.9172 28.3506 72.0802 26.7291C72.1386 26.2418 72.0692 25.7646 71.9088 25.3589C73.8671 25.3024 75.9234 24.8522 76.607 24.5414ZM68.6877 24.9026L68.7466 24.8336C69.2169 25.0865 69.8395 25.2309 70.585 25.3014C71.1867 26.4127 70.6255 28.2906 69.2233 28.4645C68.6182 28.544 68.2389 28.2196 68.0065 27.3047C67.7767 26.4217 68.2969 25.2549 68.6877 24.9026ZM76.5895 27.5673C76.6614 28.0765 77.8033 28.2769 77.7388 27.8637L77.7133 27.1256C78.216 25.7349 80.5267 24.0099 82.8733 23.5692C82.8393 23.958 82.8348 24.3123 82.8623 24.6641C82.9073 25.2397 83.0457 25.7759 83.403 26.2307C84.0436 27.0172 85.097 27.321 86.0244 27.2486C88.2631 27.0737 90.2095 25.2163 90.8996 24.1649C91.3318 23.5198 91.149 22.8262 91.026 22.9002C90.0426 23.4918 87.4576 26.2357 85.4748 26.3906C85.059 26.4231 84.6997 26.3546 84.3599 26.1237C83.8967 25.5486 84.1536 24.3058 84.1111 23.7621C84.0736 23.2824 83.453 22.7517 82.8403 22.7352C81.0344 22.6832 78.8217 24.0144 77.7968 24.8989L77.7758 23.8065C77.7928 23.6122 77.4825 23.3468 77.2142 23.2069C76.8843 23.104 76.567 23.1609 76.5845 23.3848L76.5145 26.6079C76.4806 26.9967 76.5375 27.314 76.5895 27.5673Z"
        fill="currentColor"
      />
      <path
        className="origin-right transition group-hover/signature:scale-110 group-hover/signature:text-brand-red"
        d="M92.3631 19.5639L93.1941 19.499C93.6629 17.986 94.1201 17.0076 96.0775 13.8308C97.4038 11.6817 97.7532 10.4627 97.6552 9.20743C97.5336 7.65164 96.0552 6.48645 94.5348 6.60522C93.421 6.69223 92.4574 7.33669 91.9107 8.53557C91.2022 7.43475 90.1503 6.94773 89.0542 7.03335C87.4984 7.15489 86.2542 8.53276 86.3757 10.0885C86.4765 11.3791 87.105 12.5929 88.6508 14.3932C91.0588 17.2112 91.6228 18.0565 92.3631 19.5639ZM92.6496 17.994C92.0745 17.0073 91.219 15.8468 90.0859 14.5479C88.9514 13.2313 88.2185 12.2747 87.905 11.6767C87.5914 11.0786 87.4058 10.5239 87.3658 10.0112C87.287 9.00348 88.1238 8.10212 89.1315 8.0234C90.1039 7.94744 91.0295 8.63998 91.5958 10.1966L92.4975 10.1262C92.7895 8.62701 93.5867 7.67537 94.6121 7.59527C95.6375 7.51516 96.5864 8.27704 96.6651 9.28477C96.7065 9.81515 96.6107 10.4096 96.3761 11.0505C96.1416 11.6914 95.569 12.7855 94.6377 14.2991C93.7065 15.8126 93.0212 17.0579 92.6496 17.994Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ShakaIllustration() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 284 202"
      className="absolute right-[5%] top-[4%] hidden w-32 lg:block xl:right-[7%] xl:w-40"
    >
      <path
        fill="#FBA82A"
        d="M206.598 85.6c-4.8-21.43-3.96-39.7-1.4-53.85 2.3-12.68-6.24-24.79-18.95-26.98-12.36-2.13-24.19 5.93-26.73 18.21-4.07 19.66-4.26 36.07-4.26 36.07-10.85-16.45-33.68-23.89-53.71-13.7-30.53 15.53-36.91 81.78-36.91 81.78l-40.08-8.79c-9.3-2.04-18.49 3.84-20.53 13.14-1.83 8.36 2.74 16.81 10.75 19.82 15.32 5.75 50.29 19.51 77.13 28.31 74.97 27.06 105.86-6.51 105.86-6.51 44.31-42.85 8.82-87.5 8.82-87.5h.01Z"
      />
      <path
        fill="#F70"
        d="M98.677 136.27s30.32 9.39 51.4-23.78c0 0-.87 19.69 25.83 23.22 0 0-11.32 9.58-31.25 2.45 0 0-19.97 18.8-45.98-1.89ZM201.967 167.23s-23.96 14.14-72.31 3.53c-48.35-10.61-95.86-24.92-96.04-15.26-.18 9.66 79.4 31.15 89.42 32.55 10.02 1.41 59 5.19 78.93-20.83v.01Z"
      />
      <path
        fill="#511500"
        d="M146.147 193.73c-14.98 0-33.32-2.85-55.37-10.8-21.15-6.94-47.49-17-64.92-23.67-4.82-1.84-9.01-3.44-12.29-4.68-9.58-3.59-15.14-13.85-12.94-23.85 2.45-11.17 13.53-18.26 24.7-15.81l36.29 7.96c1.93-14.84 10.56-66.51 38.36-80.65 17.77-9.04 38.77-5.57 52.27 7.66.52-6.76 1.6-16.65 3.87-27.62a26.664 26.664 0 0 1 30.75-20.96c7.1 1.22 13.28 5.14 17.41 11.04 4.11 5.87 5.67 12.98 4.4 20.01-3.04 16.77-2.63 34.17 1.21 51.72 2.02 2.75 9.35 13.46 12.38 28.49 3.21 15.91 2 39.75-21.96 62.97-1.55 1.64-18.07 18.17-54.13 18.17l-.03.02Zm-125.28-72.29c-6.31 0-12 4.38-13.41 10.79-1.45 6.62 2.23 13.41 8.56 15.79 3.3 1.24 7.5 2.84 12.34 4.69 17.38 6.65 43.66 16.69 64.65 23.57l.1.03c20.71 7.47 51.11 14.75 78.35 6.97 16.17-4.62 23.68-12.5 23.75-12.57.04-.04.09-.09.13-.14 17.38-16.81 24.14-35.77 20.08-56.35-3.07-15.57-11.48-26.35-11.57-26.46-.33-.41-.56-.9-.67-1.41-4.19-18.72-4.67-37.3-1.43-55.24.94-5.18-.21-10.42-3.24-14.75a19.616 19.616 0 0 0-12.85-8.15 19.678 19.678 0 0 0-22.7 15.47c-3.38 16.32-4.04 30.52-4.16 34.38 9.19 14.76 8.38 33.25-2.29 50.93-7.93 13.15-21.66 29.34-42.01 31.86-12.37 1.52-21.24-2.79-21.62-2.98a3.509 3.509 0 0 1-1.58-4.7 3.509 3.509 0 0 1 4.7-1.58c1.21.59 30.18 14.09 54.51-26.23 9.44-15.64 10.11-31.81 1.86-44.36l-.05-.07c-10.57-15.99-31.7-21.36-49.17-12.47-28.46 14.47-34.95 78.35-35.01 78.99-.1 1-.62 1.91-1.43 2.5-.81.59-1.84.8-2.81.59l-40.07-8.79c-.99-.22-1.97-.32-2.95-.32l-.01.01Z"
      />
      <path
        fill="#511500"
        d="M181.748 139.2c-11.78 0-20.61-3.06-26.31-9.13-7.99-8.52-6.5-19.63-6.43-20.1a3.491 3.491 0 0 1 3.96-2.97c1.91.27 3.24 2.04 2.97 3.95-.02.16-1.01 8.4 4.66 14.39 5.1 5.39 14.06 7.62 26.61 6.63 1.91-.17 3.61 1.29 3.77 3.22a3.506 3.506 0 0 1-3.22 3.77c-2.08.16-4.09.25-6.02.25l.01-.01ZM111.447 72.09c17.19-3.4 35.44 2.3 50.6 10.26 4.07 2.16 1.08 8.23-3.13 6.27-7.13-3.98-14.68-7.37-22.6-9.41-5.82-1.46-11.8-2.36-17.79-2.19-1.92.05-3.97.23-5.82.61-3.61.67-4.81-4.57-1.26-5.54ZM103.958 101.79c11.31 1.28 22.24 4.1 32.65 8.69 3.48 1.52 6.83 3.39 10.11 5.42a3.497 3.497 0 0 1 1.14 4.82c-1.06 1.73-3.4 2.19-5.04 1-2.88-1.92-5.85-3.75-9.02-5.28-9.48-4.64-19.98-7.76-30.4-9.34-3.48-.46-2.96-5.58.56-5.31Z"
      />
      <path
        fill="#DCDFE2"
        d="M37.698 90.92h-.2a5.5 5.5 0 0 1-5.3-5.7c1.34-36.96 26.09-56.87 27.15-57.7a5.492 5.492 0 0 1 7.72.92c1.88 2.38 1.47 5.83-.91 7.72-.32.26-21.82 17.84-22.97 49.47a5.5 5.5 0 0 1-5.49 5.3v-.01ZM14.898 59.84c-.4 0-.8-.04-1.21-.13-2.96-.67-4.83-3.61-4.16-6.57 2.42-10.79 6.97-20.85 13.54-29.92a5.501 5.501 0 0 1 7.68-1.23 5.501 5.501 0 0 1 1.23 7.68c-5.68 7.85-9.63 16.56-11.71 25.88a5.495 5.495 0 0 1-5.36 4.3l-.01-.01ZM229.898 196.36c-1.63 0-3.24-.72-4.32-2.1-1.88-2.38-1.47-5.83.91-7.72.33-.26 21.82-17.84 22.97-49.47.11-3.04 2.64-5.43 5.7-5.3a5.5 5.5 0 0 1 5.3 5.7c-1.34 36.96-26.09 56.87-27.15 57.7a5.51 5.51 0 0 1-3.4 1.18l-.01.01ZM265.118 201.76c-1.12 0-2.25-.34-3.22-1.04a5.501 5.501 0 0 1-1.23-7.68c5.68-7.85 9.63-16.56 11.71-25.88.67-2.96 3.6-4.83 6.57-4.16 2.96.67 4.83 3.61 4.16 6.57-2.42 10.79-6.97 20.85-13.54 29.92a5.498 5.498 0 0 1-4.46 2.28l.01-.01Z"
      />
    </svg>
  )
}

function SurfboardIllustration() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 215 345"
      className="absolute left-[5%] top-[21%] hidden w-24 lg:block xl:left-[7%] xl:w-32"
    >
      <path
        fill="#FF4173"
        d="m40.2 147.97 160.51 10.55c3.09-11.8 5.45-23.64 7.1-35.34L57.46 113.3c-4.97 8.51-9.55 17.33-13.63 26.41-1.23 2.74-2.44 5.5-3.63 8.26Z"
      />
      <path
        fill="#fff"
        d="m26.57 182.88 162.55 10.68c4.64-11.5 8.49-23.25 11.58-35.05L40.19 147.96a564.663 564.663 0 0 0-13.62 34.91v.01Z"
      />
      <path
        fill="#FF4173"
        d="M189.12 193.57 26.57 182.89c-4.22 11.96-7.93 23.77-11.07 35.08l157.46 10.35c4.22-8.24 8.27-16.66 12.09-25.16 1.43-3.17 2.77-6.37 4.07-9.59Z"
      />
      <path
        fill="#38BDF8"
        d="M205.83 29.051c-4.4-20.57-27.35-30.88-45.64-20.51-35.72 20.25-75.3 57.8-102.73 104.749l150.35 9.88c4.86-34.359 3.74-67.419-1.97-94.129l-.01.01ZM11.66 309.66c18.8 8.45 48.85-18.21 48.85-18.21s.03 40.17 18.83 48.62c16.69 7.5 60.22-46.47 93.62-111.76L15.5 217.96c-13.15 47.41-16.17 86.16-3.84 91.7Z"
      />
      <path
        fill="#FFA2BE"
        d="M188.81 131.18c-1.23 8.69-2.84 17.46-4.86 26.24l16.76 1.1c3.09-11.8 5.45-23.64 7.1-35.34l-17.86-1.17c-.34 3.05-.71 6.1-1.14 9.17ZM170.12 201.57c-1.3 3.22-2.65 6.42-4.07 9.59-2.45 5.44-5 10.85-7.62 16.2l14.53.96c4.22-8.24 8.27-16.66 12.09-25.16 1.43-3.17 2.77-6.37 4.07-9.59l-15.54-1.02c-1.1 3.02-2.25 6.03-3.46 9.02Z"
      />
      <path
        fill="#85DFFF"
        d="M205.83 29.051c-4.4-20.57-27.35-30.88-45.64-20.51-2.28 1.29-4.58 2.66-6.9 4.1 15.13-1.6 30.08 8.23 33.54 24.41 5.2 24.32 6.58 53.91 3.12 84.959l17.86 1.17c4.86-34.359 3.74-67.419-1.97-94.129h-.01ZM153.96 236.31c-23.8 46.52-52.73 87.27-73.43 104.16 17.49 4.63 59.79-48.35 92.44-112.16l-14.53-.96c-1.47 3-2.96 5.99-4.47 8.96h-.01Z"
      />
      <path
        fill="#511500"
        d="M82.66 344.24c-1.84 0-3.41-.37-4.75-.97-15.66-7.04-19.59-32.25-20.57-44.75-9.99 7.56-31.46 21.37-47.11 14.34-7.54-3.39-14.66-17.16-5.75-63.56 6.5-33.89 19.68-74.36 36.16-111.03C69.97 72.991 120.74 26.881 158.47 5.501c9.7-5.5 21.07-6.04 31.2-1.49 10.12 4.55 17.27 13.41 19.6 24.32 9.07 42.42 8.31 110.999-21.01 176.269-16.47 36.67-37.98 73.4-59 100.77-23.67 30.83-38.04 38.88-46.59 38.88l-.01-.01Zm-22.14-56.29c.49 0 .97.1 1.44.31 1.26.56 2.07 1.81 2.07 3.19 0 .1.04 9.9 2.31 20.53 1.99 9.29 6.1 21.15 14.45 24.9 5.29 2.37 19.7-5.57 42.91-35.78 20.7-26.96 41.9-63.18 58.17-99.37C210.5 138 211.26 71.131 202.42 29.791c-1.86-8.7-7.55-15.77-15.62-19.39-8.07-3.62-17.13-3.19-24.87 1.2-36.77 20.84-86.26 65.82-114.9 129.549-16.26 36.19-29.26 76.1-35.67 109.48-7.18 37.42-3.55 53.47 1.74 55.85 8.35 3.75 19.95-1.05 28.21-5.73 9.45-5.36 16.81-11.84 16.88-11.91a3.48 3.48 0 0 1 2.32-.88l.01-.01Z"
      />
      <path
        fill="#511500"
        d="M70.84 259.92c19.59-48.85 41.64-96.63 63.68-144.4 7.4-15.899 14.9-31.749 22.55-47.539a3.496 3.496 0 0 1 4.68-1.62c1.68.81 2.41 2.8 1.71 4.5C143.21 119.42 122 167.57 100.02 215.37c-7.37 15.91-14.93 31.74-22.79 47.43-2.04 3.87-7.93 1.36-6.39-2.87v-.01Z"
      />
      <path
        fill="#511500"
        d="M200.71 162.02h-.23L39.97 151.47c-1.13-.08-2.16-.7-2.76-1.67-.59-.97-.68-2.17-.23-3.21 1.27-2.95 2.46-5.67 3.65-8.32 4.02-8.96 8.67-17.95 13.8-26.74a3.5 3.5 0 0 1 3.25-1.73l150.35 9.88c.97.06 1.88.53 2.49 1.29.61.76.89 1.73.75 2.7-1.7 12.03-4.12 24.06-7.18 35.74a3.506 3.506 0 0 1-3.39 2.61h.01ZM45.39 144.8l152.65 10.03c2.35-9.32 4.28-18.85 5.75-28.41L59.4 116.93c-4.58 7.98-8.74 16.11-12.38 24.2-.54 1.2-1.08 2.42-1.63 3.66v.01Z"
      />
      <path
        fill="#511500"
        d="M189.13 197.07h-.23L26.35 186.39a3.514 3.514 0 0 1-2.7-1.57c-.61-.92-.74-2.06-.38-3.09a569.39 569.39 0 0 1 13.71-35.13c.59-1.36 1.97-2.2 3.45-2.11l160.51 10.55c1.04.07 2 .6 2.61 1.45.61.85.81 1.92.55 2.94-3.19 12.18-7.14 24.11-11.73 35.47a3.51 3.51 0 0 1-3.25 2.19l.01-.02ZM31.44 179.69l155.38 10.21c3.57-9.09 6.72-18.54 9.4-28.17L42.45 151.62c-3.89 9.18-7.58 18.59-11.01 28.06v.01Z"
      />
    </svg>
  )
}
