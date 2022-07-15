import * as React from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import ImageFish from '../../public/assets/fish@2x.png'
import ImageFormMushroomRight from '../../public/assets/form-mushroom-right@2x.png'
import ImageFormMushroomLeft from '../../public/assets/form-mushroom-left@2x.png'
import ImageFormLeaf from '../../public/assets/form-leaf@2x.png'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'

export const CallToActionForm: React.FC<any> = ({content}) => {
  const router = useRouter()

  return (
    <section className="flex flex-col items-center justify-center sm:pt-16 sm:pb-16 pt-12">
      <div className="relative max-w-2xl mx-auto flex flex-col items-center">
        <div className="absolute sm:-left-24 sm:top-0 -top-16 sm:w-auto w-36 z-20">
          <Image
            loading="eager"
            aria-hidden="true"
            src={ImageFish}
            width={160}
            height={136}
            alt="a fish"
          />
        </div>
        <div className="absolute right-[-116px] z-20 sm:block hidden">
          <Image
            loading="eager"
            aria-hidden="true"
            src={ImageFormMushroomRight}
            width={196}
            height={478}
            alt="mushroom"
          />
        </div>
        <div className="absolute -left-24 -bottom-24 z-20 sm:block hidden">
          <Image
            loading="eager"
            aria-hidden="true"
            src={ImageFormMushroomLeft}
            width={280 / 1.1}
            height={459 / 1.1}
            alt="a mushroom"
          />
        </div>
        <div className="absolute -right-40 bottom-8 z-0 sm:block hidden">
          <Image
            loading="eager"
            aria-hidden="true"
            src={ImageFormLeaf}
            width={338 / 1.1}
            height={449 / 1.1}
            alt="a mushroom"
          />
        </div>
        <div className="bg-[#082C1B] sm:px-20 sm:py-20 px-5 py-16 rounded-md relative z-10">
          <h2 className="font-heading sm:text-4xl text-3xl text-center">
            {content.heading}
          </h2>
          <div className="pt-10 pb-5 space-y-5 opacity-80 sm:text-lg">
            {content.description}
          </div>
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
    </section>
  )
}
