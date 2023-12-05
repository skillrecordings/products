import React from 'react'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@skillrecordings/ui'
import toast from 'react-hot-toast'
import {Icon} from '../icons'
import {
  ClientSafeProvider,
  LiteralUnion,
  signIn,
  useSession,
} from 'next-auth/react'
import {BuiltInProviderType} from 'next-auth/providers'
import Link from 'next/link'

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

const EditProfileForm: React.FC<{providers: Providers}> = ({providers}) => {
  const {update: updateSession} = useSession()
  const {data: user, status: userStatus} =
    trpcSkillLessons.user.currentUser.useQuery()
  const {mutate: disconnectGithub} =
    trpcSkillLessons.user.disconnectGithub.useMutation()
  const {mutateAsync: updateName} =
    trpcSkillLessons.user.updateName.useMutation()

  const githubProvider = providers?.github
  const githubConnected = user?.accounts.find(
    (account: any) => account.provider === 'github',
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    values: {
      name: user?.name || '',
      email: user?.email || '',
    },
    reValidateMode: 'onBlur',
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    return await updateName(
      {name: values.name},
      {
        onSuccess: async (data) => {
          form.setValue('name', data.name as string)
          await updateSession(() => {
            return {
              name: values.name,
            }
          })
          toast.success('Profile updated successfully!')
        },
      },
    )
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <fieldset className="space-y-5">
            <FormField
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      {...field}
                      required
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      id="email"
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    You can not change your email address, but you can transfer
                    your product licenses to a different email address on{' '}
                    <Link
                      href="/products?s=purchased"
                      className="underline"
                      target="_blank"
                    >
                      Product page
                    </Link>
                    .
                  </FormDescription>
                </FormItem>
              )}
            />
          </fieldset>
          {providers && (
            <fieldset className="w-full">
              <h3 className="text-lg font-bold">Accounts</h3>
              <ul className="divide-y border-b">
                <li className="flex items-center justify-between py-3">
                  <h4 className="inline-flex items-center gap-2 font-medium">
                    <Icon name="Github" className="w-5 h-5" />
                    GitHub
                  </h4>
                  <div>
                    {githubConnected ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => disconnectGithub()}
                      >
                        Disconnect
                      </Button>
                    ) : githubProvider ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          signIn(githubProvider.id)
                        }}
                      >
                        Connect
                      </Button>
                    ) : (
                      <div className="text-sm font-semibold">N/A</div>
                    )}
                  </div>
                </li>
              </ul>
            </fieldset>
          )}
          {(form.formState.dirtyFields.name || form.formState.isSubmitting) && (
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Update profile
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}

export default EditProfileForm

type Providers = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null
