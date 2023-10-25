import * as React from 'react'
import Image from 'next/image'
import {useCopyToClipboard} from 'react-use'
import {twMerge} from 'tailwind-merge'
import {renderToString} from 'react-dom/server'
import toast from 'react-hot-toast'
import cx from 'classnames'
import {DownloadIcon} from '@heroicons/react/outline'

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
    >
      <span>Download</span>
      <DownloadIcon aria-hidden="true" className="w-6" />
    </a>
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
    <StackSection title="Primary Color Palette">LogosStackSection</StackSection>
  )
}
const FontsSection = () => {
  return <StackSection title="Fonts">LogosStackSection</StackSection>
}

const BrandPage = () => {
  return (
    <Layout
      meta={{
        title: 'Brand Assets',
        ogImage: {
          url: 'https://badass.dev/card@2x.png',
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
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default BrandPage

// const EpicStackSection = () => {
//   return (
//     <div>
//       <h2 className="w-full border-b border-black/5 pb-2 text-2xl font-bold dark:border-white/5">
//         Epic Stack
//       </h2>
//       <section className="space-y-12 pt-12">
//         <article>
//           <h3 className="pb-2 text-sm font-semibold uppercase tracking-wide">
//             Logo Mark
//           </h3>
//           <Grid>
//             <LogoCard
//               className="bg-gray-900 dark:bg-gray-900/75"
//               logo={<EpicStackMark variant="light" />}
//             />
//             <LogoCard
//               className="bg-white"
//               logo={<EpicStackMark variant="dark" />}
//             />
//           </Grid>
//         </article>
//         <article className="">
//           <h3 className="pb-2 text-sm font-semibold uppercase tracking-wide">
//             Horizontal Version
//           </h3>

//           <Grid>
//             <LogoCard
//               className="bg-[#140C3E]"
//               logo={<EpicStackHorizontal variant="light" isGrayscale={false} />}
//             />
//             <LogoCard
//               className="bg-white"
//               logo={<EpicStackHorizontal variant="dark" isGrayscale={false} />}
//             />
//           </Grid>
//         </article>
//         <article>
//           <h3 className="pb-2 text-sm font-semibold uppercase tracking-wide">
//             Vertical Version
//           </h3>
//           <Grid>
//             <LogoCard
//               className="bg-[#140C3E]"
//               logo={<EpicStackVertical variant="light" isGrayscale={false} />}
//             />
//             <LogoCard
//               className="bg-white"
//               logo={<EpicStackVertical variant="dark" isGrayscale={false} />}
//             />
//           </Grid>
//         </article>
//       </section>
//     </div>
//   )
// }

// const EpicWebSection = () => {
//   return (
//     <div>
//       <h2 className="w-full border-b border-black/5 pb-2 text-2xl font-bold dark:border-white/5">
//         Epic Web
//       </h2>
//       <section className="space-y-12 pt-12">
//         <article>
//           <h3 className="pb-2 text-sm font-semibold uppercase tracking-wide">
//             Logo Mark
//           </h3>
//           <Grid>
//             <LogoCard
//               className="bg-gray-900 dark:bg-gray-900/75"
//               logo={<EpicWebMark variant="light" />}
//             />
//             <LogoCard
//               className="bg-white"
//               logo={<EpicWebMark variant="dark" />}
//             />
//           </Grid>
//         </article>
//         <article>
//           <h3 className="pb-2 text-sm font-semibold uppercase tracking-wide">
//             Vertical Version
//           </h3>
//           <Grid>
//             <LogoCard
//               className="bg-gray-900 dark:bg-gray-900/75"
//               logo={<EpicWebVertical variant="light" />}
//             />
//             <LogoCard
//               className="bg-white"
//               logo={<EpicWebVertical variant="dark" />}
//             />
//           </Grid>
//         </article>
//         <article>
//           <h3 className="pb-2 text-sm font-semibold uppercase tracking-wide">
//             Horizontal Version
//           </h3>
//           <Grid>
//             <LogoCard
//               className="bg-gray-900 dark:bg-gray-900/75"
//               logo={<EpicWebHorizontal variant="light" />}
//             />
//             <LogoCard
//               className="bg-white"
//               logo={<EpicWebHorizontal variant="dark" />}
//             />
//           </Grid>
//         </article>
//       </section>
//     </div>
//   )
// }

// const LogoCard: React.FC<
//   React.PropsWithChildren<{logo: React.ReactElement; className?: string}>
// > = ({className, logo}) => {
//   const [copiedState, setCopied] = useCopyToClipboard()
//   const [isExpanded, setIsExpanded] = React.useState(false)
//   const ref = React.useRef<HTMLDivElement>(null)
//   const grayscaleLogo = React.createElement(logo.type, {
//     ...logo.props,
//     isGrayscale: true,
//   })
//   const [isGrayscale, setIsGrayscale] = React.useState(false)
//   const logoEl = React.createElement(logo.type, {
//     ...logo.props,
//     isGrayscale,
//   })
//   return (
//     <div>
//       <div
//         ref={ref}
//         tabIndex={0}
//         onMouseOver={() => {
//           setIsExpanded(true)
//         }}
//         onMouseOut={() => {
//           setIsExpanded(false)
//         }}
//         onFocus={() => {
//           setIsExpanded(true)
//         }}
//         onBlur={(e) => {
//           if (ref.current && !ref.current.contains(e.relatedTarget as Node)) {
//             setIsExpanded(false)
//           }
//         }}
//         className={twMerge(
//           'relative flex aspect-video items-center justify-center rounded',
//           className,
//         )}
//       >
//         {logoEl}
//         {isExpanded && (
//           <div
//             className={cx(
//               'absolute bottom-3 right-3 flex items-center gap-2 text-black',
//             )}
//           >
//             <div className="py-1 pl-2 font-mono text-xs uppercase text-gray-500">
//               Copy SVG:
//             </div>
//             <button
//               type="button"
//               key={logo.props.variant}
//               className="rounded bg-gray-100 px-2 py-1 font-mono text-xs font-medium uppercase hover:underline"
//               onClick={() => {
//                 setCopied(renderToString(logo))
//                 !copiedState.error && toast.success('Copied to clipboard')
//               }}
//             >
//               Color
//             </button>
//             <button
//               onMouseOver={() => {
//                 setIsGrayscale(true)
//               }}
//               onMouseOut={() => {
//                 setIsGrayscale(false)
//               }}
//               onFocus={() => {
//                 setIsGrayscale(true)
//               }}
//               onBlur={(e) => {
//                 setIsGrayscale(false)
//               }}
//               type="button"
//               key={logo.props.variant}
//               className="rounded bg-gray-100 px-2 py-1 font-mono text-xs font-medium uppercase hover:underline"
//               onClick={() => {
//                 setCopied(renderToString(grayscaleLogo))
//                 !copiedState.error && toast.success('Copied to clipboard')
//               }}
//             >
//               Grayscale
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// const Grid: React.FC<React.PropsWithChildren> = ({children}) => {
//   return <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{children}</div>
// }

// const EpicStackMark: React.FC<{variant?: 'light' | 'dark'}> = ({
//   variant = 'light',
// }) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="65"
//       height="65"
//       fill="none"
//       viewBox="0 0 65 65"
//     >
//       <path
//         fill={variant === 'light' ? '#FFF' : '#000'}
//         d="M39.445 25.555 37 17.163 65 0 47.821 28l-8.376-2.445Zm-13.89 0L28 17.163 0 0l17.179 28 8.376-2.445Zm13.89 13.89L37 47.837 65 65 47.821 37l-8.376 2.445Zm-13.89 0L28 47.837 0 65l17.179-28 8.376 2.445Z"
//       />
//     </svg>
//   )
// }

// const EpicStackVertical: React.FC<{
//   variant?: 'light' | 'dark'
//   isGrayscale?: boolean
// }> = ({variant, isGrayscale = true}) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="100"
//       height="112"
//       fill="none"
//       viewBox="0 0 100 112"
//     >
//       <path
//         fill={
//           variant === 'light'
//             ? isGrayscale
//               ? '#FFF'
//               : '#D6C5FF'
//             : isGrayscale
//             ? '#000'
//             : '#6A24FF'
//         }
//         d="M7.885 111.479c-3.652 0-6.356-1.812-7.388-4.795l2.23-1.283c.753 2.37 2.51 3.541 5.214 3.541 2.676 0 4.126-1.199 4.126-3.011 0-.92-.362-1.617-1.06-2.091-.696-.474-1.895-.948-3.54-1.478l-1.868-.613a29.066 29.066 0 0 1-1.617-.725c-.641-.335-1.115-.669-1.422-1.004-.641-.697-1.227-1.84-1.227-3.262 0-1.7.586-3.039 1.785-4.014 1.199-1.004 2.648-1.506 4.35-1.506 3.094 0 5.463 1.7 6.607 4.266L11.9 96.758c-.836-2.007-2.314-3.01-4.433-3.01-2.119 0-3.54 1.114-3.54 2.899 0 .864.306 1.505.92 1.951.613.446 1.672.92 3.178 1.394l1.143.363c.223.083.557.195 1.031.39.976.363 1.2.502 1.952.92.78.418 1.031.725 1.505 1.283.697.697.976 1.7.976 2.927 0 1.701-.613 3.067-1.868 4.098-1.254 1.004-2.871 1.506-4.879 1.506ZM19.587 91.6h14.08v2.454h-5.771v17.062H25.33V94.054h-5.744V91.6Zm35.025 19.516h-2.76l-1.59-4.377H41.48l-1.589 4.377h-2.76L44.408 91.6h2.927l7.277 19.516Zm-8.755-16.42-3.484 9.618h6.997l-3.512-9.619Zm23.703 16.783c-2.955 0-5.408-.976-7.332-2.928-1.924-1.951-2.871-4.349-2.871-7.193 0-2.843.947-5.241 2.871-7.193 1.924-1.951 4.377-2.927 7.333-2.927 3.568 0 6.747 1.84 8.42 4.74l-2.259 1.31c-1.115-2.147-3.485-3.54-6.161-3.54-2.259 0-4.099.724-5.52 2.174-1.422 1.45-2.12 3.262-2.12 5.436 0 2.147.697 3.959 2.12 5.409 1.421 1.45 3.261 2.175 5.52 2.175 2.676 0 5.046-1.394 6.161-3.513l2.258 1.282c-.808 1.45-1.98 2.621-3.485 3.485-1.505.865-3.15 1.283-4.934 1.283Zm20.836-10.399 8.894 10.036h-3.18l-8.42-9.367v9.367H85.1V91.6h2.593v8.811l8.14-8.81h3.179l-8.615 9.479Z"
//       />
//       <path
//         fill={variant === 'light' ? '#FFF' : '#000'}
//         fillRule="evenodd"
//         d="M18.003 74.265v6.189h9.061v2.453H15.411V63.392h11.514v2.453h-8.922v5.994h8.225v2.426h-8.225Zm17.35-10.873h7.08c1.813 0 3.29.613 4.49 1.812 1.198 1.199 1.812 2.676 1.812 4.46 0 1.757-.614 3.262-1.812 4.461-1.2 1.2-2.677 1.813-4.49 1.813h-4.488v6.97h-2.593V63.39Zm2.592 10.12h4.489c1.087 0 1.98-.362 2.676-1.087.697-.753 1.06-1.673 1.06-2.76 0-2.23-1.59-3.848-3.736-3.848h-4.489v7.695Zm18.592 7.472V65.072h-2.949v-1.829h8.81v1.828H59.13v15.913h3.268v1.829H59.13v.094h-2.593v-.094h-2.949v-1.829h2.949Zm21.11 2.286c-2.956 0-5.41-.976-7.333-2.927-1.924-1.952-2.872-4.35-2.872-7.194 0-2.843.948-5.241 2.872-7.193 1.924-1.951 4.377-2.927 7.332-2.927 3.57 0 6.747 1.84 8.42 4.74l-2.258 1.31c-1.115-2.147-3.485-3.54-6.162-3.54-2.258 0-4.098.724-5.52 2.174-1.422 1.45-2.119 3.262-2.119 5.437 0 2.146.697 3.958 2.12 5.408 1.421 1.45 3.261 2.175 5.52 2.175 2.676 0 5.046-1.394 6.16-3.513l2.26 1.282c-.81 1.45-1.98 2.621-3.486 3.485-1.505.865-3.15 1.283-4.935 1.283Z"
//         clipRule="evenodd"
//       />
//       <path
//         fill={
//           variant === 'light'
//             ? isGrayscale
//               ? '#FFF'
//               : '#D6C5FF'
//             : isGrayscale
//             ? '#000'
//             : '#6A24FF'
//         }
//         d="m46.177 13.174-1.806 6.197-6.185 1.806L25.5.5l20.677 12.674Zm6.646 0 1.806 6.197 6.186 1.806L73.5.5 52.823 13.174ZM54.63 29.63l-1.806 6.197L73.5 48.5 60.815 27.823l-6.186 1.806Zm-8.452 6.197-1.806-6.197-6.185-1.806L25.5 48.5l20.677-12.674Z"
//         fillRule="evenodd"
//         clipRule="evenodd"
//       />
//     </svg>
//   )
// }

// const EpicStackHorizontal: React.FC<{
//   variant?: 'light' | 'dark'
//   isGrayscale?: boolean
// }> = ({variant, isGrayscale = true}) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="228"
//       height="48"
//       fill="none"
//       viewBox="0 0 228 48"
//     >
//       <path
//         fill={
//           variant === 'light'
//             ? isGrayscale
//               ? '#FFF'
//               : '#D6C5FF'
//             : isGrayscale
//             ? '#000'
//             : '#6A24FF'
//         }
//         d="m20.677 12.674-1.806 6.197-6.185 1.806L0 0l20.677 12.674Zm6.646 0 1.806 6.197 6.185 1.806L48 0 27.323 12.674ZM29.13 29.13l-1.806 6.197L48 48 35.314 27.323 29.13 29.13Zm-8.452 6.197-1.806-6.197-6.185-1.806L0 48l20.677-12.674Z"
//         fillRule="evenodd"
//         clipRule="evenodd"
//       />
//       <path
//         fill={
//           variant === 'light'
//             ? isGrayscale
//               ? '#FFF'
//               : '#D6C5FF'
//             : isGrayscale
//             ? '#000'
//             : '#6A24FF'
//         }
//         d="M145.523 33.556c-3.354 0-5.838-1.665-6.786-4.404l2.049-1.178c.691 2.176 2.304 3.252 4.788 3.252 2.458 0 3.79-1.101 3.79-2.766 0-.845-.333-1.485-.973-1.92-.64-.436-1.741-.871-3.252-1.357l-1.716-.564a26.477 26.477 0 0 1-1.485-.666c-.589-.307-1.024-.614-1.306-.921-.589-.64-1.127-1.69-1.127-2.996 0-1.562.538-2.792 1.639-3.688 1.101-.921 2.433-1.382 3.995-1.382 2.842 0 5.019 1.562 6.069 3.917l-1.998 1.153c-.768-1.844-2.125-2.766-4.071-2.766-1.946 0-3.252 1.024-3.252 2.663 0 .794.282 1.383.845 1.793.563.41 1.536.845 2.919 1.28l1.05.333c.205.077.512.18.947.358.897.333 1.101.461 1.793.845.717.384.947.666 1.382 1.178.641.64.897 1.562.897 2.689 0 1.562-.564 2.817-1.716 3.764-1.152.922-2.637 1.383-4.481 1.383Zm10.758-18.257h12.931v2.253h-5.301v15.67h-2.355v-15.67h-5.275v-2.253Zm31.804 17.924h-2.535l-1.46-4.02h-8.066l-1.459 4.02h-2.535l6.683-17.924h2.689l6.683 17.924Zm-8.041-15.082-3.2 8.834h6.427l-3.227-8.834Zm20.884 15.415c-2.714 0-4.967-.896-6.734-2.689-1.767-1.792-2.638-3.995-2.638-6.606 0-2.612.871-4.814 2.638-6.607 1.767-1.792 4.02-2.688 6.734-2.688 3.278 0 6.197 1.69 7.733 4.353l-2.074 1.203c-1.024-1.971-3.2-3.252-5.659-3.252-2.074 0-3.764.666-5.07 1.997-1.306 1.332-1.946 2.996-1.946 4.994 0 1.971.64 3.636 1.946 4.967 1.306 1.332 2.996 1.998 5.07 1.998 2.459 0 4.635-1.28 5.659-3.227l2.074 1.178c-.742 1.332-1.818 2.407-3.2 3.2-1.383.795-2.894 1.179-4.533 1.179Zm18.572-9.551 8.168 9.218h-2.919l-7.733-8.604v8.604h-2.382V15.299h2.382v8.091l7.477-8.091h2.919l-7.912 8.706Z"
//       />
//       <path
//         fill={variant === 'light' ? '#FFF' : '#000'}
//         d="M104.912 14.5h-8.094v1.679h2.875v17.044h2.381V16.18h2.838V14.5Zm-40.61 16.47v-5.685h7.554v-2.227h-7.554v-5.506h8.194V15.3H61.92v17.924h10.704V30.97h-8.322ZM86.74 15.299h-6.504v17.924h2.381v-6.401h4.123c1.664 0 3.021-.564 4.123-1.665 1.1-1.1 1.664-2.484 1.664-4.097 0-1.639-.563-2.996-1.665-4.097-1.1-1.1-2.458-1.664-4.122-1.664Zm0 9.295h-4.123v-7.068h4.123c1.972 0 3.431 1.486 3.431 3.534 0 .999-.333 1.844-.973 2.535-.64.666-1.46.999-2.458.999Zm25.606 6.273c1.767 1.793 4.021 2.689 6.735 2.689 1.639 0 3.149-.384 4.532-1.178 1.383-.794 2.458-1.87 3.201-3.2L124.74 28c-1.024 1.945-3.201 3.226-5.659 3.226-2.074 0-3.764-.666-5.07-1.997-1.306-1.332-1.946-2.996-1.946-4.968 0-1.997.64-3.662 1.946-4.993 1.306-1.332 2.996-1.998 5.07-1.998 2.458 0 4.635 1.28 5.659 3.252l2.074-1.203c-1.536-2.663-4.456-4.353-7.733-4.353-2.714 0-4.968.896-6.735 2.688-1.766 1.793-2.637 3.995-2.637 6.607s.871 4.814 2.637 6.606Z"
//         fillRule="evenodd"
//         clipRule="evenodd"
//       />
//       <path
//         fill={variant === 'light' ? '#FFF' : '#000'}
//         d="M96.819 31.821h8.093V33.5h-8.094v-1.68Z"
//       />
//     </svg>
//   )
// }

// const EpicWebMark: React.FC<{
//   variant?: 'light' | 'dark'
//   isGrayscale?: boolean
// }> = ({variant = 'light', isGrayscale = false}) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="70"
//       height="70"
//       fill="none"
//       viewBox="0 0 70 70"
//     >
//       <path
//         fill={
//           variant === 'light'
//             ? isGrayscale
//               ? '#FFF'
//               : 'url(#markGradient)'
//             : isGrayscale
//             ? '#000'
//             : 'url(#markGradient)'
//         }
//         d="M36.277 33.738a64.504 64.504 0 0 1-4.257 2.15c-6.333 2.912-15.383 5.86-26.228 5.981l-1.249.014-.226-1.228a31.016 31.016 0 0 1-.531-5.638C3.786 17.804 17.787 3.802 35 3.802a31.05 31.05 0 0 1 13.295 2.975l4.146-2.113A34.774 34.774 0 0 0 35 0C15.712 0 0 15.712 0 35c0 7.7 2.504 14.83 6.74 20.617 7.252-1.235 11.802-4.14 11.802-4.14s-2.905 4.544-4.14 11.798A34.803 34.803 0 0 0 35 70c19.288 0 35-15.712 35-35a34.778 34.778 0 0 0-4.652-17.42l-2.11 4.138a31.037 31.037 0 0 1 2.976 13.299C66.214 52.23 52.213 66.23 35 66.23c-1.942 0-3.804-.196-5.635-.53l-1.231-.225.014-1.251c.12-10.854 3.069-19.903 5.98-26.234a64.386 64.386 0 0 1 2.149-4.253Z"
//       />
//       <path
//         fill={variant === 'light' ? '#FFF' : isGrayscale ? '#000' : '#333753'}
//         d="m53.235 27.155-8.03-2.344-2.345-8.047L69.5.5 53.235 27.155Z"
//       />
//       <defs>
//         <linearGradient
//           id="markGradient"
//           x1="49.496"
//           x2="20.585"
//           y1="20.504"
//           y2="49.431"
//           gradientUnits="userSpaceOnUse"
//         >
//           <stop stopColor="#4F75FF" />
//           <stop offset="1" stopColor="#30AFFF" />
//         </linearGradient>
//       </defs>
//     </svg>
//   )
// }

// const EpicWebVertical: React.FC<{
//   variant?: 'light' | 'dark'
//   isGrayscale?: boolean
// }> = ({variant, isGrayscale = false}) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="152"
//       height="111"
//       fill="none"
//       viewBox="0 0 152 111"
//     >
//       <g
//         fill={
//           variant === 'light'
//             ? isGrayscale
//               ? '#FFF'
//               : '#FFF'
//             : isGrayscale
//             ? '#000'
//             : '#333753'
//         }
//       >
//         <path d="M2.893 101.357v6.19h9.06V110H.3V90.484h11.514v2.454H2.893v5.994h8.224v2.425H2.893Z" />
//         <path
//           fillRule="evenodd"
//           d="M20.242 90.484h7.081c1.812 0 3.29.614 4.489 1.812 1.199 1.2 1.812 2.677 1.812 4.461 0 1.757-.613 3.262-1.812 4.461-1.199 1.199-2.677 1.812-4.489 1.812h-4.488V110h-2.593V90.484Zm2.593 10.121h4.488c1.088 0 1.98-.363 2.677-1.088.697-.752 1.06-1.672 1.06-2.76 0-2.23-1.59-3.847-3.737-3.847h-4.488v7.695Z"
//           clipRule="evenodd"
//         />
//         <path d="M41.426 108.2V92.164h-3.09v-1.828h8.81v1.828h-3.127V108.2h3.127v1.828h-8.81V108.2h3.09Zm21.11 2.163c-2.956 0-5.409-.976-7.333-2.928-1.923-1.951-2.871-4.349-2.871-7.193 0-2.844.948-5.241 2.871-7.193 1.924-1.951 4.377-2.927 7.333-2.927 3.568 0 6.747 1.84 8.42 4.74l-2.259 1.31c-1.115-2.147-3.485-3.541-6.161-3.541-2.258 0-4.099.725-5.52 2.175-1.422 1.45-2.12 3.262-2.12 5.436 0 2.147.698 3.959 2.12 5.409 1.422 1.45 3.262 2.175 5.52 2.175 2.676 0 5.046-1.394 6.161-3.513l2.258 1.282c-.808 1.45-1.979 2.621-3.484 3.485-1.506.864-3.15 1.283-4.935 1.283Z" />
//         <path
//           fillRule="evenodd"
//           d="M11.954 107.547V110H.3V90.484h11.514v2.454H2.893v5.994h8.224v2.425H2.893v6.19h9.06Zm-8.761-.3h9.06v3.053H0V90.184h12.114v3.054H3.193v5.394h8.224v3.025H3.193v5.59Zm16.749-17.063h7.381c1.89 0 3.444.643 4.701 1.9 1.257 1.257 1.9 2.811 1.9 4.673 0 1.833-.643 3.416-1.9 4.673-1.257 1.257-2.812 1.9-4.7 1.9h-4.19v6.97h-3.192V90.184ZM22.835 110h-2.593V90.484h7.081c1.812 0 3.29.614 4.489 1.812 1.199 1.2 1.812 2.677 1.812 4.461 0 1.757-.613 3.262-1.812 4.461-1.199 1.199-2.677 1.812-4.489 1.812h-4.488V110Zm15.502-17.836v-1.828h8.809v1.828h-3.127V108.2h3.127v1.828h-8.81V108.2h3.09V92.164h-3.09Zm2.79.3h-3.09v-2.428h9.409v2.428h-3.127V107.9h3.127v2.428h-9.41V107.9h3.09V92.464Zm30.238 2.507-2.79 1.618-.144-.279c-1.059-2.039-3.32-3.379-5.895-3.379-2.188 0-3.947.7-5.306 2.085-1.362 1.388-2.033 3.122-2.033 5.226 0 2.075.67 3.81 2.033 5.199 1.359 1.385 3.118 2.085 5.306 2.085 2.575 0 4.837-1.341 5.896-3.353l.144-.274 2.787 1.582-.145.26c-.837 1.5-2.048 2.709-3.598 3.599-1.554.892-3.25 1.323-5.084 1.323-3.028 0-5.561-1.003-7.546-3.017-1.982-2.011-2.958-4.486-2.958-7.404s.976-5.393 2.958-7.403c1.985-2.014 4.518-3.017 7.546-3.017 3.672 0 6.951 1.894 8.68 4.89l.149.259Zm-48.23 5.334h4.188c1.012 0 1.823-.334 2.459-.994.642-.695.977-1.541.977-2.554 0-2.072-1.462-3.547-3.436-3.547h-4.188v7.095ZM30 99.517c-.697.725-1.59 1.088-2.677 1.088h-4.488V92.91h4.488c2.147 0 3.736 1.617 3.736 3.847 0 1.087-.362 2.008-1.06 2.76Zm40.805 6.338c-.8 1.33-1.92 2.413-3.335 3.225-1.505.864-3.15 1.283-4.934 1.283-2.956 0-5.409-.976-7.333-2.928-1.923-1.951-2.871-4.349-2.871-7.193 0-2.844.948-5.241 2.871-7.193 1.924-1.951 4.377-2.927 7.333-2.927 3.462 0 6.556 1.731 8.265 4.482a9.171 9.171 0 0 1 .154.257l-2.258 1.31a5.921 5.921 0 0 0-.145-.262c-1.167-1.997-3.45-3.278-6.016-3.278-2.258 0-4.099.725-5.52 2.175-1.422 1.45-2.12 3.262-2.12 5.436 0 2.147.698 3.959 2.12 5.409 1.422 1.45 3.262 2.175 5.52 2.175 2.564 0 4.847-1.28 6.015-3.251.05-.086.1-.174.146-.262l2.258 1.282a3.841 3.841 0 0 1-.07.123l-.08.137Z"
//           clipRule="evenodd"
//         />
//         <path d="M92.357 110h-3.01l-5.604-19.516h2.732l4.46 16.059 4.74-16.059h2.62l4.74 16.059 4.461-16.059h2.732L104.625 110h-3.011l-4.629-15.585L92.358 110Zm27.295-8.643v6.19h9.061V110h-11.654V90.484h11.514v2.454h-8.921v5.994h8.224v2.425h-8.224Zm28.222-1.477c1.784.864 2.927 2.509 2.927 4.6 0 1.561-.557 2.871-1.645 3.931-1.087 1.059-2.425 1.589-4.014 1.589h-8.42V90.484h7.806c1.534 0 2.816.502 3.876 1.534 1.059 1.031 1.589 2.286 1.589 3.791 0 1.729-.697 3.095-2.119 4.07Zm-3.346-6.97h-5.213v5.966h5.213c1.645 0 2.9-1.31 2.9-2.983 0-.809-.279-1.506-.864-2.091-.558-.586-1.227-.892-2.036-.892Zm-5.213 14.664h5.827c1.756 0 3.094-1.394 3.094-3.178 0-.864-.306-1.617-.92-2.23-.585-.614-1.31-.92-2.174-.92h-5.827v6.328Z" />
//         <path
//           fillRule="evenodd"
//           d="M92.581 110.3h-3.46l-5.777-20.116h3.359l4.241 15.269 4.507-15.269h3.07l4.506 15.269 4.241-15.269h3.359l-5.776 20.116h-3.461l-4.404-14.831L92.58 110.3Zm-.224-.3h-3.01l-5.604-19.516h2.732l4.46 16.059 4.74-16.059h2.62l4.74 16.059 4.461-16.059h2.732L104.625 110h-3.011l-4.629-15.585L92.358 110Zm36.656-2.753v3.053h-12.254V90.184h12.114v3.053h-8.921v5.395h8.224v3.025h-8.224v5.59h9.061Zm-9.361.3v-6.19h8.224v-2.425h-8.224v-5.995h8.921v-2.453h-11.514V110h11.654v-2.453h-9.061Zm16.77 2.753V90.184h8.106c1.607 0 2.966.53 4.085 1.618 1.118 1.09 1.68 2.421 1.68 4.007 0 1.66-.616 3.019-1.861 4.029 1.635.957 2.669 2.6 2.669 4.642 0 1.641-.59 3.029-1.735 4.146-1.146 1.117-2.561 1.674-4.224 1.674h-8.72Zm11.752-10.265a6.424 6.424 0 0 0-.3-.155c.094-.065.185-.131.273-.2 1.238-.959 1.846-2.257 1.846-3.87 0-1.506-.53-2.761-1.589-3.793-1.06-1.031-2.342-1.533-3.876-1.533h-7.806V110h8.42c1.589 0 2.927-.53 4.014-1.589 1.088-1.06 1.645-2.37 1.645-3.931 0-1.972-1.016-3.547-2.627-4.445Zm-1.828-6.026c-.504-.53-1.097-.8-1.818-.8h-4.913v5.367h4.913c1.47 0 2.6-1.167 2.6-2.683 0-.73-.248-1.351-.777-1.88l-.005-.004Zm-1.818 4.867c1.645 0 2.9-1.31 2.9-2.983 0-.809-.279-1.506-.864-2.091-.558-.586-1.227-.892-2.036-.892h-5.213v5.966h5.213Zm2.576 3.502-.005-.005c-.527-.553-1.173-.827-1.957-.827h-5.527v5.728h5.527c1.582 0 2.794-1.25 2.794-2.878 0-.786-.275-1.462-.832-2.018Zm-7.789 5.196v-6.328h5.827c.864 0 1.589.306 2.174.92.614.613.92 1.366.92 2.23 0 1.784-1.338 3.178-3.094 3.178h-5.827Z"
//           clipRule="evenodd"
//         />
//       </g>
//       <path
//         fill={
//           variant === 'light'
//             ? isGrayscale
//               ? '#FFF'
//               : 'url(#markGradient)'
//             : isGrayscale
//             ? '#000'
//             : 'url(#markGradient)'
//         }
//         d="M77.277 33.738a64.504 64.504 0 0 1-4.257 2.15c-6.333 2.912-15.383 5.86-26.228 5.981l-1.249.014-.226-1.228a31.01 31.01 0 0 1-.531-5.638C44.786 17.804 58.787 3.802 76 3.802a31.05 31.05 0 0 1 13.295 2.975l4.146-2.113A34.774 34.774 0 0 0 76 0C56.712 0 41 15.712 41 35c0 7.7 2.504 14.83 6.74 20.617 7.252-1.235 11.802-4.14 11.802-4.14s-2.905 4.544-4.14 11.798A34.803 34.803 0 0 0 76 70c19.288 0 35-15.712 35-35a34.779 34.779 0 0 0-4.652-17.42l-2.111 4.138a31.039 31.039 0 0 1 2.977 13.299C107.214 52.23 93.213 66.23 76 66.23c-1.942 0-3.804-.196-5.635-.53l-1.231-.225.014-1.251c.12-10.854 3.069-19.903 5.98-26.234a64.386 64.386 0 0 1 2.149-4.253Z"
//       />
//       <path
//         fill={
//           variant === 'light'
//             ? isGrayscale
//               ? '#FFF'
//               : '#FFF'
//             : isGrayscale
//             ? '#000'
//             : '#333753'
//         }
//         d="m94.235 27.155-8.03-2.344-2.345-8.047L110.5.5 94.235 27.155Z"
//       />
//       {!isGrayscale && (
//         <defs>
//           <linearGradient
//             id="markGradient"
//             x1="90.496"
//             x2="61.585"
//             y1="20.504"
//             y2="49.431"
//             gradientUnits="userSpaceOnUse"
//           >
//             <stop stopColor="#4F75FF" />
//             <stop offset="1" stopColor="#30AFFF" />
//           </linearGradient>
//         </defs>
//       )}
//     </svg>
//   )
// }

// const EpicWebHorizontal: React.FC<{
//   variant?: 'light' | 'dark'
//   isGrayscale?: boolean
// }> = ({variant, isGrayscale = false}) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="264"
//       height="70"
//       fill="none"
//       viewBox="0 0 264 70"
//     >
//       <g
//         fill={
//           variant === 'light'
//             ? isGrayscale
//               ? '#FFF'
//               : '#FFF'
//             : isGrayscale
//             ? '#000'
//             : '#333753'
//         }
//       >
//         <path d="M92.593 36.536v6.189h9.061v2.453H90V25.662h11.515v2.454h-8.922v5.994h8.225v2.426h-8.225Z" />
//         <path
//           fillRule="evenodd"
//           d="M109.942 25.662h7.081c1.813 0 3.29.614 4.489 1.813 1.199 1.198 1.812 2.676 1.812 4.46 0 1.757-.613 3.262-1.812 4.461-1.199 1.199-2.676 1.812-4.489 1.812h-4.488v6.97h-2.593V25.662Zm2.593 10.12h4.488c1.088 0 1.98-.362 2.677-1.086.697-.753 1.059-1.673 1.059-2.76 0-2.231-1.589-3.848-3.736-3.848h-4.488v7.695Z"
//           clipRule="evenodd"
//         />
//         <path d="M131.126 43.379V27.342h-3.089v-1.828h8.809v1.828h-3.127V43.38h3.127v1.828h-8.809V43.38h3.089Zm21.11 2.161c-2.955 0-5.409-.975-7.332-2.927-1.924-1.951-2.872-4.349-2.872-7.193 0-2.843.948-5.241 2.872-7.193 1.923-1.951 4.377-2.927 7.332-2.927 3.569 0 6.747 1.84 8.42 4.74l-2.259 1.31c-1.115-2.147-3.485-3.54-6.161-3.54-2.258 0-4.098.724-5.52 2.174-1.422 1.45-2.119 3.262-2.119 5.436 0 2.147.697 3.96 2.119 5.41 1.422 1.449 3.262 2.174 5.52 2.174 2.676 0 5.046-1.394 6.161-3.513l2.259 1.282c-.809 1.45-1.98 2.621-3.485 3.485-1.506.865-3.151 1.283-4.935 1.283Z" />
//         <path
//           fillRule="evenodd"
//           d="M101.654 42.725v2.453H90V25.662h11.515v2.454h-8.922v5.994h8.225v2.426h-8.225v6.189h9.061Zm-8.761-.3h9.061v3.053H89.7V25.362h12.115v3.054h-8.922v5.394h8.225v3.026h-8.225v5.589Zm16.749-17.063h7.381c1.889 0 3.444.643 4.701 1.9 1.257 1.257 1.9 2.812 1.9 4.673 0 1.834-.643 3.416-1.9 4.673-1.257 1.257-2.812 1.9-4.701 1.9h-4.188v6.97h-3.193V25.362Zm2.893 19.816h-2.593V25.662h7.081c1.813 0 3.29.614 4.489 1.813 1.199 1.198 1.812 2.676 1.812 4.46 0 1.757-.613 3.262-1.812 4.461-1.199 1.199-2.676 1.812-4.489 1.812h-4.488v6.97Zm15.502-17.836v-1.828h8.809v1.828h-3.127V43.38h3.127v1.828h-8.809V43.38h3.089V27.342h-3.089Zm2.789.3h-3.089v-2.428h9.409v2.428h-3.127V43.08h3.127v2.428h-9.409V43.08h3.089V27.642Zm30.239 2.507-2.789 1.618-.145-.279c-1.059-2.038-3.32-3.379-5.895-3.379-2.188 0-3.947.7-5.306 2.085-1.362 1.388-2.033 3.123-2.033 5.226 0 2.076.671 3.81 2.033 5.199 1.359 1.386 3.118 2.085 5.306 2.085 2.575 0 4.837-1.341 5.896-3.353l.144-.274 2.787 1.583-.145.26c-.837 1.499-2.047 2.708-3.598 3.599-1.554.891-3.25 1.322-5.084 1.322-3.028 0-5.561-1.003-7.546-3.017-1.982-2.01-2.958-4.485-2.958-7.404 0-2.918.976-5.392 2.958-7.403 1.985-2.014 4.518-3.017 7.546-3.017 3.672 0 6.951 1.894 8.68 4.89l.149.259Zm-48.23 5.334h4.188c1.012 0 1.823-.334 2.459-.993.643-.696.977-1.542.977-2.555 0-2.072-1.462-3.547-3.436-3.547h-4.188v7.095Zm6.865-.787c-.697.724-1.589 1.087-2.677 1.087h-4.488v-7.695h4.488c2.147 0 3.736 1.617 3.736 3.847 0 1.088-.362 2.008-1.059 2.76Zm40.805 6.337c-.8 1.33-1.92 2.413-3.334 3.225-1.506.865-3.151 1.283-4.935 1.283-2.955 0-5.409-.976-7.332-2.928-1.924-1.951-2.872-4.349-2.872-7.193 0-2.843.948-5.241 2.872-7.193 1.923-1.951 4.377-2.927 7.332-2.927 3.462 0 6.556 1.732 8.266 4.482l.131.218.023.04-2.259 1.31a6.226 6.226 0 0 0-.144-.263c-1.168-1.997-3.451-3.278-6.017-3.278-2.258 0-4.098.725-5.52 2.175-1.422 1.45-2.119 3.262-2.119 5.436 0 2.147.697 3.96 2.119 5.41 1.422 1.449 3.262 2.174 5.52 2.174 2.565 0 4.848-1.28 6.015-3.251.051-.086.1-.173.146-.262l2.259 1.282-.07.123c-.027.046-.053.092-.081.137Z"
//           clipRule="evenodd"
//         />
//         <path d="M174.058 45.178h-3.011l-5.604-19.516h2.732l4.461 16.06 4.739-16.06h2.621l4.74 16.06 4.46-16.06h2.733l-5.604 19.516h-3.011l-4.628-15.585-4.628 15.585Zm27.294-8.643v6.19h9.061v2.453h-11.654V25.662h11.515v2.454h-8.922v5.994h8.225v2.425h-8.225Zm28.222-1.477c1.784.864 2.928 2.509 2.928 4.6 0 1.561-.558 2.872-1.645 3.931-1.088 1.06-2.426 1.59-4.015 1.59h-8.42V25.661h7.807c1.533 0 2.815.502 3.875 1.534 1.059 1.031 1.589 2.286 1.589 3.791 0 1.729-.697 3.095-2.119 4.07Zm-3.345-6.97h-5.214v5.966h5.214c1.644 0 2.899-1.31 2.899-2.983 0-.809-.279-1.506-.864-2.091-.558-.585-1.227-.892-2.035-.892Zm-5.214 14.665h5.827c1.756 0 3.095-1.394 3.095-3.179 0-.864-.307-1.617-.92-2.23-.586-.613-1.311-.92-2.175-.92h-5.827v6.329Z" />
//         <path
//           fillRule="evenodd"
//           d="M174.281 45.478h-3.46l-5.777-20.116h3.359l4.241 15.27 4.507-15.27h3.069l4.507 15.27 4.241-15.27h3.359l-5.776 20.116h-3.461l-4.404-14.83-4.405 14.83Zm-.223-.3h-3.011l-5.604-19.516h2.732l4.461 16.06 4.739-16.06h2.621l4.74 16.06 4.46-16.06h2.733l-5.604 19.516h-3.011l-4.628-15.585-4.628 15.585Zm36.655-2.753v3.053h-12.254V25.362h12.115v3.054h-8.922v5.394h8.225v3.026h-8.225v5.589h9.061Zm-9.361.3v-6.19h8.225V34.11h-8.225v-5.994h8.922v-2.454h-11.515v19.516h11.654v-2.453h-9.061Zm16.77 2.753V25.362h8.107c1.607 0 2.966.53 4.084 1.619 1.118 1.088 1.68 2.42 1.68 4.006 0 1.66-.615 3.019-1.861 4.029 1.635.957 2.67 2.6 2.67 4.642 0 1.642-.59 3.03-1.736 4.146-1.146 1.117-2.561 1.674-4.224 1.674h-8.72Zm11.752-10.264a6.066 6.066 0 0 0-.3-.156c.094-.065.185-.131.273-.2 1.238-.958 1.846-2.256 1.846-3.87 0-1.506-.53-2.76-1.589-3.792-1.06-1.032-2.342-1.534-3.875-1.534h-7.807v19.516h8.42c1.589 0 2.927-.53 4.015-1.589 1.087-1.06 1.645-2.37 1.645-3.931 0-1.971-1.017-3.546-2.628-4.444Zm-1.827-6.027c-.505-.53-1.097-.8-1.818-.8h-4.914v5.367h4.914c1.469 0 2.599-1.166 2.599-2.683 0-.73-.248-1.35-.776-1.879l-.005-.005Zm-1.818 4.867c1.644 0 2.899-1.31 2.899-2.983 0-.809-.279-1.506-.864-2.091-.558-.585-1.227-.892-2.035-.892h-5.214v5.966h5.214Zm2.575 3.502-.005-.005c-.527-.553-1.173-.827-1.957-.827h-5.527v5.729h5.527c1.582 0 2.795-1.251 2.795-2.879a2.75 2.75 0 0 0-.833-2.018Zm-7.789 5.197v-6.329h5.827c.864 0 1.589.307 2.175.92.613.613.92 1.366.92 2.23 0 1.785-1.339 3.179-3.095 3.179h-5.827Z"
//           clipRule="evenodd"
//         />
//         <path d="M239.041 32.853a.89.89 0 0 1-1.254 0 .89.89 0 0 1 0-1.254.89.89 0 0 1 1.254 0 .889.889 0 0 1 0 1.254Zm2.753-7.187h2.904c1.003 0 1.839.355 2.508 1.055.679.7 1.013 1.567 1.013 2.6 0 1.035-.334 1.902-1.013 2.602-.669.7-1.505 1.055-2.508 1.055h-2.904v-7.313Zm1.442 5.933h1.462c.638 0 1.15-.209 1.547-.627.397-.428.595-.971.595-1.65 0-.68-.198-1.223-.595-1.64-.397-.429-.909-.637-1.547-.637h-1.462v4.554Zm8.753-1.64v1.64h3.082v1.379h-4.524v-7.313h4.471v1.38h-3.029V28.6h2.768v1.358h-2.768Zm8.997 3.019H259.2l-2.455-7.313h1.567l1.786 5.62 1.776-5.62h1.578l-2.466 7.313Z" />
//       </g>
//       <path
//         fill={
//           variant === 'light'
//             ? isGrayscale
//               ? '#FFF'
//               : 'url(#markGradient)'
//             : isGrayscale
//             ? '#000'
//             : 'url(#markGradient)'
//         }
//         d="M36.277 33.738a64.504 64.504 0 0 1-4.257 2.15c-6.333 2.912-15.383 5.86-26.228 5.981l-1.249.014-.226-1.228a31.016 31.016 0 0 1-.531-5.638C3.786 17.804 17.787 3.802 35 3.802a31.05 31.05 0 0 1 13.295 2.975l4.146-2.113A34.774 34.774 0 0 0 35 0C15.712 0 0 15.712 0 35c0 7.7 2.504 14.83 6.74 20.617 7.252-1.235 11.802-4.14 11.802-4.14s-2.905 4.544-4.14 11.798A34.803 34.803 0 0 0 35 70c19.288 0 35-15.712 35-35a34.778 34.778 0 0 0-4.652-17.42l-2.11 4.138a31.037 31.037 0 0 1 2.976 13.299C66.214 52.23 52.213 66.23 35 66.23c-1.942 0-3.804-.196-5.635-.53l-1.231-.225.014-1.251c.12-10.854 3.069-19.903 5.98-26.234a64.386 64.386 0 0 1 2.149-4.253Z"
//       />
//       <path
//         fill={
//           variant === 'light'
//             ? isGrayscale
//               ? '#FFF'
//               : '#FFF'
//             : isGrayscale
//             ? '#000'
//             : '#333753'
//         }
//         d="m53.235 27.155-8.03-2.344-2.345-8.047L69.5.5 53.235 27.155Z"
//       />
//       <defs>
//         <linearGradient
//           id="markGradient"
//           x1="49.496"
//           x2="20.585"
//           y1="20.504"
//           y2="49.431"
//           gradientUnits="userSpaceOnUse"
//         >
//           <stop stopColor="#4F75FF" />
//           <stop offset="1" stopColor="#30AFFF" />
//         </linearGradient>
//       </defs>
//     </svg>
//   )
// }
