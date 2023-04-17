import React from 'react'
import Layout from 'layouts'
import Spinner from 'components/spinner'
import queryString from 'query-string'
import toast from 'react-hot-toast'
import Image from 'next/legacy/image'
import cx from 'classnames'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {getSdk, User} from '@skillrecordings/database'
import {SanityDocument} from '@sanity/client'
import {Subscriber} from '@skillrecordings/skill-lesson/schemas/subscriber'
import {getTutorial} from 'lib/tutorials'
import {GetServerSideProps} from 'next'
import {get, isEmpty} from 'lodash'
import {trpc} from 'trpc/trpc.client'
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
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {USER_ID_QUERY_PARAM_KEY} from '.'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  params,
  req,
}) => {
  const tutorial = await getTutorial(params?.module as string)
  let subscriber = req.cookies['ck_subscriber'] || null
  subscriber = subscriber && JSON.parse(subscriber)

  const {getUserByEmail} = getSdk()
  const user =
    subscriber &&
    (await getUserByEmail(
      get(subscriber, 'email_address') as unknown as string,
    ))

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
      <main className="relative flex flex-col items-center pb-40 pt-8 sm:pt-0">
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
  const ckNameMutation = trpc.convertkit.updateName.useMutation()

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
      <h3 className="py-6 px-5 text-xl font-medium tracking-tight sm:text-2xl">
        Update your name on the certificate
      </h3>
      <form
        onSubmit={handleSubmit(processForm)}
        className="flex w-full max-w-2xl flex-col items-center gap-2 px-5 md:flex-row md:items-end"
      >
        <label className="flex w-full flex-col">
          <span className="pb-2 text-gray-200">First name</span>
          <input
            {...register('firstName', {required: true})}
            className="h-14 rounded-md border border-gray-600 bg-gray-800/50 px-4 py-3 text-lg font-medium"
            type="text"
            name="firstName"
          />
        </label>
        <label className="flex w-full flex-col">
          <span className="pb-2 text-gray-200">Last name</span>
          <input
            {...register('lastName', {required: false})}
            className="h-14 rounded-md border border-gray-600 bg-gray-800/50 px-4 py-3 text-lg font-medium"
            type="text"
            name="lastName"
          />
        </label>

        <button
          type="submit"
          className="mt-5 inline-flex h-14 flex-shrink-0 items-center justify-center rounded-md border-2 border-cyan-300/80 bg-cyan-400/10 px-8 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-400/20 sm:mt-0"
        >
          {ckNameMutation.isLoading ? 'Submitting...' : 'Update name'}
        </button>
      </form>
      {ckNameMutation.isError && (
        <p className="pt-5 text-center">Something went wrong.</p>
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
    <div className="relative flex w-full items-center justify-center sm:pt-16">
      {!isEmpty(name) && (
        <div
          className={cx(
            'relative z-10 flex w-[calc(1200px/1.8)] items-center justify-center rounded-2xl border border-gray-800 sm:h-[calc(630px/1.8)]',
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
            className={cx('overflow-hidden rounded-2xl', {
              'opacity-0': !isCertificateImageLoaded,
              'opacity-100': isCertificateImageLoaded,
            })}
          />
          {!isCertificateImageLoaded && (
            <div className="absolute flex max-w-[23ch] items-center justify-center gap-2 text-center text-base drop-shadow-lg">
              <Spinner className="w-6" /> Loading certificate...
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const CertificateShare: React.FC<{shareUrl: string}> = ({shareUrl}) => {
  const shareButtonStyles =
    'gap-2 flex items-center justify-center rounded-md px-4 py-2 hover:brightness-125 transition'
  return (
    <div className="mb-8 flex w-full -translate-y-px flex-col items-center justify-center gap-3 border-gray-800 p-4 text-gray-200 sm:mb-16 sm:w-auto sm:rounded-b-xl sm:border sm:bg-black/50 md:flex-row ">
      <h1 className="px-2">Share on:</h1>
      <div className="relative z-10 grid grid-cols-2 flex-wrap items-center justify-center gap-2 text-center font-medium shadow-xl sm:flex">
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
    <header className="px-5 pt-28 text-center sm:pt-32 md:pt-40">
      <p className="pb-4 text-lg text-cyan-300 sm:text-xl">
        Congrats on finishing the {title} Tutorial!
      </p>
      <h1 className="font-heading text-5xl font-bold md:text-6xl">
        Your Certificate
      </h1>
    </header>
  )
}
