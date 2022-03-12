import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from 'next/link'
import {Logo} from 'components/images'
import {useRouter} from 'next/router'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {useSession} from 'next-auth/react'

type NavigationProps = {}

const Navigation: FunctionComponent<NavigationProps> = () => {
  const router = useRouter()
  const [data, setData] = React.useState<any>()
  const {data: sessionData} = useSession()

  const scheduledWorkshopsQuery = groq`
*[_type == "workshop" && ckFormId != null && published == true]{
  ckFormId,
  published
}`

  async function fetchData() {
    const result = await sanityClient.fetch(scheduledWorkshopsQuery)
    setData(result)
  }
  React.useEffect(() => {
    fetchData()
  }, [])

  return (
    <nav className="sm:p-5 p-2 flex items-center justify-between w-full text-white bg-black">
      <Link href="/" aria-label="Home" passHref>
        <a
          className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          tabIndex={router.pathname === '/' ? -1 : 0}
        >
          <div className="pr-1 sm:pr-2 sm:w-8 w-6">
            <Logo />
          </div>
          <div className="flex flex-col leading-tight ">
            <div className="font-semibold lg:text-lg sm:text-base text-sm">
              <span className="sr-only">Home page of&nbsp;</span>Testing
              Accessibility <span className="sr-only">&nbsp;.com</span>
            </div>
          </div>
        </a>
      </Link>
      <div className="text-right sm:pr-3 flex items-center">
        {sessionData?.user && (
          <div className="px-3">Welcome, {sessionData.user.name}!</div>
        )}
        <Link href="/workshops" passHref>
          <a className="relative group sm:text-base text-xs inline-block sm:px-4 px-3 sm:py-2 py-1.5 leading-5 transition-all duration-200 ease-in-out transform bg-white rounded-full hover:opacity-100 opacity-90 bg-opacity-5 hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            Upcoming Workshops{' '}
            {data && data.length > 0 && (
              <span className="absolute right-0 top-1 rounded-full inline-flex leading-none bg-pink-300 bg-opacity-100 -translate-y-1 group-hover:bg-yellow-400 transition-all ease-in-out duration-200 text-black w-4 h-4 items-center justify-center font-mono sm:text-[0.7rem] text-[0.6rem] font-extrabold">
                {data.length}
              </span>
            )}
          </a>
        </Link>
      </div>
    </nav>
  )
}

export default Navigation
