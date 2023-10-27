import * as React from 'react'
import Image from 'next/image'
import {useCopyToClipboard} from 'react-use'
import {twMerge} from 'tailwind-merge'
import toast from 'react-hot-toast'
import cx from 'classnames'
import {DownloadIcon, ClipboardCopyIcon} from '@heroicons/react/outline'

import Layout from 'components/layout'

const StackSection: React.FC<{title: string; children: React.ReactNode}> = ({
  title,
  children,
}) => {
  return (
    <section>
      <h3 className="text-[2rem] font-heading leading-tight">{title}</h3>
      <div className="mt-10">{children}</div>
    </section>
  )
}

const LogoTile: React.FC<{
  type: 'dark' | 'light'
  logoSrc: string
  logoSize: {
    width: number
    height: number
  }
  logoAlt: string
}> = ({type, logoSrc, logoSize, logoAlt}) => {
  return (
    <div
      className={cx(
        'rounded-2xl p-4 h-[300px] relative flex justify-center items-center group',
        type === 'dark' ? 'bg-badass-gray-800' : 'bg-white',
      )}
    >
      <Image
        src={logoSrc}
        width={logoSize.width}
        height={logoSize.height}
        alt={logoAlt}
      />
      <DownloadButton type={type} srcToDownload={logoSrc} />
    </div>
  )
}

const downloadButtonStyles =
  'inline-flex px-6 py-3 justify-center items-center rounded-xl text-white hover:text-black hover:bg-badass-green-500 duration-150 leading-tight border space-x-3 h-[52px] font-medium absolute bottom-4 right-4 opacity-0 group-hover:opacity-100'

const downloadButtonStylesLight = 'bg-badass-gray-900 hover:border-black'
const downloadButtonStylesDark = 'hover:border-badass-green-500'

const DownloadButton: React.FC<{
  type: 'dark' | 'light'
  srcToDownload: string
}> = ({type, srcToDownload}) => {
  return (
    <a
      href={srcToDownload}
      download={srcToDownload}
      className={twMerge(
        downloadButtonStyles,
        type === 'dark' ? downloadButtonStylesDark : downloadButtonStylesLight,
      )}
      onClick={() => toast.success('Logo has been downloaded')}
    >
      <span>Download</span>
      <DownloadIcon aria-hidden="true" className="w-6" />
    </a>
  )
}

const colorPaletteTiles = [
  {
    hexCode: '#FDB854',
    colorClassName: 'bg-badass-yellow-300',
  },
  {
    hexCode: '#FF6D46',
    colorClassName: 'bg-badass-red-400',
  },
  {
    hexCode: '#F8ABB5',
    colorClassName: 'bg-badass-pink-500',
  },
  {
    hexCode: '#4958B4',
    colorClassName: 'bg-badass-neutral-500',
  },
  {
    hexCode: '#88D4DD',
    colorClassName: 'bg-badass-cyan-500',
  },
  {
    hexCode: '#2BC370',
    colorClassName: 'bg-badass-green-500',
  },
]

const ColorPaletteTile: React.FC<{hexCode: string; colorClassName: string}> = ({
  hexCode,
  colorClassName,
}) => {
  const [copiedState, setCopied] = useCopyToClipboard()
  return (
    <div className="group">
      <div
        className={cx(
          'h-40 rounded-2xl flex justify-center items-center font-sans font-medium text-base cursor-pointer',
          colorClassName,
        )}
        onClick={() => {
          setCopied(hexCode)
          !copiedState.error && toast.success('Copied to clipboard')
        }}
      >
        <div className="opacity-0 group-hover:opacity-100 duration-150 flex items-center space-x-3">
          <span>Click to copy</span>
          <ClipboardCopyIcon aria-hidden="true" className="w-6" />
        </div>
      </div>
      <h4 className="text-badass-gray-300 font-mono text-base font-medium opacity-70 group-hover:opacity-100 group-hover:text-white duration-150 leading-[2.18] mt-4">
        {hexCode}
      </h4>
    </div>
  )
}

