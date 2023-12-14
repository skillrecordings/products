import React from 'react'
import {motion} from 'framer-motion'
import Layout from 'components/app/layout'
import Particles, {initParticlesEngine} from '@tsparticles/react'
import {loadSlim} from '@tsparticles/slim'
import type {Engine} from '@tsparticles/engine'
import {loadStarsPreset} from 'tsparticles-preset-stars'
import Image from 'next/image'
import {CalendarIcon, LocationMarkerIcon} from '@heroicons/react/solid'
import {format} from 'date-fns'
import {SubscribeToConvertkitForm} from '@skillrecordings/skill-lesson/convertkit'
import Link from 'next/link'
import {cn} from '@skillrecordings/ui/utils/cn'

const LINEUP_TBD = true
const LOCATION_TBD = true
const TIME_TBD = true

const date = new Date('2024-04-11')
const ckSubsriberField = {
  [`conf_2024_news`]: new Date().toISOString().slice(0, 10),
}
const lineup = [
  {
    name: 'John Doe',
    title: 'CEO',
    company: 'Acme Inc.',
    image: null,
  },
  {
    name: 'John Doe',
    title: 'CEO',
    company: 'Acme Inc.',
    image: null,
  },
  {
    name: 'John Doe',
    title: 'CEO',
    company: 'Acme Inc.',
    image: null,
  },
  {
    name: 'John Doe',
    title: 'CEO',
    company: 'Acme Inc.',
    image: null,
  },
  {
    name: 'John Doe',
    title: 'CEO',
    company: 'Acme Inc.',
    image: null,
  },
  {
    name: 'John Doe',
    title: 'CEO',
    company: 'Acme Inc.',
    image: null,
  },
]

const sponsors = [
  {
    image: null,
    name: 'Acme Inc.',
    url: 'https://acme.com',
  },
  {
    image: null,
    name: 'Acme Inc.',
    url: 'https://acme.com',
  },
  {
    image: null,
    name: 'Acme Inc.',
    url: 'https://acme.com',
  },
  {
    image: null,
    name: 'Acme Inc.',
    url: 'https://acme.com',
  },
  {
    image: null,
    name: 'Acme Inc.',
    url: 'https://acme.com',
  },
  {
    image: null,
    name: 'Acme Inc.',
    url: 'https://acme.com',
  },
  {
    image: null,
    name: 'Acme Inc.',
    url: 'https://acme.com',
  },
  {
    image: null,
    name: 'Acme Inc.',
    url: 'https://acme.com',
  },
]

