'use client'

import React, {BaseSyntheticEvent, SyntheticEvent} from 'react'
import {
  Button,
  Input,
  Progress,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@skillrecordings/ui'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import MuxPlayer from '@mux/mux-player-react'
import {useFileChange} from './use-file-change'
import {uploadToS3} from './upload-file'
import {trpc} from '@/trpc/trpc.client'
import {useRouter} from 'next/router'
import axios from 'axios'
import {v4} from 'uuid'
import {processFile} from '@/module-builder/cloudinary-video-uploader'

type CreateTipFormState = 'idle' | 'ready' | 'uploading' | 'success' | 'error'

const CreateTipForm: React.FC = () => {
  const [state, setState] = React.useState('idle')

  const formSchema = z.object({
    video: z.string().optional(),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })
  const router = useRouter()

  const {
    fileError,
    fileName,
    fileContents,
    fileType,
    fileDispatch,
    handleFileChange,
  } = useFileChange()
  const [s3FileUrl, setS3FileUrl] = React.useState('')
  const [progress, setProgress] = React.useState(0)
  const {mutate: createTip} = trpc.tips.create.useMutation()

  const handleSubmit = async (values?: any, event?: BaseSyntheticEvent) => {
    try {
      if (fileType && fileContents) {
        setState('uploading')
        const uploadResponse: {secure_url: string} = await processFile(
          fileContents,
          (progress) => {
            setProgress(progress)
          },
        )

        setState('success')

        createTip(
          {
            s3Url: uploadResponse.secure_url,
            fileName,
          },
          {
            onSettled: (data) => {
              router.push(`/creator/tips/${data?.slug}`)
            },
          },
        )
      }
    } catch (err) {
      setState('error')
      console.log('error is', err)
    }
  }

  let buttonText

  switch (state) {
    case 'ready':
      buttonText = `Upload ${fileName}`
      break
    case 'uploading':
      buttonText = `Uploading ${fileName}`
      break
    case 'success':
      buttonText = `Processing ${fileName}`
      break
    case 'error':
      buttonText = `Error Uploading ${fileName}`
      break
    default:
      buttonText = `Select a Video File Above`
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <FormField
            name="video"
            render={({field}) => (
              <FormItem>
                <FormLabel>Video File to Upload</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="video/*"
                    id="video"
                    {...field}
                    onChange={(e) => {
                      handleFileChange(e)
                      field.onChange(e)
                      setState('ready')
                    }}
                  />
                </FormControl>
                <FormDescription>
                  {form.formState.isSubmitting || state === 'success' ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-6 flex-shrink-0 text-xs">
                        {(progress * 100).toFixed(0)}%
                      </div>
                      <Progress
                        value={Number((progress * 100).toFixed(0))}
                        max={100}
                      />
                    </div>
                  ) : (
                    'Required'
                  )}
                </FormDescription>
                <FormMessage>{fileError && <div>{fileError}</div>}</FormMessage>
              </FormItem>
            )}
          />
          <Button
            disabled={
              !fileContents ||
              form.formState.isSubmitting ||
              state === 'success'
            }
            type="submit"
          >
            {buttonText}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default () => {
  return <CreateTipForm />
}
