'use client'

import * as React from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@skillrecordings/ui'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {trpc} from 'trpc/trpc.client'
import {useRouter} from 'next/router'
import {processFile} from 'module-builder/cloudinary-video-uploader'
import {useFileChange} from '@skillrecordings/skill-lesson/lib/use-file-change'

type CreateTipFormState = 'idle' | 'ready' | 'uploading' | 'success' | 'error'

const CreateTipForm: React.FC = () => {
  const [tipFormState, setTipFormState] =
    React.useState<CreateTipFormState>('idle')

  const formSchema = z.object({
    video: z.string().optional(),
    title: z.string().min(1),
    contributorId: z.string().optional(),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })
  const router = useRouter()

  const {fileError, fileName, fileContents, fileType, handleFileChange} =
    useFileChange()
  const [progress, setProgress] = React.useState(0)
  const {mutate: createTip} = trpc.tips.create.useMutation()
  const {data: contributors} = trpc.contributors.all.useQuery()

  const defaultContributor =
    contributors?.find(({slug}) => slug === 'kent-c-dodds') ||
    contributors?.find(({name}) => name === 'Kent C. Dodds')

  const handleSubmit = async (values: {
    title: string
    contributorId?: string
  }) => {
    try {
      if (fileType && fileContents) {
        setTipFormState('uploading')
        const uploadResponse: {secure_url: string} = await processFile(
          fileContents,
          (progress) => {
            setProgress(progress)
          },
        )

        setTipFormState('success')

        createTip(
          {
            s3Url: uploadResponse.secure_url,
            fileName,
            title: values.title,
            ...(values.contributorId &&
            values.contributorId !== defaultContributor?._id
              ? {contributorId: values.contributorId}
              : {}),
          },
          {
            onSettled: (data) => {
              console.log('tip creation settled', data)
              if (data?.slug) {
                router.push(`/creator/tips/${data?.slug}`)
              }
            },
            onError: (error) => {
              console.log('tip creation error', error)
            },
            onSuccess: (data) => {
              console.log('tip creation success', data)
            },
          },
        )
      }
    } catch (err) {
      setTipFormState('error')
      console.log('error is', err)
    }
  }

  let buttonText

  switch (tipFormState) {
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
            name="title"
            render={({field}) => (
              <FormItem>
                <FormLabel>Title of your Tip</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="title"
                    {...field}
                    required={true}
                    maxLength={90}
                    onChange={field.onChange}
                    placeholder="A good title for your tip!"
                  />
                </FormControl>
                <FormDescription>Required</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            name="contributorId"
            render={({field}) => (
              <FormItem>
                <FormLabel>Instructor</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || defaultContributor?._id || ''}
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      {contributors?.map(({_id, name}) => {
                        return (
                          <SelectItem key={_id} value={_id}>
                            {name}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
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
                      setTipFormState('ready')
                    }}
                  />
                </FormControl>
                <FormDescription>
                  {form.formState.isSubmitting || tipFormState === 'success' ? (
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
              tipFormState === 'success'
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
