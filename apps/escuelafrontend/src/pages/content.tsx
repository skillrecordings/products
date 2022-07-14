import {useSession} from 'next-auth/react'
import Link from 'next/link'

export default function Content() {
  const {data: session, status} = useSession()

  if (status === 'authenticated') {
    return (
      <>
        Signed in as {session.user && session.user.email} <br />
        <p>secreate badass content!</p>
      </>
    )
  }

  return (
    <>
      secrete content! <br />
      <Link href="/login">
        <a className="text-base font-normal text-gray-300 hover:text-white">
          Sign in to get access
        </a>
      </Link>
    </>
  )
}