const LogosSection = () => {
  return (
    <StackSection title="Logo">
      <div className="space-y-8">
        <div>
          <div className="grid sm:grid-cols-2 gap-4">
            <LogoTile
              type="dark"
              logoSrc="https://res.cloudinary.com/badass-courses/image/upload/v1698241619/brand/logo-mark/logo-mark-dark_prawjv.svg"
              logoSize={{width: 140, height: 140}}
              logoAlt="Logo Mark Dark"
            />
            <LogoTile
              type="light"
              logoSrc="https://res.cloudinary.com/badass-courses/image/upload/v1698241620/brand/logo-mark/logo-mark-light_ozc6j4.svg"
              logoSize={{width: 140, height: 140}}
              logoAlt="Logo Mark Light"
            />
          </div>
          <h4 className="uppercase text-badass-gray-300 font-mono text-base leading-[2.18] mt-7">
            Logo Mark
          </h4>
        </div>
        <div>
          <div className="grid sm:grid-cols-2 gap-4">
            <LogoTile
              type="dark"
              logoSrc="https://res.cloudinary.com/badass-courses/image/upload/v1698241641/brand/logotype/logotype-dark_baubcg.svg"
              logoSize={{width: 291, height: 101}}
              logoAlt="Logotype Dark"
            />
            <LogoTile
              type="light"
              logoSrc="https://res.cloudinary.com/badass-courses/image/upload/v1698241642/brand/logotype/logotype-light_svrnhh.svg"
              logoSize={{width: 291, height: 101}}
              logoAlt="Logotype Light"
            />
          </div>
          <h4 className="uppercase text-badass-gray-300 font-mono text-base leading-[2.18] mt-7">
            Logotype
          </h4>
        </div>
        <div>
          <div className="grid sm:grid-cols-2 gap-4">
            <LogoTile
              type="dark"
              logoSrc="https://res.cloudinary.com/badass-courses/image/upload/v1698241641/brand/logotype/logotype-censored-dark_gnplxd.svg"
              logoSize={{width: 291, height: 101}}
              logoAlt="Logotype Censored Dark"
            />
            <LogoTile
              type="light"
              logoSrc="https://res.cloudinary.com/badass-courses/image/upload/v1698241642/brand/logotype/logotype-censored-light_c5ah9x.svg"
              logoSize={{width: 291, height: 101}}
              logoAlt="Logotype Censored Light"
            />
          </div>
          <h4 className="uppercase text-badass-gray-300 font-mono text-base leading-[2.18] mt-7">
            Censored Logotype
          </h4>
        </div>
      </div>
    </StackSection>
  )
}

const PrimaryColorsSection = () => {
  return (
    <StackSection title="Primary Color Palette">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
        {colorPaletteTiles.map((tile) => {
          return (
            <ColorPaletteTile
              key={`color-palette-tile-${tile.hexCode}`}
              hexCode={tile.hexCode}
              colorClassName={tile.colorClassName}
            />
          )
        })}
      </div>
    </StackSection>
  )
}

const FontsSection = () => {
  return (
    <StackSection title="Fonts">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <a
            href="https://www.sudtipos.com/font/espiritu"
            target="_blank"
            className="rounded-2xl px-4 pt-0 h-[300px] relative flex justify-center items-center bg-badass-green-600 group"
          >
            <div className="group-hover:scale-105 duration-300 flex flex-col items-center text-center">
              <span className="font-condensed text-[2.5rem] leading-[0.6]">
                This is espiritu
              </span>
              <span className="font-heading text-[3.5rem] leading-none mt-9 mb-4">
                Also espiritu
              </span>
              <span className=" font-script text-[2.5rem] leading-none">
                and this too
              </span>
            </div>
          </a>
          <h4 className="uppercase text-badass-gray-300 font-mono text-base leading-[2.18] mt-7">
            Espiritu by <span className="text-white">Sudtipos</span>
          </h4>
        </div>
        <div>
          <a
            href="https://fonts.google.com/specimen/DM+Sans"
            target="_blank"
            className="rounded-2xl p-4 h-[300px] relative flex flex-col justify-center items-center bg-badass-neutral-600 group"
          >
            <div className="group-hover:scale-105 duration-300 flex flex-col items-center text-center">
              <span className="font-sans font-medium text-[3.5rem]">
                DM Sans
              </span>
              <span className="font-mono font-medium text-base uppercase">
                for paragraphs and controls
              </span>
            </div>
          </a>
          <h4 className="uppercase text-badass-gray-300 font-mono text-base leading-[2.18] mt-7">
            dm sans by <span className="text-white">colophon foundry</span>
          </h4>
        </div>
      </div>
    </StackSection>
  )
}

