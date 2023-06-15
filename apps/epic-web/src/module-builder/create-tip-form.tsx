'use client'

import React from 'react'
import {Button, Input, Progress} from '@skillrecordings/skill-lesson/ui'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@skillrecordings/skill-lesson/ui/form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import MuxPlayer from '@mux/mux-player-react'
import {useFileChange} from './use-file-change'
import {uploadToS3} from './upload-file'
import {trpc} from 'trpc/trpc.client'
import {useRouter} from 'next/router'

const CreateTipForm: React.FC = () => {
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

  const handleSubmit = async () => {
    try {
      if (fileType && fileContents) {
        const filePath = await uploadToS3({
          fileType,
          fileContents,
          onUploadProgress: (progressEvent) => {
            setProgress(progressEvent.loaded / progressEvent.total!)
          },
        })
        createTip(
          {
            s3Url: filePath,
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
      console.log('error is', err)
    }
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
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormDescription>Required</FormDescription>
                <FormMessage>{fileError && <div>{fileError}</div>}</FormMessage>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between gap-3">
            <Progress value={Number((progress * 100).toFixed(0))} max={100} />
            <div className="w-28 flex-shrink-0 text-sm font-medium uppercase">
              {(progress * 100).toFixed(0)}% uploaded
            </div>
          </div>
          <Button
            disabled={!fileContents || form.formState.isSubmitting}
            className="bg-black text-white"
            type="submit"
          >
            Continue
          </Button>
          <div className="flex font-mono text-sm">{s3FileUrl}</div>
        </form>
      </Form>
    </>
  )
}

export default () => {
  return <CreateTipForm />
}

export const Video: React.FC<{playbackId: string | undefined | null}> = ({
  playbackId,
}) => {
  return (
    <>
      {playbackId && (
        <MuxPlayer
          className="overflow-hidden rounded"
          playbackId={playbackId}
        />
      )}
    </>
  )
}
