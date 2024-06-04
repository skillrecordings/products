import React from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {localPrefsFieldsSchema} from '../../lib/user-prefs'
import {z} from 'zod'
import {
  Button,
  Input,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  DialogTrigger,
  DialogFooter,
} from '@skillrecordings/ui'
import {trpc} from '@/trpc/trpc.client'
import {AlertCircle} from 'lucide-react'
import slugify from '@sindresorhus/slugify'

export default function LocalDevPrefsForm({
  resourceId,
  githubRepositoryName,
}: {
  resourceId: string
  githubRepositoryName: string
}) {
  const {mutateAsync: setLocalPrefs} = trpc.userPrefs.setLocal.useMutation()
  const {data: userPrefs} = trpc.userPrefs.getLocal.useQuery({
    resourceId,
  })
  const form = useForm<z.infer<typeof localPrefsFieldsSchema>>({
    resolver: zodResolver(localPrefsFieldsSchema),
    defaultValues: {
      editorLaunchProtocol: userPrefs?.editorLaunchProtocol || 'vscode://file/',
      localDirectoryPath: userPrefs?.localDirectoryPath || '',
    },
  })

  async function onSubmit(values: z.infer<typeof localPrefsFieldsSchema>) {
    return await setLocalPrefs({
      resourceId,
      fields: values,
    })
  }

  const [
    displayCustomEditorLaunchProtocolField,
    setDisplayCustomEditorLaunchProtocolField,
  ] = React.useState(false)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 [&_button[role='combobox']]:border-white/20 [&_input]:border-white/20"
      >
        <FormField
          control={form.control}
          name="editorLaunchProtocol"
          render={({field}) => (
            <FormItem>
              <FormLabel>IDE (Code Editor)</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (value === 'custom') {
                    form.setValue('editorLaunchProtocol', '')
                    return setDisplayCustomEditorLaunchProtocolField(true)
                  } else {
                    setDisplayCustomEditorLaunchProtocolField(false)
                  }
                  return field.onChange(value)
                }}
                defaultValue={field.value}
                required
              >
                <FormControl className="flex gap-2">
                  <>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your IDE of choice..." />
                    </SelectTrigger>
                    {displayCustomEditorLaunchProtocolField && (
                      <Input
                        placeholder="Enter custom IDE protocol..."
                        {...field}
                        required
                      />
                    )}
                  </>
                </FormControl>
                <SelectContent
                // className="bg-background text-white [&_option[selected]]:bg-gray-800"
                >
                  <SelectItem value="vscode://file/">
                    Visual Studio Code <code>vscode://file/</code>
                  </SelectItem>
                  <SelectItem value="jetbrains://web-storm/navigate/reference?path=">
                    WebStorm{' '}
                    <code>jetbrains://web-storm/navigate/reference?path=</code>
                  </SelectItem>
                  <SelectItem value="custom">
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3" />
                      Custom
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The protocol used to launch your preferred IDE from the browser.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="localDirectoryPath"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Full path to{' '}
                <code>
                  {slugify(githubRepositoryName, {
                    customReplacements: [['TypeScript', 'typescript']],
                  }) || 'project'}
                </code>{' '}
                directory on your computer
              </FormLabel>
              <FormControl>
                <Input {...field} required />
              </FormControl>
              <FormDescription>
                Example:{' '}
                <code>
                  /Users/Jane/learning/total-typescript/
                  {slugify(githubRepositoryName, {
                    customReplacements: [['TypeScript', 'typescript']],
                  })}
                </code>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogTrigger asChild>
            <Button
              className="bg-white/10 text-white hover:bg-white/20"
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
          </DialogTrigger>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