const BG_BADGES_PILE_DARK =
  'https://res.cloudinary.com/badass-courses/image/upload/v1698341795/brand/miscellaneous/bg-dark-brand_wqcem0.png'
const BG_BADGES_PILE_LIGHT =
  'https://res.cloudinary.com/badass-courses/image/upload/v1698341794/brand/miscellaneous/bg-light-brand_cif1ri.png'

const BADGE_DARK_SVG =
  'https://res.cloudinary.com/badass-courses/image/upload/v1698342586/brand/badge/badass-badge-dark_b4dqxh.svg'
const BADGE_DARK_PNG =
  'https://res.cloudinary.com/badass-courses/image/upload/v1698241493/brand/badge/badass-badge-dark_2x_wddckq.png'
const BADGE_DARK_CENSORED_SVG =
  'https://res.cloudinary.com/badass-courses/image/upload/v1698342584/brand/badge/badass-badge-dark-censored_b5jrit.svg'
const BADGE_DARK_CENSORED_PNG =
  'https://res.cloudinary.com/badass-courses/image/upload/v1698241493/brand/badge/badass-badge-dark-censored_2x_yhppq6.png'
const BADGE_LIGHT_SVG =
  'https://res.cloudinary.com/badass-courses/image/upload/v1698342587/brand/badge/badass-badge-light_ngylbj.svg'
const BADGE_LIGHT_PNG =
  'https://res.cloudinary.com/badass-courses/image/upload/v1698241493/brand/badge/badass-badge-light_2x_mgf0ww.png'
const BADGE_LIGHT_CENSORED_SVG =
  'https://res.cloudinary.com/badass-courses/image/upload/v1698342585/brand/badge/badass-badge-light-censored_zhbkii.svg'
const BADGE_LIGHT_CENSORED_PNG =
  'https://res.cloudinary.com/badass-courses/image/upload/v1698241493/brand/badge/badass-badge-light-censored_2x_aq5967.png'

const badgeDownloadButtonStyles =
  'px-1 py-0.5 duration-150 bg-black hover:bg-badass-green-500 hover:text-black block border rounded-md'
const badgeDownloadButtonDarkStyles =
  'border-white hover:border-badass-green-500'
const badgeDownloadButtonLightStyles =
  'border-black hover:border-badass-green-500'

const BadgeDownloadButtonsSet: React.FC<{
  type: 'dark' | 'light'
  badgeSvg: string
  badgePng: string
  newFileName: string
}> = ({type, badgeSvg, badgePng, newFileName}) => {
  const downloadButtonStyles = cx(
    badgeDownloadButtonStyles,
    type === 'dark'
      ? badgeDownloadButtonDarkStyles
      : badgeDownloadButtonLightStyles,
  )

  const downloadBlob = (url: string, fileName: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = fileName
        a.click()
        window.URL.revokeObjectURL(blobUrl)
      })
  }
  return (
    <div className="absolute bottom-4 flex flex-col items-center text-white opacity-0 group-hover:opacity-100 duration-150">
      <h4
        className={cx(
          'mb-3 font-medium',
          type === 'dark' ? 'text-white' : 'text-black',
        )}
      >
        Download
      </h4>
      <div className="flex justify-center space-x-4 text-xs font-medium">
        <a
          href={badgeSvg}
          className={downloadButtonStyles}
          onClick={(e) => {
            e.preventDefault()
            downloadBlob(badgeSvg, `${newFileName}.svg`)
            toast.success('Badge has been downloaded')
          }}
        >
          SVG
        </a>
        <a
          href={badgePng}
          className={downloadButtonStyles}
          onClick={(e) => {
            e.preventDefault()
            downloadBlob(badgePng, `${newFileName}.png`)
            toast.success('Badge has been downloaded')
          }}
        >
          PNG
        </a>
      </div>
    </div>
  )
}

