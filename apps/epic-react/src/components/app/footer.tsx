import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {twMerge} from 'tailwind-merge'

type FooterProps = {
  className?: string
}

const Footer: React.FC<FooterProps> = ({className}) => {
  const {pathname, asPath} = useRouter()
  const isRoot = pathname === '/'

  return (
    <footer
      className={twMerge(
        'mx-auto mt-5 flex h-full w-full flex-col items-center space-y-16 px-5 py-5',
        className,
      )}
    >
      <div>
        <Link
          href="https://badass.dev"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            src={require('../../../public/badge-badass.svg')}
            alt="Powered by Badass.dev"
            width={186 / 1.1}
            height={56 / 1.1}
          />
        </Link>
      </div>
      <div>
        <Link
          href="/privacy"
          passHref
          className="font-mono text-xs opacity-50 hover:opacity-100"
        >
          Terms & Conditions
        </Link>
      </div>
    </footer>
  )
}

export default Footer
