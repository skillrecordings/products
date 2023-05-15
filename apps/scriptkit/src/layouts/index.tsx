import React, {FunctionComponent} from 'react'
import {NextSeo, NextSeoProps} from 'next-seo'
import Footer from 'components/footer'
import Navigation from 'components/navigation'
import {useRouter} from 'next/router'
import qs from 'query-string'
import {twMerge} from 'tailwind-merge'

type LayoutProps = {
  meta?: NextSeoProps & {user?: string; author?: string; ogImage?: any}
  className?: string
  withFooter?: boolean
  navClassName?: string
  style?: {}
}

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className = '',
  withFooter = true,
  navClassName = '',
  meta,
  style,
}) => {
  const {
    title,
    description,
    user,
    author,
    twitter,
    additionalMetaTags,
    ogImage,
  } = meta || {}

  const router = useRouter()
  const query = {title, user, author}
  let opengraphImage =
    (user || author) &&
    `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/cloudinary-cache?${qs.stringify(
      query,
    )}`

  if (opengraphImage && !opengraphImage.startsWith('http'))
    opengraphImage = `https://${opengraphImage}`

  let url = `${process.env.NEXT_PUBLIC_VERCEL_URL}${router.asPath}`
  if (!url.startsWith('http')) url = `https://${url}/`

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        twitter={
          twitter && {
            handle: `@${twitter?.handle}`,
            site: `@${twitter?.handle}`,
          }
        }
        openGraph={{
          title,
          description,
          url,
          images: opengraphImage
            ? [{url: opengraphImage, width: 1200, height: 630}]
            : ogImage
            ? [{url: ogImage.url, width: 1200, height: 630}]
            : undefined,
        }}
        additionalMetaTags={additionalMetaTags}
      />
      <div
        className={twMerge('flex flex-col min-h-screen px-5', className)}
        style={style}
      >
        <Navigation className={navClassName} />
        <div className="flex-grow">{children}</div>
        {withFooter && <Footer />}
      </div>
    </>
  )
}

export default Layout
