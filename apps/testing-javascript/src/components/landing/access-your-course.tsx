import * as React from 'react'
import Link from 'next/link'
import cx from 'classnames'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import type {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import * as Dialog from '@radix-ui/react-dialog'
import {XIcon} from '@heroicons/react/solid'
import MuxPlayer from '@mux/mux-player-react'

import Icon from 'components/icons'
import CertificateForm from 'components/certificate-form'

const AccessYourCourse: React.FunctionComponent<{
  product: SanityProduct
  className?: string
}> = ({product, className}) => {
  return (
    <section className={cx(className)}>
      <div className="container max-w-6xl mb-20">
        <div className="flex flex-col items-center">
          <div className="w-40">
            <Image
              src={product.image.url}
              alt={product.name}
              width={368}
              height={368}
            />
          </div>
          <Balancer>
            <div className="space-y-6 text-lg">
              <h2 className="text-3xl md:text-4xl font-tt-regular text-center">
                Access your{' '}
                <span className="font-tt-demibold">{product.name}</span> course.
              </h2>
              <div className="max-w-3xl text-center mx-auto space-y-6">
                <p>
                  If you want to chat with other people taking this course, or
                  have content questions, please head on over to the{' '}
                  <a
                    href="https://kcd.im/discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b-2  border-tjs-yellow hover:bg-tjs-yellow duration-200"
                  >
                    <b>KCD discord server</b>
                  </a>
                  .{' '}
                  <a
                    href="https://discord.com/api/oauth2/authorize?client_id=738096608440483870&redirect_uri=https%3A%2F%2Ftestingjavascript.com%2F.netlify%2Ffunctions%2Fdiscord&response_type=code&scope=identify%20email%20guilds%20guilds.join"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b-2  border-tjs-yellow hover:bg-tjs-yellow duration-200"
                  >
                    <b>
                      Click here if you have not yet connected your TestingJS
                      account to Discord
                    </b>
                  </a>
                  .
                </p>
                <p>
                  Also, don't miss{' '}
                  <a
                    href="https://testing-library.com/discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b-2  border-tjs-yellow hover:bg-tjs-yellow duration-200"
                  >
                    <b>the Testing Library discord server</b>
                  </a>{' '}
                  if you'd like help with implementing Testing Library in your
                  own project.
                </p>
                <p>
                  If you are having technical issues, please email{' '}
                  <a
                    href="mailto:help@testingjavascript.com"
                    className="border-b-2  border-tjs-yellow hover:bg-tjs-yellow duration-200"
                  >
                    help@testingjavascript.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </Balancer>
          <Dialog.Root>
            <Dialog.Trigger data-download-certificate-button className="mt-8">
              <span>Download Course Completion Certificate</span>
            </Dialog.Trigger>
            <CertificateForm />
          </Dialog.Root>
          <Dialog.Root>
            <Dialog.Trigger className="space-x-4 inline-flex items-center bg-gray-100 text-black px-6 py-2 rounded-md mt-7 md:mt-10 lg:mt-16 hover:bg-gray-200 duration-100 min-h-[50px] self-center border-gray-200 border">
              <Icon name="play" className="w-[10px] h-[10px]" />
              <span>2020 Course Update</span>
            </Dialog.Trigger>
            <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-40 w-full -translate-x-1/2 -translate-y-1/2 container max-w-6xl">
              <MuxPlayer
                streamType="on-demand"
                playbackId="lZ7JLEsycJZ1hi9D02NlGo701t2IILWuXssviaT9fy8u8"
              />
              <Dialog.Close className="absolute right-7 -top-14 rounded-full px-3 py-1 space-x-2 flex items-center bg-gray-100 hover:bg-white duration-200">
                <span>close</span>
                <XIcon className="h-5 w-5" />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>
    </section>
  )
}

export default AccessYourCourse
