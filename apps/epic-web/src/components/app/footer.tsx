import React from 'react'
import {Logo, useNavigationLinks} from './navigation'
import Link from 'next/link'
import {cn} from '@skillrecordings/ui/utils/cn'
import {useRouter} from 'next/router'

const Footer = () => {
  const primaryNavLinks = useNavigationLinks()
  const footerNavLinks = [
    ...primaryNavLinks,
    {
      label: 'Talks',
      href: '/talks',
      icon: () => {},
    },
  ]

  const contactLinks = [
    {
      label: 'Contact Us',
      href: '/contact',
    },
    {
      label: 'Email Support',
      href: `mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`,
    },
  ]

  const router = useRouter()

  return (
    <footer className="relative w-full bg-white shadow-soft-2xl before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent before:content-[''] dark:bg-black/50 dark:before:via-gray-800/75">
      <div className="relative mx-auto flex w-full max-w-screen-lg flex-row justify-between gap-16 px-5 pb-48 pt-16">
        <div className="relative mx-auto flex w-full flex-col gap-16 px-5 md:flex-row">
          <div>
            <strong className="font-mono text-xs uppercase tracking-wider opacity-75">
              Learn
            </strong>
            <ul className="pt-3">
              {footerNavLinks.map(({label, href}) => (
                <li key={href}>
                  <Link
                    className={cn(
                      'inline-block py-1 opacity-90 transition hover:opacity-100',
                      {
                        'underline [&_span]:underline':
                          router.pathname.includes(href),
                      },
                    )}
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="font-mono text-xs uppercase tracking-wider opacity-75">
              Contact
            </strong>
            <ul className="pt-3">
              {contactLinks.map(({label, href}) => (
                <li key={href}>
                  <Link
                    className="inline-block py-1 opacity-90 transition hover:opacity-100"
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pr-8 sm:pr-0">
          <Link href="/">
            <svg
              className="h-12 w-12 opacity-30 saturate-0 transition duration-300 ease-in-out hover:opacity-100 hover:saturate-100"
              viewBox="0 0 70 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M36.2769 33.7384C35.0376 34.4235 33.6137 35.1551 32.0196 35.888C25.6867 38.8 16.6372 41.7482 5.7924 41.8693L4.54328 41.8832L4.31667 40.6548C3.98144 38.8375 3.78557 36.9574 3.78557 35.0169C3.78557 17.8042 17.7873 3.80245 35 3.80245C39.7497 3.80245 44.258 4.86959 48.2947 6.77729L52.441 4.66358C47.3041 1.69794 41.3484 0 35 0C15.712 0 0 15.712 0 35C0 42.6997 2.50383 49.8295 6.73946 55.6175C13.9922 54.3823 18.5423 51.4766 18.5423 51.4766C18.5423 51.4766 15.637 56.0207 14.4018 63.2746C20.1863 67.5017 27.3088 70 35 70C54.288 70 70 54.288 70 35C70 28.6625 68.3067 22.7134 65.3476 17.5795L63.2374 21.7175C65.1465 25.7553 66.2144 30.2653 66.2144 35.0169C66.2144 52.2296 52.2127 66.2313 35 66.2313C33.0583 66.2313 31.1957 66.0352 29.3646 65.7007L28.1336 65.4758L28.1476 64.2245C28.2686 53.3714 31.2168 44.3218 34.1289 37.9908C34.8613 36.3985 35.5922 34.9763 36.2769 33.7384Z"
                fill="url(#paint0_linear_215_1284)"
              />
              <path
                d="M53.2352 27.1553L45.2049 24.8112L42.8604 16.7642L69.5 0.5L53.2352 27.1553Z"
                fill="currentColor"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_215_1284"
                  x1="49.4956"
                  y1="20.5044"
                  x2="20.5854"
                  y2="49.4308"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4F75FF" />
                  <stop offset="1" stopColor="#30AFFF" />
                </linearGradient>
              </defs>
            </svg>
          </Link>
        </div>
        <small className="absolute bottom-5 left-5 flex items-center gap-5">
          <span className="opacity-75">© EpicWeb.dev</span>
          <Link
            className="opacity-75 transition hover:opacity-100"
            href="/privacy"
          >
            Terms & Conditions
          </Link>
        </small>
      </div>
    </footer>
  )
}

export default Footer