const BadgesPile: React.FC<{
  pileBgImage: string
  badgeSvg: string
  badgePng: string
  badgeCensoredSvg: string
  badgeCensoredPng: string
  type: 'light' | 'dark'
}> = ({
  pileBgImage,
  badgeSvg,
  badgePng,
  badgeCensoredSvg,
  badgeCensoredPng,
  type,
}) => {
  return (
    <div>
      <div
        className={cx(
          'rounded-2xl h-[300px] relative flex bg-cover group',
          type === 'dark' ? 'bg-badass-neutral-900' : 'bg-badass-green-400',
        )}
        style={{
          backgroundImage: `url("${pileBgImage}")`,
        }}
      >
        <div className="w-1/2 p-4 flex justify-center items-center relative">
          <Image src={badgeSvg} alt="Badge Dark" width={186} height={56} />
          <BadgeDownloadButtonsSet
            type={type}
            badgeSvg={badgeSvg}
            badgePng={badgePng}
            newFileName={`badge-${type}`}
          />
        </div>
        <div className="w-1/2 p-4 flex justify-center items-center relative">
          <Image
            src={badgeCensoredSvg}
            alt="Badge Dark"
            width={170}
            height={56}
          />
          <BadgeDownloadButtonsSet
            type={type}
            badgeSvg={badgeCensoredSvg}
            badgePng={badgeCensoredPng}
            newFileName={`badge-${type}-censored`}
          />
        </div>
      </div>
      <h4 className="uppercase text-badass-gray-300 font-mono text-base leading-[2.18] mt-7">
        {type === 'dark' ? 'Dark' : 'Light'} Background
      </h4>
    </div>
  )
}

const BadgesSection = () => {
  return (
    <StackSection title="Badges for product websites">
      <div className="grid md:grid-cols-2 gap-4">
        <BadgesPile
          pileBgImage={BG_BADGES_PILE_DARK}
          badgeSvg={BADGE_DARK_SVG}
          badgePng={BADGE_DARK_PNG}
          badgeCensoredSvg={BADGE_DARK_CENSORED_SVG}
          badgeCensoredPng={BADGE_DARK_CENSORED_PNG}
          type="dark"
        />
        <BadgesPile
          pileBgImage={BG_BADGES_PILE_LIGHT}
          badgeSvg={BADGE_LIGHT_SVG}
          badgePng={BADGE_LIGHT_PNG}
          badgeCensoredSvg={BADGE_LIGHT_CENSORED_SVG}
          badgeCensoredPng={BADGE_LIGHT_CENSORED_PNG}
          type="light"
        />
      </div>
    </StackSection>
  )
}

const BrandPage = () => {
  return (
    <Layout
      meta={{
        title: 'Brand Assets',
        ogImage: {
          url: 'https://res.cloudinary.com/badass-courses/image/upload/v1698340706/og-images/brand/og-image-brand_2x_c8j0ez.png',
        },
      }}
      className="overflow-hidden pb-64"
    >
      <div className="container mt-6 md:mt-8 lg:mt-11">
        <header className="text-center">
          <h2 className="text-badass-pink-400 font-script text-[2.5rem] leading-[0.6]">
            Useful Assets
          </h2>
          <h1 className="text-[4rem] font-heading leading-tight mt-8">
            Brand Resources
          </h1>
        </header>
        <main className="w-full mt-20">
          <div className="space-y-16">
            <LogosSection />
            <PrimaryColorsSection />
            <FontsSection />
            <BadgesSection />
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default BrandPage
