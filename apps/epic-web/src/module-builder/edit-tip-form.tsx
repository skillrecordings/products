'use client'

import React from 'react'
import {Tip, TipSchema} from 'lib/tips'
import {
  Button,
  Input,
  Label,
  Textarea,
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
import MuxPlayer from '@mux/mux-player-react'
import {trpc} from 'trpc/trpc.client'
import {useRouter} from 'next/router'

const EditTipForm: React.FC<{tip: Tip}> = ({tip}) => {
  const router = useRouter()
  const formSchema = TipSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...tip,
    },
  })
  const {mutate: updateTip} = trpc.tips.update.useMutation()
  const {data: contributors} = trpc.contributors.all.useQuery()

  // Tracks the instructor the user explicitly selected; undefined until they
  // interact with the dropdown.
  const [selectedContributorId, setSelectedContributorId] = React.useState<
    string | undefined
  >(undefined)

  // Display-only default: the tip's current instructor, falling back to
  // Kent C. Dodds once contributors are loaded.
  const defaultContributorId =
    tip.instructor?._id ??
    contributors?.find(({slug}) => slug === 'kent-c-dodds')?._id

  const displayedContributorId = selectedContributorId ?? defaultContributorId

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Only send contributorId when the user actually changed the selection,
    // otherwise omit it so the server leaves the contributors array untouched.
    const contributorChanged =
      selectedContributorId !== undefined &&
      selectedContributorId !== tip.instructor?._id

    try {
      await updateTip(
        {
          _id: tip._id,
          title: values.title,
          slug: values.slug,
          body: values.body,
          ...(contributorChanged && {contributorId: selectedContributorId}),
        },
        {
          onSuccess: (data) => {
            router.push(`/creator/tips/${data.slug}`)
          },
        },
      )
    } catch (error) {
      console.log(error)
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
                <FormDescription>
                  This is the title of your tip.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({field}) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({field}) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Textarea
                    rows={16}
                    placeholder="Body"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>This is the tip body in MDX.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Select
              value={displayedContributorId ?? ''}
              onValueChange={(value) => {
                setSelectedContributorId(value)
              }}
            >
              <SelectTrigger id="instructor" className="w-full">
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
            <p className="text-sm text-muted-foreground">
              This is the instructor for your tip.
            </p>
          </div>
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </>
  )
}

export default EditTipForm

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
