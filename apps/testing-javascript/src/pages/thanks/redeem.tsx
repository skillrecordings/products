import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getSdk} from '@skillrecordings/database'
import Layout from 'components/layout'
import {MailIcon} from '@heroicons/react/solid'
import Balancer from 'react-wrap-balancer'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {query} = context

  const {purchaseId} = query

  const {getPurchaseWithUser} = getSdk()

  const purchase = await getPurchaseWithUser(purchaseId as string)

  return {
    props: {
      email: purchase?.user?.email,
    },
  }
}

const ThanksRedeem: React.FC<
  React.PropsWithChildren<{purchase: any; email: string}>
> = ({email}) => {
  return (
    <Layout footer={null}>
      <main className="flex flex-grow flex-col items-center justify-center p-5">
        <div className="w-full max-w-screen-md">
          <h1 className="pb-5 font-heading text-3xl font-black text-black">
            Success!
          </h1>
        </div>
        <div className="relative mx-auto flex w-full max-w-screen-md items-center justify-between gap-5 overflow-hidden rounded-xl bg-brand-red p-7 text-white shadow-2xl shadow-gray-400/20 selection:bg-white selection:text-brand-red sm:p-12">
          <div className="relative z-10">
            <p className="inline-flex rounded-full bg-white px-3 py-1 font-heading text-xs font-black uppercase text-brand-red sm:text-sm">
              Final step
            </p>
            <h2 className="mx-auto py-5 font-heading text-2xl font-black sm:text-3xl lg:text-4xl">
              <Balancer>
                Please check your inbox for a <i>login link</i> that just got
                sent.
              </Balancer>
            </h2>
            <div className="mb-3 inline-flex items-center gap-1 rounded-lg bg-white/20 py-3 px-4">
              <MailIcon className="h-5 w-5" />{' '}
              <strong className="font-semibold">Email sent to: {email}</strong>
            </div>
            <p className="mx-auto text-sm font-medium leading-relaxed text-white sm:text-base">
              As a final step to access the course you need to check your inbox
              (<strong>{email}</strong>) where you will find an email from{' '}
              <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> with a
              link to access your purchase and start learning.
            </p>
          </div>
          <PawTrail />
        </div>
      </main>
    </Layout>
  )
}

export default ThanksRedeem

export const PawTrail = () => {
  return (
    <svg
      className="absolute -top-2 right-8 z-0 w-32 rotate-[-30deg]"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 77 156"
    >
      <path
        fill="#FF7097"
        d="M38.614 12.108c1.071-4.162-.64-8.2-3.823-9.02-3.183-.818-6.631 1.892-7.702 6.054-1.071 4.163.64 8.2 3.823 9.02 3.183.819 6.631-1.892 7.702-6.054Zm6.26 14.905c1.683-3.314.994-7.044-1.539-8.33-2.533-1.287-5.951.356-7.635 3.67-1.683 3.314-.994 7.043 1.539 8.33s5.951-.356 7.635-3.67ZM23.549 8.548C23.83 4.259 21.402.608 18.123.39c-3.28-.216-6.167 3.086-6.45 7.374-.282 4.289 2.147 7.94 5.427 8.157 3.279.216 6.166-3.086 6.449-7.374ZM7.128 25.9c2.808-.431 4.627-3.76 4.063-7.433-.564-3.674-3.298-6.303-6.106-5.871-2.808.43-4.628 3.759-4.063 7.433.564 3.673 3.298 6.302 6.106 5.87Zm21.825-3.04-.037-.177c-.48-2.497-2.444-4.454-4.945-4.872a2.157 2.157 0 0 0-.105-.016l-.104-.016c-2.512-.382-4.988.864-6.223 3.082l-.089.163a17.653 17.653 0 0 1-7.552 7.211 7.057 7.057 0 0 0-3.475 8.777 7.059 7.059 0 0 0 7.526 4.548 21.28 21.28 0 0 1 11.911 1.91 7.064 7.064 0 0 0 8.013-11.398 17.592 17.592 0 0 1-4.92-9.206v-.005Zm18.879 107.238c.843-3.275-.503-6.452-3.005-7.096-2.502-.644-5.214 1.489-6.057 4.764-.843 3.275.503 6.452 3.005 7.096 2.503.644 5.215-1.489 6.057-4.764Zm4.923 11.712c1.325-2.608.782-5.544-1.212-6.557-1.995-1.013-4.686.28-6.01 2.887-1.325 2.608-.782 5.544 1.212 6.557 1.995 1.013 4.686-.28 6.01-2.887Zm-16.781-14.524c.223-3.374-1.688-6.247-4.266-6.417-2.578-.17-4.849 2.428-5.071 5.802-.222 3.374 1.688 6.248 4.266 6.418 2.578.169 4.849-2.428 5.071-5.803Zm-12.92 13.66c2.211-.339 3.644-2.958 3.2-5.849-.444-2.891-2.597-4.96-4.808-4.62-2.211.339-3.644 2.958-3.2 5.849.444 2.892 2.597 4.96 4.808 4.62Zm17.172-2.405-.026-.142c-.377-1.962-1.92-3.501-3.894-3.831-.026 0-.052-.01-.078-.015-.026-.005-.053-.011-.079-.011-1.973-.303-3.925.681-4.893 2.429l-.068.125a13.875 13.875 0 0 1-5.94 5.673 5.559 5.559 0 0 0-2.737 6.903 5.561 5.561 0 0 0 5.919 3.58c3.203-.414 6.458.11 9.373 1.502a5.56 5.56 0 0 0 6.74-1.549 5.559 5.559 0 0 0-.439-7.416 13.838 13.838 0 0 1-3.873-7.243l-.005-.005Zm27.061-70.227c1.071-4.162-.64-8.2-3.824-9.02-3.182-.819-6.63 1.892-7.702 6.054-1.07 4.163.641 8.2 3.824 9.02 3.183.819 6.63-1.892 7.702-6.054Zm6.265 14.906c1.684-3.315.995-7.044-1.538-8.331s-5.951.356-7.635 3.67c-1.683 3.314-.995 7.044 1.539 8.33 2.533 1.287 5.95-.356 7.634-3.67ZM52.227 64.755c.282-4.289-2.147-7.94-5.426-8.157-3.28-.216-6.167 3.086-6.45 7.374-.282 4.289 2.147 7.94 5.426 8.157 3.28.216 6.167-3.086 6.45-7.374ZM35.803 82.101c2.808-.431 4.627-3.76 4.063-7.433-.564-3.674-3.298-6.303-6.106-5.871-2.809.43-4.628 3.759-4.064 7.433.564 3.674 3.298 6.302 6.107 5.871Zm21.829-3.044-.037-.178c-.481-2.496-2.444-4.453-4.945-4.872a4.839 4.839 0 0 0-.105-.016l-.105-.015c-2.512-.382-4.987.863-6.222 3.082l-.09.162a17.651 17.651 0 0 1-7.551 7.212 7.057 7.057 0 0 0-3.475 8.777 7.058 7.058 0 0 0 7.526 4.547 21.28 21.28 0 0 1 11.91 1.91 7.064 7.064 0 0 0 8.013-11.398 17.592 17.592 0 0 1-4.92-9.205v-.006Z"
      />
    </svg>
  )
}
