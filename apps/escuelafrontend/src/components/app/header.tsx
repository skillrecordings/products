import * as React from 'react'
import Link from 'next/link'
import {Dialog} from '@reach/dialog'
import SubscribeForm from 'components/forms/convertkit/subscribe-form'
import useConvertkit from 'hooks/use-convertkit'
import {Fragment} from 'react'
import {Popover, Transition} from '@headlessui/react'
import {MenuIcon, XIcon} from '@heroicons/react/outline'
import Logo from '../logo'

export default function Navigation() {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 px-5 py-5">
      <Popover className="max-w-screen-xl mx-auto w-full">
        {({open, close}) => (
          <>
            <div className="flex justify-between items-center md:justify-start md:space-x-10">
              <Link href="/">
                <a>
                  <Logo />
                </a>
              </Link>
              <div className="-mr-2 -my-2 md:hidden">
                <Popover.Button>
                  <span className="sr-only">Open menu</span>
                  <MenuIcon
                    className="h-8 w-8 transition ease-in dark:text-white text-gray-900 text-opacity-40 dark:text-opacity-40 hover:text-opacity-100"
                    aria-hidden="true"
                  />
                </Popover.Button>
              </div>
              <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
                <span className="flex space-x-10" />
                <div className="flex items-center md:ml-12 gap-8">
                  <Link href="/articulos">
                    <a className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100">
                      Artículos
                    </a>
                  </Link>
                  <Link href="/react">
                    <a className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100">
                      Aprende React
                    </a>
                  </Link>
                  <Subscribe />
                </div>
              </div>
            </div>

            <Transition
              show={open}
              as={Fragment}
              enter="duration-200 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Popover.Panel
                focus
                static
                className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50"
              >
                <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-800 backdrop-filter backdrop-blur-3xl dark:bg-opacity-80 bg-opacity-80 z-10">
                  <div className="pt-5 pb-6 px-5">
                    <div className="flex items-center justify-between">
                      <Link href="/">
                        <a onClick={() => close()}>
                          <Logo />
                        </a>
                      </Link>
                      <div className="-mr-2">
                        <Popover.Button className="p-2 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 bg-gray-200 dark:bg-gray-600 rounded-full top-3 right-3 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500">
                          <span className="sr-only">Close menu</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                  </div>
                  <div className="py-6 px-5 divide-y-2 dark:divide-gray-100 dark:divide-opacity-10 divide-gray-800 divide-opacity-10">
                    <div className="grid grid-cols-1 gap-4">
                      <Link href="/articulos">
                        <a
                          onClick={() => close()}
                          className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
                        >
                          Artículos
                        </a>
                      </Link>
                      <Link href="/react">
                        <a
                          onClick={() => close()}
                          className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
                        >
                          Aprende React
                        </a>
                      </Link>
                    </div>
                    <div className="my-6">
                      <SubscribeForm className="py-4 text-left" />
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

const Subscribe = () => {
  const {subscriber} = useConvertkit()
  const [open, setOpen] = React.useState(false)

  return !subscriber ? (
    <>
      <button
        type="button"
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-base text-white bg-blue-600 hover:bg-blue-700"
        onClick={() => setOpen(true)}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
            strokeMiterlimit="10"
          >
            <path d="M1,13v6a2,2,0,0,0,2,2H21a2,2,0,0,0,2-2V13" />
            <path
              d="M23,8V5a2,2,0,0,0-2-2H3A2,2,0,0,0,1,5V8l11,6Z"
              stroke="currentColor"
            />
          </g>
        </svg>
        <div className="pl-4 pb-1 font-semibold">Únete al Newsletter</div>
      </button>
      <Dialog
        isOpen={open}
        onDismiss={() => setOpen(false)}
        aria-label="subscribe"
        className="relative w-full max-w-screen-sm rounded-3xl shadow-xl bg-gray-100 dark:bg-gray-800 backdrop-filter backdrop-blur-3xl dark:bg-opacity-80 bg-opacity-80 border border-gray-200 dark:border-gray-800 opacity-0 secondary-animation"
      >
        <SubscribeForm className="text-center max-w-md mx-auto my-5" />
        <button
          className="absolute p-3 bg-gray-200 dark:bg-gray-600 rounded-full top-3 right-3 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500"
          type="button"
          aria-label="close"
          onClick={() => setOpen(false)}
        >
          <svg
            focusable="false"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
          >
            <g fill="currentColor">
              <path
                d="M10.707,1.293a1,1,0,0,0-1.414,0L6,4.586,2.707,1.293A1,1,0,0,0,1.293,2.707L4.586,6,1.293,9.293a1,1,0,1,0,1.414,1.414L6,7.414l3.293,3.293a1,1,0,0,0,1.414-1.414L7.414,6l3.293-3.293A1,1,0,0,0,10.707,1.293Z"
                fill="currentColor"
              />
            </g>
          </svg>
        </button>
      </Dialog>
    </>
  ) : null
}
