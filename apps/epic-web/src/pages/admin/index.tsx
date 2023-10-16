import Layout from 'components/app/layout'
import * as React from 'react'
import CouponGenerator from '@skillrecordings/skill-lesson/admin/coupon-generator'
import {GetServerSideProps} from 'next'
import {Decimal, getSdk} from '@skillrecordings/database'
import {stringify} from 'superjson'
import {
  Table,
  TableBody,
  TableRow,
  TableCaption,
  TableHead,
  TableHeader,
  TableCell,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormDescription,
  Button,
  Skeleton,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar,
  FormMessage,
} from '@skillrecordings/ui'
import {format} from 'date-fns'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {trpc} from 'trpc/trpc.client'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {cn} from '@skillrecordings/ui/utils/cn'
import {CalendarIcon} from '@heroicons/react/outline'
import CouponDataTable from 'components/admin/coupon-data-table'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query, params} = context
  const {getCoupons} = getSdk()
  const coupons = await getCoupons()

  return {
    props: {
      couponsData: stringify(coupons),
    },
  }
}

const AdminPage: React.FC<{couponsData: any}> = ({}) => {
  // const coupons: Coupon[] = JSON.parse(couponsData).json
  const formSchema = z.object({
    quantity: z.string(),
    // coupon
    maxUses: z.string(),
    expires: z.date().optional(),
    restrictedToProductId: z.string(),
    percentOff: z.string(),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: '1',
      maxUses: '-1',
      restrictedToProductId: process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID,
      percentOff: '20',
      expires: undefined,
    },
  })

  const {data: products} = trpc.products.getAllProducts.useQuery()
  const {data: coupons, status: couponsStatus} = trpc.coupons.get.useQuery()

  const createCouponsMutation = trpc.coupons.create.useMutation()

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createCouponsMutation.mutate(values)
  }
  const expiresAtDateTime = form.watch('expires')?.setHours(23, 59, 0, 0)

  return (
    <Layout meta={{title: 'Admin'}}>
      <main className="flex flex-grow flex-col items-center space-y-5 py-16">
        <h2 className="w-full max-w-screen-lg px-5 text-left text-3xl font-bold">
          Coupons
        </h2>
        <section className="mx-auto w-full max-w-screen-lg space-y-5 px-5 pt-8">
          <h3 className="text-2xl font-medium">Create new</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <fieldset className="grid-cols-4 gap-5 md:grid">
                <FormField
                  name="percentOff"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel htmlFor="percentOff">
                        Discount Percentage
                      </FormLabel>
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
                    <FormItem>
                      <FormLabel>Restricted to Product</FormLabel>
                      <FormControl>
                        <Select
                          required
                          {...field}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
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
                      <FormDescription>Required</FormDescription>
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
                        Limit usage count
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
                  Generate
                </Button>
              </div>
            </form>
          </Form>
        </section>
        <section className="mx-auto w-full max-w-screen-lg px-5 pt-10">
          {coupons && <CouponDataTable coupons={coupons} />}
        </section>
      </main>
    </Layout>
  )
}

export default AdminPage

export type Coupon = {
  id: string
  code: null | string
  createdAt: Date
  expires: null | Date
  maxUses: number
  default: boolean
  merchantCouponId: null | string
  status: number
  usedCount: number
  percentageDiscount: Decimal
  restrictedToProductId: null | string
  bulkPurchaseId: null | string
}
