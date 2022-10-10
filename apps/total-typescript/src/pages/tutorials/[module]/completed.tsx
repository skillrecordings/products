import React from 'react'
import Layout from 'components/app/layout'
import Spinner from 'components/spinner'
import queryString from 'query-string'
import toast from 'react-hot-toast'
import Image from 'next/image'
import cx from 'classnames'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {getSdk, User} from '@skillrecordings/database'
import {SanityDocument} from '@sanity/client'
import {Subscriber} from 'schemas/subscriber'
import {getModule} from 'lib/tutorials'
import {GetServerSideProps} from 'next'
import {get, isEmpty} from 'lodash'
import {trpc} from 'utils/trpc'
import {
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from 'react-hook-form'
import {
  CopyToClipboard,
  Facebook,
  LinkedIn,
  Twitter,
} from '@skillrecordings/react'
import {track} from 'utils/analytics'
import {USER_ID_QUERY_PARAM_KEY} from '.'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  params,
  req,
}) => {
  const tutorial = await getModule(params?.module as string)
  let subscriber = req.cookies['ck_subscriber'] || null
  subscriber = subscriber && JSON.parse(subscriber)

  const {getUserByEmail} = getSdk()
  const user =
    subscriber && (await getUserByEmail(get(subscriber, 'email_address')))

  if (!tutorial) {
    return {
      notFound: true,
    }
  }

  if (!user) {
    return {
      redirect: {
        destination: `/tutorials/${tutorial.slug.current}`,
        permanent: false,
      },
    }
  }

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  return {
    props: {
      tutorial,
      subscriber,
      user: convertToSerializeForNextResponse(user),
    },
  }
}

type CompletedTutorialProps = {
  tutorial: SanityDocument
  subscriber: Subscriber
  user: User
}

const CompletedTutorialPage: React.FC<CompletedTutorialProps> = ({
  tutorial,
  subscriber,
  user,
}) => {
  return tutorial ? (
    <CompletedTutorialTemplate
      tutorial={tutorial}
      subscriber={subscriber}
      user={user}
    />
  ) : null
}

export default CompletedTutorialPage

