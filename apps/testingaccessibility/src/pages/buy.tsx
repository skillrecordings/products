import React from 'react'
import {Pricing} from '../components/Pricing'
import {GetServerSideProps} from 'next'
import {getToken, JWT} from 'next-auth/jwt'
import jwt from 'jsonwebtoken'

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // you have to use the same decoder you use in the auth routes
    // if you want this to return a value or set `raw: true`
    decode: async (params) => {
      if (!params.token) return null

      const verify = jwt.verify(params.token, params.secret)
      return verify as JWT
    },
  })

  return {
    props: {
      token,
    },
  }
}

const Course = () => {
  return (
    <div>
      <Pricing />
    </div>
  )
}

export default Course
