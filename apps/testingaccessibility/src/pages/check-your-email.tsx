import Layout from 'components/app/layout'
import * as React from 'react'

const CheckYourEmail = () => {
  return (
    <Layout meta={{title: 'Check your email'}}>
      <div className="prose mx-auto my-16">
        <h1>Check your email!</h1>

        <p>
          If you bought the course, a login link will been sent to your email!
          Use it and you&apos;ll be able to access the content 🚀
        </p>
      </div>
    </Layout>
  )
}

export default CheckYourEmail
