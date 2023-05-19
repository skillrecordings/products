import Balancer from 'react-wrap-balancer'
import Layout from '@/components/app/layout'
import Link from 'next/link'
import Image from 'next/image'
import {GetServerSideProps} from 'next'
import React from 'react'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string
  if (!id) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      id,
    },
  }
}

const CLOUDINARY_FETCH_BASE_URL = `https://res.cloudinary.com/total-typescript/image/fetch/w_1200,h_630,c_fill/`

const YouTube: React.FC<{id: string}> = ({id}) => {
  return (
    <Layout
      footer={null}
      meta={{
        title: 'YouTube on Total TypeScript',
        ogImage: {
          url: `${CLOUDINARY_FETCH_BASE_URL}https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        },
      }}
    >
      <div className="video-responsive mt-14 sm:mt-16">
        <iframe
          width="853"
          height="480"
          src={`https://www.youtube.com/embed/${id}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </div>
      <Banner />
    </Layout>
  )
}

export default YouTube

const Banner = () => {
  return (
    <div className="sm:my-5 sm:p-5">
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-around border border-gray-800 bg-gray-800/50 text-center text-gray-200 shadow-xl shadow-black/20 transition sm:flex-row sm:rounded-lg sm:text-left">
        <Image
          src="https://res.cloudinary.com/total-typescript/image/upload/w_480,h_480/v1676015688/core-volume_2x_wt7jnc.png"
          width={240}
          height={240}
          alt=""
          aria-hidden="true"
          priority
        />
        <div className="pb-10 pl-5 pt-5 sm:py-8 sm:pb-5 sm:pl-0 sm:pr-8">
          <h1 className="text-3xl font-bold leading-tight sm:leading-tight">
            <Balancer>Become a TypeScript Wizard</Balancer>
          </h1>
          <p className="font-text text-xl text-orange-200">At Your Company</p>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href="/buy"
              className="rounded border border-transparent bg-cyan-300 px-3 py-2 text-center font-medium text-black transition hover:saturate-150"
            >
              Buy Total TypeScript Core Volume
            </Link>
            <Link
              href="/workshops"
              className="rounded border border-cyan-300 bg-transparent px-3 py-2 text-center font-medium text-cyan-300 transition hover:bg-gray-700/50"
            >
              Browse Workshops
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
