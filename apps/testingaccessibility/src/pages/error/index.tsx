import React from 'react'
import {useRouter} from 'next/router'

const ErrorPage = () => {
  const router = useRouter()

  return (
    <div className="prose mx-auto mt-16">
      <h1> Error:{router.query.error}! </h1>
      <p>
        <br /> Make sure that you purchased the course with this email. If you
        did and you can&apos;t login, please contact support :D
      </p>
      <br />
    </div>
  )
}

export default ErrorPage
