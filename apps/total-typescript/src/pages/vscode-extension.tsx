import Layout from 'components/app/layout'
import {ArticleNewsletterCta} from 'components/primary-newsletter-cta'
import Share from 'components/share'
import {useConvertkit} from 'hooks/use-convertkit'
import Image from 'next/image'
import {track} from 'utils/analytics'

const DOWNLOAD_URL =
  'https://marketplace.visualstudio.com/items?itemName=mattpocock.ts-error-translator'

const REPO_URL = 'https://github.com/mattpocock/ts-error-translator'

const ExtensionPage = () => {
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout
      meta={{
        title: 'VSCode Extension',
        description:
          "Learn TypeScript from within VSCode. Get helpful hints on syntax, and get translations of TypeScript's most cryptic errors.",
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1671535371/extension/card_2x_yjsjfl.png',
          alt: 'VSCode Extension - Learn TypeScript from withing VSCode',
        },
      }}
      className="bg-black/10"
    >
      <header className="flex flex-col items-center justify-center px-5 pt-32 pb-10 text-center">
        <Image
          src={require('../../public/assets/extension/extension-icon-expanded@2x.png')}
          alt=""
          aria-hidden="true"
          width={1060 / 2}
          height={368 / 2}
          placeholder="blur"
          priority
          quality={100}
        />
        <h1 className="pt-2 font-text text-4xl font-bold sm:text-5xl">
          Learn TypeScript from within VSCode
        </h1>
        <h2 className="max-w-[38ch] pt-8 text-lg text-gray-300 md:text-xl">
          Get helpful hints on syntax, and get translations of TypeScript's most
          cryptic errors.
        </h2>
        <a
          href={DOWNLOAD_URL}
          target="_blank"
          className="mt-16 rounded-lg bg-gradient-to-t from-cyan-300 to-cyan-200 px-7 py-4 text-lg font-semibold text-black shadow-xl shadow-cyan-500/10 transition hover:brightness-110"
          onClick={() => {
            track('clicked install extension button')
          }}
          rel="noreferrer"
        >
          Install the VSCode Extension
        </a>
        <div className="flex flex-wrap items-center justify-center gap-10 pt-32 text-sm text-gray-300 sm:text-base">
          <a
            href={DOWNLOAD_URL}
            className="flex items-center gap-2 hover:underline"
          >
            <VSCodeIcon /> for Visual Studio Code
          </a>
          <a
            href={REPO_URL}
            className="flex items-center gap-2 hover:underline"
          >
            <GitHubIcon /> Source
          </a>
        </div>
      </header>
      <main className="relative flex w-full flex-col gap-10 overflow-hidden bg-gray-900 py-16 lg:gap-24">
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <section className="mx-auto flex max-w-screen-xl flex-col-reverse items-center justify-center lg:flex-row">
          <div className="max-w-xl p-6 sm:p-10 lg:max-w-none xl:p-24">
            <h3 className="text-3xl font-bold">Syntax Guide</h3>
            <p className="pt-5 text-lg opacity-80">
              Get helpful hints on syntax you've never seen before, with direct
              links to the docs. Once you feel you've got it covered, mark it as
              learned to hide the hints. Goes all the way from beginner to
              hyper-advanced.
            </p>
          </div>
          <div className="-mr-5 flex max-w-2xl flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/5 shadow-2xl shadow-black/50">
            <Image
              src={require('../../public/assets/extension/syntax-guide@2x.png')}
              placeholder="blur"
              quality={100}
              alt="screenshot of VSCode showcasing Total TypeScript extension and it's ability to teach you TypeScript syntax."
            />
          </div>
        </section>
        <section className="mx-auto flex max-w-screen-xl flex-col items-center justify-center lg:flex-row lg:justify-start">
          <div className="-ml-3 flex max-w-2xl flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/5 shadow-2xl shadow-black/50">
            <Image
              src={require('../../public/assets/extension/error-translation@2x.png')}
              placeholder="blur"
              quality={100}
              alt="screenshot of VSCode showcasing Total TypeScript extension and it's ability to translate cryptic TypeScript errors into human-readable language."
            />
          </div>
          <div className="max-w-xl p-6 sm:p-10 lg:max-w-none xl:p-24">
            <h3 className="text-3xl font-bold">Error Translation</h3>
            <p className="pt-5 text-lg opacity-80">
              Confused by TypeScript errors? Translate them into human-readable
              language right in your IDE.
            </p>
          </div>
        </section>
        <section className="mx-auto flex w-full max-w-screen-md flex-col px-5">
          <h2 className="pb-8 text-2xl font-bold sm:text-3xl">Reviews</h2>
          <div className="flex flex-col gap-16 md:flex-row">
            {reviews.map(({author, review}) => {
              return (
                <article className="w-full">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Image
                        placeholder="blur"
                        src={author.image}
                        width={44}
                        height={44}
                        quality={100}
                        className="rounded-full"
                      />
                      <span className="font-medium">{author.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {new Array(5).fill('').map(() => (
                        <StarIcon />
                      ))}
                    </div>
                  </div>
                  <p className="pt-3 leading-relaxed opacity-80">{review}</p>
                </article>
              )
            })}
          </div>
        </section>
      </main>
      <section className="relative z-10 bg-black/10 px-5 pb-24">
        <Share
          title={'Total TypeScript VSCode Extension'}
          contentType="extension"
        />
        {!subscriber && !loadingSubscriber && <ArticleNewsletterCta />}
      </section>
    </Layout>
  )
}

