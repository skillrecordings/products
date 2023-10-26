import * as React from 'react'
import Image from 'next/image'
import {useCopyToClipboard} from 'react-use'
import {twMerge} from 'tailwind-merge'
import {renderToString} from 'react-dom/server'
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
          'h-40 rounded-2xl flex justify-center items-center font-mono font-medium text-base cursor-pointer',
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
            <div className="group-hover:scale-105 duration-300 flex flex-col items-center">
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
            <div className="group-hover:scale-105 duration-300 flex flex-col items-center">
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

const BadgesSection = () => {
  return (
    <StackSection title="Badges for product websites">
      LogosStackSection
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
          <div className="container space-y-16">
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
