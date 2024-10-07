import Link from 'next/link'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import {ChevronRightIcon} from '@heroicons/react/outline'
import {track} from '@skillrecordings/analytics'
import {Button} from '@skillrecordings/ui/primitives/button'

const BuyTicketsCTA = ({titoUrl}: {titoUrl?: string}) => {
  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-5 pb-16">
      <div className="relative z-10 mx-auto flex h-[240px] w-full max-w-screen-lg flex-col items-center justify-center sm:h-[320px]">
        {titoUrl && (
          <>
            <h2 className="pb-10 text-center text-2xl font-semibold sm:text-3xl">
              <Balancer>See you at the Epic Web Conf!</Balancer>
            </h2>
            <Button
              asChild
              className="h-12 rounded-sm bg-gradient-to-tr from-gray-50 to-gray-100 font-mono text-sm font-bold uppercase tracking-wide text-gray-950 shadow-soft-2xl transition hover:brightness-110 sm:text-base"
              size="lg"
            >
              <Link
                href={titoUrl}
                rel="noopener noreferrer"
                target="_blank"
                onClick={() => {
                  track('clicked buy tickets', {
                    title: 'conf2024',
                    type: 'event',
                    location: 'bottom',
                  })
                }}
              >
                Buy Tickets <ChevronRightIcon className="-mr-2 ml-2 w-4" />
              </Link>
            </Button>
          </>
        )}
      </div>
      <Image
        loading="eager"
        src={require('../../../public/assets/conf/big-planet-bottom@2x.png')}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 sm:bottom-auto"
        quality={100}
      />
      <Image
        loading="eager"
        width={153}
        height={102}
        src={require('../../../public/assets/conf/ship2@2x.png')}
        alt=""
        aria-hidden="true"
        className="absolute bottom-24 translate-x-96"
        quality={100}
      />
      <Image
        loading="eager"
        width={255}
        height={170}
        src={require('../../../public/assets/conf/ship3@2x.png')}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 -translate-x-96"
        quality={100}
      />
      <div
        className="absolute bottom-0 left-0 z-10 h-px w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-20"
        aria-hidden="true"
      />
    </section>
  )
}

export default BuyTicketsCTA
