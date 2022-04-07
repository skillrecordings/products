import * as React from 'react'
import Link from 'next/link'
import {Fragment} from 'react'
import {Popover, Transition} from '@headlessui/react'
import {MenuIcon, XIcon} from '@heroicons/react/outline'
import Logo from '../logo'

export default function Navigation() {
  return (
    <div className="px-5 py-5">
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
                  <Link href="/cursos">
                    <a className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100">
                      Cursos
                    </a>
                  </Link>
                  <Link href="/articulos">
                    <a className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100">
                      Artículos
                    </a>
                  </Link>
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
                <div className="z-10 bg-white rounded shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 backdrop-filter backdrop-blur-3xl dark:bg-opacity-80 bg-opacity-80">
                  <div className="px-5 pt-5 pb-6">
                    <div className="flex items-center justify-between">
                      <Link href="/">
                        <a onClick={() => close()}>
                          <Logo />
                        </a>
                      </Link>
                      <div className="-mr-2">
                        <Popover.Button className="inline-flex items-center justify-center p-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:bg-gray-600 top-3 right-3 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500">
                          <span className="sr-only">Close menu</span>
                          <XIcon className="w-6 h-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-6 divide-y-2 divide-gray-800 dark:divide-gray-100 dark:divide-opacity-10 divide-opacity-10">
                    <div className="grid grid-cols-1 gap-4">
                      <Link href="/cursos">
                        <a
                          onClick={() => close()}
                          className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
                        >
                          Cursos
                        </a>
                      </Link>
                      <Link href="/articulos">
                        <a
                          onClick={() => close()}
                          className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
                        >
                          Artículos
                        </a>
                      </Link>
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
