import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {twMerge} from 'tailwind-merge'
import Container from './container'

type FooterProps = {
  className?: string
}

const Footer: React.FC<FooterProps> = ({className}) => {
  const {pathname, asPath} = useRouter()
  const isRoot = pathname === '/'

  return (
    <footer className={twMerge('border-t', className)}>
      <Container className="flex h-full w-full items-center justify-between py-24 font-mono text-xs uppercase text-gray-300">
        <div />
        <div className="text-gray-500">{/* <CurrentTime /> */}</div>
        {/* <Link
          href="https://badass.dev"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            src={require('../../../public/badge-badass.svg')}
            alt="Powered by Badass.dev"
            width={186 / 1.5}
            height={56 / 1.5}
          />
        </Link> */}

        {/* <Link
            href="/privacy"
            passHref
            className="font-mono text-xs opacity-50 hover:opacity-100"
          >
            Terms & Conditions
          </Link> */}
      </Container>
    </footer>
  )
}

export default Footer

function CurrentTime() {
  const [currentTime, setCurrentTime] = React.useState(
    new Date().toLocaleTimeString(),
  )

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return currentTime
}