export default ExtensionPage

const reviews = [
  {
    author: {
      name: 'Kevin Bailey',
      image: require('../../public/assets/extension/kevin-bailey.png'),
    },
    review: `I've been working with TypeScript for a long time. Back in the 1.0 days. I've always hated the errors with TypeScript, eventually I'd be able to translate, but man... having this has just made it so much faster to quickly figured out what the error is even talking about. LOVE IT`,
  },
  {
    author: {
      name: 'Will Klein',
      image: require('../../public/assets/extension/will-klein.png'),
    },
    review: `Fantastic work here. The obtuse error dialog in VS Code for TypeScript errors has been holding everyone back. This is the single best improvement to my DX in many years!`,
  },
]

const GitHubIcon = () => {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 28 28"
    >
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M13.963 0C6.338 0 .1 6.239.1 13.863c0 6.066 3.985 11.264 9.53 13.17.694.174.867-.346.867-.693v-2.426c-3.812.867-4.679-1.733-4.679-1.733-.693-1.56-1.56-2.08-1.56-2.08-1.212-.866.174-.866.174-.866 1.386.174 2.08 1.387 2.08 1.387 1.212 2.253 3.292 1.56 3.985 1.213.173-.867.52-1.56.867-1.906-3.12-.347-6.239-1.56-6.239-6.932 0-1.56.52-2.773 1.386-3.64-.173-.346-.693-1.732.174-3.638 0 0 1.213-.347 3.812 1.386 1.04-.347 2.253-.52 3.466-.52s2.426.173 3.466.52c2.6-1.733 3.812-1.386 3.812-1.386.693 1.906.347 3.292.174 3.639.866 1.04 1.386 2.253 1.386 3.639 0 5.372-3.293 6.412-6.412 6.758.52.693 1.04 1.56 1.04 2.773v3.812c0 .347.173.867 1.04.694 5.545-1.907 9.53-7.105 9.53-13.17C27.827 6.238 21.589 0 13.964 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const VSCodeIcon = () => {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="29"
      fill="none"
      viewBox="0 0 28 29"
    >
      <g clipPath="url(#a)">
        <mask
          id="b"
          width="28"
          height="28"
          x="0"
          y="1"
          maskUnits="userSpaceOnUse"
          style={{maskType: 'alpha'}}
        >
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M19.855 28.75c.441.172.944.16 1.39-.054l5.764-2.774A1.75 1.75 0 0 0 28 24.346V5.537a1.75 1.75 0 0 0-.99-1.577l-5.766-2.774a1.743 1.743 0 0 0-1.989.338L8.22 11.593l-4.807-3.65a1.165 1.165 0 0 0-1.489.067L.382 9.412a1.167 1.167 0 0 0-.002 1.726l4.17 3.803-4.17 3.803a1.167 1.167 0 0 0 .002 1.726l1.541 1.402a1.165 1.165 0 0 0 1.49.066l4.806-3.649 11.036 10.069c.175.174.38.306.6.392Zm1.15-20.165L12.63 14.94l8.373 6.356V8.585Z"
            clipRule="evenodd"
          />
        </mask>
        <g mask="url(#b)">
          <path
            fill="#0065A9"
            d="m27.01 3.964-5.769-2.778a1.744 1.744 0 0 0-1.99.339L.365 18.745a1.167 1.167 0 0 0 .001 1.725l1.543 1.402a1.167 1.167 0 0 0 1.49.067L26.142 4.685a1.159 1.159 0 0 1 1.86.923V5.54a1.75 1.75 0 0 0-.991-1.577Z"
          />
          <g filter="url(#c)">
            <path
              fill="#007ACC"
              d="m27.01 25.918-5.769 2.778a1.744 1.744 0 0 1-1.99-.338L.365 11.138a1.167 1.167 0 0 1 .001-1.726L1.91 8.01a1.167 1.167 0 0 1 1.49-.066l22.743 17.254a1.159 1.159 0 0 0 1.86-.924v.067a1.75 1.75 0 0 1-.991 1.577Z"
            />
          </g>
          <g filter="url(#d)">
            <path
              fill="#1F9CF0"
              d="M21.242 28.696a1.745 1.745 0 0 1-1.99-.338c.646.645 1.75.188 1.75-.725V2.249c0-.913-1.104-1.37-1.75-.725a1.745 1.745 0 0 1 1.99-.338L27.01 3.96c.606.291.992.904.992 1.577v18.808a1.75 1.75 0 0 1-.992 1.578l-5.768 2.773Z"
            />
          </g>
          <path
            fill="url(#e)"
            fillRule="evenodd"
            d="M19.84 28.75c.44.172.944.16 1.389-.054l5.764-2.774a1.75 1.75 0 0 0 .991-1.577V5.537a1.75 1.75 0 0 0-.99-1.577l-5.765-2.774a1.743 1.743 0 0 0-1.99.338L8.205 11.593l-4.807-3.65a1.165 1.165 0 0 0-1.49.067L.367 9.412a1.167 1.167 0 0 0-.001 1.726l4.169 3.803-4.17 3.803a1.167 1.167 0 0 0 .002 1.726l1.542 1.402a1.165 1.165 0 0 0 1.489.066l4.807-3.649L19.24 28.358c.174.174.38.306.6.392Zm1.149-20.165-8.374 6.356 8.374 6.356V8.585Z"
            clipRule="evenodd"
            opacity=".25"
            style={{mixBlendMode: 'overlay'}}
          />
        </g>
      </g>
      <defs>
        <filter
          id="c"
          width="32.684"
          height="25.829"
          x="-2.349"
          y="5.373"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.167" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend
            in2="BackgroundImageFix"
            mode="overlay"
            result="effect1_dropShadow_898_538"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_898_538"
            result="shape"
          />
        </filter>
        <filter
          id="d"
          width="13.417"
          height="32.522"
          x="16.919"
          y="-1.32"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.167" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend
            in2="BackgroundImageFix"
            mode="overlay"
            result="effect1_dropShadow_898_538"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_898_538"
            result="shape"
          />
        </filter>
        <linearGradient
          id="e"
          x1="13.984"
          x2="13.984"
          y1="1.013"
          y2="28.869"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h28v28H0z" transform="translate(0 .94)" />
        </clipPath>
      </defs>
    </svg>
  )
}

const StarIcon = () => {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="15"
      fill="none"
      viewBox="0 0 16 15"
    >
      <path
        fill="#F0B50B"
        d="M7.217.69c.3-.92 1.603-.92 1.902 0l1.07 3.293a1 1 0 0 0 .95.69H14.6c.969 0 1.37 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.92-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.54-1.118l1.07-3.292a1 1 0 0 0-.363-1.118l-2.8-2.033c-.782-.57-.38-1.81.589-1.81h3.46a1 1 0 0 0 .952-.69L7.218.692 7.217.69Z"
      />
    </svg>
  )
}
