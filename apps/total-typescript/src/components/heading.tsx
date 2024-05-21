import {cn} from '@skillrecordings/ui/utils/cn'
import Image from 'next/image'

type HeadingProps = {
  title: string
  className?: string
  description?: string
  withImage?: boolean
}

const getImageByTitle = (title: string) => {
  if (title === 'Articles') {
    return require('../../public/assets/headings/articles@2x.png')
  }
  if (title === 'TypeScript Tips') {
    return require('../../public/assets/headings/tips@2x.png')
  }
  if (title === 'Log in') {
    return require('../../public/assets/headings/log-in@2x.png')
  }
  if (title === 'Check your email') {
    return require('../../public/assets/headings/check-your-email@2x.png')
  }
  if (title === 'Free TypeScript Tutorials') {
    return require('../../public/assets/headings/faq@2x.png')
  }
  if (title === 'TypeScript Essentials') {
    return require('../../public/assets/headings/book@2x.png')
  }
  return require('../../public/assets/headings/default@2x.png')
}

const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
  children,
  className,
  title,
  description,
  withImage = true,
}) => {
  return (
    <header
      className={cn(
        'flex w-full flex-col items-center overflow-x-hidden pb-5 pt-40 text-center',
        className,
      )}
    >
      <h1 className="mt-36 max-w-screen-md text-balance font-heading text-5xl font-bold text-white md:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-screen-sm text-balance pt-5 text-lg text-[#94A5BB]">
          {description}
        </p>
      )}
      {children}
      <div className="pointer-events-none absolute top-0 -z-10 h-[600px] w-full max-w-[1600px] select-none">
        <Image
          src={
            withImage
              ? getImageByTitle(title)
              : require('../../public/assets/headings/bg@2x.png')
          }
          aria-hidden="true"
          alt=""
          fill
          className="object-cover"
          sizes="1600px"
          quality={100}
          priority
        />
      </div>
    </header>
  )
}

export default Heading
