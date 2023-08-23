import * as React from 'react'
import {useRouter} from 'next/router'
import Image from 'next/legacy/image'
import ImageFish from '../../public/assets/fish@2x.png'
import ImageFormMushroomRight from '../../public/assets/form-mushroom-right@2x.png'
import ImageFormMushroomLeft from '../../public/assets/form-mushroom-left@2x.png'
import ImageFormLeaf from '../../public/assets/form-leaf@2x.png'
import LevelUp from '../../public/assets/level-up@2x.png'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'

export const CallToActionForm: React.FC<React.PropsWithChildren<any>> = ({
  content,
}) => {
  const router = useRouter()

  return (
    <section className="bg-badass-neutral-500 pt-52 md:pt-[7.5rem] pb-[8.5rem] mt-[150px] md:mt-44 relative">
      <div className="max-w-[1158px] px-6 mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className="grow">
            <h2 className="font-heading md:text-[2rem] md:leading-tight text-2xl leading-[1.333]">
              {content.heading}
            </h2>
            <div className="mt-5 md:mt-11 space-y-8 md:space-y-10 text-lg sm:text-xl leading-[1.75] text-[#e5e5e5]">
              {content.description}
            </div>
          </div>
          <div className="shrink-0 md:w-[434px] md:ml-[120px] md:relative">
            <div className="w-[390px] md:w-[491px] absolute left-0 md:left-auto m-auto right-0 -top-40 md:-top-[19rem]">
              <Image
                src="https://res.cloudinary.com/badass-courses/image/upload/v1692693157/assets/subscribe-form-image_2x_h0mweo.png"
                width={982}
                height={982}
                alt="Subscribe Form image"
              />
            </div>
            <div className="mt-16 md:mt-40">
              <SubscribeToConvertkitForm
                actionLabel={content.button}
                onSuccess={(subscriber: any) => {
                  if (subscriber) {
                    const redirectUrl = redirectUrlBuilder(
                      subscriber,
                      '/confirm',
                    )
                    router.push(redirectUrl)
                  }
                }}
              />
              <p className="text-center text-base text-badass-gray-300 leading-tight mt-6 md:mt-8">
                {content.info}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const SmallCallToActionForm: React.FC<React.PropsWithChildren<any>> = ({
  content,
}) => {
  const router = useRouter()

  return (
    <section className="bg-white/10 py-12 mt-32 flex  items-center justify-center sm:px-10 px-5">
      <div className="max-w-4xl flex md:gap-10 md:flex-row flex-col">
        <div className="w-72 -mt-32 mx-auto md:hidden block">
          <Image
            loading="eager"
            aria-hidden="true"
            src={LevelUp}
            alt="a mushroom"
          />
        </div>
        <div className="py-10 relative z-10">
          <h2 className="sm:text-3xl text-2xl font-bold">{content.heading}</h2>
          <div className="pt-5 space-y-5 opacity-80 prose sm:prose-lg max-w-md">
            {content.description}
          </div>
        </div>
        <div className="w-full">
          <div className="w-80 md:-mt-40 mx-auto md:block hidden">
            <Image
              loading="eager"
              aria-hidden="true"
              src={LevelUp}
              alt="a mushroom"
            />
          </div>
          <div>
            <SubscribeToConvertkitForm
              actionLabel={content.button}
              onSuccess={(subscriber: any) => {
                if (subscriber) {
                  const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                  router.push(redirectUrl)
                }
              }}
            />
            <p className="text-center pt-8 text-sm opacity-50 max-w-xs mx-auto">
              {content.info}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
