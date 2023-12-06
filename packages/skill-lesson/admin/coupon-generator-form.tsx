import React from 'react'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {motion} from 'framer-motion'
import {
  Button,
  Calendar,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@skillrecordings/ui'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {cn} from '../utils/cn'
import {format} from 'date-fns'
import {CalendarIcon} from 'lucide-react'
import Spinner from '../spinner'
import toast from 'react-hot-toast'

const formSchema = z.object({
  quantity: z.string(),
  // coupon
  maxUses: z.string(),
  expires: z.date().optional(),
  restrictedToProductId: z.string().optional(),
  percentOff: z.string(),
})

const CouponGeneratorForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: '1',
      maxUses: '-1',
      restrictedToProductId: undefined,
      percentOff: '20',
      expires: undefined,
    },
  })
  const [codes, setCodes] = React.useState<string[]>([])
  const {data: products} = trpcSkillLessons.products.getAllProducts.useQuery()
  const expiresAtDateTime = form.watch('expires')?.setHours(23, 59, 0, 0)
  const createCouponsMutation = trpcSkillLessons.coupons.create.useMutation()
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createCouponsMutation.mutate(values, {
      onSuccess: ({codes}) => {
        setCodes(codes)
        if (codes.length > 1) {
          downloadTextFile(codes.join('\n'))
        } else {
          navigator.clipboard.writeText(codes.join('\n'))
          toast.success('Copied to clipboard')
        }
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <fieldset className="grid-cols-4 gap-5 md:grid">
          <FormField
            name="percentOff"
            render={({field}) => (
              <FormItem>
                <FormLabel htmlFor="percentOff">Discount Percentage</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    id="percentOff"
                    {...field}
                    required
                    onChange={field.onChange}
                    placeholder={'20'}
                  />
                </FormControl>
                <FormDescription>Required</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            name="restrictedToProductId"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <FormLabel
                  htmlFor="enableRestrictedToProductId"
                  className="mb-0.5 mt-1.5 flex items-center gap-1.5"
                >
                  <Checkbox
                    id="enableRestrictedToProductId"
                    checked={Boolean(form.watch('restrictedToProductId'))}
                    onCheckedChange={() => {
                      return Boolean(form.watch('restrictedToProductId'))
                        ? form.setValue('restrictedToProductId', undefined)
                        : form.setValue(
                            'restrictedToProductId',
                            process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID,
                          )
                    }}
                  />
                  Restricted to Product
                </FormLabel>
                <FormControl>
                  <Select
                    required
                    {...field}
                    disabled={!Boolean(form.watch('restrictedToProductId'))}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          Boolean(form.watch('restrictedToProductId'))
                            ? 'Select a product'
                            : 'Global'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((product: SanityProduct) => (
                        <SelectItem value={product.productId}>
                          {product.title || product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="expires"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <FormLabel
                  htmlFor="enableExpires"
                  className="mb-0.5 mt-1.5 flex items-center gap-1.5"
                >
                  <Checkbox
                    id="enableExpires"
                    checked={Boolean(form.watch('expires'))}
                    onCheckedChange={() => {
                      return Boolean(form.watch('expires'))
                        ? form.setValue('expires', undefined)
                        : form.setValue('expires', new Date())
                    }}
                  />
                  Expiration date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        return field.onChange(date)
                      }}
                      disabled={(date) =>
                        date < new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  {/* {form.watch('expires')?.toUTCString()} */}
                  {expiresAtDateTime &&
                    new Date(expiresAtDateTime).toISOString()}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="maxUses"
            render={({field}) => (
              <FormItem className="flex flex-col gap-0.5">
                <FormLabel
                  htmlFor="enableMaxUses"
                  className="mt-1.5 flex items-center gap-1.5"
                >
                  <Checkbox
                    id="enableMaxUses"
                    checked={form.watch('maxUses') !== '-1'}
                    // onChange={() => form.setValue('maxUses', '1')}
                    onCheckedChange={() => {
                      return form.getValues('maxUses') === '1'
                        ? form.setValue('maxUses', '-1')
                        : form.setValue('maxUses', '1')
                    }}
                  />
                  Limit max uses
                </FormLabel>
                <FormControl>
                  {form.watch('maxUses') === '-1' ? (
                    <Button
                      onClick={() => {
                        form.setValue('maxUses', '1')
                      }}
                      size="sm"
                      variant="ghost"
                      className="h-10 justify-start border border-input text-left text-base text-opacity-60"
                    >
                      Set
                    </Button>
                  ) : (
                    <Input
                      disabled={form.watch('maxUses') === '-1'}
                      type="number"
                      id="maxUses"
                      {...field}
                      required
                      onChange={(e) => {
                        if (e.currentTarget.value === '0') {
                          form.setValue('maxUses', '-1')
                        } else {
                          return field.onChange(e)
                        }
                      }}
                      placeholder="-1"
                    />
                  )}
                </FormControl>
              </FormItem>
            )}
          />
        </fieldset>
        <div className="flex items-end gap-5">
          <div className="flex sm:items-end gap-5 justify-between w-full sm:flex-row flex-col">
            <div className="flex gap-5 items-end">
              <FormField
                name="quantity"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        id="quantity"
                        {...field}
                        required
                        min={1}
                        max={100}
                        onChange={field.onChange}
                        defaultValue={1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button disabled={form.formState.isSubmitting} type="submit">
                Generate{' '}
                {form.formState.isSubmitting && (
                  <Spinner className="ml-1 w-4 h-5" />
                )}
              </Button>
            </div>
            <motion.div
              key={codes.join('\n')}
              animate={{opacity: form.formState.isSubmitted ? [1, 0.5, 1] : 1}}
              className="w-full flex sm:justify-end items-end gap-2"
            >
              {form.formState.isSubmitted && codes && (
                <>
                  <Button
                    disabled={form.formState.isSubmitting}
                    type="button"
                    onClick={() => downloadTextFile(codes.join('\n'))}
                    className="bg-foreground text-background"
                  >
                    Download
                  </Button>
                  <Button
                    disabled={form.formState.isSubmitting}
                    type="button"
                    onClick={() => {
                      toast.success('Copied to clipboard')
                      return navigator.clipboard.writeText(codes.join('\n'))
                    }}
                    variant="secondary"
                  >
                    Copy to clipboard
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default CouponGeneratorForm

const downloadTextFile = (textData: string) => {
  const blob = new Blob([textData], {type: 'text/plain'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'codes.csv'
  a.click()
  URL.revokeObjectURL(url)
}
