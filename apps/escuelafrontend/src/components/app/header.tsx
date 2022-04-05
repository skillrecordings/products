import * as React from 'react'
import Link from 'next/link'
import {Dialog} from '@reach/dialog'
import SubscribeForm from 'components/forms/convertkit/subscribe-form'
import {useConvertkit} from '@skillrecordings/convertkit'
import {Fragment} from 'react'
import {Popover, Transition} from '@headlessui/react'
import {MenuIcon, XIcon} from '@heroicons/react/outline'
import Logo from '../logo'

export default function Navigation() {
  return (
    <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
      <Popover className="w-full max-w-screen-xl mx-auto">
        {({open, close}) => (
          <>
            <div className="flex items-center justify-between md:justify-start md:space-x-10">
              <Link href="/">
                <a>
                  <Logo />
                </a>
              </Link>
              <div className="-my-2 -mr-2 md:hidden">
                <Popover.Button>
                  <span className="sr-only">Open menu</span>
                  <MenuIcon
                    className="w-8 h-8 text-gray-900 transition ease-in dark:text-white text-opacity-40 dark:text-opacity-40 hover:text-opacity-100"
                    aria-hidden="true"
                  />
                </Popover.Button>
              </div>
              <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
                <span className="flex space-x-10" />
                <div className="flex items-center gap-8 md:ml-12">
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
                className="absolute inset-x-0 top-0 z-50 p-2 transition origin-top-right transform md:hidden"
              >
                <div className="z-10 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 backdrop-filter backdrop-blur-3xl dark:bg-opacity-80 bg-opacity-80">
                  <div className="px-5 pt-5 pb-6">
                    <div className="flex items-center justify-between">
                      <Link href="/">
                        <a onClick={() => close()}>
                          <Logo />
                        </a>
                      </Link>
                      <div className="-mr-2">
                        <Popover.Button className="inline-flex items-center justify-center p-2 text-gray-900 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-600 top-3 right-3 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500">
                          <span className="sr-only">Close menu</span>
                          <XIcon className="w-6 h-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-6 divide-y-2 divide-gray-800 dark:divide-gray-100 dark:divide-opacity-10 divide-opacity-10">
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
        className="inline-flex items-center justify-center px-4 py-2 text-base text-white bg-blue-600 border border-transparent shadow-sm rounded-xl hover:bg-blue-700"
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
        <div className="pl-4 font-semibold">Únete al Newsletter</div>
      </button>
      <Dialog
        isOpen={open}
        onDismiss={() => setOpen(false)}
        aria-label="subscribe"
        className="relative w-full max-w-screen-sm bg-gray-100 border border-gray-200 shadow-xl opacity-0 rounded-3xl dark:bg-gray-800 backdrop-filter backdrop-blur-3xl dark:bg-opacity-80 bg-opacity-80 dark:border-gray-800 secondary-animation"
      >
        <SubscribeForm className="max-w-md mx-auto my-5 text-center" />
        <button
          className="absolute p-3 text-gray-900 bg-gray-200 rounded-full dark:bg-gray-600 top-3 right-3 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500"
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