const ConfPage = () => {
  return (
    <Layout meta={{title: 'Epic Web Conf 2024'}}>
      <Header />
      <main className="">
        <section className="mx-auto flex w-full max-w-screen-lg items-center justify-between px-5 py-16">
          <div>
            <p className="max-w-xs text-lg opacity-90">
              Epic Web Conf hosts innovative and international talents to share
              their insightful experiences.
            </p>
          </div>
          <div className="flex gap-10">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-400 to-indigo-400 p-3 text-white">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>{format(date, 'MMMM dd, yyyy')}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-400 to-indigo-400 p-3 text-white">
                <LocationMarkerIcon className="h-5 w-5" />
              </div>
              <div>Salt Palace Convention Center</div>
            </div>
          </div>
        </section>
        <section className="w-full bg-gray-900/50 py-24">
          <div className="mx-auto w-full max-w-screen-lg px-5">
            <h2 className="pb-8 text-6xl font-light">Line Up</h2>
            <div className="relative grid grid-cols-3 gap-6">
              {LINEUP_TBD && (
                <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center text-center text-4xl font-light">
                  TBD
                </div>
              )}
              {lineup.map(({company, image, name, title}) => {
                return (
                  <article
                    key={name}
                    className={cn('', {
                      'pointer-events-none select-none blur-xl': LINEUP_TBD,
                    })}
                  >
                    <div className="relative aspect-square overflow-hidden rounded bg-gradient-to-tr from-gray-900 to-gray-900/75">
                      {image && (
                        <Image
                          className="object-cover"
                          src={image}
                          alt={name}
                          fill
                        />
                      )}
                    </div>
                    <h3 className="pt-3 text-lg font-semibold">{name}</h3>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
        <section className="w-full py-24">
          <div className="mx-auto w-full max-w-screen-lg px-5">
            <h2 className="pb-8 text-lg font-medium uppercase tracking-wider">
              Sponsors
            </h2>
            <div className="grid grid-cols-4 gap-5">
              {sponsors.map(({image, name, url}) => {
                return (
                  <Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={url}
                    className="relative h-16 w-full overflow-hidden rounded bg-gradient-to-tr from-gray-900 to-gray-900/75"
                  >
                    {image && (
                      <Image
                        src={image}
                        alt={name}
                        fill
                        className="aspect-contain"
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
        <section className="w-full bg-gray-900/50 py-24">
          <div className="mx-auto w-full max-w-screen-lg px-5">
            <h2 className="pb-8 text-6xl font-light">Get Notified</h2>
            <div className="">
              {/* <Image
                src={require('../../../public/assets/conf/planet-blue.png')}
                alt=""
                aria-hidden="true"
                width={250}
                height={250}
              /> */}
              <SubscribeToConvertkitForm
                className="max-w-sm [&_button]:mt-3 [&_button]:inline-flex [&_button]:w-full [&_input]:mb-3 [&_input]:px-3 [&_input]:py-3"
                fields={ckSubsriberField}
                actionLabel="Get Notified"
              />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default ConfPage

const Header = () => {
  return (
    <header className="relative flex h-[calc(100svh-81px-212px)] w-full items-center justify-center bg-[radial-gradient(#1a1e2c,#080b16)]">
      <ConfLogo />
      <Image
        priority
        src={require('../../../public/assets/conf/planet.png')}
        alt=""
        aria-hidden="true"
        quality={100}
        width={800}
        height={800}
        className="pointer-events-none absolute z-20 select-none shadow-black drop-shadow-2xl"
      />
      <PulsingEffect />
      <StarsEffect />
    </header>
  )
}

const circles = ({
  getDelay = (i: number) => i * 0.5,
  duration = 5,
}: {
  getDelay?: (i: number) => number | undefined
  duration?: number
}) => {
  return (
    <>
      {[
        {strokeWidth: 3, stroke: 'url(#paint0_linear_762_23)'},
        {strokeWidth: 8, stroke: 'url(#paint1_linear_762_23)'},
        {strokeWidth: 13, stroke: 'url(#paint2_linear_762_23)'},
      ].map(({stroke, strokeWidth}, i) => {
        const startRadius = 100
        const endRadius = 600
        const startOpacity = 0.5
        const endOpacity = 0
        const delay = i * 0.5
        const ease = 'easeOut'

        return (
          <>
            <g>
              <motion.circle
                animate={{
                  r: [startRadius, endRadius],
                  opacity: [startOpacity, startOpacity, 1, endOpacity],
                  filter: ['blur(0px)', 'blur(10px)', 'blur(10px)'],
                }}
                transition={{
                  delay: getDelay ? getDelay(i) : delay,
                  duration: duration,
                  repeat: Infinity,
                  ease,
                }}
                cx="411"
                cy="411"
                r="279"
                stroke={stroke}
                strokeWidth={strokeWidth}
              />

              <motion.circle
                animate={{
                  r: [startRadius, endRadius],
                  opacity: [startOpacity, startOpacity, 1, endOpacity],
                }}
                transition={{
                  delay: getDelay ? getDelay(i) : delay,
                  duration: duration,
                  repeat: Infinity,
                  ease,
                }}
                cx="411"
                cy="411"
                r="279"
                className="blur-lg"
                stroke={stroke}
                strokeWidth={strokeWidth}
              />

              <motion.circle
                animate={{
                  r: [startRadius, endRadius],
                  opacity: [startOpacity, startOpacity, 1, endOpacity],
                }}
                transition={{
                  delay: getDelay ? Number(getDelay(i)) + 3.5 : delay + 3.5,
                  duration: duration,
                  repeat: Infinity,
                  ease,
                }}
                cx="411"
                cy="411"
                r="279"
                className="blur-lg"
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
              <motion.circle
                animate={{
                  r: [startRadius, endRadius],
                  opacity: [startOpacity, startOpacity, 1, endOpacity],
                }}
                transition={{
                  delay: getDelay ? Number(getDelay(i)) - 1 : delay - 1,
                  duration: duration,
                  repeat: Infinity,
                  ease,
                }}
                cx="411"
                cy="411"
                r="279"
                className="blur-xl"
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            </g>
          </>
        )
      })}
    </>
  )
}

const ConfLogo = () => {
  return (
    <svg
      aria-label="Epic Web Conf 2024"
      className="absolute z-30"
      width="183"
      height="143"
      viewBox="0 0 183 143"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Epic Web Conf 2024</title>
      <path
        d="M91.9104 30.6162C90.6472 31.3139 89.3586 31.9647 88.0473 32.5672C82.3003 35.2098 74.0877 37.885 64.2463 37.9948L63.1128 38.0075L62.9077 36.8931C62.5914 35.206 62.4301 33.4934 62.4259 31.7768C62.4259 16.1566 75.1313 3.45022 90.7516 3.45022C94.9234 3.44587 99.0442 4.36797 102.816 6.14993L106.579 4.23246C101.768 1.45285 96.3079 -0.00716425 90.7516 2.64329e-05C73.2483 2.64329e-05 58.9902 14.2582 58.9902 31.7614C58.9902 38.7489 61.2625 45.2191 65.1065 50.4707C71.6875 49.3499 75.8165 46.7137 75.8165 46.7137C75.8165 46.7137 73.1803 50.8373 72.0596 57.42C77.4821 61.3914 84.0303 63.5293 90.7516 63.5228C108.255 63.5228 122.513 49.2646 122.513 31.7614C122.52 26.2125 121.064 20.7599 118.291 15.9533L116.377 19.7084C118.16 23.4815 119.082 27.6036 119.077 31.7768C119.077 47.3971 106.372 60.1016 90.7516 60.1016C88.9893 60.1016 87.2996 59.9237 85.638 59.6206L84.5209 59.4165L84.5336 58.2812C84.6425 48.4316 87.3186 40.2199 89.9603 34.4747C90.5625 33.1646 91.213 31.8782 91.9104 30.6162Z"
        fill="url(#paint0_linear_734_996)"
      />
      <path
        d="M107.299 24.6423L100.012 22.5152L97.8844 15.2128L122.059 0.453735L107.299 24.6423Z"
        fill="white"
      />
      <path
        d="M79.9185 111.238C76.1236 111.238 72.9731 109.985 70.5028 107.479C68.0325 104.973 66.8153 101.894 66.8153 98.242C66.8153 94.5903 68.0325 91.5114 70.5028 89.0053C72.9731 86.4992 76.1236 85.2462 79.9185 85.2462C84.5011 85.2462 88.5825 87.609 90.7305 91.3324L87.8306 93.015C86.3986 90.2583 83.3555 88.4683 79.9185 88.4683C77.0186 88.4683 74.6558 89.3991 72.8299 91.2608C71.004 93.1224 70.109 95.4495 70.109 98.242C70.109 100.999 71.004 103.326 72.8299 105.187C74.6558 107.049 77.0186 107.98 79.9185 107.98C83.3555 107.98 86.3986 106.19 87.8306 103.469L90.7305 105.116C89.6923 106.978 88.1886 108.481 86.2554 109.591C84.3221 110.701 82.2098 111.238 79.9185 111.238Z"
        fill="white"
      />
      <path
        d="M25.6077 85.7116H34.7012C37.0283 85.7116 38.9258 86.4992 40.4652 88.0387C42.0047 89.5781 42.7923 91.4756 42.7923 93.7669C42.7923 96.0224 42.0047 97.9557 40.4652 99.4951C38.9258 101.035 37.0283 101.822 34.7012 101.822H28.9372V110.773H25.6077V85.7116ZM28.9372 98.7075H34.7012C36.0975 98.7075 37.2431 98.2421 38.1382 97.3112C39.0332 96.3446 39.4986 95.1631 39.4986 93.7669C39.4986 90.9028 37.4579 88.8263 34.7012 88.8263H28.9372V98.7075Z"
        fill="white"
      />
      <path
        d="M3.32952 99.6741V107.622H14.9649V110.773H0V85.7116H14.7859V88.8621H3.32952V96.5594H13.8909V99.6741H3.32952Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M48.8437 85.5214L60.1561 85.5214V87.8689L56.1406 87.8689V108.461H60.1561V110.809H48.8437V108.461H52.8111V87.8689L48.8437 87.8689V85.5214Z"
        fill="white"
      />
      <path
        d="M179.231 97.7766C181.522 98.8865 182.99 100.999 182.99 103.684C182.99 105.689 182.274 107.371 180.878 108.732C179.481 110.092 177.763 110.773 175.722 110.773H164.91V85.7116H174.935C176.904 85.7116 178.551 86.356 179.911 87.6807C181.272 89.0053 181.952 90.6164 181.952 92.5497C181.952 94.7693 181.057 96.5236 179.231 97.7766ZM174.935 88.8263H168.24V96.4878H174.935C177.047 96.4878 178.658 94.8051 178.658 92.6571C178.658 91.6188 178.3 90.7238 177.548 89.972C176.832 89.2201 175.973 88.8263 174.935 88.8263ZM168.24 107.658H175.722C177.978 107.658 179.696 105.868 179.696 103.576C179.696 102.467 179.302 101.5 178.515 100.712C177.763 99.9247 176.832 99.5309 175.722 99.5309H168.24V107.658Z"
        fill="white"
      />
      <path
        d="M142.99 99.6741V107.622H154.626V110.773H139.661V85.7116H154.447V88.8621H142.99V96.5594H153.552V99.6741H142.99Z"
        fill="white"
      />
      <path
        d="M107.941 110.773H104.074L96.8781 85.7116H100.387L106.115 106.333L112.201 85.7116H115.566L121.653 106.333L127.381 85.7116H130.889L123.693 110.773H119.827L113.884 90.7596L107.941 110.773Z"
        fill="white"
      />
      <path
        d="M36.8688 142.243C34.9026 142.243 33.2548 141.588 31.9628 140.296C30.6707 138.985 30.0153 137.375 30.0153 135.446C30.0153 133.518 30.6707 131.907 31.9628 130.615C33.2548 129.304 34.9026 128.649 36.8688 128.649C39.2468 128.649 41.3815 129.847 42.505 131.776L40.6325 132.862C39.9397 131.57 38.5166 130.746 36.8688 130.746C35.4644 130.746 34.3409 131.196 33.4608 132.076C32.5994 132.956 32.1687 134.079 32.1687 135.446C32.1687 136.813 32.5994 137.937 33.4608 138.817C34.3409 139.697 35.4644 140.146 36.8688 140.146C38.5166 140.146 39.9584 139.322 40.6325 138.03L42.505 139.098C41.962 140.053 41.1755 140.82 40.1644 141.401C39.1719 141.963 38.0672 142.243 36.8688 142.243ZM59.8381 140.277C58.5273 141.588 56.9169 142.243 55.0257 142.243C53.1345 142.243 51.5241 141.588 50.1946 140.277C48.8839 138.948 48.2285 137.337 48.2285 135.446C48.2285 133.555 48.8839 131.945 50.1946 130.634C51.5241 129.304 53.1345 128.649 55.0257 128.649C56.9169 128.649 58.5273 129.304 59.8381 130.634C61.1676 131.945 61.8229 133.555 61.8229 135.446C61.8229 137.337 61.1676 138.948 59.8381 140.277ZM51.7114 138.817C52.6102 139.697 53.7149 140.146 55.0257 140.146C56.3365 140.146 57.4413 139.697 58.3213 138.817C59.2201 137.918 59.6695 136.794 59.6695 135.446C59.6695 134.098 59.2201 132.974 58.3213 132.094C57.4413 131.196 56.3365 130.746 55.0257 130.746C53.7149 130.746 52.6102 131.196 51.7114 132.094C50.8313 132.974 50.3819 134.098 50.3819 135.446C50.3819 136.794 50.8313 137.918 51.7114 138.817ZM75.7713 137.787V128.892H77.9247V142H76.2394L70.0601 133.106V142H67.9067V128.892H69.592L75.7713 137.787ZM92.9011 128.892V130.952H87.3772V134.622H92.7139V136.682H87.3772V142H85.2238V128.892H92.9011ZM110.551 142H102.218V140.82L106.937 136.064C108.285 134.716 108.959 133.555 108.959 132.6C108.959 130.933 107.761 129.941 106.319 129.941C104.971 129.941 103.997 130.559 103.379 131.795L102.275 131.139C103.098 129.51 104.596 128.668 106.319 128.668C107.368 128.668 108.285 129.023 109.072 129.735C109.877 130.428 110.27 131.383 110.27 132.6C110.27 134.117 109.39 135.446 107.836 137L104.091 140.727H110.551V142ZM123.858 140.39C122.996 141.607 121.779 142.225 120.206 142.225C118.633 142.225 117.416 141.607 116.536 140.39C115.675 139.154 115.244 137.506 115.244 135.446C115.244 133.386 115.675 131.739 116.536 130.521C117.416 129.286 118.633 128.668 120.206 128.668C121.779 128.668 122.996 129.286 123.858 130.521C124.738 131.739 125.168 133.386 125.168 135.446C125.168 137.506 124.738 139.154 123.858 140.39ZM117.51 139.51C118.165 140.465 119.064 140.951 120.206 140.951C121.348 140.951 122.247 140.465 122.884 139.51C123.539 138.555 123.858 137.188 123.858 135.446C123.858 133.705 123.539 132.338 122.884 131.383C122.247 130.428 121.348 129.941 120.206 129.941C119.064 129.941 118.165 130.428 117.51 131.383C116.873 132.338 116.555 133.705 116.555 135.446C116.555 137.188 116.873 138.555 117.51 139.51ZM138.185 142H129.852V140.82L134.571 136.064C135.919 134.716 136.593 133.555 136.593 132.6C136.593 130.933 135.394 129.941 133.953 129.941C132.604 129.941 131.631 130.559 131.013 131.795L129.908 131.139C130.732 129.51 132.23 128.668 133.953 128.668C135.001 128.668 135.919 129.023 136.705 129.735C137.51 130.428 137.904 131.383 137.904 132.6C137.904 134.117 137.024 135.446 135.469 137L131.724 140.727H138.185V142ZM150.466 138.143H152.151V139.378H150.466V142H149.155V139.378H142.227V138.143L147.095 128.892H148.537L143.668 138.143H149.155V134.135H150.466V138.143Z"
        fill="url(#paint1_linear_734_996)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_734_996"
          x1="103.906"
          y1="18.6067"
          x2="77.6704"
          y2="44.8571"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4F75FF" />
          <stop offset="1" stopColor="#30AFFF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_734_996"
          x1="134.435"
          y1="113.067"
          x2="135.097"
          y2="139.139"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4F75FF" />
          <stop offset="1" stopColor="#30AFFF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const PulsingEffect = () => {
  return (
    <svg
      // width="822"
      // height="822"
      viewBox="0 0 822 822"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute z-10 w-[1050px] select-none overflow-visible opacity-75"
    >
      {circles({getDelay: (i) => i * 1.5, duration: 8})}
      {/* {circles({getDelay: (i) => 2.5 + i * 0.5, duration: 8})} */}
      <defs>
        <linearGradient
          id="paint0_linear_762_23"
          x1="411"
          y1="132"
          x2="411"
          y2="690"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0520833" stopOpacity="0" />
          <stop offset="0.223958" stopColor="#3955AB" />
          <stop offset="0.505208" stopColor="#81E1FF" />
          <stop offset="0.78125" stopColor="#3955AB" />
          <stop offset="0.947917" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_762_23"
          x1="411"
          y1="67"
          x2="411"
          y2="755"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.145833" stopOpacity="0" />
          <stop offset="0.223958" stopColor="#3955AB" />
          <stop offset="0.505208" stopColor="#81E1FF" />
          <stop offset="0.78125" stopColor="#3955AB" />
          <stop offset="0.859375" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_762_23"
          x1="411"
          y1="2"
          x2="411"
          y2="820"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.192708" stopOpacity="0" />
          <stop offset="0.307292" stopColor="#3955AB" />
          <stop offset="0.505208" stopColor="#81E1FF" />
          <stop offset="0.692708" stopColor="#3955AB" />
          <stop offset="0.817708" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const StarsEffect = () => {
  const [init, setInit] = React.useState(false)
  React.useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine)
      await loadStarsPreset(engine as any)
    }).then(() => {
      setInit(true)
    })
  }, [])
  const particlesLoaded = (container: any) => {
    return container
  }
  return init ? (
    <>
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        className="absolute left-0 top-0 z-0 h-full w-full"
        options={{
          fullScreen: {
            enable: false,
          },
          background: {
            opacity: 0,
          },
          smooth: true,
          preset: 'stars',
          detectRetina: true,

          pauseOnOutsideViewport: true,
          zLayers: 10,
          particles: {
            number: {
              value: 60,
            },
            zIndex: {
              value: {
                min: 1,
                max: 6,
              },
            },
            shadow: {
              blur: 20,
              color: '#67CBEB',
              enable: true,
            },
            size: {
              value: {min: 1, max: 6},
            },
            color: {
              value: '#67CBEB',
            },
            opacity: {
              value: {
                min: 0.1,
                max: 0.95,
              },
            },
            move: {
              direction: 'outside',
              enable: true,
              speed: {
                max: 0.7,
                min: 0.2,
              },
              straight: true,
            },
          },
        }}
      />
    </>
  ) : null
}
