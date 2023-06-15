'use client'

import React from 'react'
import {TipSchema} from 'lib/tips'
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

const CreateTipForm: React.FC = () => {
  const formSchema = z.object({
    title: z.string().optional(),
    video: z.string().optional(),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

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

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // TODO:
    // - navigate to /tips/[slug]/status when complete (creator view)
    // - announce in LC that creator has uploaded a new video, provide link to /tips/[slug]/edit and raw s3 url in announcement
    // - (?) create videoResource in Sanity  with s3FileUrl
    // - (?) create new tip in Sanity with videoResource and title

    try {
      if (fileType && fileContents) {
        const filePath = await uploadToS3({
          fileType,
          fileContents,
          onUploadProgress: (progressEvent) => {
            console.log(
              'progressEvent',
              progressEvent.total
                ? progressEvent.loaded / progressEvent.total
                : 0,
            )
            setProgress(progressEvent.loaded / progressEvent.total!)
          },
        })
        console.log({filePath})
        fileDispatch({type: 'RESET_FILE_STATE'})
        setS3FileUrl(filePath)
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
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="video"
            render={({field}) => (
              <FormItem>
                <FormLabel>Video</FormLabel>
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

export default CreateTipForm

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
