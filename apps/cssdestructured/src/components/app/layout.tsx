import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/react'
import Image from 'next/image'
import Noise from '../../../public/assets/noise@1x.jpg'
import Navigation from './navigation'
import isNull from 'lodash/isNull'
import {Toaster} from 'react-hot-toast'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
}

const Layout: FunctionComponent<LayoutProps> = ({
  children,
  className,
  meta,
  noIndex,
  nav,
}) => {
  const {
    title,
    description,
    titleAppendSiteName = false,
    url,
    ogImage,
  } = meta || {}
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  const renderNoise = mounted && CSS.supports('mix-blend-mode: soft-light')

  return (
    <>
      <Toaster position="bottom-center" />
      <NextSeo
        title={title}
        description={description}
        titleTemplate={titleAppendSiteName ? undefined : '%s'}
        openGraph={{
          title,
          description,
          url,
          images: ogImage ? [ogImage] : undefined,
        }}
        canonical={url}
        noindex={noIndex}
      />
      <div className={`flex flex-col min-h-screen bg-background ${className}`}>
        {nav ? nav : isNull(nav) ? null : <Navigation />}
        <div className="flex-grow flex flex-col justify-center">
          {children}
          {/* <div className="relative z-10">{children}</div> */}
        </div>
        {renderNoise && (
          <div
            aria-hidden
            className="fixed w-full h-screen top-0 pointer-events-none block z-10"
          >
            <Image
              priority={true}
              quality={100}
              src={Noise}
              layout="fill"
              objectFit="cover"
              aria-hidden
              alt=""
              className="bg-blend-soft-light opacity-[5%]"
            />
          </div>
        )}
      </div>
    </>
  )
}

export default Layout
