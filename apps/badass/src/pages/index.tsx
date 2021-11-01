/* This example requires Tailwind CSS v2.0+ */
import * as React from 'react'
import {Fragment} from 'react'
import {Popover, Transition} from '@headlessui/react'
import {MenuIcon, XIcon} from '@heroicons/react/outline'

const navigation = [
  {name: 'Product', href: '#'},
  {name: 'Features', href: '#'},
  {name: 'Marketplace', href: '#'},
  {name: 'Company', href: '#'},
]

export default function Example() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="relative pt-6 pb-16 sm:pb-24">
        <Popover>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav
              className="relative flex items-center justify-between sm:h-10 md:justify-center"
              aria-label="Global"
            >
              <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <a href="#">
                    <span className="sr-only">Workflow</span>
                    <img
                      className="h-8 w-auto sm:h-10"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                      alt=""
                    />
                  </a>
                  <div className="-mr-2 flex items-center md:hidden">
                    <Popover.Button className="bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open main menu</span>
                      <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex md:space-x-10">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="font-medium text-gray-500 hover:text-gray-900"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
                <span className="inline-flex rounded-md shadow">
                  <a
                    href="#"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </span>
              </div>
            </nav>
          </div>

          <Transition
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
            >
              <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="px-5 pt-4 flex items-center justify-between">
                  <div>
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                      alt=""
                    />
                  </div>
                  <div className="-mr-2">
                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="px-2 pt-2 pb-3">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <a
                  href="#"
                  className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"
                >
                  Log in
                </a>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>

        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Show off your skills and get a better job as a web developer.
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Build a fully functioning SASS (software-as-a-service) application
              using the best modern tools in web development.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Get started
                </a>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Live demo
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="relative py-10 bg-white overflow-hidden">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <h1>
              <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
                Introducing
              </span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Badass Portfolios for Web Developers
              </span>
            </h1>
            <p className="mt-8 text-xl text-gray-500 leading-8">
              Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem.
              At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id at
              vitae feugiat egestas ac. Diam nulla orci at in viverra
              scelerisque eget. Eleifend egestas fringilla sapien.
            </p>
          </div>
          <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <p>
              Faucibus commodo massa rhoncus, volutpat.{' '}
              <strong>Dignissim</strong> sed <strong>eget risus enim</strong>.
              Mattis mauris semper sed amet vitae sed turpis id. Id dolor
              praesent donec est. Odio penatibus risus viverra tellus varius sit
              neque erat velit. Faucibus commodo massa rhoncus, volutpat.
              Dignissim sed eget risus enim.{' '}
              <a href="#">Mattis mauris semper</a> sed amet vitae sed turpis id.
            </p>
            <ul role="list">
              <li>Quis elit egestas venenatis mattis dignissim.</li>
              <li>
                Cras cras lobortis vitae vivamus ultricies facilisis tempus.
              </li>
              <li>Orci in sit morbi dignissim metus diam arcu pretium.</li>
            </ul>
            <p>
              Quis semper vulputate aliquam venenatis egestas sagittis quisque
              orci. Donec commodo sit viverra aliquam porttitor ultrices gravida
              eu. Tincidunt leo, elementum mattis elementum ut nisl, justo,
              amet, mattis. Nunc purus, diam commodo tincidunt turpis. Amet,
              duis sed elit interdum dignissim.
            </p>
            <h2>From beginner to expert in 30 days</h2>
            <p>
              Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam
              consequat in. Convallis arcu ipsum urna nibh. Pharetra, euismod
              vitae interdum mauris enim, consequat vulputate nibh. Maecenas
              pellentesque id sed tellus mauris, ultrices mauris. Tincidunt enim
              cursus ridiculus mi. Pellentesque nam sed nullam sed diam turpis
              ipsum eu a sed convallis diam.
            </p>
            <blockquote>
              <p>
                Sagittis scelerisque nulla cursus in enim consectetur quam.
                Dictum urna sed consectetur neque tristique pellentesque.
                Blandit amet, sed aenean erat arcu morbi.
              </p>
            </blockquote>
            <p>
              Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus
              enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor
              praesent donec est. Odio penatibus risus viverra tellus varius sit
              neque erat velit.
            </p>
            <figure>
              <img
                className="w-full rounded-lg"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&w=1310&h=873&q=80&facepad=3"
                alt=""
                width={1310}
                height={873}
              />
              <figcaption>
                Sagittis scelerisque nulla cursus in enim consectetur quam.
              </figcaption>
            </figure>
            <h2>Everything you need to get up and running</h2>
            <p>
              Purus morbi dignissim senectus mattis <a href="#">adipiscing</a>.
              Amet, massa quam varius orci dapibus volutpat cras. In amet eu
              ridiculus leo sodales cursus tristique. Tincidunt sed tempus ut
              viverra ridiculus non molestie. Gravida quis fringilla amet eget
              dui tempor dignissim. Facilisis auctor venenatis varius nunc,
              congue erat ac. Cras fermentum convallis quam.
            </p>
            <p>
              Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus
              enim. Mattis mauris semper sed amet vitae sed turpis id. Id dolor
              praesent donec est. Odio penatibus risus viverra tellus varius sit
              neque erat velit.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white py-10 sm:py-24">
        <div className="relative sm:py-16">
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="relative rounded-2xl px-6 py-10 bg-indigo-600 overflow-hidden shadow-xl sm:px-12 sm:py-20">
              <div className="relative">
                <div className="sm:text-center">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                    Get notified when we&rsquo;re launching.
                  </h2>
                  <p className="mt-6 mx-auto max-w-2xl text-lg text-indigo-200">
                    Sagittis scelerisque nulla cursus in enim consectetur quam.
                    Dictum urna sed consectetur neque tristique pellentesque.
                  </p>
                </div>
                <form
                  action="#"
                  className="mt-12 sm:mx-auto sm:max-w-lg sm:flex"
                >
                  <div className="min-w-0 flex-1">
                    <label htmlFor="cta-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="cta-email"
                      type="email"
                      className="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      className="block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
                    >
                      Notify me
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