const CompletedTutorialTemplate: React.FC<CompletedTutorialProps> = ({
  tutorial,
  subscriber,
  user,
}) => {
  const {title, image, slug} = tutorial
  const form = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      firstName: subscriber?.first_name || '',
      lastName: subscriber?.fields.last_name || '',
    },
  })

  const firstName = form.getValues().firstName
  const lastName = form.getValues().lastName
  const certificateUrl = queryString.stringifyUrl({
    url: `${process.env.NEXT_PUBLIC_CERTIFICATE_URI}/${encodeURI(
      title,
    )} Tutorial`,
    query: {
      name: `${firstName} ${lastName}`,
      image,
    },
  })
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}/tutorials/${slug.current}?${USER_ID_QUERY_PARAM_KEY}=${user.id}`

  const [isCertificateImageLoaded, setCertificateImageLoaded] =
    React.useState(false)

  const subscriberName = `${firstName} ${lastName}`

  return (
    <Layout className="bg-black/30">
      <Header title={title} />
      <main className="flex flex-col items-center relative pb-40 sm:pt-0 pt-8">
        <CertificateImage
          isCertificateImageLoaded={isCertificateImageLoaded}
          setCertificateImageLoaded={setCertificateImageLoaded}
          certificateUrl={certificateUrl}
          name={subscriberName}
        />
        {!isEmpty(user) && <CertificateShare shareUrl={shareUrl} />}
        <UpdateSubscriberNameForm
          form={form}
          tutorial={tutorial}
          setCertificateImageLoaded={setCertificateImageLoaded}
        />
      </main>
    </Layout>
  )
}

const UpdateSubscriberNameForm: React.FC<{
  tutorial: SanityDocument
  form: UseFormReturn<{firstName: string; lastName: string}, any>
  setCertificateImageLoaded: React.Dispatch<boolean>
}> = ({form, setCertificateImageLoaded, tutorial}) => {
  const ckNameMutation = trpc.useMutation(['convertkit.updateName'])

  const processForm: SubmitHandler<FieldValues> = async ({
    firstName,
    lastName,
  }) => {
    track('clicked update name on certificate', {
      module: tutorial.slug.current,
    })
    ckNameMutation.mutate({
      first_name: firstName,
      last_name: lastName,
    })
    setCertificateImageLoaded(false)
  }
  const {register, handleSubmit} = form

  return (
    <>
      <h3 className="sm:text-2xl text-xl tracking-tight font-medium py-6 px-5">
        Update your name on the certificate
      </h3>
      <form
        onSubmit={handleSubmit(processForm)}
        className="w-full flex md:flex-row flex-col md:items-end items-center gap-2 max-w-2xl px-5"
      >
        <label className="flex flex-col w-full">
          <span className="pb-2 text-gray-200">First name</span>
          <input
            {...register('firstName', {required: true})}
            className="px-4 py-3 bg-gray-800/50 h-14 font-medium text-lg rounded-md border border-gray-600"
            type="text"
            name="firstName"
          />
        </label>
        <label className="flex flex-col w-full">
          <span className="pb-2 text-gray-200">Last name</span>
          <input
            {...register('lastName', {required: false})}
            className="px-4 py-3 bg-gray-800/50 h-14 font-medium text-lg rounded-md border border-gray-600"
            type="text"
            name="lastName"
          />
        </label>

        <button
          type="submit"
          className="sm:mt-0 mt-5 flex-shrink-0 border-2 h-14 border-cyan-300/80 text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 transition font-semibold px-8 py-3 rounded-md inline-flex items-center justify-center"
        >
          {ckNameMutation.isLoading ? 'Submitting...' : 'Update name'}
        </button>
      </form>
      {ckNameMutation.isError && (
        <p className="text-center pt-5">Something went wrong.</p>
      )}
    </>
  )
}

type CertificateImageProps = {
  isCertificateImageLoaded: boolean
  setCertificateImageLoaded: React.Dispatch<React.SetStateAction<boolean>>
  certificateUrl: string
  name: string
}

const CertificateImage: React.FC<CertificateImageProps> = ({
  setCertificateImageLoaded,
  isCertificateImageLoaded,
  certificateUrl,
  name,
}) => {
  return (
    <div className="relative w-full flex items-center justify-center sm:pt-16">
      {!isEmpty(name) && (
        <div
          className={cx(
            'rounded-2xl relative flex items-center justify-center w-[calc(1200px/1.8)] sm:h-[calc(630px/1.8)] z-10 border border-gray-800',
            {
              'bg-black/80': !isCertificateImageLoaded,
            },
          )}
        >
          <img
            onLoad={() => {
              setCertificateImageLoaded(true)
            }}
            src={certificateUrl}
            className={cx('rounded-2xl overflow-hidden', {
              'opacity-0': !isCertificateImageLoaded,
              'opacity-100': isCertificateImageLoaded,
            })}
          />
          {!isCertificateImageLoaded && (
            <div className="absolute drop-shadow-lg text-base max-w-[23ch] text-center flex items-center justify-center gap-2">
              <Spinner className="w-6" /> Loading certificate...
            </div>
          )}
        </div>
      )}
      <Image
        src={require('../../../../public/assets/landing/bg-divider-5.png')}
        layout="fill"
        objectFit="contain"
        objectPosition="bottom"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none"
        quality={100}
      />
    </div>
  )
}

const CertificateShare: React.FC<{shareUrl: string}> = ({shareUrl}) => {
  const shareButtonStyles =
    'gap-2 flex items-center justify-center rounded-md px-4 py-2 hover:brightness-125 transition'
  return (
    <div className="-translate-y-px sm:w-auto w-full gap-3 flex flex-col items-center justify-center md:flex-row p-4 sm:mb-16 mb-8 sm:rounded-b-xl sm:bg-black/50 sm:border border-gray-800 text-gray-200 ">
      <h1 className="px-2">Share on:</h1>
      <div className="text-center font-medium relative z-10 shadow-xl sm:flex grid grid-cols-2 flex-wrap items-center justify-center gap-2">
        <Twitter
          link={shareUrl}
          className={cx('bg-[#1B95E0]', shareButtonStyles)}
        >
          Twitter
        </Twitter>
        <LinkedIn
          link={shareUrl}
          className={cx('bg-[#117AB4]', shareButtonStyles)}
        >
          LinkedIn
        </LinkedIn>
        <Facebook
          link={shareUrl}
          className={cx('bg-[#4266B2]', shareButtonStyles)}
        >
          Facebook
        </Facebook>
        <CopyToClipboard
          link={shareUrl}
          className={cx('bg-gray-600', shareButtonStyles)}
          onSuccess={() => {
            toast.success('Copied to clipboard')
          }}
        >
          Copy link
        </CopyToClipboard>
      </div>
    </div>
  )
}

const Header: React.FC<{title: string}> = ({title}) => {
  return (
    <header className="md:pt-40 sm:pt-32 pt-28 text-center px-5">
      <p className="sm:text-xl text-lg text-cyan-300 pb-4">
        Congrats on finishing the {title} Tutorial!
      </p>
      <h1 className="font-heading md:text-6xl text-5xl font-bold">
        Your Certificate
      </h1>
    </header>
  )
}
