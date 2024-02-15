import Image from 'next/image'

type HeadingProps = {
  title: string
  description?: string
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
  if (title === 'Frequently Asked Questions') {
    return require('../../public/assets/headings/faq@2x.png')
  }

  return require('../../public/assets/headings/default@2x.png')
}

const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
  children,
  title,
  description,
}) => {
  return (
    <header className="flex w-full flex-col items-center overflow-x-hidden pt-40 text-center">
      <h1 className="mt-36 max-w-screen-md text-balance font-heading text-5xl font-bold md:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-screen-sm text-balance pt-5 text-lg text-[#94A5BB]">
          {description}
        </p>
      )}
      <div className="pointer-events-none absolute top-0 -z-10 h-[600px] w-full max-w-[1600px] select-none">
        <Image
          src={getImageByTitle(title)}
          aria-hidden="true"
          alt=""
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>
    </header>
  )
}

export default Heading
