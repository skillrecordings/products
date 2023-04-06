import Layout from 'components/app/layout'
import * as React from 'react'
import VideoUploader from 'module-builder/video-uploader'
import {useForm} from 'react-hook-form'
import {trpc} from '../../trpc/trpc.client'
import {useRouter} from 'next/router'

type CreateTipFormData = {
  title: string
}

export default function Adminpage() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {errors},
  } = useForm<CreateTipFormData>()
  const router = useRouter()
  const {mutate, error} = trpc.tips.createTip.useMutation()

  const onSubmit = (data: CreateTipFormData) => {
    mutate(data, {
      onSuccess: (data) => {
        reset()
        router.push(`/tips/${data.slug.current}/edit`)
      },
    })
  }

  return (
    <div>
      <header className="relative flex flex-col items-center justify-center overflow-hidden px-5 pt-12">
        <div className="relative z-10 flex w-full max-w-screen-lg flex-col-reverse items-center  lg:flex-row">
          <div className="relative z-10 max-w-2xl pb-10 lg:py-12 lg:pb-12">
            <h1 className="w-full max-w-[14ch] font-heading text-4xl font-normal leading-[1.25] sm:mt-0 sm:text-5xl sm:leading-[1.15] lg:text-5xl lg:leading-[1.15] xl:text-6xl xl:leading-[1.15]">
              create a new tip
            </h1>
          </div>
        </div>
      </header>
      <div className="flex min-h-full items-center">
        <form id="create-tip-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              {...register('title', {required: true})}
              placeholder="think seo"
            />
            {errors.title && <span>This field is required</span>}
          </div>
          <button type="submit">Create Tip</button>
          {error && <div>{error.message}</div>}
        </form>
      </div>
    </div>
  )
}
